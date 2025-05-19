'use client';

import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import styles from './PlaceChat.module.scss';
import MessageItem from '../MessageItem/MessageItem';
import ChatInput, {
  ChatInputHandle,
} from '@/components/common/ChatInput/ChatInput';
import { useChatWebSocket } from '@/hooks/useChatWebSocket';
import { Message } from '@/types/chat';
import IconBox from '@/components/common/IconBox/IconBox';

interface PlaceChatProps {
  arenaId: number;
}

export default function PlaceChat({
  arenaId,
  scrollY,
  setScrollY,
}: PlaceChatProps & {
  scrollY: number;
  setScrollY: (y: number) => void;
}) {
  // Redux에서 사용자 정보 가져오기
  const { data: userInfo } = useSelector((state: RootState) => state.user);

  const {
    messages,
    isConnected,
    isLoading,
    error,
    sendMessage,
    loadPreviousMessages,
  } = useChatWebSocket({ chatRoomId: arenaId });

  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const chatInputRef = useRef<ChatInputHandle>(null);
  const [inputHeight, setInputHeight] = useState(60);
  const newMessageRef = useRef<number | string | undefined>(null);
  const inputAreaRef = useRef<HTMLDivElement>(null);
  const [bottomOffset, setBottomOffset] = useState(120);

  // 스크롤 위치 저장 참조
  const scrollPositionRef = useRef(0);

  // 최초 렌더일 때만 맨 아래로 이동
  const didInitialScrollRef = useRef(false);

  useEffect(() => {
    if (messages.length === 0 || didInitialScrollRef.current) return;

    didInitialScrollRef.current = true;

    // DOM 업데이트 완료 후 스크롤 반영
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'auto' });
      });
    });
  }, [messages]);

  // 메시지 수신 시 마지막 메시지 저장
  useEffect(() => {
    if (messages.length === 0 || !didInitialScrollRef.current) return;

    const container = messageListRef.current;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      150;

    // 새 메시지 맨 아래 자동 스크롤은 아래에 있을 때만
    if (isNearBottom) {
      setTimeout(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      // 수동 스크롤 유도 (사용자는 위쪽을 보고 있음)
      setShowScrollDown(true);

      // 마지막 메시지를 따로 저장
      const lastMessage = messages[messages.length - 1];
      if (lastMessage) {
        newMessageRef.current = lastMessage.id || lastMessage.tempId;
      }
    }
  }, [messages]);

  // 컴포넌트 언마운트 시 스크롤 위치 저장
  useEffect(() => {
    return () => {
      if (messageListRef.current) {
        scrollPositionRef.current = messageListRef.current.scrollTop;
      }
    };
  }, []);

  // 탭 전환시 스크롤 위치 복원
  useEffect(() => {
    const container = messageListRef.current;
    if (!container) return;

    // 렌더링 이후에 scrollTop 복원
    const timeout = setTimeout(() => {
      container.scrollTop = scrollY;
    }, 50);

    const handleScroll = () => {
      setScrollY(container.scrollTop);
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, [scrollY, setScrollY]);

  // 스크롤 상단에 있을때 버튼 표시
  useEffect(() => {
    const container = messageListRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isFarFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight >
        150;

      setShowScrollDown(isFarFromBottom); // 스크롤 위치에 따라 버튼 표시
    };

    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 인풋창 높이 계산
  useEffect(() => {
    const inputArea = inputAreaRef.current;

    if (!inputArea) return;

    const inputBoxHeight = inputArea.offsetHeight;

    const container = messageListRef.current;
    if (container) {
      container.style.setProperty(
        '--chat-bottom-padding',
        `${inputBoxHeight}px`
      );
    }

    setBottomOffset(inputBoxHeight);
  }, [inputHeight, replyingTo]);

  // 하단 이동 버튼 클릭 핸들러
  const handleScrollToNewMessage = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    if (newMessageRef.current) {
      // 딜레이 줘야 스크롤 완료 후 실행됨
      setTimeout(() => {
        scrollToMessage(newMessageRef.current!);
        newMessageRef.current = null; // 이동 후 초기화
      }, 300);
    }
  };

  // 스크롤 이벤트로 이전 메시지 로드
  useEffect(() => {
    const handleScroll = async () => {
      const container = messageListRef.current;

      if (
        container &&
        container.scrollTop < 50 &&
        messages.length > 0 &&
        !isLoading
      ) {
        // 스크롤이 거의 맨 위에 도달했을 때 이전 메시지 로드
        const oldestMessage = messages[0];
        const scrollHeightBefore = container.scrollHeight;

        // 이전 메시지 로드
        const moreMessagesAvailable = await loadPreviousMessages(oldestMessage);

        // 스크롤 위치 유지
        if (moreMessagesAvailable) {
          setTimeout(() => {
            if (container) {
              const scrollHeightAfter = container.scrollHeight;
              container.scrollTop = scrollHeightAfter - scrollHeightBefore;
            }
          }, 100);
        }
      }
    };

    const messageList = messageListRef.current;
    if (messageList) {
      messageList.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (messageList) {
        messageList.removeEventListener('scroll', handleScroll);
      }
    };
  }, [messages, isLoading, loadPreviousMessages]);

  // 메시지 전송 처리
  const handleSend = (content: string) => {
    if (content.trim() === '') return;

    const success = sendMessage(content, replyingTo || undefined);

    if (success) {
      setReplyingTo(null); // 답글 상태 초기화

      // 메시지 전송 후 스크롤 맨 아래로
      setTimeout(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // 답글 처리
  const handleReply = (message: Message) => {
    setReplyingTo(message);
    chatInputRef.current?.focusInput(); // 🔹 포커싱
  };

  // 메시지로 스크롤 이동
  const scrollToMessage = (messageId: number | string) => {
    const messageElement = document.getElementById(`message-${messageId}`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // 강조 효과 추가
      messageElement.classList.add(styles.highlighted);
      setTimeout(() => {
        messageElement.classList.remove(styles.highlighted);
      }, 2000);
    }
  };

  // 답글 취소
  const cancelReply = () => {
    setReplyingTo(null);
  };

  // 안내 메시지
  const systemMessage: Message = {
    id: 'system-guide',
    nickname: '',
    time: '',
    content: `폭언, 음란, 불법 행위, 상업적 홍보 등\n채팅방 사용을 저해하는 활동에 대해\n메세지 삭제 및 계정 정지 조치를 할 수 있습니다.`,
    createdAt: new Date().toISOString(),
    isSystem: true,
  };

  // 날짜별로 메시지 그룹화
  function groupMessagesByDate(messages: Message[]) {
    const groups: { [date: string]: Message[] } = {};

    messages.forEach((msg) => {
      const dateStr = new Date(msg.createdAt || '').toLocaleDateString(
        'ko-KR',
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
        }
      );

      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(msg);
    });

    return groups;
  }

  // 시스템 메시지까지 포함시킨 후 그룹핑
  const shouldShowSystemMessage = true;
  const messagesWithSystem = shouldShowSystemMessage
    ? [...messages, systemMessage]
    : messages;
  const grouped = groupMessagesByDate(messagesWithSystem);

  // 오류 처리
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>새로고침</button>
      </div>
    );
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesWrapper} ref={messageListRef}>
        <div className={styles.messageList}>
          {isLoading && messages.length === 0 && (
            <div className={styles.loadingContainer}>
              메시지를 불러오는 중...
            </div>
          )}
          {/* 메세지 렌더링 */}
          {Object.entries(grouped).map(([date, messagesForDate]) => (
            <div key={date}>
              <div className={styles.dateDivider}>{date}</div>
              {messagesForDate.map((msg, index) => {
                const prevMsg = messagesForDate[index - 1];
                const showNickname = Boolean(
                  !msg.isSystem &&
                    (!prevMsg ||
                      prevMsg.nickname !== msg.nickname ||
                      prevMsg.isSystem)
                );

                return msg.isSystem ? (
                  <div key={msg.id} className={styles.systemMessageContainer}>
                    <div className={styles.systemMessage}>{msg.content}</div>
                  </div>
                ) : (
                  <div
                    key={msg.id || msg.tempId}
                    id={`message-${msg.id || msg.tempId}`}
                  >
                    <MessageItem
                      message={msg}
                      replyTo={msg.replyTo}
                      onReply={() => handleReply(msg)}
                      onReplyClick={
                        msg.replyTo
                          ? () =>
                              scrollToMessage(
                                msg.replyTo?.id || msg.replyTo?.tempId || ''
                              )
                          : undefined
                      }
                      showNickname={showNickname}
                    />
                  </div>
                );
              })}
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>
      </div>

      <div className={styles.inputArea} ref={inputAreaRef}>
        {replyingTo && (
          <div className={styles.replyingToContainer}>
            <div className={styles.replyingToContent}>
              <div className={styles.replyingBox}>
                <span className={styles.replyingToNickname}>
                  {replyingTo.nickname}
                </span>
                <span className={styles.replyText}>에게 답장</span>
              </div>
              <span className={styles.replyingToMessage}>
                {replyingTo.content}
              </span>
            </div>
            <button className={styles.cancelReplyButton} onClick={cancelReply}>
              ×
            </button>
          </div>
        )}
        <div className={styles.nicknameDisplay}>
          {userInfo?.anonym || '닉네임'}
        </div>
        <div className={styles.inputWrapper}>
          <ChatInput
            ref={chatInputRef}
            onSend={handleSend}
            placeholder={
              replyingTo ? '답글 작성하기' : '궁금한 내용을 물어볼 수 있어요!'
            }
            buttonText='보내기'
            isReplying={!!replyingTo}
            onHeightChange={(h) => setInputHeight(h)}
          />
        </div>
        {showScrollDown && (
          <button
            className={styles.scrollToBottomButton}
            style={{ bottom: `${bottomOffset}px` }}
            onClick={handleScrollToNewMessage}
          >
            <IconBox name='chevron-small-down' size={15} color='#666' />
          </button>
        )}
      </div>
    </div>
  );
}
