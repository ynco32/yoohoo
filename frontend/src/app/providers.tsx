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
  // 브라우저가 닫히거나 페이지가 새로고침될 때 세션 ID 관리
  useEffect(() => {
    // 세션 시작 시 세션 ID 설정
    if (typeof window !== 'undefined') {
      // 이미 세션 ID가 있는지 확인
      const currentSessionId = localStorage.getItem('sessionId');

      // 세션 ID가 없으면 새로 생성
      if (!currentSessionId) {
        localStorage.setItem('sessionId', Date.now().toString());
      }
    }

    // beforeunload 이벤트 핸들러: 페이지가 언로드되기 전에 실행
    const handleBeforeUnload = () => {
      if (typeof window !== 'undefined') {
        // 새로고침이 아닌 브라우저/탭 닫기 시에만 세션 ID 재설정
        // (페이지를 떠날 때만 세션 ID를 변경)
        localStorage.setItem('sessionId', Date.now().toString());
      }
    };

    // 이벤트 리스너 등록
    window.addEventListener('beforeunload', handleBeforeUnload);

    // 컴포넌트 언마운트 시 정리
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
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
