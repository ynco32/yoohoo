'use client';
import React, { useState, useEffect } from 'react';
import { useWebSocketQueue } from '@/hooks/useWebSocketQueue';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface WebSocketProviderProps {
  children: React.ReactNode;
  onEnterQueue?: boolean;
}

export default function WebSocketProvider({
  children,
  onEnterQueue = false,
}: WebSocketProviderProps) {
  const { enterQueue } = useWebSocketQueue();
  const [hasEnteredQueue, setHasEnteredQueue] = useState(false);
  const queueInfo = useSelector((state: RootState) => state.queue);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // WebSocket 연결 및 대기열 진입
    if (onEnterQueue && !hasEnteredQueue) {
      console.log('🤝 WebSocketProvider: enterQueue 호출 시작');
      setIsLoading(true);
      setHasEnteredQueue(true);

      // enterQueue 호출
      const enterQueueAsync = async () => {
        try {
          await enterQueue();
          console.log('🤝 WebSocketProvider: enterQueue 완료');
        } catch (error) {
          console.error('🤝 WebSocketProvider: enterQueue 오류', error);
        } finally {
          if (isMounted) {
            // 짧은 지연 후 로딩 종료
            setTimeout(() => {
              if (isMounted) {
                setIsLoading(false);
              }
            }, 800);
          }
        }
      };

      enterQueueAsync();
    }

    return () => {
      isMounted = false;
      console.log('🤝 WebSocketProvider: clean-up 함수 실행');
    };
  }, [onEnterQueue, enterQueue, hasEnteredQueue]);

  // queueInfo 업데이트 시 로딩 상태 확인
  useEffect(() => {
    if (
      queueInfo.queueNumber > 0 ||
      queueInfo.waitingTime > 0 ||
      queueInfo.peopleBehind > 0
    ) {
      setIsLoading(false);
    }
  }, [queueInfo]);

  // 로딩 중일 때 로딩 인디케이터 표시, 그러나 children은 계속 렌더링
  return (
    <>
      {isLoading && (
        <div className='loading-overlay'>
          <div className='loading-spinner'>대기열에 입장 중입니다...</div>
        </div>
      )}
      {children}
    </>
  );
}
