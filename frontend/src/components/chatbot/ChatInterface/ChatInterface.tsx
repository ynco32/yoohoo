'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './ChatInterface.module.scss';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: '안녕하세요?\n전 당신의 콘서트 도우미 끼리봇입니끼리',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 텍스트 강조 처리 함수
  const highlightText = (text: string) => {
    // 강조할 단어들
    const highlightWords = ['끼리봇'];

    // 줄바꿈과 강조 처리
    let htmlText = text;

    // 각 강조 단어 처리
    highlightWords.forEach((word) => {
      if (typeof word === 'string' && word.trim() !== '') {
        const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedWord})`, 'g');
        htmlText = htmlText.replace(regex, `<span class="highlight">$1</span>`);
      }
    });

    // 줄바꿈 처리
    htmlText = htmlText.replace(/\n/g, '<br/>');

    return <span dangerouslySetInnerHTML={{ __html: htmlText }} />;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    if (inputValue.trim() === '') return;

    const newUserMessage = {
      id: messages.length + 1,
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue('');

    // 모의 응답 생성
    setTimeout(() => {
      const botResponses = [
        '입장 시간은 오후 6시부터입니다!',
        '공연장 주변에는 여러 식당이 있어요. 지도에서 확인해보세요!',
        '입장 게이트는 티켓에 표시되어 있습니다.',
        '주차장은 공연장 앞쪽과 뒤쪽에 있어요.',
      ];

      const randomResponse =
        botResponses[Math.floor(Math.random() * botResponses.length)];

      const newBotMessage = {
        id: messages.length + 2,
        text: randomResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newBotMessage]);
    }, 1000);
  };

  return (
    <div className={styles.chatInterface}>
      <div className={styles.messagesContainer}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${styles.messageWrapper} ${
              message.isUser ? styles.userMessage : styles.botMessage
            }`}
          >
            <div
              className={`${styles.messageContent} ${
                message.isUser ? styles.userContent : styles.botContent
              }`}
            >
              {message.isUser ? message.text : highlightText(message.text)}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.inputContainer}>
        <input
          type='text'
          value={inputValue}
          onChange={handleInputChange}
          placeholder='여기에 질문을 입력하세요.'
          className={styles.input}
        />
        <button
          className={styles.sendButton}
          onClick={handleSubmit}
          disabled={inputValue.trim() === ''}
        >
          전송
        </button>
      </div>
    </div>
  );
}
