'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';
import { ReactNode, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@/assets/styles/toast-custom.scss';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // 페이지 로드 시 브라우저 세션 관리
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 브라우저 세션 ID 관리
      // sessionStorage는 브라우저가 닫힐 때만 초기화되므로 이 값의 존재 여부로 브라우저 세션 판단
      const browserSessionKey = 'browser_session_active';
      const isBrowserSessionActive = sessionStorage.getItem(browserSessionKey);

      if (!isBrowserSessionActive) {
        // 새 브라우저 세션 시작 (브라우저가 닫혔다가 다시 열림)
        console.log('새 브라우저 세션 시작 - 사용자 정보 초기화 필요');

        // 브라우저 세션 마커 설정
        sessionStorage.setItem(browserSessionKey, 'true');

        // 새 세션 ID 설정 (로컬스토리지에는 계속 보관)
        const newSessionId = `browser_session_${Date.now()}`;
        localStorage.setItem('session_id', newSessionId);

        // 사용자 상태 초기화 필요 플래그 설정
        localStorage.setItem('reset_user_state', 'true');
      } else {
        // 기존 브라우저 세션 유지 (새로고침)
        console.log('기존 브라우저 세션 유지 - 사용자 정보 유지');

        // 사용자 상태 초기화 필요 없음
        localStorage.removeItem('reset_user_state');
      }
    }
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
        <ToastContainer
          position='top-right'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </PersistGate>
    </Provider>
  );
}
