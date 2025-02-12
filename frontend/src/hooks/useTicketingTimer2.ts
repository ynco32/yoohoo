import api from '@/lib/api/axios';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';

interface TimeInfo {
  startTime: string;
  serverTime: string;
  Finished: boolean;
  within10Minutes: boolean;
}

export const useTicketingTimer2 = () => {
  // 넘겨줘야 하는 값들들
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [buttonMessage, setButtonMessage] = useState('잠시만 기다려주세요...');
  const [intervalId, setIntervalId] = useState<number | null>(null);

  const [timeInfo, setTimeInfo] = useState<TimeInfo | null>(null);

  //1️⃣ 시간 정보 가져오기
  const fetchTimeInfo = async () => {
    try {
      const { data } = await api.get(`/api/v1/ticketing/time-info`);
      setTimeInfo(data); // 시간 정보 등록
      return;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        // 에러 처리
        console.error('시간 정보 불러오기 실패', error);
      }
    }
  };

  //2️⃣ 남은 시간 계산하기
  const calculateSecondsLeft = () => {
    const now = Date.now(); // 현재 시간

    // 티켓팅이 끝나거나 시간 정보가 없을 경우우
    if (timeInfo?.Finished || !timeInfo) {
      return 0;
    }

    // 시작 시간을 경과했을 때
    const start = new Date(timeInfo.startTime).getTime();
    if (start < now) {
      return 0;
    }

    // 시간 정보도 있고 시간을 경과하지 않았을 때
    console.log('⏰ now:', now); // 테스트 출력
    const server = new Date(timeInfo.serverTime).getTime();
    console.log('⏰ server:', new Date(server).toISOString()); // 테스트 출력
    const timePassed = now - server;
    const timeLeft =
      new Date(timeInfo.startTime).getTime() - timePassed - server;
    // 밀리초를 초로 변환 (Math.floor로 소수점 버림)
    const secondsLeft = Math.floor(timeLeft / 1000);
    return secondsLeft;
  };

  // 3️⃣ 남은 시간에 따라 버튼 문구 바꿔주기기
  const changeButtonMessage = () => {
    fetchTimeInfo();

    // 이전 인터벌 제거
    if (intervalId) {
      clearInterval(intervalId);
    }

    const secondsLeft = calculateSecondsLeft();

    if (timeInfo) {
      if (timeInfo.Finished) {
        // 티켓팅이 끝났을 때
        setButtonDisabled(true);
        setButtonMessage('마감되었습니다.');
      } else if (secondsLeft <= 0 && !timeInfo.Finished) {
        // 시간이 안 남고 티켓팅이 끝나지 않았을 때
        setButtonDisabled(false);
        setButtonMessage('예매하기.');
      } else if (secondsLeft <= 60 && !timeInfo.Finished) {
        // 60초 이하 남았을 때
        setButtonDisabled(true);
        setButtonMessage(secondsLeft + '초 후 예매 시작');
        setIntervalId(window.setInterval(changeButtonMessage, 1000) as number); // 1초마다 실행
      } else if (secondsLeft < 600 && !timeInfo.Finished) {
        // 10분 이하 남았을 때
        setButtonDisabled(true);
        const min = Math.floor(secondsLeft / 60);
        setButtonMessage(min + '분 후 예매 시작');
        setIntervalId(window.setInterval(changeButtonMessage, 60000) as number); // 1분마다 실행
      } else if (secondsLeft >= 600 && !timeInfo.Finished) {
        // 10분 이상 남았을 때
        setButtonDisabled(true);
        const start = new Date(timeInfo.startTime);
        const hours = start.getHours().toString().padStart(2, '0');
        const minutes = start.getMinutes().toString().padStart(2, '0');
        setButtonMessage(`${hours}시 ${minutes}분 오픈`);
      }
    }
  };

  useEffect(() => {
    const intervalId = setInterval(changeButtonMessage, 300000); // 5분마다 실행
    return () => clearInterval(intervalId);
  }, []);

  return {
    buttonDisabled,
    buttonMessage,
  };
};
