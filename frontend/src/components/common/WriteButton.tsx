// components/common/ReviewButton/ReviewButton.tsx
'use client';

import { PencilIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface WriteButtonProps {
  path: string;
}

export const WriteButton = ({ path }: WriteButtonProps) => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(path)}
      className="absolute bottom-6 right-4 z-50 w-[60px] h-[60px] flex items-center justify-center rounded-full 
            bg-white p-3 shadow-lg hover:bg-gray-50 md:right-4"
    >
      <PencilIcon className="h-8 w-8" aria-label="Write Review" />
    </button>
  );
};
