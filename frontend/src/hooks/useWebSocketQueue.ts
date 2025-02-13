'use client';
// hooks/useWebSocketQueue.ts
import { AxiosError } from 'axios';
import { useState, useRef, useEffect } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import { useRouter } from 'next/navigation';
import api from '@/lib/api/axios';

export const useWebSocketQueue = () => {
  const router = useRouter();
  const [queueNumber, setQueueNumber] = useState('');
  const [waitingTime, setWaitingTime] = useState('');
  const [peopleBehind, setPeopleBehind] = useState(0);
  const stompClient = useRef<Client | null>(null);

  const getAccessToken = () => {
    return document.cookie
      .split('; ')
      .find((row) => row.startsWith('access_token='))
      ?.split('=')[1];
  };

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DISABLE_WEBSOCKET === 'true') {
      return;
    }
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

    client.onStompError = (frame) => {
      console.error('🤝 STOMP 에러:', frame);
    };

    client.onConnect = () => {
      console.log('🤝 웹소켓 연결 성공');

      client.subscribe(`/user/book/waiting-time`, (message: IMessage) => {
        console.log('🤝waiting-time 구독~!!');
        console.log('🤝waiting-time 수신된 메세지:', message.body);
        const response = JSON.parse(message.body);
        setQueueNumber(response.position);
        setWaitingTime(response.estimatedWaitingSeconds);
        setPeopleBehind(response.usersAfter);
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

    client.activate();
    stompClient.current = client;

    return () => {
      if (client.connected) {
        client.deactivate();
      }
    };
  }, [router]);

  const enterQueue = async () => {
    try {
      const response = await api.post(`/api/v1/ticketing/queue`);
      setQueueNumber(response.data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          console.log(error.response.data.message);
        }
      }
      console.log('대기열 진입 실패');
    }
  };

  return {
    queueNumber,
    waitingTime,
    peopleBehind,
    enterQueue,
  };
};
