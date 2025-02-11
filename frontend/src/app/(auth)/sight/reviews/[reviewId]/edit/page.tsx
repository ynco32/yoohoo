'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { EditSightReviewFormContainer } from '@/components/features/sight/form/EditSightReviewFormContainer';
import type { SightReviewFormData } from '@/types/sightReviews';
import { getReview } from '@/lib/api/sightReview'; // getReview 함수 추가 필요

export default function EditSightReviewPage() {
  const params = useParams();
  const reviewId = Number(params.reviewId);
  const [initialData, setInitialData] = useState<
    SightReviewFormData | undefined
  >();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log(reviewId);
  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        console.log(reviewId);
        const data = await getReview(reviewId);
        setInitialData(data);
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
      console.log(reviewId);
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
