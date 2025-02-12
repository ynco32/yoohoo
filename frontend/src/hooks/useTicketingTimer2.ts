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
    if (timeInfo?.Finished || !timeInfo) {
      return 0; // 이미 티켓팅을 할 수 없음
    }
    if (!timeInfo) {
      return; // 시간 정보가 없음
    }
    if (!timeInfo.Finished) {
      return 0; // 10분 이내
    }
  };
};
