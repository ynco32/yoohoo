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
} from '@/lib/utils/sightReviewMapper';
import { useSeatsStore } from '@/store/useSeatStore';

interface EditSightReviewFormContainerProps {
  className?: string;
  artist?: string;
  reviewId: number;
  initialData?: ApiReview; // 기존 리뷰 데이터
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

  const { getSectionBySeatId } = useSeatsStore();
  // 초기 데이터 설정
  useEffect(() => {
    if (initialData) {
      // photo가 URL인 경우 File 객체로 변환
      const setInitialData = async () => {
        try {
          let photoFile;

          // photo가 문자열(URL)인 경우 File 객체로 변환
          if (typeof initialData.photoUrl === 'string') {
            const response = await fetch(initialData.photoUrl);
            const blob = await response.blob();
            photoFile = new File([blob], 'image.jpg', { type: 'image/jpeg' });
          }

          setFormData({
            ...initialData,
            sectionNumber: getSectionBySeatId(initialData.seatId) ?? 0,
            seatDistance: mapApiToSeatDistance(initialData.seatDistance),
            sound: mapApiToSound(initialData.sound),
            photo: photoFile || null,
          });
        } catch (error) {
          console.error('Error setting initial photo:', error);
          // 에러 발생 시에도 나머지 데이터는 설정
          setFormData({
            ...initialData,
            sectionNumber: getSectionBySeatId(initialData.seatId) ?? 0,
            seatDistance: mapApiToSeatDistance(initialData.seatDistance),
            sound: mapApiToSound(initialData.sound),
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
      const { photo, ...reviewData } = data;
      if (!photo) {
        throw new Error('사진을 선택해주세요.');
      }
      await updateSightReview(reviewId, reviewData, photo);
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
