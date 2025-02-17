'use client';
// hooks/useWebSocketQueue.ts
import { useRef, useEffect, useState, useCallback } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import { useRouter } from 'next/navigation';
import { useQueueStore } from '@/store/useQueueStore';
import api from '@/lib/api/axios';

export const useWebSocketQueue = () => {
  const router = useRouter();
  const stompClient = useRef<Client | null>(null);
  const setQueueInfo = useQueueStore((state) => state.setQueueInfo);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  const disconnect = useCallback(() => {
    if (stompClient.current?.connected) {
      console.log('🤝 웹소켓 연결 종료 시도');
      try {
        stompClient.current.deactivate();
        stompClient.current = null;
        setConnectionAttempts(0);
        setIsConnected(false);
      } catch (error) {
        console.error('🤝 웹소켓 연결 종료 실패', error);
      }
    }
  }, []);

  const getAccessToken = () => {
    return document.cookie
      .split('; ')
      .find((row) => row.startsWith('access_token='))
      ?.split('=')[1];
  };

  useEffect(() => {
    if (connectionAttempts >= 5) {
      console.log(
        '🤝 웹소켓 5회 이상 연결 시도로 client 를 만들지 않겠습니다. '
      );
      return;
    }
    console.log('🤝 현재 연결 시도 횟수:', connectionAttempts);

    if (process.env.NEXT_PUBLIC_DISABLE_WEBSOCKET === 'true') {
      return;
    }
    if (!stompClient.current) {
      const client = new Client({
        brokerURL: 'wss://i12b207.p.ssafy.io/ticketing-melon',
        connectHeaders: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        debug: (str) => console.log('🤝 STOMP: ' + str),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      client.beforeConnect = () => {
        setConnectionAttempts((prev) => prev + 1);
      };

      client.onStompError = (frame) => {
        console.error('🤝 STOMP 에러:', frame);
        setIsConnected(false);
        if (connectionAttempts >= 5) {
          client.deactivate();
          alert('🤝 웹소켓 5회 이상 연결 시도. 연결 중단');
        }
      };

      client.onConnect = () => {
        console.log('🤝 웹소켓 연결 성공');
        setConnectionAttempts(0);
        setIsConnected(true);

        client.subscribe(`/user/book/waiting-time`, (message: IMessage) => {
          console.log('🤝waiting-time 구독~!!');
          console.log('🤝waiting-time 수신된 메세지:', message.body);
          const response = JSON.parse(message.body);
          setQueueInfo(
            response.position,
            response.estimatedWaitingSeconds,
            response.usersAfter
          );
        });

        client.subscribe(`/user/book/notification`, (message: IMessage) => {
          console.log('🤝notification 구독~!!');
          console.log('🤝notification 수신된 메세지:', message.body);
          const response = JSON.parse(message.body);
          if (response === true) {
            router.push('./real/areaSelect');
          }
        });
      };

      stompClient.current = client;
    }
    // 연결 시도 횟수가 최대치 미만일 때만 활성화
    if (connectionAttempts < 5 && stompClient.current) {
      stompClient.current.activate();
    }

    // [수정] cleanup 함수에서 disconnect 사용
    return () => {
      if (stompClient.current?.connected) {
        stompClient.current.deactivate();
        stompClient.current = null;
        setConnectionAttempts(0);
      }
    };
  }, [connectionAttempts, router]);

  const enterQueue = async () => {
    try {
      const response = await api.post(`/api/v1/ticketing/queue`);
      console.log(`🤝 ${response.data} 번째로 대기열 진입 성공`);
    } catch (_error) {
      console.log('🤝 대기열 진입 실패');
    }
  };

  return {
    enterQueue,
    disconnect, // [추가] disconnect 함수 외부 노출
    connectionAttempts,
    isMaxAttemptsReached: connectionAttempts >= 5,
    isConnected, // [추가] 연결 상태 외부 노출
  };
};
