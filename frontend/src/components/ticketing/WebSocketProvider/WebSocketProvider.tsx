'use client';
import React, { useEffect, useRef } from 'react';
import { useWebSocketQueue } from '@/hooks/useWebSocketQueue';

interface WebSocketProviderProps {
  children: React.ReactNode;
  onEnterQueue?: boolean;
}

export default function WebSocketProvider({
  children,
  onEnterQueue = false,
}: WebSocketProviderProps) {
  const { enterQueue } = useWebSocketQueue();
  const hasEnteredQueueRef = useRef(false);

  useEffect(() => {
    // 이미 대기열에 진입했는지 확인하여 중복 호출 방지
    if (onEnterQueue && !hasEnteredQueueRef.current) {
      console.log('🤝 WebSocketProvider: enterQueue 호출');
      hasEnteredQueueRef.current = true;
      enterQueue();
      // 쿠키 설정 등의 클라이언트 측 코드도 여기에 배치
      // document.cookie = 'ticketing-progress=1; path=/';
    }
  }, [onEnterQueue]); // enterQueue 의존성 제거

  return <>{children}</>;
}
