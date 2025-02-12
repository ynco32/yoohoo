// hooks/useTicketingTimer.ts
import { useState, useEffect } from 'react';
import api from '@/lib/api/axios';
interface TimeInfo {
  startTime: string;
  serverTime: string;
  finished: boolean;
  within10Minutes: boolean;
}
// const calculateTimeLeft = ({ startTime, serverTime, finished }: TimeInfo) => {
//   const start = new Date(startTime).getTime();
//   const server = new Date(serverTime).getTime();
//   if (finished) {
//     // 이미 티켓팅이 끝났으면
//     return 0;
//   } else {
//     return Math.floor((start - server) / 1000);
//   }
// };

export const useTicketingTimer = () => {
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [buttonMessage, setButtonMessage] = useState('잠시만 기다려주세요...');
  const [timeInfo, setTimeInfo] = useState<TimeInfo | null>(null);
  const [finished, setFinished] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  // 서버 시간 정보 가져오기
  const fetchTimeInfo = async () => {
    try {
      const { data } = await api.get(`/api/v1/ticketing/time-info`);
      setTimeInfo(data);
      return data;
    } catch (error) {
      console.error('시간 정보 불러오기 실패', error);
      setButtonMessage('fetchTimeInfo에서 일시적인 오류가 발생했습니다');
      return null;
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let startTimeStamp: number;

    const updateTimer = async () => {
      // 초기 시간 정보를 서버에서 가져옴
      const info = await fetchTimeInfo();
      if (!info) return;

      if (info.finished) {
        setFinished(true);
        return;
      }

      // 서버 시간을 기준으로 설정
      startTimeStamp = new Date(info.serverTime + 'Z').getTime();
      console.log('⌛ startTimeStamp:', new Date(startTimeStamp).toISOString());

      // 프론트엔드에서 시간 계산을 위한 내부 함수
      const calculateRemainingTime = () => {
        const now = Date.now();
        const elapsedTime = now - startTimeStamp;
        const remainingTime = 10 * 60 * 1000 - elapsedTime; // 10분에서 경과 시간을 뺌
        const howManySecondsLeft = Math.ceil(remainingTime / 1000);
        setSecondsLeft(howManySecondsLeft);

        // 종료 조건 체크
        if (secondsLeft <= 0) {
          clearInterval(interval);
          return;
        }

        // timeInfo 업데이트
        setTimeInfo({
          ...info,
          serverTime: new Date(now).toISOString(),
          within10Minutes: secondsLeft <= 600, // 10분 = 600초
        });
      };

      // 초기 계산 실행
      calculateRemainingTime();

      // 남은 시간이 10분 이상일 때는 1분마다 갱신
      if (secondsLeft > 600) {
        interval = setInterval(calculateRemainingTime, 60000); // 1분
      } else {
        // 10분 이내일 때는 1초마다 갱신
        interval = setInterval(calculateRemainingTime, 1000);
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

    const { startTime, within10Minutes } = timeInfo;
    // const secondsLeft = calculateTimeLeft({
    //   startTime,
    //   serverTime,
    //   within10Minutes,
    //   finished: timeInfo.finished,
    // });

    setButtonDisabled(secondsLeft > 0);

    if (!within10Minutes && !finished) {
      const openTime = new Date(startTime);
      setButtonMessage(
        `${openTime.getHours()}시 ${openTime.getMinutes()}분 오픈`
      );
    } else if (secondsLeft > 60 && !finished) {
      setButtonMessage(`${Math.floor(secondsLeft / 60)}분 후 오픈`);
    } else if (secondsLeft > 0 && !finished) {
      setButtonMessage(`${secondsLeft}초 후 오픈`);
    } else if (secondsLeft <= 0 && !finished) {
      setButtonMessage('예매하기');
    } else if (finished) {
      setButtonMessage('예매 종료');
      setButtonDisabled(true);
    }
  }, [timeInfo]);

  return {
    buttonDisabled,
    buttonMessage,
  };
};
