'use client';

import React from 'react';
import { SharingCard } from './SharingCard';
import { SharingPost } from '@/types/sharing';

export interface SharingListProps {
  posts: SharingPost[];
}

/**
 * 나눔 게시글 목록 컴포넌트
 * @description 나눔 게시글 카드들을 목록 형태로 보여주는 컴포넌트
 */
export const SharingList = ({ posts }: SharingListProps) => {
  return (
    <div className="flex flex-col gap-3 p-4">
      {posts.map((post) => (
        <SharingCard key={post.id} {...post} />
      ))}
    </div>
  );
};
