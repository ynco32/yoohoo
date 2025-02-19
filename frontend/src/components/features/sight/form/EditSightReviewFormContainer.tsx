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
import { useSeatsStore } from '@/store/useSeatStore';
import { useSectionStore } from '@/store/useSectionStore';

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
  const { setError, setIsSubmitting, setFormData, formData } =
    useSightReviewStore();

  const { getSectionBySeatId } = useSeatsStore();
  const { getSectionById } = useSectionStore();

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

          // seatId로 sectionId를 찾고
          const sectionId = getSectionBySeatId(initialData.seatId);
          if (!sectionId) {
            throw new Error('섹션 정보를 찾을 수 없습니다.');
          }

          // sectionId로 section 정보를 찾음
          const section = getSectionById(sectionId);
          // section.sectionName은 이미 sectionNumber를 toString()한 값이므로 다시 Number로 변환
          const sectionNumber = section ? Number(section.sectionName) : 0;

          setFormData({
            ...initialData,
            sectionNumber,
            seatDistance: mapApiToSeatDistance(initialData.seatDistance),
            sound: mapApiToSound(initialData.sound),
            photo: photoFile || null,
          });
        } catch (error) {
          console.error('Error setting initial data:', error);
          setError('submit', '초기 데이터 설정 중 오류가 발생했습니다.');
        }
      };

      setInitialData();
    }
  }, [getSectionBySeatId, getSectionById, initialData, setFormData, setError]);

  // initialData가 formData에 제대로 설정되었는지 확인
  useEffect(() => {
    console.log('Current form data:', formData);
  }, [formData]);

  const handleSubmit = async (data: SightReviewFormData) => {
    try {
      setIsSubmitting(true);
      const { photo, ...reviewData } = data;
      if (!photo) {
        throw new Error('사진을 선택해주세요.');
      }
      const mappedData = mapFormDataToApiRequest(reviewData);
      await updateSightReview(reviewId, mappedData, photo);

      // 성공적으로 수정이 완료되면 onSubmitComplete 호출
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
