// import { count } from 'node:console';
import { useState, useEffect } from 'react';

export type TicketingStatus = 'BEFORE_OPEN' | 'COUNT_DOWN' | 'OPEN';

interface WebSocketMessage {
  type: TicketingStatus;
  openTime?: string;
  countdown?: number;
}

interface TicketingState {
  status: TicketingStatus;
  openTime: string;
  countdown: number | null;
}

export const useTicketingSocket = () => {
  const [_socket, setSocket] = useState<WebSocket | null>(null); // 웹소켓 초기화
  const [ticketingState, setTicketingState] = useState<TicketingState>({
    // 티켓팅 상태 초기화
    status: 'BEFORE_OPEN',
    openTime: '',
    countdown: null,
  });

  useEffect(() => {
    // vue 로 치면 onMounted
    const ws = new WebSocket(
      process.env.NEXT_PUBLIC_WS_URL ||
        'wss://i12b207.p.ssafy.io/ticketing-melon' // 임시 api 주소
    ); // 웹소켓 연결
    setSocket(ws); // 웹소켓 초기화

    ws.onmessage = (event) => {
      const data: WebSocketMessage = JSON.parse(event.data); // 백에서 받은 데이터를 json으로 파싱

      setTicketingState((prev) => ({
        ...prev, // 이전 상태를 스프레드 연산자로 복사
        status: data.type,
        openTime: data.openTime || prev.openTime,
        countdown: data.countdown ?? prev.countdown, // 0도 의미 있을 수 있어서 || 대신 ?? 사용
      }));
    };

    return () => {
      if (ws.readyState == WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []); // 빈 의존성 배열로 마운트 시에만 실행

  // [JavaScript] 예매 시작 시간을 한국어 형식으로 포맷팅하는 유틸리티 함수
  const formatOpenTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours()}시 ${date.getMinutes()}분 예매 시작`;
  };

  // [JavaScript] 카운트다운 시간을 MM:SS 형식으로 포맷팅하는 유틸리티 함수
  const formatCountdown = (countdown: number) => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    return `남은 시간: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // 훅의 반환값으로 상태와 유틸리티 함수들을 객체로 제공
  return {
    ticketingState, // 현재 티켓팅 상태
    formatOpenTime, // 시작 시간 포맷팅 함수
    formatCountdown, // 카운트다운 포맷팅 함수
  };
};
