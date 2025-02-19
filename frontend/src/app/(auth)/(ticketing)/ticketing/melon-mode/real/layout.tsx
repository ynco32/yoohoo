// 티켓팅을 위한 웹소켓 레이아웃입니다~!
// 링크로 접속을 막기 위한 코드 추가!.. 하지 않기...

'use client';
import { useWebSocketQueue } from '@/hooks/useWebSocketQueue';
// import { SessionProvider } from 'next-auth/react';

export default function TicketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useWebSocketQueue(); // 티켓팅 관련 페이지들에서만 웹소켓 연결 유지

  return <>{children}</>;
}
