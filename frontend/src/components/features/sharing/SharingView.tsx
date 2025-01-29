'use client';

import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { ViewModeToggle } from './ViewModeToggle';
import { SharingList } from './SharingList';
import { SharingMap } from './SharingMap';
import { SharingPost } from '@/types/sharing';

type ViewMode = 'list' | 'map';

//DUMMY DATA
const MOCK_POSTS: SharingPost[] = [
  {
    id: '1',
    title: '베몬 포카 나눔합니다',
    nickname: '닉네임',
    status: 'ONGOING',
    start_time: '14:00',
    image: '/images/card.png',
  },
  {
    id: '2',
    title: '포카 나눔합니다22',
    nickname: '닉네임',
    status: 'UPCOMING',
    start_time: '15:30',
    image: '/images/card.png',
  },
  {
    id: '3',
    title: '떴다 팔찌 나눔',
    nickname: '닉네임',
    status: 'CLOSED',
    start_time: '13:00',
    image: '/images/card.png',
  },
  {
    id: '4',
    title: '포토카드 세트 나눔합니다',
    nickname: '닉네임',
    status: 'ONGOING',
    start_time: '16:00',
    image: '/images/card.png',
  },
  {
    id: '5',
    title: '부채 나눔합니다',
    nickname: '닉네임',
    status: 'UPCOMING',
    start_time: '17:30',
    image: '/images/card.png',
  },
  {
    id: '6',
    title: '부채 나눔합니다22',
    nickname: '닉네임',
    status: 'UPCOMING',
    start_time: '17:30',
    image: '/images/card.png',
  },
];

/**
 * 나눔 게시글 뷰 컴포넌트
 * @description 나눔 게시글을 지도 또는 목록 형태로 보여주는 메인 컴포넌트
 */
export const SharingView = () => {
  // URL 파라미터에서 공연 ID 추출 -> 추후 사용 예정
  const params = useParams();
  const concertId = params.concertId;

  // 뷰 모드 상태 관리 (지도/목록)
  const [viewMode, setViewMode] = useState<ViewMode>('map');

  // 나눔 게시글 데이터 상태 관리
  const [posts, setPosts] = React.useState<SharingPost[]>(MOCK_POSTS);

  return (
    <div className="flex h-[calc(100vh-56px)] flex-col overflow-hidden">
      {/* 지도/목록 토글 버튼 */}
      <ViewModeToggle viewMode={viewMode} onModeChange={setViewMode} />

      {/* 선택된 뷰 모드에 따른 컴포넌트 렌더링 */}
      <div className="flex-1 overflow-auto">
        {viewMode === 'list' && <SharingList posts={posts} />}
        {viewMode === 'map' && <SharingMap posts={posts} />}
      </div>
    </div>
  );
};
