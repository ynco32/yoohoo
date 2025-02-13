'use client';
// hooks/useWebSocketQueue.ts
import { useRef, useEffect } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import { useRouter } from 'next/navigation';
import { useQueueStore } from '@/store/useQueueStore';
import api from '@/lib/api/axios';

export const useWebSocketQueue = () => {
  const router = useRouter();
  // const [queueNumber, setQueueNumber] = useState(0);
  // const [waitingTime, setWaitingTime] = useState(0);
  // const [peopleBehind, setPeopleBehind] = useState(0);
  const stompClient = useRef<Client | null>(null);
  const setQueueInfo = useQueueStore((state) => state.setQueueInfo);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DISABLE_WEBSOCKET === 'true') {
      return;
    }
    const client = new Client({
      brokerURL: 'ws://i12b207p.ssafy.io/ticketing',
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
        // setQueueNumber(response.position);
        // setWaitingTime(response.estimatedWaitingSeconds);
        // setPeopleBehind(response.usersAfter);
        setQueueInfo(
          response.position,
          response.estimatedWaitingSeconds,
          response.usersAfter
        );
      });

      client.subscribe(`/user/book/notification`, (message: IMessage) => {
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
  }, []);

  const enterQueue = async () => {
    try {
      const response = await api.post(`/api/v1/ticketing/queue`);
      // setQueueNumber(response.data); // 이걸로 설정해주지 말기
      console.log(`🤝 ${response.data} 번째로 대기열 진입 성공`);
    } catch (_error) {
      console.log('🤝 대기열 진입 실패');
    }
  };

  return {
    // queueNumber,
    // waitingTime,
    // peopleBehind,
    enterQueue,
  };
};
