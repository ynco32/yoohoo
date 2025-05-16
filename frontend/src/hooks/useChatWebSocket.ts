// src/hooks/useChatWebSocket.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { apiRequest } from '@/api/api';
import {
  ApiChatMessage,
  Message,
  SendMessageRequest,
  MessagesResponse,
} from '@/types/chat';

interface UseChatWebSocketProps {
  chatRoomId: number;
}

export function useChatWebSocket({ chatRoomId }: UseChatWebSocketProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redux에서 사용자 정보 가져오기
  const { data: userInfo } = useSelector((state: RootState) => state.user);

  // 웹소켓 클라이언트 및 구독 참조
  const clientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<any>(null);

  // 세션 스토리지 키
  const storageKey = `chat-messages-${chatRoomId}`;

  // API 메시지를 클라이언트 메시지로 변환하는 함수
  const convertApiMessageToClientMessage = useCallback(
    (apiMessage: ApiChatMessage): Message => {
      // 시간 포맷팅 (HH:MM 형식)
      const messageDate = new Date(apiMessage.createdAt);
      const formattedTime = `${messageDate
        .getHours()
        .toString()
        .padStart(2, '0')}:${messageDate
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;

      // 부모 메시지가 있는지 확인
      let replyTo: Message | undefined = undefined;
      if (apiMessage.parentMessageId) {
        replyTo = {
          id: apiMessage.parentMessageId,
          nickname: apiMessage.parentSenderNickname || '',
          time: '', // 부모 메시지 시간은 API에서 제공되지 않음
          content: apiMessage.parentContent || '',
        };
      }

      // 내가 보낸 메시지인지 확인
      const isMe = apiMessage.senderId === userInfo?.userId;

      return {
        id: apiMessage.messageId,
        nickname: apiMessage.senderNickname,
        time: formattedTime,
        content: apiMessage.content,
        isMe,
        replyTo,
      };
    },
    [userInfo?.userId]
  );

  // 초기 메시지 로드 함수
  const loadInitialMessages = useCallback(async () => {
    try {
      setIsLoading(true);

      // 세션 스토리지에서 캐시된 메시지 확인
      const cachedMessagesStr = sessionStorage.getItem(storageKey);
      let cachedMessages: Message[] = [];

      if (cachedMessagesStr) {
        try {
          cachedMessages = JSON.parse(cachedMessagesStr);
          // 임시로 캐시된 메시지 표시 (API 로드 전)
          setMessages(cachedMessages);
        } catch (e) {
          console.error('캐시된 메시지 파싱 오류:', e);
        }
      }

      // API로 최신 메시지 로드
      const response = await apiRequest<MessagesResponse>(
        'GET',
        `/api/v1/place/chat/chat-rooms/${chatRoomId}/messages`
      );

      if (response?.messages) {
        // API 메시지를 클라이언트 메시지로 변환
        const clientMessages = response.messages.map(
          convertApiMessageToClientMessage
        );

        // 세션 스토리지에 메시지 캐싱
        sessionStorage.setItem(storageKey, JSON.stringify(clientMessages));

        setMessages(clientMessages);
        setError(null);
      }
    } catch (err: any) {
      console.error('메시지 로드 오류:', err);
      setError(err.message || '메시지를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [chatRoomId, convertApiMessageToClientMessage, storageKey]);

  // 이전 메시지 로드 (무한 스크롤)
  const loadPreviousMessages = useCallback(
    async (beforeTime: string, size: number = 20) => {
      if (isLoading) return false;

      try {
        setIsLoading(true);

        // ISO 형식으로 날짜 변환
        const isoDateTime = new Date(beforeTime).toISOString();

        const response = await apiRequest<MessagesResponse>(
          'GET',
          `/api/v1/place/chat/chat-rooms/${chatRoomId}/messages/before`,
          undefined,
          { beforeTime: isoDateTime, size }
        );

        if (response?.messages) {
          // API 메시지를 클라이언트 메시지로 변환
          const clientMessages = response.messages.map(
            convertApiMessageToClientMessage
          );

          // 중복 제거 후 메시지 목록 앞에 추가
          setMessages((prevMessages) => {
            const existingIds = new Set(prevMessages.map((msg) => msg.id));
            const newMessages = clientMessages.filter(
              (msg) => !existingIds.has(msg.id)
            );
            const updatedMessages = [...newMessages, ...prevMessages];

            // 업데이트된 전체 메시지 캐싱
            sessionStorage.setItem(storageKey, JSON.stringify(updatedMessages));

            return updatedMessages;
          });

          return clientMessages.length > 0;
        }

        return false;
      } catch (err: any) {
        console.error('이전 메시지 로드 오류:', err);
        setError(
          err.message || '이전 메시지를 불러오는 중 오류가 발생했습니다.'
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [chatRoomId, convertApiMessageToClientMessage, isLoading, storageKey]
  );

  // 웹소켓 연결 설정
  useEffect(() => {
    // 이미 존재하는 클라이언트가 있다면 재사용
    if (clientRef.current && isConnected) {
      return;
    }

    // 쿠키 확인 - access_token 없으면 바로 오류 설정
    const hasAccessToken = document.cookie.includes('access_token');
    if (!hasAccessToken) {
      setError('로그인이 필요합니다. 로그인 후 다시 시도해주세요.');
      return; // 토큰 없으면 연결 시도 자체를 하지 않음
    }

    try {
      console.log('채팅 웹소켓 연결 시도...');

      // 쿠키 확인 (디버깅용)
      console.log('현재 쿠키:', document.cookie);
      console.log(
        'access_token 존재 여부:',
        document.cookie.includes('access_token')
      );

      // API URL 구성
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

      // SockJS 인스턴스 생성 (상대 경로 사용)
      const sockJsUrl = `${baseUrl}/place-ws`;
      const socket = new SockJS(sockJsUrl);

      // Stomp 클라이언트 생성 (SockJS 사용)
      const client = new Client({
        webSocketFactory: () => socket,
        debug: (str) => console.log('CHAT STOMP: ' + str),
        reconnectDelay: 10000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      // 연결 성공 콜백
      client.onConnect = () => {
        console.log('웹소켓 연결 성공');
        setIsConnected(true);
        setError(null);

        // 채팅방 메시지 구독
        subscriptionRef.current = client.subscribe(
          `/topic/chat/${chatRoomId}`,
          (messageEvent) => {
            try {
              const receivedMessage = JSON.parse(
                messageEvent.body
              ) as ApiChatMessage;
              console.log('새 메시지 수신:', receivedMessage);

              // API 메시지를 클라이언트 메시지로 변환
              const clientMessage =
                convertApiMessageToClientMessage(receivedMessage);

              // 중복 메시지 방지를 위한 ID 체크
              setMessages((prevMessages) => {
                // ID로 중복 체크
                if (prevMessages.some((msg) => msg.id === clientMessage.id)) {
                  return prevMessages;
                }

                const updatedMessages = [...prevMessages, clientMessage];

                // 업데이트된 메시지를 세션 스토리지에 캐싱
                sessionStorage.setItem(
                  storageKey,
                  JSON.stringify(updatedMessages)
                );

                return updatedMessages;
              });
            } catch (err) {
              console.error('메시지 처리 오류:', err);
            }
          }
        );

        // 연결 성공 후 초기 메시지 로드
        loadInitialMessages();
      };

      // 오류 처리
      client.onStompError = (frame) => {
        console.error('STOMP 오류:', frame);
        setError(`연결 오류: ${frame.headers.message}`);
        setIsConnected(false);
      };

      client.onWebSocketError = (event) => {
        console.error('웹소켓 오류:', event);
        setError('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
        setIsConnected(false);
      };

      // 연결 시작
      client.activate();
      clientRef.current = client;
    } catch (err) {
      console.error('웹소켓 초기화 오류:', err);
      setError('연결 초기화 중 오류가 발생했습니다.');
    }

    // 정리 함수 - 컴포넌트 언마운트 시 구독만 해제하고 연결은 유지
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [
    chatRoomId,
    convertApiMessageToClientMessage,
    isConnected,
    loadInitialMessages,
    storageKey,
  ]);

  // 메시지 전송 함수
  const sendMessage = useCallback(
    (content: string, replyToMessage?: Message) => {
      if (!clientRef.current || !isConnected) {
        setError(
          '서버에 연결되어 있지 않습니다. 새로고침 후 다시 시도해주세요.'
        );
        return false;
      }

      if (!content.trim()) {
        return false;
      }

      try {
        // 전송할 메시지 데이터
        const messageRequest: SendMessageRequest = {
          content: content.trim(),
          parentMessageId: replyToMessage?.id,
        };

        console.log('메시지 전송:', messageRequest);

        // 웹소켓을 통해 메시지 전송
        clientRef.current.publish({
          destination: `/app/chat/${chatRoomId}`,
          body: JSON.stringify(messageRequest),
        });

        return true;
      } catch (err) {
        console.error('메시지 전송 오류:', err);
        setError('메시지 전송에 실패했습니다.');
        return false;
      }
    },
    [chatRoomId, isConnected]
  );

  // 연결 끊기 함수 (명시적으로 연결 해제 필요시)
  const disconnect = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }

    if (clientRef.current) {
      clientRef.current.deactivate();
      clientRef.current = null;
      setIsConnected(false);
    }
  }, []);

  // 재연결 함수
  const reconnect = useCallback(() => {
    if (!clientRef.current || !isConnected) {
      if (clientRef.current) {
        clientRef.current.activate();
      }
    }
  }, [isConnected]);

  return {
    messages,
    isConnected,
    isLoading,
    error,
    sendMessage,
    loadPreviousMessages,
    refreshMessages: loadInitialMessages,
    disconnect,
    reconnect,
  };
}
