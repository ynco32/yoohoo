'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './PlaceChat.module.scss';
import MessageItem from '../MessageItem/MessageItem';

interface Message {
  id: number;
  nickname: string;
  time: string;
  content: string;
  replyTo?: Message;
  isMe?: boolean;
  isSystem?: boolean;
}

interface PlaceChatProps {
  arenaId: number;
}

export default function PlaceChat({ arenaId }: PlaceChatProps) {
  // 초기 메시지 목록
  const initialMessages = [
    {
      id: 1,
      nickname: '콘끼리 짱팬',
      time: '23:55',
      content: '괜찮을 거 같아요',
    },
    {
      id: 2,
      nickname: '익명익명의명',
      time: '23:55',
      content:
        '지금 화장실 가고 싶은데\n자리 어디세요??\n동편 화장실은 줄 길어서 좀 아슬아슬할듯\n멀지 않으면 서편 화장실로 가세요\n저 방금 다녀옴',
    },
    {
      id: 3,
      nickname: '닉네임닉네임',
      time: '23:55',
      content: '5분은 늦어도 ㄱㅊ아요',
    },
    {
      id: 4,
      nickname: '콘끼리 짱팬',
      time: '23:55',
      content: '어차피 10분은 VCR이라 ㄱㅊㄱㅊ',
      replyTo: {
        id: 3,
        nickname: '닉네임닉네임',
        time: '23:55',
        content: '5분은 늦어도 ㄱㅊ아요',
      },
    },
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [textareaHeight, setTextareaHeight] = useState('44px');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 처음 채팅에 진입했을 때 안내 메시지를 표시하는 효과
  useEffect(() => {
    // 처음 채팅방 입장인지 확인
    const hasSeenGuide = sessionStorage.getItem(`chat-guide-${arenaId}`);

    if (!hasSeenGuide) {
      // 안내 메시지 생성 (채팅방 입장 후 약간의 딜레이를 두고 표시)
      const timer = setTimeout(() => {
        const systemMessage: Message = {
          id: 999, // 임의의 ID 사용
          nickname: '',
          time: '',
          content:
            '폭언, 음란, 불법 행위, 상업적 홍보 등 채팅방 사용을 저해하는 활동에 대해 메세지 삭제 및 계정 정지 조치를 할 수 있습니다.',
          isSystem: true,
        };

        setMessages((prevMessages) => [...prevMessages, systemMessage]);

        // 안내 메시지를 봤다고 표시
        sessionStorage.setItem(`chat-guide-${arenaId}`, 'true');
      }, 500); // 0.5초 딜레이

      return () => clearTimeout(timer);
    }
  }, [arenaId]);

  // 새 메시지가 추가될 때마다 스크롤을 아래로 이동
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    // 현재 시간 가져오기
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    const newMsg: Message = {
      id: Math.max(...messages.map((m) => m.id)) + 1,
      nickname: '나',
      time: timeString,
      content: input,
      isMe: true,
      replyTo: replyingTo || undefined,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setReplyingTo(null);
    setTextareaHeight('44px');

    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = '44px';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // 시프트 엔터는 줄바꿈 (기본 동작 유지)
        return;
      } else {
        // 엔터만 누르면 메시지 전송
        e.preventDefault();
        handleSend();
      }
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);

    // 높이 자동 조절
    e.target.style.height = '44px'; // 기본 높이로 초기화
    const scrollHeight = e.target.scrollHeight;
    const newHeight = Math.min(scrollHeight, 120) + 'px'; // 최대 높이 제한
    e.target.style.height = newHeight;
    setTextareaHeight(newHeight);
  };

  const handleReply = (message: Message) => {
    // 시스템 메시지는 답글을 달 수 없음
    if (message.isSystem) return;

    setReplyingTo(message);
    // 입력창으로 포커스 이동
    const inputElement = document.querySelector('input') as HTMLInputElement;
    if (inputElement) {
      inputElement.focus();
    }
  };

  const scrollToMessage = (messageId: number) => {
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

  const cancelReply = () => {
    setReplyingTo(null);
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesWrapper}>
        <div className={styles.messageList}>
          <div className={styles.dateLabel}>2025년 4월 18일</div>
          {messages.map((msg) =>
            msg.isSystem ? (
              <div key={msg.id} className={styles.systemMessageContainer}>
                <div className={styles.systemMessage}>{msg.content}</div>
              </div>
            ) : (
              <div id={`message-${msg.id}`} key={msg.id}>
                <MessageItem
                  message={msg}
                  replyTo={msg.replyTo}
                  onReply={() => handleReply(msg)}
                  onReplyClick={
                    msg.replyTo
                      ? () => scrollToMessage(msg.replyTo?.id || 0)
                      : undefined
                  }
                />
              </div>
            )
          )}
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
        <div className={styles.nicknameDisplay}>나</div>
        <div className={styles.inputWrapper}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={
              replyingTo ? '답글 작성하기' : '궁금한 내용을 물어볼 수 있어요!'
            }
            className={styles.messageInput}
            style={{ height: textareaHeight }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={styles.sendButton}
          >
            보내기
          </button>
        </div>
      </div>
    </div>
  );
}
