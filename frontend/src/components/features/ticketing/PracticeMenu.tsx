'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LockClosedIcon } from '@heroicons/react/24/solid';

export default function PracticeMenu() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 gap-3 p-3">
      <div
        onClick={() => router.push('/ticketing/melon-mode/practice/entrance')}
        className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center"
      >
        <div className="hover:shadow-card-hover flex flex-col items-center justify-center rounded-card bg-gray-50 shadow-card-colored transition-shadow">
          <div className="relative flex h-20 w-20 items-center justify-center">
            <Image
              src="/images/queue.png"
              alt="대기열 입장 연습"
              fill
              className="z-10 object-contain"
            />
          </div>
        </div>
        <span className="mt-1 text-caption2-bold text-text-menu">
          대기열 입장
        </span>
      </div>

      <div
        onClick={() => router.push('/ticketing/melon-mode/practice/grape')}
        className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center"
      >
        <div className="hover:shadow-card-hover flex flex-col items-center justify-center rounded-card bg-gray-50 p-4 shadow-card-colored transition-shadow">
          <div className="relative flex h-12 w-12 items-center justify-center">
            <Image
              src="/images/seat.png"
              alt="좌석 선택 연습"
              fill
              className="z-10 object-contain"
            />
          </div>
        </div>
        <span className="mt-1 text-caption2-bold text-text-menu">
          좌석 선택
        </span>
      </div>

      <div className="flex h-24 w-24 cursor-not-allowed flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center rounded-card bg-gray-100 p-4 shadow-card-colored">
          <div className="relative flex h-12 w-12 items-center justify-center">
            <Image
              src="/images/capcha.png"
              alt="보안문자 연습"
              fill
              className="z-10 object-contain brightness-50"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <LockClosedIcon className="h-6 w-6 text-gray-400" />
            </div>
          </div>
        </div>
        <span className="mt-1 text-caption2-bold text-gray-400">보안 문자</span>
      </div>

      <div className="flex h-24 w-24 cursor-not-allowed flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center rounded-card bg-gray-100 p-4 shadow-card-colored">
          <div className="relative flex h-12 w-12 items-center justify-center">
            <Image
              src="/images/total.png"
              alt="종합 연습"
              fill
              className="z-10 object-contain brightness-50"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <LockClosedIcon className="h-6 w-6 text-gray-400" />
            </div>
          </div>
        </div>
        <span className="mt-1 text-caption2-bold text-gray-400">종합 연습</span>
      </div>
    </div>
  );
}
