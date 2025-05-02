'use client';
import { useEffect, useState, useRef } from 'react';
import Captcha from '@/components/ticketing/Captcha/Captcha';
import { useRouter } from 'next/navigation';
import { useTicketing } from '../TicketingContext'; // 상위 폴더의 Context 사용
import styles from './page.module.scss';

export default function SecurityMessage() {
  const router = useRouter();
  const { setReactionTime, setGameMode } = useTicketing(); // Context에서 setter 함수 가져오기

  const [gameState, setGameState] = useState<
    'counting' | 'showing' | 'completed'
  >('counting');
  const [countdown, setCountdown] = useState(3);
  const [showPopup, setShowPopup] = useState(false);
  const startTimeRef = useRef<number>(0);
  const autoRedirectTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // [React] 게임 모드 설정
  useEffect(() => {
    setGameMode('capcha');
  }, [setGameMode]);

  useEffect(() => {
    const startTimestamp = Date.now();
    const endTimestamp = startTimestamp + 3000; // 3초 후

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
          router.push('minigame/complete');
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
    router.push('/minigame/complete');
  };

  return (
    <div className={styles.container}>
      {gameState === 'counting' && (
        <div className={styles.overlay}>
          <div className={styles.countdownBox}>
            <span className={styles.countdownNumber}>{countdown}</span>
          </div>
        </div>
      )}

      <Captcha
        isOpen={showPopup}
        onPostpone={() => {}}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
