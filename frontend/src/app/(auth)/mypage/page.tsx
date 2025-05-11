import React, { Suspense } from 'react';
import {
  getUserProfile,
  getUserConcerts,
  getUserArtists,
  getUserReviews,
} from '@/api/auth/user';
import MyPageContent from './MypageContent';
import MyPageSkeleton from './MypageSkeleton';

// 서버 컴포넌트로 데이터를 가져오는 페이지
export default async function MyPageRoute() {
  // 병렬로 데이터 가져오기
  const userPromise = getUserProfile();
  const concertsPromise = getUserConcerts();
  const artistsPromise = getUserArtists();
  const reviewsPromise = getUserReviews();

  // Promise.all로 모든 데이터를 기다림
  const [user, concerts, artists, reviews] = await Promise.all([
    userPromise,
    concertsPromise,
    artistsPromise,
    reviewsPromise,
  ]);

  // 클라이언트 컴포넌트에 데이터 전달
  return (
    <Suspense fallback={<MyPageSkeleton />}>
      <MyPageContent
        user={user}
        concerts={concerts}
        artists={artists}
        reviews={reviews}
      />
    </Suspense>
  );
}
