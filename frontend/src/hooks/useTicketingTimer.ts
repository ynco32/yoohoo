import api from '@/lib/api/axios';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';

interface TimeInfo {
  startTime: string;
  serverTime: string;
  finished: boolean;
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
      console.log('[Timer] Fetching time info...'); // 디버깅 로그 추가
      const { data } = await api.get('/api/v1/ticketing/time-info');
      console.log('[Timer] Time info received:', data); // 응답 데이터 확인
      setTimeInfo(data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('[Timer] Error fetching time info:', {
          status: error.response?.status,
          data: error.response?.data,
          config: error.config, // 요청 설정 확인
        });
      }
    }
  };

  //2️⃣ 남은 시간 계산하기
  // const calculateSecondsLeft = () => {
  //   const now = Date.now(); // 현재 시간

  //   // 티켓팅이 끝나거나 시간 정보가 없을 경우우
  //   if (timeInfo?.finished || !timeInfo) {
  //     return 0;
  //   }

  //   // 시작 시간을 경과했을 때
  //   const start = new Date(timeInfo.startTime).getTime();
  //   if (start < now) {
  //     return 0;
  //   }

  //   // 시간 정보도 있고 시간을 경과하지 않았을 때
  //   console.log('⏰ now:', new Date(now).toISOString()); // 테스트 출력
  //   const server = new Date(timeInfo.serverTime).getTime();
  //   console.log('⏰ server:', new Date(server).toISOString()); // 테스트 출력
  //   const timePassed = now - server;
  //   const timeLeft =
  //     new Date(timeInfo.startTime).getTime() - timePassed - server;
  //   // 밀리초를 초로 변환 (Math.floor로 소수점 버림)
  //   const secondsLeft = Math.floor(timeLeft / 1000);
  //   return secondsLeft;
  // };
  const calculateSecondsLeft = () => {
    if (!timeInfo || timeInfo.finished) return 0; // 예외 처리

    const now = Date.now();
    const start = new Date(timeInfo.startTime).getTime();
    const server = new Date(timeInfo.serverTime).getTime();

    if (start < now) return 0; // 시작 시간이 지났으면 0 반환

    const timePassed = now - server; // 서버 기준으로 경과한 시간
    const timeLeft = start - server - timePassed; // 정확한 남은 시간 계산

    return Math.floor(timeLeft / 1000); // 초 단위 변환
  };

  // 3️⃣ 남은 시간에 따라 버튼 문구 바꿔주기기
  const changeButtonMessage = () => {
    // fetchTimeInfo(); // 빌드될 때 한 번만 가져오기

    // 이전 인터벌 제거
    if (intervalId) {
      clearInterval(intervalId);
    }

    const secondsLeft = calculateSecondsLeft();

    if (timeInfo) {
      if (timeInfo.finished) {
        // 티켓팅이 끝났을 때
        setButtonDisabled(true);
        setButtonMessage('마감되었습니다.');
      } else if (secondsLeft <= 0 && !timeInfo.finished) {
        // 시간이 안 남고 티켓팅이 끝나지 않았을 때
        setButtonDisabled(false);
        setButtonMessage('예매하기');
      } else if (secondsLeft <= 60 && !timeInfo.finished) {
        // 60초 이하 남았을 때
        setButtonDisabled(true);
        setButtonMessage(secondsLeft + '초 후 예매 시작');
        setIntervalId(window.setInterval(changeButtonMessage, 1000) as number); // 1초마다 실행
      } else if (secondsLeft < 600 && !timeInfo.finished) {
        // 10분 이하 남았을 때
        setButtonDisabled(true);
        const min = Math.floor(secondsLeft / 60);
        const sec = secondsLeft % 60;
        setButtonMessage(min + '분 ' + sec + '후 예매 시작');
        setIntervalId(window.setInterval(changeButtonMessage, 1000) as number); // 1초초마다 실행
      } else if (secondsLeft >= 600 && !timeInfo.finished) {
        // 10분 이상 남았을 때
        setButtonDisabled(true);
        const start = new Date(timeInfo.startTime);
        const hours = start.getHours().toString().padStart(2, '0');
        const minutes = start.getMinutes().toString().padStart(2, '0');
        setButtonMessage(`${hours}시 ${minutes}분 오픈`);
      }
    } else {
      console.log('timeInfo is null');
    }
  };

  // useEffect(() => {
  //   fetchTimeInfo();
  //   changeButtonMessage();
  //   const intervalId = setInterval(changeButtonMessage, 300000); // 5분마다 실행
  //   return () => clearInterval(intervalId);
  // }, []);

  // return {
  //   buttonDisabled,
  //   buttonMessage,
  // };
  // ✅ 처음 마운트될 때 API 요청 실행
  useEffect(() => {
    fetchTimeInfo();
  }, []);

  // ❌ 기존에는 `fetchTimeInfo()`만 실행하고 `timeInfo`가 변경되어도 `changeButtonMessage()`가 실행되지 않음
  // 🔄 수정: `useEffect`에서 `timeInfo` 변경 감지하여 버튼 메시지 업데이트
  useEffect(() => {
    if (timeInfo) {
      changeButtonMessage();
    }
  }, [timeInfo]);

  // ✅ 3분마다 `fetchTimeInfo()` 실행하여 최신 데이터 유지
  useEffect(() => {
    const interval = setInterval(fetchTimeInfo, 180000);
    return () => clearInterval(interval);
  }, []);

  return { buttonDisabled, buttonMessage };
};
