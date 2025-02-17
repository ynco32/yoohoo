'use client';

// hooks/useWebSocketQueue.ts
import { useRef, useEffect } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
// import { useRouter } from 'next/navigation';
import api from '@/lib/api/axios';
import { useQueueStore } from '@/store/useQueueStore';

export const useWebSocketQueue = () => {
  const stompClient = useRef<Client | null>(null);
  const setQueueInfo = useQueueStore((state) => state.setQueueInfo);

  const getAccessToken = () => {
    return document.cookie
      .split('; ')
      .find((row) => row.startsWith('accessToken='))
      ?.split('=')[1];
  };

  useEffect(() => {
    const client = new Client({
      brokerURL: `${process.env.NEXT_PUBLIC_WS_BASE_URL}/ws`,
      connectHeaders: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onStompError = (frame) => {
      console.error('🤝 STOMP 에러:', frame);
    };

    client.onConnect = () => {
      console.log('🤝 웹소켓 연결 성공');
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
    };

    client.activate();
    stompClient.current = client;

    return () => {
      if (client.connected) {
        client.deactivate();
      }
    };
  }, []);

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
  };
};
