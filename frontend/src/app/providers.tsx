'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';
import { ReactNode, useEffect, useRef } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@/assets/styles/toast-custom.scss';
import { PURGE } from 'redux-persist';
import desktopBg from '/public/images/desktop.webp';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const initialized = useRef(false); // 초기화 상태 추적

  useEffect(() => {
    if (typeof window !== 'undefined' && !initialized.current) {
      // 배경 이미지 최적화 설정
      document.documentElement.style.setProperty(
        '--desktop-bg-url',
        `url(${desktopBg.src})`
      );

      // 브라우저 세션 관리
      const SESSION_KEY = 'app_browser_session';
      const isNewBrowserSession = !sessionStorage.getItem(SESSION_KEY);

      console.log(
        '브라우저 세션 상태:',
        isNewBrowserSession ? '새 세션' : '기존 세션 유지'
      );

      if (isNewBrowserSession) {
        console.log('새 브라우저 세션 감지: 사용자 상태 초기화 중...');

        store.dispatch({
          type: PURGE,
          key: 'user',
          result: () => {
            console.log('사용자 상태 초기화 완료');
          },
        });

        sessionStorage.setItem(SESSION_KEY, Date.now().toString());
      }

      // 초기화 완료 표시
      initialized.current = true;
    }
  }, []); // 빈 의존성 배열

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
