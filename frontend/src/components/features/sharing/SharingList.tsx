'use client';

import React, { useEffect, useRef } from 'react';
import { SharingCard } from './SharingCard';
import { SharingPost } from '@/types/sharing';

export interface SharingListProps {
  posts: SharingPost[];
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
  concertId,
  isLoading,
  hasMore,
  onLoadMore,
}: SharingListProps) => {
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
    <div className="px-4 pb-14">
      <div className="flex flex-col">
        {posts.map((post, index) => (
          <div
            key={post.sharingId}
            className={`${index !== posts.length - 1 ? 'border-b border-gray-50' : ''}`}
          >
            <SharingCard
              {...post}
              concertId={concertId}
              isLastItem={index === posts.length - 1}
            />
          </div>
        ))}
        <div ref={observerRef} className="h-4" />
        {isLoading && <div className="py-4 text-center">로딩 중...</div>}
      </div>
    </div>
  );
};
