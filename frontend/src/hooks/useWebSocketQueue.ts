// hooks/useWebSocketQueue.ts
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

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DISABLE_WEBSOCKET === 'true') {
      return;
    }
    const client = new Client({
      brokerURL: 'wss://i12b207.p.ssafy.io/ticketing-melon',
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

      client.subscribe(`/book/waiting-time`, (message: IMessage) => {
        const response = JSON.parse(message.body);
        setQueueNumber(response.position);
        setWaitingTime(response.estimatedWaitingSeconds);
        setPeopleBehind(response.usersAfter);
      });

      client.subscribe(`/user/book/notification`, (message: IMessage) => {
        const response = JSON.parse(message.body);
        if (response === true) {
          router.push('area');
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
    } catch (_error) {
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
