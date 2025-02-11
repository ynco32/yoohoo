'use client';
import { Client, IMessage } from '@stomp/stompjs';
import { AxiosError } from 'axios';
import Page1 from '@/components/features/ticketing/pages/1';
import SchedulePopup from '@/components/ui/SchedulePopup';
import ConcertScheduleButton from '@/components/ui/ConcertScheduleButton';
import QueuePopup from '@/components/ui/QueuePopup';
import { useState, useEffect, useRef } from 'react';
import api from '@/lib/api/axios';
import { useRouter } from 'next/navigation';

export default function Ticketing1() {
  const router = useRouter();
  const [isSchedulePopupOpen, setisSchedulePopupOpen] = useState(true); // 잠시 테스트를 위해 true 로 변경
  const [isQueuePopupOpen, setisQueuePopupOpen] = useState(false);
  const [isfixedButtonDisabled, _setIsfixedButtonDisabled] = useState(true);
  const [fixedButtonMessage, _setFixedButtonMessage] = useState('임시 메세지');

  // 🆕 WebSocket 관련 상태 추가
  const [queueNumber, setQueueNumber] = useState('');
  const stompClient = useRef<Client | null>(null); // STOMP 클라이언트 참조 저장
  const [waitingTime, setWaitingTime] = useState<string>(''); // 대기 시간
  const [peopleBehind, setPeopleBehind] = useState<number>(0); // 내 뒤 대기 인원

  useEffect(() => {
    // 🌟 STOMP 클라이언트 설정
    const client = new Client({
      brokerURL: 'ws://i12b207p.ssafy.io/ticketing',
      debug: function (str) {
        console.log('🤝 STOMP: ' + str);
      },
      reconnectDelay: 5000, // 연결 끊김 시 5초 후 재시도
      heartbeatIncoming: 4000, // 서버->클라이언트 생존 확인 4초
      heartbeatOutgoing: 4000, // 클라이언트->서버 생존 확인 4초
    });

    // ✨ 연결 성공하면면 실행될 콜백
    client.onConnect = () => {
      console.log('🤝  웹소켓 연결 성공');

      // 📩 대기열 정보 구독 설정
      // 서버에서 주기적으로 대기 시간과 인원 업데이트
      client.subscribe(`/book/waiting-time`, (message: IMessage) => {
        const response = JSON.parse(message.body);
        setQueueNumber(response.position); // 현재 위치
        setWaitingTime(response.estimatedWaitingSeconds); // 예상 대기 시간 업데이트
        setPeopleBehind(response.usersAfter); // 앞 대기 인원 업데이트
      });

      // 🔔 개인별 알림 구독 설정
      // 유저별 고유 메시지 (입장 허가 등) 수신
      client.subscribe(`/user/book/notification`, (message: IMessage) => {
        const response = JSON.parse(message.body);
        console.log('🤝 입장 알림 응답:', response); // 응답 구조 확인
        if (response === true) {
          // 'ENTER' 이거 수정 예정!!!!
          // 입장 가능 알림
          setisQueuePopupOpen(false);
          // TODO: 다음 페이지로 이동 로직 추가
          router.push('area');
        }
      });
    };

    // ⚠️ 에러 처리 콜백
    client.onStompError = (frame) => {
      console.error('🤝 STOMP 에러:', frame);
    };

    // 🎯 모든 설정이 끝났으니 연결 시작
    client.activate();
    stompClient.current = client; // ref에 클라이언트 저장

    // 🧹 클린업: 컴포넌트 언마운트 시 연결 해제
    return () => {
      if (client.connected) {
        client.deactivate();
      }
    };
  }, []); // 빈 배열: 컴포넌트 마운트 시 1회만 실행

  // 백엔드에서 오는 웹소켓 메세지에 따라 setFixedButtonMessage로 바꾸기

  // 📮 대기열 진입 함수 수정
  const enterQueue = async () => {
    try {
      const response = await api.post(`/api/v1/ticketing/queue`);
      setQueueNumber(response.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log('🤝 ⚠️ queue 진입 api 실패:', error.response?.status);
      }
    }
  };

  const handleQueuePopupOpen = () => {
    setisSchedulePopupOpen(false);
    setisQueuePopupOpen(true);
    enterQueue();
  };

  return (
    <div>
      <Page1
        isfixedButtonDisabled={isfixedButtonDisabled}
        fixedButtonOnClick={() => setisSchedulePopupOpen(true)}
        fixedButtonMessage={fixedButtonMessage}
      />
      <SchedulePopup
        isOpen={isSchedulePopupOpen}
        onClose={() => setisSchedulePopupOpen(false)}
        title="공연 회차를 고르세요."
        width="md"
      >
        <div>
          <ConcertScheduleButton onClick={handleQueuePopupOpen}>
            2024.2.21(토) 20시 00분
          </ConcertScheduleButton>
          <ConcertScheduleButton onClick={handleQueuePopupOpen}>
            2024.2.22(일) 18시 00분
          </ConcertScheduleButton>
        </div>
      </SchedulePopup>
      <QueuePopup
        title="ASIA TOUR LOG in SEOUL"
        queueNumber={queueNumber}
        behindMe={peopleBehind}
        expectedTime={waitingTime}
        onClose={() => setisQueuePopupOpen(false)}
        isOpen={isQueuePopupOpen}
      ></QueuePopup>
    </div>
  );
}
