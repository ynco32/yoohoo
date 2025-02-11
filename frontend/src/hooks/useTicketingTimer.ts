// hooks/useTicketingTimer.ts
import { useState, useEffect } from 'react';
import api from '@/lib/api/axios';

export const useTicketingTimer = () => {
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [buttonMessage, setButtonMessage] = useState('잠시만 기다려주세요...');

  useEffect(() => {
    const calculateTimeLeft = (
      startTime: string,
      serverTime: string
    ): number => {
      const start = new Date(startTime).getTime();
      const server = new Date(serverTime).getTime();
      return Math.floor((start - server) / 1000);
    };

    const getButtonMessage = async () => {
      try {
        const { data } = await api.get(`/api/v1/ticketing/time-info`);
        const { startTime, serverTime, within10Minutes } = data;
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
      } catch (_error) {
        setButtonMessage('일시적인 오류가 발생했습니다');
      }
    };

    getButtonMessage();
    const interval = setInterval(getButtonMessage, 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    buttonDisabled,
    buttonMessage,
  };
};
