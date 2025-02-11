// hooks/useTicketingTimer.ts
import { useState, useEffect } from 'react';
import api from '@/lib/api/axios';
interface TimeInfo {
  startTime: string;
  serverTime: string;
  within10Minutes: boolean;
}
const calculateTimeLeft = (startTime: string, serverTime: string) => {
  const start = new Date(startTime).getTime();
  const server = new Date(serverTime).getTime();
  return Math.floor((start - server) / 1000);
};

export const useTicketingTimer = () => {
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [buttonMessage, setButtonMessage] = useState('잠시만 기다려주세요...');
  const [timeInfo, setTimeInfo] = useState<TimeInfo | null>(null);

  // 서버 시간 정보 가져오기
  const fetchTimeInfo = async () => {
    try {
      const { data } = await api.get(`/api/v1/ticketing/time-info`);
      setTimeInfo(data);
      return data;
    } catch (_error) {
      setButtonMessage('일시적인 오류가 발생했습니다');
      return null;
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const updateTimer = async () => {
      const info = await fetchTimeInfo();
      if (!info) return;

      // 10분 이상 남았을 때는 1분마다 체크
      if (!info.within10Minutes) {
        interval = setInterval(fetchTimeInfo, 60000); // 1분
      } else {
        // 10분 이내일 때는 1초마다 체크
        interval = setInterval(fetchTimeInfo, 1000);
      }
    };

    updateTimer();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  // timeInfo가 업데이트될 때마다 버튼 상태 업데이트
  useEffect(() => {
    if (!timeInfo) return;

    const { startTime, serverTime, within10Minutes } = timeInfo;
    const secondsLeft = calculateTimeLeft(startTime, serverTime);

    setButtonDisabled(secondsLeft > 0);

    if (!within10Minutes) {
      const openTime = new Date(startTime);
      setButtonMessage(
        `${openTime.getHours()}시 ${openTime.getMinutes()}분 오픈`
      );
    } else if (secondsLeft > 60) {
      setButtonMessage(`${Math.floor(secondsLeft / 60)}분 후 오픈`);
    } else if (secondsLeft > 0) {
      setButtonMessage(`${secondsLeft}초 후 오픈`);
    } else {
      setButtonMessage('예매하기');
    }
  }, [timeInfo]);

  return {
    buttonDisabled,
    buttonMessage,
  };
};
