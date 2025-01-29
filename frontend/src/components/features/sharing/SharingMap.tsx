'use client'

import { SharingPost } from '@/types/sharing';

export interface SharingMapProps {
  posts: SharingPost[];
}

export const SharingMap = ({ posts }: SharingMapProps) => {
  return (
    <div className="h-[calc(100vh-180px)]">
      <div className="flex h-full items-center justify-center bg-gray-100">
        지도 구현 예정
      </div>
    </div>
  );
};