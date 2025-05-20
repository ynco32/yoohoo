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
  const [selectedConcert, setSelectedConcert] = useState<number>(0);
  const [highlightWords, setHighlightWords] = useState<string[]>([
    '끼리봇',
    '콘서트',
  ]);
  // 모달 관련 상태 추가
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');

  const fetchConcertList = async () => {
    const response = await getMyConcerts();
    setConcertList(response?.concerts || []);

    response?.concerts.forEach((concert) => {
      setHighlightWords((prev) => [...prev, concert.concertName]);
    });
  };

  // 이미지 클릭 처리 함수 추가
  const handleImageClick = (imageSrc: string) => {
    setModalImageSrc(imageSrc);
    setShowImageModal(true);
  };

  // 모달 닫기 함수 추가
  const handleCloseModal = () => {
    setShowImageModal(false);
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
    setIsLoading(true); // 로딩 상태 활성화

    try {
      const response = await getChatbotResponse(message, 39);
      // const response = await getChatbotResponse(message, selectedConcert);

      const newBotMessage = {
        id: messages.length + 2,
        text: response?.answer || '',
        isUser: false,
        timestamp: new Date(),
        hasEvidanceImage: response?.hasEvidanceImage || false,
        evidenceImageData: response?.evidenceImageData || '',
      };

      setMessages((prev) => [...prev, newBotMessage]);
    } catch (error) {
      setIsError(true);
      setErrorMessage('메시지를 가져오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false); // 로딩 상태 비활성화
    }
  };

  const handleConcertClick = (concertId: number) => () => {
    setSelectedConcert(concertId);
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
                  <div
                    key={concert.concertId}
                    className={styles.concertContainer}
                    onClick={handleConcertClick(concert.concertId)}
                  >
                    <div className={styles.concertPoster}>
                      <Image
                        alt={concert.concertName}
                        src={concert.photoUrl || '/images/dummy.png'}
                        width={140}
                        height={140}
                        style={{
                          objectFit: 'cover',
                          width: '100%',
                          height: '100%',
                          position: 'absolute',
                        }}
                        className={styles.posterImage}
                      />
                    </div>
                    <div className={styles.artistName}>
                      {Array.isArray(concert.artists)
                        ? concert.artists.length > 0
                          ? concert.artists.length > 1
                            ? `${concert.artists[0].artistName} 외`
                            : concert.artists[0].artistName
                          : '아티스트명'
                        : concert.artists}
                    </div>
                    <div
                      className={styles.concertTitle}
                      title={concert.concertName}
                    >
                      {concert.concertName.length > 10
                        ? `${concert.concertName.substring(0, 12)}...`
                        : concert.concertName}
                    </div>
                  </div>
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
                <img
                  src={message.evidenceImageData}
                  alt='증거 이미지'
                  className={styles.evidenceImage}
                  onClick={() => handleImageClick(message.evidenceImageData!)}
                />
              )}
            </div>
          </div>
        ))}

        {/* 로딩 말풍선 */}
        {isLoading && (
          <div className={`${styles.messageWrapper} ${styles.botMessage}`}>
            <div className={styles.loadingMessage}>
              <div className={styles.typingDots}>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.inputContainer}>
        <ChatInput
          onSend={handleSendMessage}
          placeholder='여기에 질문을 입력하세요.'
          buttonText='전송'
        />
      </div>

      {/* 이미지 모달 추가 */}
      {showImageModal && (
        <div className={styles.imageModal} onClick={handleCloseModal}>
          <img
            src={modalImageSrc}
            alt='전체 이미지'
            className={styles.modalImage}
            onClick={(e) => e.stopPropagation()} // 이미지 클릭 시 모달이 닫히지 않도록
          />
          <button className={styles.closeButton} onClick={handleCloseModal}>
            ×
          </button>
        </div>
      )}
    </div>
  );
}
