import api from '@/lib/api/axios';
import { AxiosError } from 'axios';
import { useEffect, useState, useRef } from 'react';

// ⌛ 서버에서 받아오는 시간 정보 타입
interface TimeInfo {
  startTime: string; // 티켓팅 시작 시간
  serverTime: string; // 현재 서버 시간
  finished: boolean; // 티켓팅 종료 여부
  within10Minutes: boolean; // 시작 10분 전 여부
  frontStartTime: number; // 프론트엔드 시작 시간
}

export const useTicketingTimer = () => {
  // 🎫 티켓팅 버튼 상태 관리
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [buttonMessage, setButtonMessage] = useState('잠시만 기다려주세요...');
  const [timeInfo, setTimeInfo] = useState<TimeInfo | null>(null);

  // 🔄 interval 관리를 위한 Ref
  const intervalsRef = useRef<NodeJS.Timeout[]>([]);

  // ⛔ 모든 interval 정리
  const clearAllIntervals = () => {
    intervalsRef.current.forEach((id) => clearInterval(id));
    intervalsRef.current = [];
  };

  // 🕒 서버 시간 정보 가져오기
  const fetchTimeInfo = async () => {
    try {
      console.log('⏰ [Timer] 서버 시간 정보 요청...');
      const { data } = await api.get('/api/v1/ticketing/time-info');
      console.log('⏰ [Timer] 서버 응답:', data);

      const now = Date.now();
      setTimeInfo({
        ...data,
        frontStartTime: now,
      });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('⏰ [Timer] 서버 시간 정보 요청 실패:', {
          status: error.response?.status,
          data: error.response?.data,
        });
      }
    }
  };

  // ⚡ 남은 시간 계산 (초 단위)
  const calculateSecondsLeft = () => {
    if (!timeInfo || timeInfo.finished) return 0;

    const now = Date.now();
    const start = new Date(timeInfo.startTime).getTime();
    const server = new Date(timeInfo.serverTime).getTime();
    const frontStart = timeInfo.frontStartTime;

    if (start < now) return 0;

    const timePassed = now - frontStart;
    const timeLeft = start - server - timePassed;

    return Math.floor(timeLeft / 1000);
  };

  // 🎯 티켓팅 시작 여부 확인
  const checkIfTicketingStarted = async () => {
    try {
      const { data } = await api.get('/api/v1/ticketing/status');
      console.log('⏰ [Timer] 티켓팅 상태:', data);
      return data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('⏰ [Timer] 티켓팅 상태 확인 실패:', {
          status: error.response?.status,
          data: error.response?.data,
        });
      }
      return false;
    }
  };

  // 🔄 티켓팅 시작 상태 폴링 (최대 10회)
  const startPollingTicketingStatus = async () => {
    clearAllIntervals();
    let count = 0;

    const checkStatus = async () => {
      if (count >= 10) {
        clearAllIntervals();
        setButtonDisabled(true);
        setButtonMessage('새로고침 후 시도해주세요');
        return;
      }

      count++;
      const isStarted = await checkIfTicketingStarted();

      if (isStarted) {
        clearAllIntervals();
        setButtonDisabled(false);
        setButtonMessage('예매하기');
      }
    };

    const newIntervalId = setInterval(checkStatus, 2000);
    intervalsRef.current.push(newIntervalId);
    checkStatus(); // 최초 1회 실행
  };

  // 🔄 버튼 메시지 업데이트
  const updateButtonMessage = async () => {
    clearAllIntervals();
    const secondsLeft = calculateSecondsLeft();

    if (!timeInfo) return;

    // 티켓팅 종료된 경우
    if (timeInfo.finished) {
      setButtonDisabled(true);
      setButtonMessage('마감되었습니다');
      return;
    }

    // 시작 시간이 된 경우
    if (secondsLeft <= 0) {
      const isStarted = await checkIfTicketingStarted();
      if (isStarted) {
        setButtonDisabled(false);
        setButtonMessage('예매하기');
      } else {
        setButtonDisabled(true);
        setButtonMessage('곧 예매가 시작됩니다.');
        startPollingTicketingStatus();
      }
      return;
    }

    // 1분 미만 남은 경우
    if (secondsLeft < 60) {
      setButtonDisabled(true);
      setButtonMessage(`${secondsLeft}초 후 예매 시작`);
      const id = setInterval(updateButtonMessage, 1000);
      intervalsRef.current.push(id);
      return;
    }

    // 10분 미만 남은 경우
    if (secondsLeft < 600) {
      setButtonDisabled(true);
      const min = Math.floor(secondsLeft / 60);
      const sec = secondsLeft % 60;
      setButtonMessage(`${min}분 ${sec}초 후 예매 시작`);
      const id = setInterval(updateButtonMessage, 1000);
      intervalsRef.current.push(id);
      return;
    }

    // 10분 이상 남은 경우
    setButtonDisabled(true);
    const start = new Date(timeInfo.startTime);
    const hours = start.getHours().toString().padStart(2, '0');
    const minutes = start.getMinutes().toString().padStart(2, '0');
    setButtonMessage(`${hours}시 ${minutes}분 오픈`);
    const id = setInterval(updateButtonMessage, 300000); // 5분마다 갱신
    intervalsRef.current.push(id);
  };

  // 🔄 초기 데이터 로드
  useEffect(() => {
    fetchTimeInfo();
    return () => clearAllIntervals();
  }, []);

  // 🔄 timeInfo 변경 시 버튼 메시지 업데이트
  useEffect(() => {
    if (timeInfo) {
      updateButtonMessage();
    }
  }, [timeInfo]);

  // 🔄 3분마다 서버 시간 정보 갱신
  useEffect(() => {
    const id = setInterval(fetchTimeInfo, 180000);
    intervalsRef.current.push(id);
    return () => clearAllIntervals();
  }, []);

  return { buttonDisabled, buttonMessage };
};
