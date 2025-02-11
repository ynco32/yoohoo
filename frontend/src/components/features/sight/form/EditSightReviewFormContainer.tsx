'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import SightReviewForm from '@/components/features/sight/form/SightReviewForm';
import { useSightReviewStore } from '@/store/useSightReviewStore';
import { updateSightReview } from '@/lib/api/sightReview';
import type { SightReviewFormData } from '@/types/sightReviews';

interface EditSightReviewFormContainerProps {
  className?: string;
  artist?: string;
  reviewId: number;
  initialData?: SightReviewFormData; // 기존 리뷰 데이터
}

export function EditSightReviewFormContainer({
  className,
  artist,
  reviewId,
  initialData,
}: EditSightReviewFormContainerProps) {
  const router = useRouter();
  const { setError, setIsSubmitting, setFormData } = useSightReviewStore();

  // 초기 데이터 설정
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData, setFormData]);

  const handleSubmit = async (data: SightReviewFormData) => {
    try {
      setIsSubmitting(true);
      const _result = await updateSightReview(reviewId, data);
      return { id: reviewId.toString() };
    } catch (error) {
      console.error('Error updating review:', error);
      if (error instanceof Error) {
        setError('submit', error.message);
      } else {
        setError('submit', '알 수 없는 오류가 발생했습니다.');
      }
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    router.back();
  };

  if (!initialData) {
    return null; // 또는 로딩 상태를 표시할 수 있습니다
  }

  return (
    <SightReviewForm
      onSubmit={handleSubmit}
      artist={artist}
      className={className}
      onClose={handleClose}
    />
  );
}
