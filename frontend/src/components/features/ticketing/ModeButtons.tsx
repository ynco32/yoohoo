'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Mode() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 gap-3 p-3">
      <div
        onClick={() => router.push('/ticketing/melon-mode/practice')}
        className={`hover:shadow-card-hover flex flex-col items-center justify-center rounded-card bg-gray-50 p-6 shadow-card-colored transition-shadow`}
      >
        <div className="relative flex h-40 w-40 items-center justify-center">
          <Image
            src="/images/practice.png"
            alt="연습모드"
            fill
            className="z-10 object-contain"
          />
        </div>
        <span className="text-title-bold text-text-menu">연습모드</span>
        <span className="text-caption3 text-text-description">단계별 연습</span>
      </div>
      <div
        onClick={() => router.push('/ticketing/melon-mode/real')}
        className={`hover:shadow-card-hover flex flex-col items-center justify-center rounded-card bg-gray-50 p-6 shadow-card-colored transition-shadow`}
      >
        <div className="relative mx-0 flex h-40 w-40 items-center justify-center">
          <Image
            src="/images/real.png"
            alt="실전모드"
            fill
            className="z-10 object-contain"
          />
        </div>
        <span className="text-title-bold text-text-menu">실전모드</span>
        <span className="text-caption3 text-text-description">
          실전과 똑같은 연습
        </span>
      </div>

      {/* <Link href="/ticketing/melon-mode/practice">
        <IconButton>
          <h2>연습 모드</h2>
          <h3>단계별 연습</h3>
        </IconButton>
      </Link>
      <Link href="/ticketing/melon-mode/real">
        <IconButton>
          <h2>실전 모드 시작</h2>
          <h3>실전과 똑같은 연습</h3>
        </IconButton>
      </Link> */}
    </div>
  );
}
