import api from '@/lib/api/axios';
import { AxiosError } from 'axios';
import { useState } from 'react';

interface TimeInfo {
  startTime: string;
  serverTime: string;
  Finished: boolean;
  within10Minutes: boolean;
}

export const useTicketingTimer2 = () => {
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
};
