import { useState, useEffect } from 'react';

// 개발 환경에서 MSW 체크를 건너뛰기 위한 플래그
const SKIP_MSW_CHECK = false;

export const useMswInit = () => {
  const [mswInitialized, setMswInitialized] = useState(false);

  useEffect(() => {
    // 개발 환경에서는 체크 건너뛰기
    if (SKIP_MSW_CHECK) {
      setMswInitialized(true);
      return;
    }

    // MSW가 이미 초기화되어 있는 경우
    if (window.mswInitialized) {
      setMswInitialized(true);
      return;
    }

    // MSW 초기화 대기
    const interval = setInterval(() => {
      if (window.mswInitialized) {
        setMswInitialized(true);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return { mswInitialized };
};
