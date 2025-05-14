'use client';
import { useRef, useEffect, useState, useCallback } from 'react';
import { Client, IMessage, StompHeaders } from '@stomp/stompjs';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setQueueInfo } from '@/store/slices/queueSlice';
import { setError } from '@/store/slices/errorSlice';
import { apiClient } from '@/api/api';
import { AxiosError } from 'axios';
import { ApiResponse } from '@/types/api';
import { WaitingTimeResponse } from '@/types/websocket';

// NotificationResponse 인터페이스 수정 (ApiResponse와 유사한 형태)
interface NotificationResponse {
  data: boolean;
  error: { code: string; message: string } | null;
  meta: { timestamp: string };
}

export const useWebSocketQueue = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const stompClient = useRef<Client | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isQueueEntering, setIsQueueEntering] = useState<boolean>(false);

  // 웹소켓 연결 설정 및 관리
  const setupWebSocket = useCallback(() => {
    // 이미 연결 중이거나 연결된 경우 중복 연결 방지
    if (
      isConnecting ||
      (stompClient.current && stompClient.current.connected)
    ) {
      console.log('🤝 웹소켓이 이미 연결 중이거나 연결되어 있습니다.');
      return;
    }

    if (process.env.NEXT_PUBLIC_DISABLE_WEBSOCKET === 'true') {
      return;
    }

    console.log('🤝 웹소켓 연결 시작...');
    setIsConnecting(true);

    // 브라우저의 WebSocket 지원 확인
    if (!window.WebSocket) {
      console.error('🤝 이 브라우저는 WebSocket을 지원하지 않습니다.');
      setIsConnecting(false);
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
        setIsConnecting(false);
      };

      client.onWebSocketError = (event) => {
        console.error('🤝 웹소켓 에러 발생:', event);
        setIsConnecting(false);
      };

      client.onWebSocketClose = (event) => {
        console.log(
          '🤝 웹소켓 연결 닫힘. 코드:',
          event.code,
          '이유:',
          event.reason || '이유 없음'
        );

        // 연결이 닫히면 구독 상태 리셋
        setIsSubscribed(false);
        setIsConnecting(false);
      };

      client.onConnect = () => {
        console.log('🤝 웹소켓 연결 성공');
        setIsConnecting(false);

        // sessionId가 있고 아직 구독하지 않은 경우에만 구독
        if (sessionId && !isSubscribed) {
          subscribeToTopics(client, sessionId);
        }
      };

      client.activate();
      stompClient.current = client;
    } catch (error) {
      console.error('🤝 웹소켓 초기화 중 오류:', error);
      setIsConnecting(false);
    }
  }, [isConnecting, isSubscribed, sessionId]);

  // 세션 ID로 토픽 구독 함수
  const subscribeToTopics = useCallback(
    (client: Client, sid: string) => {
      if (isSubscribed) {
        console.log('🤝 이미 구독 중입니다.');
        return;
      }

      try {
        // 구독 경로에 세션 ID 포함 (전체 문자열 사용)
        // 로그를 보니 콜론(:) 대신 언더스코어(_)가 사용됨
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
            console.error('🤝 waiting-time 메시지 파싱 오류:', error);
          }
        });

        console.log(`🤝 구독 시작: ${notificationTopic}`);
        client.subscribe(notificationTopic, (message: IMessage) => {
          console.log(`🤝 ${sid}/book/notification 구독 메시지 수신`);
          console.log('🤝 notification 수신된 메세지:', message.body);

          try {
            // 원시 메시지 출력 (디버깅용)
            console.log('🤝 원시 메시지:', message.body);

            // API 응답 구조로 파싱
            const response: NotificationResponse = JSON.parse(message.body);
            console.log('🤝 파싱된, 알림 응답:', response);

            // data 필드가 true인 경우 페이지 이동
            if (response.data === true) {
              console.log('🤝 입장 가능 상태, 페이지 이동 시작');
              router.push('./real/areaSelect');
            } else {
              console.log('🤝 아직 입장 불가능 상태');
            }
          } catch (error) {
            console.error('🤝 notification 메시지 파싱 오류:', error);
            console.error('🤝 오류 상세:', JSON.stringify(error));
            try {
              // 파싱 실패 시 원본 메시지 표시
              console.log('🤝 원본 메시지(문자열):', message.body);
            } catch (e) {
              console.error('🤝 원본 메시지 접근 오류:', e);
            }
          }
        });

        setIsSubscribed(true);
        console.log('🤝 모든 토픽 구독 완료, 구독 상태:', true);
      } catch (error) {
        console.error('🤝 구독 중 오류 발생:', error);
        setIsSubscribed(false);
      }
    },
    [isSubscribed, dispatch, router]
  );

  // 웹소켓 초기 연결
  useEffect(() => {
    setupWebSocket();

    return () => {
      if (stompClient.current && stompClient.current.connected) {
        console.log('🤝 컴포넌트 언마운트: 웹소켓 연결 해제');
        stompClient.current.deactivate();
        setIsSubscribed(false);
      }
    };
  }, [setupWebSocket]); // setupWebSocket 의존성 추가

  // 세션 ID가 변경되면 구독 실행
  useEffect(() => {
    if (
      sessionId &&
      stompClient.current &&
      stompClient.current.connected &&
      !isSubscribed
    ) {
      console.log('🤝 세션 ID 변경됨, 구독 시작:', sessionId);
      subscribeToTopics(stompClient.current, sessionId);
    }
  }, [sessionId, isSubscribed, subscribeToTopics]);

  const enterQueue = useCallback(async () => {
    // 이미 대기열 진입 중이면 중복 요청 방지
    if (isQueueEntering) {
      console.log('🤝 이미 대기열 진입 처리 중입니다.');
      return;
    }

    // 이미 세션 ID가 있고 구독 중이면 중복 요청 방지
    if (sessionId && isSubscribed) {
      console.log('🤝 이미 대기열에 진입한 상태입니다:', sessionId);
      return;
    }

    setIsQueueEntering(true);

    try {
      console.log('🤝 대기열 진입 API 요청 시작');
      const response = await apiClient.post<ApiResponse<string>>(
        `/api/v1/ticketing/queue`
      );
      const receivedSessionId = response.data.data;
      console.log(`🤝 대기열 진입 성공: sessionId = ${receivedSessionId}`);

      // sessionId 상태 업데이트
      setSessionId(receivedSessionId);

      // 웹소켓 연결 확인
      if (stompClient.current) {
        if (stompClient.current.connected) {
          console.log('🤝 웹소켓이 이미 연결되어 있습니다.');
          // useEffect에서 세션 ID 변경을 감지하여 구독 처리
        } else {
          console.log('🤝 웹소켓 연결이 필요합니다.');
          setupWebSocket();
        }
      } else {
        console.log('🤝 웹소켓 클라이언트 초기화 필요');
        setupWebSocket();
      }
    } catch (error: unknown) {
      console.error('🤝 대기열 진입 API 오류:', error);
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
    } finally {
      setIsQueueEntering(false);
    }
  }, [sessionId, isSubscribed, isQueueEntering, dispatch, setupWebSocket]);

  return {
    enterQueue,
    sessionId,
    isSubscribed,
  };
};
