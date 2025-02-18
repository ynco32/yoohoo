'use client';
import { useEffect, useState } from 'react';
import SecurityMessagePopup from '@/components/features/ticketing/SecurityMessagePopup';
import { useTicketintPracticeResultStore } from '@/store/useTicketingPracticeResult';
import { useRouter } from 'next/navigation';

export default function SecurityMessage() {
  const router = useRouter();
  // [React] 상태 관리
  const [gameState, setGameState] = useState<
    'counting' | 'showing' | 'completed'
  >('counting');
  const [countdown, setCountdown] = useState(5);
  const [startTime, setStartTime] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  // [Zustand] 전역 상태 관리
  const setReactionTime = useTicketintPracticeResultStore(
    (state) => state.setReactionTime
  );

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
        setGameState('showing');
        setShowPopup(true);
        setStartTime(performance.now());

        autoRedirectTimer = setTimeout(() => {
          if (gameState !== 'completed') {
            setReactionTime(10000);
            router.push('securityMessage/result');
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

  // [React] 보안문자 입력 성공 핸들러
  const handleSuccess = () => {
    if (gameState !== 'showing') return;

    const endTime = performance.now();
    const reactionTime = Math.max(0, endTime - startTime);

    if (reactionTime > 10000) {
      console.warn('Invalid reaction time detected');
      return;
    }

    setReactionTime(reactionTime);
    setGameState('completed');
    setTimeout(() => {
      router.push('securityMessage/result');
    }, 100);
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      {/* 카운트다운 오버레이 */}
      {gameState === 'counting' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-8 text-center">
            <span className="text-4xl font-bold text-primary-main">
              {countdown}
            </span>
          </div>
        </div>
      )}

      {/* 보안문자 팝업 */}
      <SecurityMessagePopup
        isOpen={showPopup}
        onPostpone={() => {}}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
