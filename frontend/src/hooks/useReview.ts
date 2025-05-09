// src/hooks/useReview.ts
import { useState } from 'react';
import { reviewApi } from '@/api/sight/review';
import { ReviewRequest, Review } from '@/types/review'; // ReviewRequestDTO를 ReviewRequest로, ReviewResponse를 Review로 변경

interface UseReviewReturn {
  createReview: (
    data: ReviewRequest, // ReviewRequestDTO를 ReviewRequest로 변경
    files: File[]
  ) => Promise<number | undefined>;
  isLoading: boolean;
  error: string | null;
}

export const useReview = (): UseReviewReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createReview = async (
    data: ReviewRequest, // ReviewRequestDTO를 ReviewRequest로 변경
    files: File[]
  ): Promise<number | undefined> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await reviewApi.createReview(data, files);

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data.reviewId;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : '후기 작성 중 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('Review creation error:', err);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createReview,
    isLoading,
    error,
  };
};
