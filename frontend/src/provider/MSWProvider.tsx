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
