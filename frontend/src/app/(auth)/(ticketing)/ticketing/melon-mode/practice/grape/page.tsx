'use client';
import React, { useState, useEffect } from 'react';
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
  const [countdown, setCountdown] = useState(5);
  const [startTime, setStartTime] = useState(0);
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

  // [React] 카운트다운 효과
  useEffect(() => {
    let autoRedirectTimer: NodeJS.Timeout;
    const startTimestamp = performance.now();

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTimestamp;
      const secondsElapsed = Math.floor(elapsed / 1000);
      const remaining = 5 - secondsElapsed;

      if (remaining <= 0) {
        clearInterval(interval);
        setCountdown(0);
        setGameState('waiting');
        setStartTime(performance.now());

        autoRedirectTimer = setTimeout(() => {
          if (gameState !== 'completed') {
            setReactionTime(5000);
            router.push('grape/result');
          }
        }, 5000);
      } else {
        setCountdown(remaining);
      }
    }, 100);

    return () => {
      clearInterval(interval);
      if (autoRedirectTimer) {
        clearTimeout(autoRedirectTimer);
      }
    };
  }, [router, setReactionTime, gameState]);

  // [React] 좌석 선택 핸들러
  const handleSeatClick = (seatId: number) => {
    if (gameState !== 'waiting') return;

    // 올바른 좌석을 선택했는지 확인
    if (seatId !== targetSeatId) return;

    setSeats(
      seats.map((seat) => ({
        ...seat,
        isSelected: seat.id === seatId,
      }))
    );

    const endTime = performance.now();
    const reactionTime = Math.max(0, endTime - startTime);

    if (reactionTime > 5000) {
      console.warn('Invalid reaction time detected');
      return;
    }

    setReactionTime(reactionTime);
    setGameState('completed');
    setTimeout(() => {
      router.push('grape/result');
    }, 100);
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
