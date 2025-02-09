'use client';

import React, { useEffect, useRef } from 'react';
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
  isLoading,
  hasMore,
  onLoadMore,
}: SharingListProps) => {
  useEffect(() => {
    // 컴포넌트가 마운트될 때 스크롤을 맨 위로 이동
    onMount?.();
  }, [onMount]);

  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore]);

  return (
    <div>
      <div className="flex flex-col gap-3 p-4">
        {posts.map((post) => (
          <SharingCard key={post.sharingId} {...post} concertId={concertId} />
        ))}
        <div ref={observerRef} className="h-4" />
        {isLoading && <div className="py-4 text-center">로딩 중...</div>}
      </div>
    </div>
  );
};
