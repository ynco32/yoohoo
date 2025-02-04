'use client';

import { useParams } from 'next/navigation';
import React, { useState, useRef, useCallback } from 'react';
import { ViewModeToggle } from './ViewModeToggle';
import { SharingList } from './SharingList';
import { SharingMap } from './SharingMap';
import { SharingPost } from '@/types/sharing';
import { VENUE_COORDINATES } from '@/lib/constans/venues';
import { MOCK_POSTS } from '@/types/sharing';

type ViewMode = 'list' | 'map';

/**
 * 나눔 게시글 뷰 컴포넌트
 * @description 나눔 게시글을 지도 또는 목록 형태로 보여주는 메인 컴포넌트
 */
export const SharingView = () => {
  // 목록 뷰에서 스크롤 복구
  const containerRef = useRef<HTMLDivElement>(null);
  const resetScroll = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, []);

  // URL 파라미터에서 공연 ID 추출
  const params = useParams();
  const concertId = params.concertId ? Number(params.concertId) : 0;

  // 뷰 모드 상태 관리 (지도/목록)
  const [viewMode, setViewMode] = useState<ViewMode>('map');

  // 나눔 게시글 데이터 상태 관리
  const [posts, setPosts] = React.useState<SharingPost[]>(MOCK_POSTS);

  // startTime 포맷팅 함수
  const formatTime = (timeString: string) => {
    return timeString.split('T')[1];
  };

  // 포맷팅된 게시글 데이터 생성
  const formattedPosts = posts.map((post) => ({
    ...post,
    startTime: formatTime(post.startTime),
  }));

  return (
    <div
      className={`${
        viewMode === 'map'
          ? '-mt-[56px] h-screen'
          : 'flex h-[calc(100vh-56px)] flex-col'
      }`}
    >
      {/* 토글 버튼 - 지도 모드일 때는 absolute, 목록 모드일 때는 일반 배치 */}
      <div
        className={viewMode === 'map' ? 'absolute top-[56px] z-10 p-4' : 'p-4'}
      >
        <ViewModeToggle viewMode={viewMode} onModeChange={setViewMode} />
      </div>

      {/* 컨텐츠 영역 */}
      <div
        ref={containerRef}
        className={`${viewMode === 'map' ? 'h-full' : 'flex-1 overflow-auto'}`}
      >
        {viewMode === 'list' && (
          <SharingList
            posts={formattedPosts}
            onMount={resetScroll}
            concertId={concertId}
          />
        )}
        {viewMode === 'map' && (
          <SharingMap
            posts={formattedPosts}
            venueLocation={VENUE_COORDINATES.KSPO_DOME}
            concertId={concertId}
          />
        )}
      </div>
    </div>
  );
};
