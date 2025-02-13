'use client';

import { useRouter } from 'next/navigation';
import SightReviewForm from '@/components/features/sight/form/SightReviewForm';
import { useSightReviewStore } from '@/store/useSightReviewStore';
import { submitSightReview } from '@/lib/api/sightReview';
import type { SightReviewFormData } from '@/types/sightReviews';

interface SightReviewFormContainerProps {
  className?: string;
  artist?: string;
}

export function SightReviewFormContainer({
  className,
  artist,
}: SightReviewFormContainerProps) {
  const router = useRouter();
  const { setError, setIsSubmitting } = useSightReviewStore();

  const handleSubmit = async (data: SightReviewFormData) => {
    console.log('제출할 데이터:', data);
    try {
      setIsSubmitting(true);

      // photo 필드를 분리
      const { photo, ...reviewData } = data;

      if (!photo || !(photo instanceof File)) {
        throw new Error('사진은 필수입니다.');
      }

      const result = await submitSightReview(reviewData, photo);
      return { id: result.id };
    } catch (error) {
      console.error('Error submitting review:', error);
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

  return (
    <SightReviewForm
      onSubmit={handleSubmit}
      artist={artist}
      className={className}
      onClose={handleClose}
    />
  );
}
