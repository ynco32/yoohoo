'use client';

import React from 'react';
import { SharingCard } from './SharingCard';
import { SharingPost } from '@/types/sharing';

/**
 * 더미 데이터
 */
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
 * 나눔 게시글 목록 컴포넌트
 * @description 나눔 게시글 카드들을 목록 형태로 보여주는 컴포넌트
 */
export const SharingList = () => {
  // TODO: API 연동 시 빈 배열([])로 초기값 변경
  const [posts, setPosts] = React.useState<SharingPost[]>(MOCK_POSTS);

  return (
    <div className="flex flex-col gap-3 p-4">
      {posts.map((post) => (
        <SharingCard key={post.id} {...post} />
      ))}
    </div>
  );
};
