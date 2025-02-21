'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import SightReviewForm from '@/components/features/sight/form/SightReviewForm';
import { useSightReviewStore } from '@/store/useSightReviewStore';
import { updateSightReview } from '@/lib/api/sightReview';
import type { ApiReview, SightReviewFormData } from '@/types/sightReviews';
import {
  mapApiToSeatDistance,
  mapApiToSound,
  mapFormDataToApiRequest,
} from '@/lib/utils/sightReviewMapper';

interface EditSightReviewFormContainerProps {
  className?: string;
  artist?: string;
  reviewId: number;
  initialData?: ApiReview; // 기존 리뷰 데이터
  onSubmitComplete?: () => void;
}

export function EditSightReviewFormContainer({
  className,
  artist,
  reviewId,
  initialData,
  onSubmitComplete,
}: EditSightReviewFormContainerProps) {
  const router = useRouter();
  const { setError, setIsSubmitting, setFormData } = useSightReviewStore();

  // 초기 데이터 설정
  useEffect(() => {
    if (initialData) {
      const setInitialData = async () => {
        try {
          let photoFile;
          if (typeof initialData.photoUrl === 'string') {
            const response = await fetch(initialData.photoUrl);
            const blob = await response.blob();
            photoFile = new File([blob], 'image.jpg', { type: 'image/jpeg' });
          }

          // initialData에서 필요한 데이터를 직접 사용
          setFormData({
            concertId: initialData.concertId,
            sectionNumber: Number(initialData.level), // level을 sectionNumber로 사용
            rowLine: initialData.rowLine,
            columnLine: initialData.columnLine,
            photo: photoFile || null,
            viewScore: initialData.viewScore,
            seatDistance: mapApiToSeatDistance(initialData.seatDistance),
            sound: mapApiToSound(initialData.sound),
            content: initialData.content,
          });
        } catch (error) {
          console.error('Error setting initial data:', error);
          setError('submit', '초기 데이터 설정 중 오류가 발생했습니다.');
        }
      };

      setInitialData();
    }
  }, [initialData, setFormData, setError]);

  const handleSubmit = async (data: SightReviewFormData) => {
    try {
      setIsSubmitting(true);
      const { photo, ...reviewData } = data;
      if (!photo) {
        throw new Error('사진을 선택해주세요.');
      }

      if (!initialData?.seatId) {
        throw new Error('좌석 정보를 찾을 수 없습니다.');
      }

      const formData = new FormData();

      // API 요청 데이터에 seatId 포함
      const apiRequestData = {
        ...mapFormDataToApiRequest(reviewData),
        seatId: initialData.seatId,
      };

      // JSON 데이터를 Blob으로 변환하여 추가
      formData.append(
        'reviewRequestDTO',
        new Blob([JSON.stringify(apiRequestData)], { type: 'application/json' })
      );

      // 이미지 파일 추가
      formData.append('file', photo, photo.name);

      await updateSightReview(reviewId, apiRequestData, photo);

      if (onSubmitComplete) {
        onSubmitComplete();
      }
      return undefined;
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
