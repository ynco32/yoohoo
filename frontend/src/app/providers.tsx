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
  // 페이지 로드 시 세션 ID 초기화
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 앱 초기 실행 시 세션 ID가 없으면 생성
      const existingSessionId = localStorage.getItem('sessionId');
      if (!existingSessionId) {
        localStorage.setItem('sessionId', Date.now().toString());
      }

      // 브라우저 탭/창이 닫힐 때 처리하는 이벤트 핸들러
      const handleBeforeUnload = () => {
        // 브라우저나 탭이 닫힐 때 세션 ID를 변경하여 다음 실행 시 사용자 상태 초기화
        const nextSessionId = `session_${Date.now()}`;
        localStorage.setItem('sessionId', nextSessionId);
      };

      // 이벤트 리스너 등록
      window.addEventListener('beforeunload', handleBeforeUnload);

      // 컴포넌트 언마운트 시 정리
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
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
