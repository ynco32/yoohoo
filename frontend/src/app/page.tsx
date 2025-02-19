'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // 토큰 체크
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('access_token='));

    // 토큰 존재 여부에 따라 즉시 리다이렉트
    if (token) {
      router.push('/main');
    } else {
      router.push('/login');
    }
  }, [router]);

  return <div />;
}
