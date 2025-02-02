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
      className="sm:right-8 md:right-12 lg:right-16 fixed bottom-6 right-4 z-50 rounded-full bg-white p-3 shadow-lg hover:bg-gray-50"
    >
      <PencilIcon className="h-8 w-8" aria-label="Write Review" />
    </button>
  );
};
