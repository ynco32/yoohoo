'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { EditSightReviewFormContainer } from '@/components/features/sight/form/EditSightReviewFormContainer';
import type { ApiResponse, ApiReview } from '@/types/sightReviews';
import { getReview } from '@/lib/api/sightReview';
import { useSightReviewStore } from '@/store/useSightReviewStore';

export default function EditSightReviewPage() {
  const params = useParams();
  const reviewId = Number(params.reviewId);
  const [initialData, setInitialData] = useState<ApiReview | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 페이지 마운트 시 store 초기화
    useSightReviewStore.getState().reset();
  }, []);

  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        const response: ApiResponse = await getReview(reviewId);
        const apiReview = response.review; // API에서 받아온 리뷰 데이터

        if (!apiReview) {
          throw new Error('Review not found');
        }

        setInitialData(apiReview); // ApiReview 형태로 그대로 전달

        setError(null);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : '알 수 없는 에러가 발생했습니다.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (reviewId) {
      fetchReviewData();
    }
  }, [reviewId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!initialData) {
    return <div>리뷰를 찾을 수 없습니다.</div>;
  }

  return (
    <EditSightReviewFormContainer
      reviewId={reviewId}
      initialData={initialData}
      className="min-h-screen"
    />
  );
}
