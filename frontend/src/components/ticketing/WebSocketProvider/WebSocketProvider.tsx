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
  const { enterQueue, disconnectWebSocket } = useWebSocketQueue();
  const [hasEnteredQueue, setHasEnteredQueue] = useState(false);
  const queueInfo = useSelector((state: RootState) => state.queue);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (onEnterQueue && !hasEnteredQueue) {
      console.log('🤝 WebSocketProvider: enterQueue 호출');
      setHasEnteredQueue(true);
      enterQueue();
    }

    // 컴포넌트가 언마운트될 때 웹소켓 연결 해제
    return () => {
      console.log('🤝 WebSocketProvider: 언마운트, 연결 해제');
      disconnectWebSocket();
    };
  }, [onEnterQueue, enterQueue, disconnectWebSocket]);

  // queueInfo가 초기값이 아닐 때 dataLoaded를 true로 설정
  useEffect(() => {
    if (
      queueInfo.queueNumber > -1 ||
      queueInfo.waitingTime > -1 ||
      queueInfo.peopleBehind > -1
    ) {
      setDataLoaded(true);
    }
  }, [queueInfo]);

  // 데이터가 로드되었을 때만 children을 렌더링
  if (onEnterQueue && !dataLoaded) {
    return <div className='loading'>데이터를 불러오는 중...</div>; // 로딩 표시기
  }

  return <>{children}</>;
}
