'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SightReviewForm from '@/components/features/sight/form/SightReviewForm';
import { useSightReviewStore } from '@/store/useSightReviewStore';
import { submitSightReview } from '@/lib/api/sightReview';
import type { SightReviewFormData } from '@/types/sightReviews';
import { mapFormDataToApiRequest } from '@/lib/utils/sightReviewMapper';
import { SuccessModal } from '@/components/common/SuccessModal';

interface SightReviewFormContainerProps {
  className?: string;
  artist?: string;
}

export function SightReviewFormContainer({
  className,
  artist,
}: SightReviewFormContainerProps) {
  const router = useRouter();
  const store = useSightReviewStore();
  const { setError, setIsSubmitting } = store;
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  const handleSubmit = async (data: SightReviewFormData) => {
    try {
      setIsSubmitting(true);
      const { photo, ...reviewData } = data;
      if (!photo) {
        throw new Error('사진을 선택해주세요.');
      }

      const mappedData = mapFormDataToApiRequest(reviewData);
      await submitSightReview(mappedData, photo);
      setIsCompleteModalOpen(true);
      return undefined;
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

  const handleModalClose = () => {
    setIsCompleteModalOpen(false);
    router.replace('/mypage/sight');
  };

  return (
    <>
      <SightReviewForm
        onSubmit={handleSubmit}
        artist={artist}
        className={className}
        onClose={handleClose}
      />
      <SuccessModal
        isOpen={isCompleteModalOpen}
        onClose={handleModalClose}
        buttonText="내 리뷰 보러가기"
        message="리뷰가 등록되었습니다"
      />
    </>
  );
}
