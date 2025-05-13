'use client';
import React, { useEffect } from 'react';
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

  useEffect(() => {
    if (onEnterQueue) {
      enterQueue();
      // 쿠키 설정 등의 클라이언트 측 코드도 여기에 배치
      // document.cookie = 'ticketing-progress=1; path=/';
    }
  }, [onEnterQueue, enterQueue]);

  return <>{children}</>;
}
