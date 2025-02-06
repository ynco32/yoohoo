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
      if (process.env.NODE_ENV === 'development') {
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
        setMswInitialized(true);
      }
    }

    initMSW();
  }, []);

  if (!mswInitialized) {
    return <div>Loading MSW...</div>;
  }

  return null;
}
