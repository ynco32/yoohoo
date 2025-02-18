'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [errorLogged, setErrorLogged] = useState(false);

  useEffect(() => {
    if (!errorLogged) {
      console.error('Encountered error:', error);
      setErrorLogged(true);

      // 스크롤 방지
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [error, errorLogged]);

  // 직접 404 페이지를 렌더링
  return (
    <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6">
          <Image
            src="/images/404-illustration.png"
            alt="404 일러스트레이션"
            width={100}
            height={100}
            style={{ display: 'block', margin: '0 auto 16px' }}
          />
          <Image
            src="/images/404-page.png"
            alt="404 이미지"
            width={270}
            height={270}
            style={{ display: 'block', margin: '0 auto' }}
          />
        </div>
        <div className="mt-8 flex flex-col items-center gap-1">
          <Link href="/main" className="transition-transform hover:scale-110">
            <Image
              src="/images/404-main.png"
              alt="메인으로 돌아가기"
              width={130}
              height={130}
              priority
            />
          </Link>
          <button
            onClick={() => window.history.back()}
            className="border-0 bg-transparent p-0 transition-transform hover:scale-110"
          >
            <Image
              src="/images/404-back.png"
              alt="이전 페이지로 돌아가기"
              width={100}
              height={100}
              priority
            />
          </button>
        </div>
      </div>
    </div>
  );
}
