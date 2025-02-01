/**
 * @component SightReviewList
 * @description 좌석 리뷰 목록을 보여주는 컴포넌트. URL 파라미터를 기반으로
 * 특정 경기장/섹션/좌석에 해당하는 리뷰들을 필터링하여 표시합니다.
 *
 * @features
 * - URL 파라미터 기반 리뷰 필터링
 * - 드래그 가능한 리뷰 시트 제어
 * - 경기장/섹션/좌석별 리뷰 표시
 *
 * @notes
 * - Client Component로 동작
 * - mockReviewData를 사용하여 리뷰 데이터 제공
 * - 좌석 ID는 선택적 필터링 조건
 *
 * @dependencies
 * - React
 * - Next.js
 * - ./DraggableReviewSheet
 * - @/types/sightReviews
 */
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { DraggableReviewSheet } from './DraggableReviewSheet';
import { mockReviewData } from '@/types/sightReviews';

export function SightReviewList() {
  // 리뷰 시트의 열림/닫힘 상태 관리
  const [isSheetOpen, setIsSheetOpen] = useState(true);

  // URL 파라미터에서 현재 선택된 경기장/섹션/좌석 ID 추출
  const params = useParams();
  const currentArenaId = Number(params.arenaId); // 현재 경기장 ID
  const currentSectionId = Number(params.sectionId); // 현재 섹션 ID
  const currentSeatId = Number(params.seatId); // 현재 좌석 ID (선택적)

  // 리뷰 필터링 로직
  const filteredReviews = mockReviewData.filter((review) => {
    // 경기장 ID와 섹션 ID는 항상 일치해야 함
    const isArenaMatch = review.arenaId === currentArenaId;
    const isSectionMatch = review.sectionId === currentSectionId;

    // 좌석 ID가 params에 있는 경우에만 좌석 일치 여부 확인
    const isSeatMatch = currentSeatId ? review.seatId === currentSeatId : true;

    return isArenaMatch && isSectionMatch && isSeatMatch;
  });

  return (
    <DraggableReviewSheet
      isOpen={isSheetOpen}
      onClose={() => setIsSheetOpen(false)}
      reviewDataList={filteredReviews}
    />
  );
}
