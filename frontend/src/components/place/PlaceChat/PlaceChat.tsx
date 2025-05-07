// PlaceChat.tsx
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
}

interface PlaceChatProps {
  arenaId: number;
}

export default function PlaceChat({ arenaId }: PlaceChatProps) {
  const [messages, setMessages] = useState<Message[]>([
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
      content: '□□ㅇ\n어차피 10분은 VCR이라 ㄱㅊㄱㅊ',
      replyTo: {
        id: 3,
        nickname: '닉네임닉네임',
        time: '23:55',
        content: '5분은 늦어도 ㄱㅊ아요',
      },
    },
  ]);

  const [input, setInput] = useState('');
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  // 새 메시지가 추가될 때마다 스크롤을 아래로 이동
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: messages.length + 1,
      nickname: '나',
      time: new Date().toTimeString().slice(0, 5),
      content: input,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesWrapper}>
        <div className={styles.messageList}>
          <div className={styles.dateLabel}>2025년 4월 18일</div>
          {messages.map((msg) => (
            <MessageItem key={msg.id} message={msg} replyTo={msg.replyTo} />
          ))}
          
          {/* 안내 메시지 - 채팅창 중간에 한 번 표시 */}
          <div className={styles.disclaimerContainer}>
            <div className={styles.disclaimer}>
              폭언, 음란, 불법 행위, 상업적 홍보 등<br />
              채팅방 사용을 저해하는 활동에 대해<br />
              메세지 삭제 및 계정 정지 조치를 할 수 있습니다.
            </div>
          </div>
          
          <div ref={messageEndRef} />
        </div>
      </div>
      
      <div className={styles.inputArea}>
        <div className={styles.nicknameDisplay}>나</div>
        <div className={styles.inputWrapper}>
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='궁금한 내용을 물어볼 수 있어요!'
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