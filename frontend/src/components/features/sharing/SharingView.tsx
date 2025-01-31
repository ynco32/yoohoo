'use client';

import { useParams } from 'next/navigation';
import React, { useState, useRef, useCallback } from 'react';
import { ViewModeToggle } from './ViewModeToggle';
import { SharingList } from './SharingList';
import { SharingMap } from './SharingMap';
import { SharingPost } from '@/types/sharing';
import { VENUE_COORDINATES } from '@/lib/constans/venues';

type ViewMode = 'list' | 'map';

//DUMMY DATA

const MOCK_POSTS: SharingPost[] = [
  {
    sharingId: 1,
    title: '베몬 포카 나눔합니다',
    nickname: '닉네임',
    status: 'ONGOING',
    startTime: '14:00',
    photoUrl: '/images/card.png',
    latitude: 37.518073, // 한얼광장
    longitude: 127.127244,
  },
  {
    sharingId: 2,
    title: '포카 나눔합니다22',
    nickname: '닉네임',
    status: 'UPCOMING',
    startTime: '15:30',
    photoUrl: '/images/card.png',
    latitude: 37.518851, // 88잔디마당
    longitude: 127.125405,
  },
  {
    sharingId: 3,
    title: '떴다 팔찌 나눔',
    nickname: '닉네임',
    status: 'CLOSED',
    startTime: '13:00',
    photoUrl: '/images/card.png',
    latitude: 37.520402, // 꿈나무다리
    longitude: 127.128242,
  },
  {
    sharingId: 4,
    title: '포토카드 세트 나눔합니다',
    nickname: '닉네임',
    status: 'ONGOING',
    startTime: '16:00',
    photoUrl: '/images/card.png',
    latitude: 37.518843, // 올림픽공원 주차장
    longitude: 127.128111,
  },
  {
    sharingId: 5,
    title: '부채 나눔합니다',
    nickname: '닉네임',
    status: 'UPCOMING',
    startTime: '17:30',
    photoUrl: '/images/card.png',
    latitude: 37.51795, // 편의점 앞
    longitude: 127.126744,
  },
  {
    sharingId: 6,
    title: '부채 나눔합니다22',
    nickname: '닉네임',
    status: 'UPCOMING',
    startTime: '17:30',
    photoUrl: '/images/card.png',
    latitude: 37.517201, // 만남의 광장
    longitude: 127.129205,
  },
];

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
            posts={posts}
            onMount={resetScroll}
            concertId={concertId}
          />
        )}
        {viewMode === 'map' && (
          <SharingMap
            posts={posts}
            venueLocation={VENUE_COORDINATES.KSPO_DOME}
            concertId={concertId}
          />
        )}
      </div>
    </div>
  );
};
