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
  const store = useSightReviewStore(); // store를 컴포넌트 최상위에서 호출
  const { setError, setIsSubmitting } = store;

  const handleSubmit = async (data: SightReviewFormData) => {
    try {
      setIsSubmitting(true);
      // 먼저 store의 formData를 업데이트
      store.setFormData(data);

      const apiData = store.getAPIRequestData();
      const photo = data.photo; // store 대신 파라미터에서 받은 data 사용

      if (!photo || !(photo instanceof File)) {
        throw new Error('사진이 필요합니다.');
      }

      const result = await submitSightReview(apiData, photo); // result 변수 추가
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
