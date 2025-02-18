// src/hooks/useTimer.ts

import { useState, useEffect } from 'react';

// [TypeScript] 타이머 상태 타입 정의
type TimerState = 'counting' | 'waiting' | 'completed';

// [TypeScript] 훅 반환값 타입 정의
interface UseTimerReturn {
  gameState: TimerState;
  countdown: number;
  reactionTime: number;
  startTimer: () => void;
  handleReaction: () => number;
  resetTimer: () => void;
}

// [TypeScript] 훅 매개변수 타입 정의
interface UseTimerProps {
  countdownFrom?: number;
  maxReactionTime?: number;
  onComplete?: (reactionTime: number) => void;
}

/**
 * 카운트다운 및 반응 시간을 측정하는 커스텀 훅
 * @param countdownFrom 카운트다운 시작 숫자 (기본값: 5)
 * @param maxReactionTime 최대 허용 반응 시간 (ms) (기본값: 5000)
 * @param onComplete 타이머 완료 시 실행할 콜백
 */
export const useTimer = ({
  countdownFrom = 5,
  maxReactionTime = 5000,
  onComplete,
}: UseTimerProps = {}): UseTimerReturn => {
  // [React] 상태 관리
  const [gameState, setGameState] = useState<TimerState>('counting');
  const [countdown, setCountdown] = useState(countdownFrom);
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);

  // [React] 타이머 시작 함수
  const startTimer = () => {
    setGameState('counting');
    setCountdown(countdownFrom);
    setStartTime(0);
    setReactionTime(0);
  };

  // [React] 타이머 초기화 함수
  const resetTimer = () => {
    setGameState('counting');
    setCountdown(countdownFrom);
    setStartTime(0);
    setReactionTime(0);
  };

  // [React] 반응 시간 측정 함수
  const handleReaction = (): number => {
    if (gameState !== 'waiting') return 0;

    const endTime = performance.now();
    const currentReactionTime = Math.max(0, endTime - startTime);

    if (currentReactionTime > maxReactionTime) {
      console.warn('Invalid reaction time detected');
      return 0;
    }

    setReactionTime(currentReactionTime);
    setGameState('completed');

    // 완료 콜백 실행
    onComplete?.(currentReactionTime);

    return currentReactionTime;
  };

  // [React] 카운트다운 효과
  useEffect(() => {
    if (gameState !== 'counting') return;

    let autoCompleteTimer: NodeJS.Timeout;
    const startTimestamp = performance.now();

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTimestamp;
      const secondsElapsed = Math.floor(elapsed / 1000);
      const remaining = countdownFrom - secondsElapsed;

      if (remaining <= 0) {
        clearInterval(interval);
        setCountdown(0);
        setGameState('waiting');
        setStartTime(performance.now());

        // 최대 시간 초과 시 자동 완료
        autoCompleteTimer = setTimeout(() => {
          if (gameState === 'waiting' && startTime > 0) {
            setReactionTime(maxReactionTime);
            setGameState('completed');
            onComplete?.(maxReactionTime);
          }
        }, maxReactionTime);
      } else {
        setCountdown(remaining);
      }
    }, 100);

    return () => {
      clearInterval(interval);
      if (autoCompleteTimer) {
        clearTimeout(autoCompleteTimer);
      }
    };
  }, [gameState, countdownFrom, maxReactionTime, onComplete]);

  return {
    gameState,
    countdown,
    reactionTime,
    startTimer,
    handleReaction,
    resetTimer,
  };
};
