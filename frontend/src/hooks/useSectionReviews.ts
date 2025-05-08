// hooks/useSectionReviews.ts
'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/api/api';

interface Review {
  reviewId: number;
  seatId: number; // 좌석 ID 추가
  content: string;
  artistGrade?: number;
  stageGrade?: number;
  screenGrade?: number;
  photos?: {
    reviewPhotoId: number;
    photoUrl: string;
  }[];
  createdAt: string;
  updatedAt: string;
  authorName: string;
  authorProfileImage?: string;
}

export function useSectionReviews(arenaId: string, sectionId: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        // 구역 전체 리뷰를 한 번에 가져오는 API 호출
        const response = await apiClient.get(
          `/arenas/${arenaId}/sections/${sectionId}/reviews`
        );

        // API 응답 구조에 맞게 데이터 추출
        const reviewsData = response.data.data || [];
        setReviews(reviewsData);
      } catch (err) {
        console.error('구역 리뷰를 가져오는 중 오류 발생:', err);
        setError(err as Error);
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
