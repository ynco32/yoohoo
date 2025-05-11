'use client';

import { useState, useEffect } from 'react';
import { ApiResponse } from '@/types/api';
import { Review } from '@/types/review';
import { reviewApi } from '@/api/sight/review';

/**
 * 구역 리뷰를 가져오는 커스텀 훅
 * @param arenaId 공연장 ID
 * @param sectionId 구역 ID
 */
export function useSectionReviews(arenaId: string, sectionId: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // API URL에 동적 파라미터 추가 필요 - API 엔드포인트 수정
        const response = await reviewApi.getReviews(arenaId, sectionId);

        // API 응답 구조에 맞게 데이터 추출
        const reviewsData = response.data.reviewList || [];
        setReviews(reviewsData);
      } catch (err) {
        console.error('구역 리뷰를 가져오는 중 오류 발생:', err);
        setError(
          err instanceof Error
            ? err
            : new Error('알 수 없는 오류가 발생했습니다.')
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (arenaId && sectionId) {
      fetchReviews();
    }
  }, [arenaId, sectionId]);

  return { reviews, isLoading, error };
}
