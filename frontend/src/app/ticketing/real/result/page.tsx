'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.scss';
import { useTicketingResult } from '@/hooks/useTicketingResult';

// SuccessModal 컴포넌트
interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  secondMessage?: string;
}

function SuccessModal({
  isOpen,
  onClose,
  message,
  secondMessage,
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalContent}>
        <div className={styles.modalInner}>
          <div className={styles.contentArea}>
            <div className={styles.messageContainer}>
              <div>{message}</div>
              {secondMessage && <div>{secondMessage}</div>}
            </div>
          </div>
          <button className={styles.modalButton} onClick={onClose}>
            돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RealResultPage() {
  const { ticketingResult, loading, error, saveResult } = useTicketingResult();
  const [isSaved, setIsSaved] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const router = useRouter();

  const handleSaveData = async () => {
    if (isSaved || !ticketingResult) return;

    try {
      await saveResult(ticketingResult.section, ticketingResult.seat);
      setIsSaved(true);
      setIsSuccessModalOpen(true);
    } catch (error) {
      alert('저장에 실패했습니다.');
    }
  };

  if (loading) {
    return <div className={styles.container}>로딩 중...</div>;
  }

  if (error || !ticketingResult) {
    return (
      <div className={styles.container}>
        데이터를 불러오는데 실패했습니다: {error}
      </div>
    );
  }

  // 콘서트 정보 포맷팅
  const concertDate = new Date(ticketingResult.reserveTime);
  const formattedDate = concertDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = concertDate.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <SuccessModal
          isOpen={isSuccessModalOpen}
          message='티켓팅 결과 저장 성공!'
          secondMessage='마이페이지에서 확인하세요!'
          onClose={() => setIsSuccessModalOpen(false)}
        />

        <div className={styles.card}>
          <div className={styles.header}>
            <h2 className={styles.title}>티켓팅 성공!</h2>
            <div className={styles.imageContainer}></div>
          </div>

          <div className={styles.ticketInfo}>
            <h3 className={styles.concertName}>
              {ticketingResult.concertName}
            </h3>
            <p className={styles.platformInfo}>
              예매처: {ticketingResult.ticketingPlatform}
            </p>
            <p className={styles.dateInfo}>
              예매일시: {formattedDate} {formattedTime}
            </p>
            <p className={styles.seatInfo}>
              {ticketingResult.section} 구역 {ticketingResult.seat}
            </p>
          </div>

          <div className={styles.buttonsContainer}>
            <button
              onClick={handleSaveData}
              className={styles.actionButton}
              disabled={isSaved}
            >
              <span className={styles.buttonText}>
                {isSaved ? '저장됨' : '기록 저장'}
              </span>
            </button>

            <button
              onClick={() => router.push('/ticketing')}
              className={styles.actionButton}
            >
              <span className={styles.buttonText}>홈으로</span>
            </button>

            <button
              onClick={() => router.push('/mypage/ticketing')}
              className={styles.actionButton}
            >
              <span className={styles.buttonText}>내 기록</span>
            </button>
          </div>

          <p className={styles.footer}>
            예매 상세 내역은 마이페이지에서 확인하실 수 있습니다
          </p>
        </div>
      </div>
    </div>
  );
}
