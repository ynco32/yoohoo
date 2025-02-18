'use client';

import React, { useEffect, useRef } from 'react';
import { SharingCard } from './SharingCard';
import { SharingPost, ViewTabItem } from '@/types/sharing';

export interface SharingListProps {
  posts: SharingPost[];
  concertId: number;
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => Promise<void>;
  currentTab?: ViewTabItem | null;
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
  currentTab,
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

  // 현재 탭에 따라 다른 빈 상태 메시지 표시
  const getEmptyStateMessage = () => {
    switch (currentTab) {
      case 'scrap':
        return {
          title: '북마크한 나눔이 없습니다',
          subtitle: '관심있는 나눔을 북마크해보세요',
        };
      case 'my':
        return {
          title: '작성한 나눔글이 없습니다',
          subtitle: '새로운 나눔을 시작해보세요',
        };
      default:
        return {
          title: '진행중인 나눔이 없습니다',
          subtitle: '새로운 나눔이 등록되면 이곳에 표시됩니다',
        };
    }
  };

  // 게시글이 없고 로딩 중이 아닌 상태일 때 빈 상태 표시
  if (posts.length === 0 && !isLoading) {
    const { title, subtitle } = getEmptyStateMessage();
    return (
      <div className="px-4 py-10">
        <div className="rounded-md bg-white py-8 text-center">
          <p className="text-lg font-medium text-gray-700">{title}</p>
          <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
    );
  }

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
