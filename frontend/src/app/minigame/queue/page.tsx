'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTicketing } from '../TicketingContext'; // 상위 폴더의 Context 사용
import styles from './page.module.scss';

export default function QueuePage() {
  const router = useRouter();
  const { setReactionTime, setGameMode } = useTicketing(); // Context에서 setter 함수 가져오기

  const [gameState, setGameState] = useState<
    'counting' | 'waiting' | 'completed'
  >('counting');

  const [countdown, setCountdown] = useState(5);
  const [startTime, setStartTime] = useState(0);
  useEffect(() => {
    setGameMode('queue');
  }, [setGameMode]);
  // [React] 카운트다운 및 게임 상태 관리
  useEffect(() => {
    let autoRedirectTimer: NodeJS.Timeout;

    // 카운트다운 시작 시점의 타임스탬프
    const startTimestamp = performance.now();

    // 100ms마다 카운트다운 상태 업데이트
    const interval = setInterval(() => {
      // 경과 시간 계산 (밀리초)
      const elapsed = performance.now() - startTimestamp;
      // 초 단위로 변환 (소수점 버림)
      const secondsElapsed = Math.floor(elapsed / 1000);
      // 남은 시간 계산
      const remaining = 5 - secondsElapsed;

      if (remaining <= 0) {
        // 카운트다운 종료
        clearInterval(interval);
        setCountdown(0);
        setGameState('waiting');
        // 반응 속도 측정 시작 시간 설정
        setStartTime(performance.now());

        autoRedirectTimer = setTimeout(() => {
          if (gameState != 'completed') {
            setReactionTime(5000); // 5초로 설정
            router.push('/minigame/complete');
          }
        }, 5000); // 5초 후 자동 이동

        // cleanup에 autoRedirectTimer 정리 추가
        return () => clearTimeout(autoRedirectTimer);
      } else {
        setCountdown(remaining);
      }
    }, 100); // 100ms 간격으로 업데이트

    return () => {
      clearInterval(interval);
      if (autoRedirectTimer) {
        // 👈 cleanup에서 자동 이동 타이머도 정리
        clearTimeout(autoRedirectTimer);
      }
    };
  }, [router, setReactionTime, gameState]); // 👈 gameState 의존성 추가

  // [React] 버튼 클릭 핸들러
  const onButtonClick = async () => {
    try {
      // 대기 상태가 아니면 클릭 무시
      if (gameState !== 'waiting') return;

      const endTime = performance.now();
      const reactionTime = Math.max(0, endTime - startTime);

      // 비정상적인 반응 시간 필터링 (5초 초과)
      if (reactionTime > 5000) {
        console.warn('Invalid reaction time detected');
        return;
      }

      // 반응 시간 저장 후 결과 페이지로 이동
      setGameState('completed');
      await new Promise((resolve) => setTimeout(resolve, 0));
      // Context에 반응 시간 저장
      setReactionTime(reactionTime);
      router.push('/minigame/complete');
    } catch (error) {
      console.error('Error in reaction time game:', error);
    }
  };

  return (
    <div>
      <div className={styles.posterSection}>
        <Image
          className={styles.poster}
          src='/images/dummy.png'
          alt='poster'
          width={80}
          height={150}
        />
        <div className={styles.posterInfo}>
          <div className={styles.badgeContainer}>
            <span className={styles.exclusiveBadge}>단독판매</span>
            <span className={styles.verifiedBadge}>인증예매</span>
          </div>
          <div className={styles.titleSection}>
            <h3 className={styles.concertTitle}>
              20XX ASIA TOUR CONCERT in SEOUL
            </h3>
            <p className={styles.concertCategory}>콘서트 | 7세 이상</p>
          </div>
        </div>
      </div>
      <div>
        <div className={styles.performanceInfo}>
          <div className={styles.infoRow}>
            <div className={styles.infoLabel}>공연기간</div>
            <div className={styles.infoValue}>20XX.xx.xx - 20XX.xx.xx</div>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.infoLabel}>공연장</div>
            <div className={styles.infoValue}>KSPO DOME</div>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.infoLabel}>관람시간</div>
            <div className={styles.infoValue}>-</div>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.infoLabel}>할인혜택</div>
            <div className={styles.infoValue}>무이자</div>
          </div>
        </div>
        <div className={styles.tabs}>
          <span className={styles.tabActive}>상세정보</span>
          <span className={styles.tabInactive}>공연장정보</span>
          <span className={styles.tabInactive}>예매안내</span>
        </div>

        <div className={styles.priceSection}>
          <div className={styles.priceHeader}>
            <h3 className={styles.priceTitle}>공연시간</h3>
            <p className={styles.priceNote}>
              20xx년 xx월 xx일(토) ~ xx월 xx일(일)
            </p>
            <p className={styles.priceNote}>토 오후 6시 / 일 오후 5시</p>
          </div>
        </div>

        <div className={styles.priceSection}>
          <div className={styles.priceHeader}>
            <h3 className={styles.priceTitle}>가격정보</h3>
            <p className={styles.priceNote}>기본가</p>
          </div>
        </div>

        <div className={styles.seatLegend}>
          <div>
            <span className={styles.seatColorVip}></span>
            <span>VIP석</span>
          </div>
          <span>198,000원</span>
          <div>
            <span className={styles.seatColorGeneral}></span>
            <span>일반석</span>
          </div>
          <span>154,000원</span>
        </div>

        <button
          type='button'
          onClick={onButtonClick}
          disabled={gameState !== 'waiting'}
          className={`${styles.fixedButton} ${
            gameState !== 'waiting' ? styles.disabled : ''
          }`}
        >
          {gameState === 'counting' ? `${countdown}초 후 열림` : '예매하기'}
        </button>
      </div>
    </div>
  );
}
