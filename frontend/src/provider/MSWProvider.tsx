'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    mswInitialized?: boolean;
    originalFetch?: typeof fetch;
  }
}

export default function MSWProvider() {
  const [mswInitialized, setMswInitialized] = useState(false);

  useEffect(() => {
    async function initMSW() {
      const isMockingEnabled =
        process.env.NODE_ENV === 'development' &&
        process.env.NEXT_PUBLIC_API_MOCKING !== 'disabled';

      if (isMockingEnabled) {
        try {
          // 기존 fetch 함수를 저장
          if (typeof window !== 'undefined' && !window.originalFetch) {
            window.originalFetch = window.fetch;

            // fetch를 가로채서 MSW가 초기화될 때까지 대기하는 함수로 교체
            window.fetch = async (...args) => {
              while (!window.mswInitialized) {
                await new Promise((resolve) => setTimeout(resolve, 50));
              }
              return window.originalFetch!(...args);
            };
          }

          const { worker } = await import('@/mocks/browser');
          await worker.start({
            onUnhandledRequest: (request, print) => {
              // 카카오 지도 타일 요청은 무시하고 네트워크로 전달
              if (Boolean(request.url.hostname.includes('mts.daumcdn.net'))) {
                return; // MSW에서 무시 (가로채지 않음)
              }
              if (Boolean(request.url.pathname.startsWith('/api/'))) {
                print.warning();
              }
            },
            serviceWorker: {
              url: '/mockServiceWorker.js',
              options: {
                scope: '/',
              },
            },
          });
          console.log('[MSW] Successfully initialized with custom options');
          if (typeof window !== 'undefined') {
            window.mswInitialized = true;
          }
        } catch (error) {
          console.error('[MSW] Failed to initialize:', error);
        }
      }
      setMswInitialized(true);
    }

    initMSW();

    // cleanup function
    return () => {
      if (typeof window !== 'undefined' && window.originalFetch) {
        window.fetch = window.originalFetch;
        delete window.originalFetch;
      }
    };
  }, []);

   // MSW 등록 후 PWA 서비스 워커를 다시 등록하도록 설정
   useEffect(() => {
    if (mswInitialized && "serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        let hasMSW = false;
        let hasPWA = false;

        registrations.forEach((registration) => {
          if (registration.active?.scriptURL.includes("mockServiceWorker.js")) {
            hasMSW = true;
          }
          if (registration.active?.scriptURL.includes("sw.js")) {
            hasPWA = true;
          }
        });

        // MSW가 실행되었어도 PWA 서비스 워커(`sw.js`)가 없으면 강제 등록
        if (hasMSW && !hasPWA) {
          console.log("🔄 Re-registering PWA Service Worker...");
          navigator.serviceWorker
            .register("/sw.js")
            .then((registration) => {
              console.log("✅ PWA Service Worker registered:", registration);
            })
            .catch((error) => {
              console.error("❌ PWA Service Worker registration failed:", error);
            });
        }
      });
    }
  }, [mswInitialized]);

  if (!mswInitialized && process.env.NEXT_PUBLIC_API_MOCKING !== 'disabled') {
    return <div>Loading MSW...</div>;
  }

  return null;
}
