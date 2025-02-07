'use client';

import React, { useEffect } from 'react';
import { SharingCard } from './SharingCard';
import { SharingPost } from '@/types/sharing';

export interface SharingListProps {
  posts: SharingPost[];
  onMount?: () => void; // 컴포넌트가 마운트될 때 호출될 함수
  concertId: number;
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => Promise<void>;
}

/**
 * 나눔 게시글 목록 컴포넌트
 * @description 나눔 게시글 카드들을 목록 형태로 보여주는 컴포넌트
 */
export const SharingList = ({
  posts,
  onMount,
  concertId,
}: SharingListProps) => {
  useEffect(() => {
    // 컴포넌트가 마운트될 때 스크롤을 맨 위로 이동
    onMount?.();
  }, [onMount]);

  return (
    <div className="flex flex-col gap-3 p-4">
      {posts.map((post) => (
        <SharingCard key={post.sharingId} {...post} concertId={concertId} />
      ))}
    </div>
  );
};
