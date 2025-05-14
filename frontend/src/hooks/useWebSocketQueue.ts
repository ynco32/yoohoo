'use client';
import { useRef, useEffect, useState } from 'react';
import { Client, IMessage, StompHeaders } from '@stomp/stompjs';
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
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DISABLE_WEBSOCKET === 'true') {
      return;
    }

    console.log('🤝 웹소켓 연결 시작...');

    // 브라우저의 WebSocket 지원 확인
    if (!window.WebSocket) {
      console.error('🤝 이 브라우저는 WebSocket을 지원하지 않습니다.');
      return;
    }

    try {
      const client = new Client({
        brokerURL: 'wss://conkiri.shop/ticketing-platform',
        debug: (str: string) => console.log('🤝 STOMP: ' + str),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      client.onStompError = (frame: {
        headers: StompHeaders;
        body: string;
      }) => {
        console.error('🤝 STOMP 에러:', frame);
      };

      client.onWebSocketError = (event) => {
        console.error('🤝 웹소켓 에러 발생:', event);
      };

      client.onWebSocketClose = (event) => {
        console.log(
          '🤝 웹소켓 연결 닫힘. 코드:',
          event.code,
          '이유:',
          event.reason || '이유 없음'
        );

        // 웹소켓 닫힘 코드에 따른 디버깅 정보
        if (event.code === 1000) {
          console.log('🤝 정상 종료');
        } else if (event.code === 1001) {
          console.log('🤝 앱이 닫히거나 페이지 이동 발생');
        } else if (event.code === 1002) {
          console.log('🤝 프로토콜 오류');
        } else if (event.code === 1003) {
          console.log('🤝 지원되지 않는 데이터 형식');
        } else if (event.code === 1005) {
          console.log('🤝 닫힘 코드가 전송되지 않음');
        } else if (event.code === 1006) {
          console.log('🤝 비정상 종료 (연결 끊김)');
        } else if (event.code === 1007) {
          console.log('🤝 잘못된 메시지 형식');
        } else if (event.code === 1008) {
          console.log('🤝 정책 위반');
        } else if (event.code === 1009) {
          console.log('🤝 메시지가 너무 큼');
        } else if (event.code === 1010) {
          console.log('🤝 클라이언트에서 필요한 확장 프로그램이 없음');
        } else if (event.code === 1011) {
          console.log('🤝 서버에서 예기치 않은 상황 발생');
        } else if (event.code === 1015) {
          console.log('🤝 TLS 핸드셰이크 실패');
        }

        // 연결이 닫히면 구독 상태 리셋
        setIsSubscribed(false);
      };

      client.onConnect = () => {
        console.log('🤝 웹소켓 연결 성공');

        // sessionId가 있고 아직 구독하지 않은 경우에만 구독
        if (sessionId && !isSubscribed) {
          subscribeToTopics(client, sessionId);
          setIsSubscribed(true);
        }
      };

      client.activate();
      stompClient.current = client;
    } catch (error) {
      console.error('🤝 웹소켓 초기화 중 오류:', error);
    }

    return () => {
      if (stompClient.current && stompClient.current.connected) {
        stompClient.current.deactivate();
      }
    };
  }, [dispatch, router, sessionId, isSubscribed]); // isSubscribed 의존성 추가

  // 세션 ID로 토픽 구독 함수
  const subscribeToTopics = (client: Client, sid: string) => {
    try {
      // 구독 경로에 세션 ID 포함 (전체 문자열 사용)
      // 콜론(:)이 그대로 유지되도록 수정
      const waitingTimeTopic = `/user/${sid}/book/waiting-time`;
      const notificationTopic = `/user/${sid}/book/notification`;

      console.log(`🤝 구독 시작: ${waitingTimeTopic}`);
      client.subscribe(waitingTimeTopic, (message: IMessage) => {
        console.log(`🤝 ${sid}/book/waiting-time 구독 메시지 수신`);
        console.log('🤝 waiting-time 수신된 메세지:', message.body);
        try {
          const response: WaitingTimeResponse = JSON.parse(message.body);
          dispatch(
            setQueueInfo({
              queueNumber: response.position,
              waitingTime: response.estimatedWaitingSeconds,
              peopleBehind: response.usersAfter,
            })
          );
        } catch (error) {
          console.error('🤝 메시지 파싱 오류:', error);
        }
      });

      console.log(`🤝 구독 시작: ${notificationTopic}`);
      client.subscribe(notificationTopic, (message: IMessage) => {
        console.log(`🤝 ${sid}/book/notification 구독 메시지 수신`);
        console.log('🤝 notification 수신된 메세지:', message.body);
        try {
          const response: NotificationResponse = JSON.parse(message.body);
          if (response.success === true) {
            router.push('./real/areaSelect');
          }
        } catch (error) {
          console.error('🤝 메시지 파싱 오류:', error);
        }
      });
    } catch (error) {
      console.error('🤝 구독 중 오류 발생:', error);
      setIsSubscribed(false);
    }
  };

  const enterQueue = async () => {
    try {
      // 이미 세션 ID가 있고 구독 중이면 중복 요청 방지
      if (sessionId && isSubscribed) {
        console.log('🤝 이미 대기열에 진입한 상태입니다:', sessionId);
        return;
      }

      const response = await apiClient.post<ApiResponse<string>>(
        `/api/v1/ticketing/queue`
      );
      const receivedSessionId = response.data.data;
      console.log(`🤝 대기열 진입 성공: sessionId = ${receivedSessionId}`);

      // sessionId 상태 업데이트
      setSessionId(receivedSessionId);

      // 웹소켓 연결 확인 및 구독
      if (stompClient.current) {
        if (stompClient.current.connected && !isSubscribed) {
          console.log('🤝 웹소켓이 이미 연결되어 있습니다. 구독을 시작합니다.');
          subscribeToTopics(stompClient.current, receivedSessionId);
          setIsSubscribed(true);
        } else if (!stompClient.current.connected) {
          console.log('🤝 웹소켓 연결이 필요합니다.');
          // 연결이 되지 않은 경우 onConnect에서 구독 처리
          // isSubscribed와 sessionId 상태 변경으로 useEffect 트리거
        }
      }
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
    sessionId,
    isSubscribed,
  };
};
