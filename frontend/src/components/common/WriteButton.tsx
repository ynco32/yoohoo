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
      className="md:right-4 absolute bottom-4 right-4 z-50 flex h-[57px] w-[57px] items-center justify-center rounded-full bg-sight-button text-white p-3 shadow-lg"
    >
      <PencilIcon  className="h-8 w-8" aria-label="Write Review" />
    </button>
  );
};
