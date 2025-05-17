'use client';

import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import styles from './PlaceChat.module.scss';
import MessageItem from '../MessageItem/MessageItem';
import ChatInput from '@/components/common/ChatInput/ChatInput';
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

  // 스크롤 위치 저장 참조
  const scrollPositionRef = useRef(0);

  // 컴포넌트 마운트 시 스크롤 위치 복원
  useEffect(() => {
    if (messages.length === 0) return;

    const timeout = setTimeout(() => {
      const container = messageListRef.current;

      if (container && scrollPositionRef.current > 0) {
        container.scrollTop = scrollPositionRef.current;
      } else {
        messageEndRef.current?.scrollIntoView({ behavior: 'auto' });
      }
    }, 50); // DOM 렌더링 이후 실행

    return () => clearTimeout(timeout);
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
    if (messageListRef.current) {
      messageListRef.current.scrollTop = scrollY;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (messageListRef.current) {
        setScrollY(messageListRef.current.scrollTop);
      }
    };
  }, []);

  // 스크롤 상단에 있을때 버튼 표시
  useEffect(() => {
    const container = messageListRef.current;

    const handleScroll = () => {
      if (container) {
        const shouldShow = container.scrollTop < container.scrollHeight - 500;
        setShowScrollDown(shouldShow);
      }
    };

    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

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
    // 입력창으로 포커스 이동
    const inputElement = document.querySelector('input') as HTMLInputElement;
    if (inputElement) {
      inputElement.focus();
    }
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

          {messages.length > 0 && (
            <div className={styles.dateLabel}>
              {new Date().toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          )}

          {/* 시스템 메시지 및 일반 메시지 렌더링 */}
          {messages.map((msg) => (
            <div
              id={`message-${msg.id || msg.tempId}`}
              key={msg.id || msg.tempId}
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
              />
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>
      </div>

      <div className={styles.inputArea}>
        {replyingTo && (
          <div className={styles.replyingToContainer}>
            <div className={styles.replyingToContent}>
              <span className={styles.replyingToNickname}>
                {replyingTo.nickname}
              </span>
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
          {userInfo?.nickname || '닉네임'}
        </div>
        <div className={styles.inputWrapper}>
          <ChatInput
            onSend={handleSend}
            placeholder={
              replyingTo ? '답글 작성하기' : '궁금한 내용을 물어볼 수 있어요!'
            }
            buttonText='보내기'
          />
        </div>
      </div>

      {showScrollDown && (
        <button
          className={styles.scrollToBottomButton}
          onClick={() =>
            messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
          }
        >
          <IconBox name='chevron-small-down' size={15} color='#666' />
        </button>
      )}

      {!isConnected && (
        <div className={styles.connectionMessage}>
          채팅 서버에 연결 중입니다...
        </div>
      )}
    </div>
  );
}
