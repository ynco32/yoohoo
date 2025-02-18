'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center overflow-hidden px-4 pt-36">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6">
          <Image
            src="/images/404-illustration.png"
            alt="404 일러스트레이션"
            width={300}
            height={300}
            style={{ display: 'block', margin: '0 auto 16px' }}
          />
        </div>
        <div className="mt-8 flex flex-col items-center gap-1">
          <Link href="/main" className="transition-transform hover:scale-110">
            <Image
              src="/images/404-main.png"
              alt="메인으로 돌아가기"
              width={160}
              height={160}
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
              width={160}
              height={160}
              priority
            />
          </button>
        </div>
      </div>
    </div>
  );
}
