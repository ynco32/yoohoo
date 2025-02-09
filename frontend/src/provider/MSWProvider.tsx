'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    mswInitialized: boolean;
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
  }, []);

  if (!mswInitialized && process.env.NEXT_PUBLIC_API_MOCKING !== 'disabled') {
    return <div>Loading MSW...</div>;
  }

  return null;
}
