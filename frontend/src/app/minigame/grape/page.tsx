'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTicketing } from '../TicketingContext'; // 상위 폴더의 Context 사용
import styles from './page.module.scss';

const SeatPractice = () => {
  const router = useRouter();
  const { setReactionTime, setGameMode } = useTicketing(); // Context에서 setter 함수 가져오기

  // [React] 상태 관리
  const [gameState, setGameState] = useState<
    'counting' | 'waiting' | 'completed'
  >('counting');
  const [countdown, setCountdown] = useState(3);
  const isGameCompletedRef = useRef(false);
  const startTimeRef = useRef<number>(0);
  const autoRedirectTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [seats, setSeats] = useState<
    Array<{ id: number; isActive: boolean; isSelected: boolean }>
  >([]);
  const [targetSeatId, setTargetSeatId] = useState<number>(0);

  // [React] 게임 모드 설정
  useEffect(() => {
    setGameMode('grape');
  }, [setGameMode]);

  // [React] 좌석 초기화
  useEffect(() => {
    const totalSeats = 40 * 30;
    const activeIndex = Math.floor(Math.random() * totalSeats);
    setTargetSeatId(activeIndex);

    const initialSeats = Array.from({ length: totalSeats }, (_, index) => ({
      id: index,
      isActive: index === activeIndex,
      isSelected: false,
    }));

    setSeats(initialSeats);
  }, []);

  // [React] 카운트다운 및 게임 시작
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const startCountdown = () => {
      let remainingTime = 3;
      setCountdown(remainingTime);

      intervalId = setInterval(() => {
        remainingTime -= 1;
        if (remainingTime <= 0) {
          clearInterval(intervalId);
          const gameStartTime = Date.now();
          console.log('게임 시작 시간:', gameStartTime);
          setCountdown(0);
          setGameState('waiting');
          startTimeRef.current = gameStartTime;

          // 5초 제한시간 설정
          autoRedirectTimerRef.current = setTimeout(() => {
            if (!isGameCompletedRef.current) {
              console.log('제한 시간 종료');
              // Context에 반응 시간 저장
              setReactionTime(5000);
              router.push('/minigame/complete');
            }
          }, 5000);
        } else {
          setCountdown(remainingTime);
        }
      }, 1000);
    };

    startCountdown();

    return () => {
      clearInterval(intervalId);
      if (autoRedirectTimerRef.current) {
        clearTimeout(autoRedirectTimerRef.current);
      }
    };
  }, [router, setReactionTime]);

  // [React] 좌석 선택 핸들러
  const handleSeatClick = (seatId: number) => {
    if (gameState !== 'waiting') return;
    if (seatId !== targetSeatId) return;

    isGameCompletedRef.current = true;
    const clickTime = Date.now();
    const reactionTime = clickTime - startTimeRef.current;
    console.log('클릭 시간:', clickTime);
    console.log('반응 시간:', reactionTime);

    if (autoRedirectTimerRef.current) {
      clearTimeout(autoRedirectTimerRef.current);
    }

    setSeats(
      seats.map((seat) => ({
        ...seat,
        isSelected: seat.id === seatId,
      }))
    );

    setGameState('completed');

    // Context에 반응 시간 저장
    setReactionTime(reactionTime);
    router.push('/minigame/complete');
  };

  return (
    <div className={styles.container}>
      <div className={styles.statusText}>
        {gameState === 'counting'
          ? `${countdown}초 후 시작됩니다`
          : '보라색 좌석을 찾아 클릭하세요!'}
      </div>

      <div className={styles.gridContainer}>
        <div className={styles.gridWrapper}>
          <div className={styles.seatGrid}>
            {seats.map((seat) => (
              <button
                key={seat.id}
                onClick={() => handleSeatClick(seat.id)}
                disabled={gameState !== 'waiting'}
                className={`${styles.seatButton} 
                  ${
                    gameState === 'counting'
                      ? styles.seatActive
                      : seat.isActive
                      ? styles.seatActive
                      : styles.seatDefault
                  } 
                  ${seat.isSelected ? styles.seatSelected : ''}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatPractice;
