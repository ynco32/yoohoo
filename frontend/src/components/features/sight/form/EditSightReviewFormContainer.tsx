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
  const { setError, setIsSubmitting, setFormData, formData } =
    useSightReviewStore();

  // 초기 데이터 설정
  useEffect(() => {
    if (initialData) {
      // photo가 URL인 경우 File 객체로 변환
      const setInitialData = async () => {
        try {
          let photoFile = initialData.photo;

          // photo가 문자열(URL)인 경우 File 객체로 변환
          if (typeof initialData.photo === 'string') {
            const response = await fetch(initialData.photo);
            const blob = await response.blob();
            photoFile = new File([blob], 'image.jpg', { type: 'image/jpeg' });
          }

          setFormData({
            ...initialData,
            photo: photoFile,
          });
        } catch (error) {
          console.error('Error setting initial photo:', error);
          // 에러 발생 시에도 나머지 데이터는 설정
          setFormData({
            ...initialData,
            photo: null, // 또는 기본 File 객체
          });
        }
      };

      setInitialData();
    }
  }, [initialData, setFormData]);

  // initialData가 formData에 제대로 설정되었는지 확인
  useEffect(() => {
    console.log('Current form data:', formData);
  }, [formData]);

  const handleSubmit = async (data: SightReviewFormData) => {
    try {
      setIsSubmitting(true);

      // photo 필드를 분리
      const { photo, ...reviewData } = data;

      if (!photo || !(photo instanceof File)) {
        throw new Error('사진은 필수입니다.');
      }

      const _result = await updateSightReview(reviewId, reviewData, photo);
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
