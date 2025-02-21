'use client';
import { useEffect, useState, useRef } from 'react';
import SecurityMessagePopup from '@/components/features/ticketing/SecurityMessagePopup';
import { useTicketintPracticeResultStore } from '@/store/useTicketingPracticeResult';
import { useRouter } from 'next/navigation';

export default function SecurityMessage() {
  const router = useRouter();
  const [gameState, setGameState] = useState<
    'counting' | 'showing' | 'completed'
  >('counting');
  const [countdown, setCountdown] = useState(3);
  const [showPopup, setShowPopup] = useState(false);
  const startTimeRef = useRef<number>(0);
  const autoRedirectTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const setReactionTime = useTicketintPracticeResultStore(
    (state) => state.setReactionTime
  );

  useEffect(() => {
    const startTimestamp = Date.now();
    const endTimestamp = startTimestamp + 3000; // 5초 후

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.ceil((endTimestamp - now) / 1000);

      if (remaining <= 0) {
        clearInterval(interval);
        setCountdown(0);
        setGameState('showing');
        setShowPopup(true);
        startTimeRef.current = performance.now();

        // 10초 제한시간 설정
        autoRedirectTimerRef.current = setTimeout(() => {
          setReactionTime(10000);
          router.push('securityMessage/result');
        }, 10000);
      } else {
        setCountdown(remaining);
      }
    }, 50);

    return () => {
      clearInterval(interval);
      if (autoRedirectTimerRef.current) {
        clearTimeout(autoRedirectTimerRef.current);
      }
    };
  }, [router, setReactionTime]);

  const handleSuccess = () => {
    if (gameState !== 'showing') return;

    if (autoRedirectTimerRef.current) {
      clearTimeout(autoRedirectTimerRef.current);
    }

    const endTime = performance.now();
    const reactionTime = endTime - startTimeRef.current;

    if (reactionTime > 10000) {
      console.warn('Invalid reaction time detected');
      return;
    }

    setReactionTime(reactionTime);
    setGameState('completed');
    router.push('securityMessage/result');
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      {gameState === 'counting' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-8 text-center">
            <span className="text-4xl font-bold text-primary-main">
              {countdown}
            </span>
          </div>
        </div>
      )}

      <SecurityMessagePopup
        isOpen={showPopup}
        onPostpone={() => {}}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
