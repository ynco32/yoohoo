'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { EditSightReviewFormContainer } from '@/components/features/sight/form/EditSightReviewFormContainer';
import type { SightReviewFormData } from '@/types/sightReviews';

export default function EditSightReviewPage() {
  const params = useParams();
  const reviewId = Number(params.id);
  const [initialData, setInitialData] = useState<
    SightReviewFormData | undefined
  >();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 기존 리뷰 데이터를 가져오는 API 호출
    const fetchReviewData = async () => {
      try {
        // TODO: 리뷰 데이터를 가져오는 API 함수 구현 필요
        const response = await fetch(`/api/v1/view/reviews/${reviewId}`);
        const data = await response.json();
        setInitialData(data);
      } catch (error) {
        console.error('Failed to fetch review data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviewData();
  }, [reviewId]);

  if (isLoading) {
    return <div>Loading...</div>; // 로딩 상태 컴포넌트로 대체 가능
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
