'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTicketintPracticeResultStore } from '@/store/useTicketingPracticeResult';
import SeatGrid from '@/components/features/ticketing/PracticeSeatGrid';

const SeatPractice = () => {
  const router = useRouter();
  const setReactionTime = useTicketintPracticeResultStore(
    (state) => state.setReactionTime
  );

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
              setReactionTime(5000);
              router.push('grape/result');
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
  }, []);

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
    setReactionTime(reactionTime);
    router.push('grape/result');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-4 text-lg font-bold">
        {gameState === 'counting'
          ? `${countdown}초 후 시작됩니다`
          : '보라색 좌석을 찾아 클릭하세요!'}
      </div>

      <SeatGrid
        seats={seats}
        onSeatClick={handleSeatClick}
        disabled={gameState !== 'waiting'}
        showAll={gameState === 'counting'}
      />
    </div>
  );
};

export default SeatPractice;
