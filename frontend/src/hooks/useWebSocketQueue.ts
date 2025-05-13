'use client';
import { useRef, useEffect } from 'react';
import { Client, IMessage, StompHeaders } from '@stomp/stompjs'; // StompHeaders 추가
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setQueueInfo } from '@/store/slices/queueSlice';
import { setError } from '@/store/slices/errorSlice';
import { apiClient } from '@/api/api';
import { AxiosError } from 'axios';
import { ApiResponse } from '@/types/api';
import { WaitingTimeResponse, NotificationResponse } from '@/types/websocket';

export const useWebSocketQueue = () => {
  const router = useRouter();
  const dispatch = useDispatch();
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
      brokerURL: 'wss://conkiri.shop/ticketing-platform',
      connectHeaders: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
      debug: (str: string) => console.log('🤝 STOMP: ' + str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onStompError = (frame: { headers: StompHeaders; body: string }) => {
      console.error('🤝 STOMP 에러:', frame);
    };

    client.onConnect = () => {
      console.log('🤝 웹소켓 연결 성공');

      client.subscribe(`/user/book/waiting-time`, (message: IMessage) => {
        console.log('🤝waiting-time 구독~!!');
        console.log('🤝waiting-time 수신된 메세지:', message.body);
        const response: WaitingTimeResponse = JSON.parse(message.body);
        dispatch(
          setQueueInfo({
            queueNumber: response.position,
            waitingTime: response.estimatedWaitingSeconds,
            peopleBehind: response.usersAfter,
          })
        );
      });

      client.subscribe(`/user/book/notification`, (message: IMessage) => {
        console.log('🤝notification 구독~!!');
        console.log('🤝notification 수신된 메세지:', message.body);
        const response: NotificationResponse = JSON.parse(message.body);
        if (response.success === true) {
          router.push('./real/areaSelect');
        }
      });
    };

    client.activate();
    stompClient.current = client;

    return () => {
      if (client && client.connected) {
        client.deactivate();
      }
    };
  }, [dispatch, router]);

  const enterQueue = async () => {
    try {
      const response = await apiClient.post<ApiResponse<number>>(
        `/api/v1/ticketing/queue`
      );
      console.log(`🤝 ${response.data.data} 번째로 대기열 진입 성공`);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          dispatch(setError('이미 티켓팅에 참여하셨습니다.'));
        } else {
          const errorMessage =
            error.response?.data?.error?.message ||
            '티켓팅 참여 중 오류가 발생했습니다.';
          dispatch(setError(errorMessage));
        }
      }
    }
  };
  return {
    enterQueue,
  };
};
