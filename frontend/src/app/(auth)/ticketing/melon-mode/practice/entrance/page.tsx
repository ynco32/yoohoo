'use client';
import Page1 from '@/components/features/ticketing/pages/1';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTicketintPracticeResultStore } from '@/store/ticketintPracticeResult';

export default function Entrance() {
  const router = useRouter();
  // [React] 게임 상태 관리
  const [gameState, setGameState] = useState<'counting' | 'waiting'>(
    'counting'
  );
  const [countdown, setCountdown] = useState(5);
  const [startTime, setStartTime] = useState(0);

  // [Zustand] 전역 상태에서 반응 시간 설정 함수 가져오기
  const setReactionTime = useTicketintPracticeResultStore(
    (state) => state.setReactionTime
  );

  // [React] 카운트다운 및 게임 상태 관리
  useEffect(() => {
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

        const autoRedirectTimer = setTimeout(() => {
          setReactionTime(5000); // 5초로 설정
          router.push('result');
        }, 5000); // 5초 후 자동 이동

        // cleanup에 autoRedirectTimer 정리 추가
        return () => clearTimeout(autoRedirectTimer);
      } else {
        setCountdown(remaining);
      }
    }, 100); // 100ms 간격으로 업데이트

    // cleanup: 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(interval);
  }, []); // 마운트 시 한 번만 실행

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
      setReactionTime(reactionTime);
      await new Promise((resolve) => setTimeout(resolve, 0));
      router.push('result');
    } catch (error) {
      console.error('Error in reaction time game:', error);
    }
  };

  return (
    <div>
      <Page1
        fixedButtonMessage={
          gameState === 'counting' ? `${countdown}초 후 열림` : '예매하기'
        }
        fixedButtonOnClick={onButtonClick}
        isfixedButtonDisabled={gameState !== 'waiting'}
      />
    </div>
  );
}
