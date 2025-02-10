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
import { useParams, useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();

  const arenaId = Number(params.arenaId);
  const sectionId = Number(params.sectionId);
  const seatId = Number(params.seatId);
  const stageType = searchParams.get('stageType') || '';

  useEffect(() => {
    console.log({
      arenaId,
      stageType,
      sectionId,
      seatId,
      isValidParams: Boolean(arenaId && stageType && sectionId),
    });

    const fetchReviews = async () => {
      if (!arenaId || !stageType || !sectionId) {
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
          mapApiToSightReview(review, arenaId, sectionId)
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

  let content: React.ReactNode = null;

  if (isLoading) {
    content = <div className="p-4">데이터를 불러오는 중입니다...</div>;
  } else if (error) {
    content = <div className="p-4 text-red-500">{error}</div>;
  } else {
    content = (
      <div className="space-y-4 px-4">
        {reviews.map((review) => (
          <div key={review.reviewId}>{/* 리뷰 카드 렌더링 */}</div>
        ))}
      </div>
    );
  }

  return (
    <DraggableReviewSheet
      isOpen={isSheetOpen}
      onClose={() => setIsSheetOpen(false)}
      reviewDataList={reviews}
    >
      {content}
    </DraggableReviewSheet>
  );
}
