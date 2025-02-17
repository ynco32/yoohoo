// 티켓팅을 위한 웹소켓 레이아웃입니다~!

'use client';
import { useWebSocketQueue } from '@/hooks/useWebSocketQueue';
import { useEffect } from 'react';

export default function TicketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { disconnect, isConnected } = useWebSocketQueue(); // 티켓팅 관련 페이지들에서만 웹소켓 연결 유지
  useEffect(() => {
    return () => {
      if (isConnected) disconnect();
    };
  }, [disconnect, isConnected]);

  return <>{children}</>;
}
