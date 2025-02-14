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

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { DraggableReviewSheet } from './DraggableReviewSheet';
import { getArenaReviews } from '@/lib/api/sightReview';
import { mapApiToSightReview } from '@/lib/utils/sightReviewMapper';
import type { SightReviewData } from '@/types/sightReviews';

export function SightReviewList() {
  const [isSheetOpen, setIsSheetOpen] = useState(true);
  const [reviews, setReviews] = useState<SightReviewData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();

  const arenaId = Number(params.arenaId);
  const sectionId = Number(params.sectionId);
  const seatId = Number(params.seatId);
  const stageType = Number(params.stageType);

  useEffect(() => {
    console.log({
      arenaId,
      stageType,
      sectionId,
      seatId,
      isValidParams: Boolean(stageType && sectionId),
    });

    const fetchReviews = async () => {
      if (stageType === undefined || sectionId === undefined) {
        console.log('필수 파라미터 누락');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        console.log('API 요청 파라미터:', {
          arenaId,
          stageType,
          section: sectionId,
          seatId,
        });

        const response = await getArenaReviews(arenaId, {
          stageType,
          section: sectionId,
          ...(seatId && { seatId }),
        });

        console.log('API 응답:', response);

        const mappedReviews = response.reviews.map((review) =>
          mapApiToSightReview(review)
        );

        setReviews(mappedReviews);
      } catch (err) {
        console.error('에러 발생:', err);
        setError(
          err instanceof Error ? err.message : '리뷰를 불러오는데 실패했습니다.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [arenaId, stageType, sectionId, seatId]);

  if (isLoading) {
    return (
      <DraggableReviewSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        reviewDataList={[]}
        isLoading={true}
      />
    );
  }

  if (error) {
    return (
      <DraggableReviewSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        reviewDataList={[]}
        error={error}
      />
    );
  }

  return (
    <DraggableReviewSheet
      isOpen={isSheetOpen}
      onClose={() => setIsSheetOpen(false)}
      reviewDataList={reviews}
    />
  );
}
