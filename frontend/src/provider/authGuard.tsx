'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const isDev = process.env.NODE_ENV === 'development';
const SKIP_AUTH_CHECK = isDev && process.env.NEXT_PUBLIC_SKIP_AUTH === 'true';
const USE_MSW = process.env.NEXT_PUBLIC_USE_MSW === 'true';

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      if (SKIP_AUTH_CHECK || USE_MSW) {
        setIsAuthorized(true);
        return;
      }

      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('access_token='));

      if (pathname === '/login' && token) {
        router.replace('/main');
        return;
      }

      if (pathname !== '/' && pathname !== '/login' && !token) {
        router.replace('/login');
        return;
      }

      setIsAuthorized(true);
    };

    checkAuth();
  }, [pathname, router]);

  if (!isAuthorized && pathname !== '/' && pathname !== '/login') {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
