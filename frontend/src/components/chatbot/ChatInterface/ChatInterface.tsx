'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './ChatInterface.module.scss';
import ChatInput from '@/components/common/ChatInput/ChatInput';
import { getChatbotResponse } from '@/api/chatbot/chatbot';
import Image from 'next/image';
import { getMyConcerts } from '@/api/mypage/mypage';
import { ConcertInfo } from '@/types/mypage';
import CardButton from '@/components/common/CardButton/CardButton';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  hasEvidanceImage?: boolean;
  evidenceImageData?: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [concertList, setConcertList] = useState<ConcertInfo[]>([]);
  const [highlightWords, setHighlightWords] = useState<string[]>([
    '끼리봇',
    '콘서트',
  ]);

  const fetchConcertList = async () => {
    const response = await getMyConcerts();
    setConcertList(response?.concerts || []);

    response?.concerts.forEach((concert) => {
      setHighlightWords((prev) => [...prev, concert.concertName]);
    });
  };

  // 텍스트 강조 처리 함수
  const highlightText = (text: string) => {
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

  useEffect(() => {
    fetchConcertList();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (message: string) => {
    const newUserMessage = {
      id: messages.length + 1,
      text: message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);

    const response = await getChatbotResponse(message, 41);

    const newBotMessage = {
      id: messages.length + 2,
      text: response?.answer || '',
      isUser: false,
      timestamp: new Date(),
      hasEvidanceImage: response?.hasEvidanceImage || false,
      evidenceImageData: response?.evidenceImageData || '',
    };

    setMessages((prev) => [...prev, newBotMessage]);
  };

  return (
    <div className={styles.chatInterface}>
      <div className={styles.messagesContainer}>
        <div className={`${styles.messageWrapper} ${styles.botMessage}`}>
          <div className={`${styles.messageContent} ${styles.botContent}`}>
            <div className={styles.botMessageText}>
              {highlightText(
                '안녕하세요? \n전 당신의 콘서트 도우미 끼리봇입니끼리'
              )}
            </div>
          </div>
        </div>
        <div className={`${styles.messageWrapper} ${styles.botMessage}`}>
          <div className={`${styles.messageContent} ${styles.botContent}`}>
            <div className={styles.botMessageText}>
              {highlightText('어떤 콘서트가 궁금하십니끼리?')}
            </div>
            <div className={styles.concertList}>
              {concertList.map((concert) => {
                return (
                  <CardButton
                    key={concert.concertId}
                    label='콘서트'
                    imgSrc={concert.photoUrl}
                    imgAlt={concert.concertName}
                    size='large'
                  />
                );
              })}
            </div>
          </div>
        </div>
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
              {message.evidenceImageData && (
                // <Image
                //   src={message.evidenceImageData}
                //   alt='증거 이미지'
                //   width={200}
                //   height={200}
                //   style={{ objectFit: 'contain' }}
                // />
                <img
                  src={message.evidenceImageData}
                  alt='증거 이미지'
                  className={styles.evidenceImage}
                />
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.inputContainer}>
        <ChatInput
          onSend={handleSendMessage}
          placeholder='여기에 질문을 입력하세요.'
          buttonText='전송'
        />
      </div>
    </div>
  );
}
