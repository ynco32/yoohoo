'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './ChatbotOverlay.module.scss';
import Image from 'next/image';
import ChatInterface from '../ChatInterface/ChatInterface';
import CloseIcon from '@/assets/icons/closeIcon.svg';

interface ChatbotOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatbotOverlay({
  isOpen,
  onClose,
}: ChatbotOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      if (isOpen) {
        setIsVisible(true);
        // 첫 렌더링에서 isOpen이 true면 애니메이션 없이 바로 표시
        return;
      }
    }

    if (isOpen) {
      // 1. 먼저 컴포넌트를 보이게 설정
      setIsVisible(true);

      // 2. 브라우저가 DOM을 업데이트할 시간을 주기 위해 약간의 지연 후 애니메이션 클래스 적용
      setTimeout(() => {
        setIsAnimating(true);
      }, 10);
    } else {
      // 1. 애니메이션 클래스 제거
      setIsAnimating(false);

      // 2. 애니메이션 완료 후 컴포넌트 숨김
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 350); // 트랜지션 시간과 일치

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  return (
    <div
      className={`${styles.overlay} ${isVisible ? styles.visible : ''} ${
        isAnimating ? styles.open : ''
      }`}
    >
      <div className={styles.chatbotContainer}>
        <div className={styles.chatbotHeader}>
          <div className={styles.profileInfo}>
            <div className={styles.avatarContainer}>
              <Image
                src='/images/dummy.png'
                alt='챗봇 아바타'
                width={45}
                height={35}
                className={styles.avatar}
              />
            </div>
            <div className={styles.textInfo}>
              <p className={styles.label}>귀여운 콘서트 도우미</p>
              <p className={styles.name}>끼리봇</p>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className={styles.chatbotContent}>
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}
