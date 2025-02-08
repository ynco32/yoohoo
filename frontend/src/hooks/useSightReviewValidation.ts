import { useCallback } from 'react';
import { StepId } from './useSightReviewSteps';
import { ValidFields } from '@/store/useSightReviewStore';
import { SightReviewFormData } from '@/types/sightReviews';

interface UseSightReviewValidationProps {
  formData: SightReviewFormData;
  touched: Record<ValidFields, boolean>;
  setValidation: (field: ValidFields, isValid: boolean) => void;
  setError: (field: ValidFields | 'submit' | 'seat', message?: string) => void;
}

export const useSightReviewValidation = ({
  formData,
  touched,
  setValidation,
  setError,
}: UseSightReviewValidationProps) => {
  const validateStep = useCallback(
    (stepId: StepId) => {
      switch (stepId) {
        case 'concertInfo':
          const isConcertValid = formData.concertId > 0;
          setValidation('concertId', isConcertValid);
          if (!isConcertValid && touched.concertId) {
            setError('concertId', '공연을 선택해주세요');
          } else {
            setError('concertId', undefined);
          }

          const isSeatValid =
            formData.section > 0 &&
            formData.rowLine > 0 &&
            formData.columnLine > 0;
          setValidation('seat', isSeatValid);
          if (!isSeatValid && touched.seat) {
            setError('seat', '좌석 정보를 모두 입력해주세요');
          } else {
            setError('seat', undefined);
          }
          return isConcertValid && isSeatValid;

        case 'reviweSight':
          const isPhotosValid = formData.images.length > 0;
          setValidation('images', isPhotosValid);
          if (!isPhotosValid && touched.images) {
            setError('images', '이미지를 업로드해주세요');
          } else {
            setError('images', undefined);
          }
          const isViewScoreValid = formData.viewScore > 0;
          setValidation('viewScore', isViewScoreValid);
          if (!isViewScoreValid && touched.viewScore) {
            setError('viewScore', '시야 점수를 선택해주세요');
          } else {
            setError('viewScore', undefined);
          }
          return isPhotosValid && isViewScoreValid;
        case 'reviewOthers':
          const isSeatDistanceValid = formData.seatDistance.length > 0;

          setValidation('seatDistance', isSeatDistanceValid);

          if (!isSeatDistanceValid && touched.seatDistance) {
            setError('seatDistance', '좌석 간격을 선택해주세요');
          } else {
            setError('seatDistance', undefined);
          }

          const isCommentValid = formData.content.length >= 10;
          setValidation('content', isCommentValid);
          if (!isCommentValid && touched.content) {
            setError('content', '최소 10자 이상 입력해주세요');
          } else {
            setError('content', undefined);
          }
          return isSeatDistanceValid && isCommentValid;

        default:
          return false;
      }
    },
    [formData, touched, setValidation, setError]
  );

  const getValidationField = (
    field: keyof SightReviewFormData
  ): ValidFields | null => {
    if (
      field === 'concertId' ||
      field === 'images' ||
      field === 'viewScore' ||
      field === 'seatDistance' ||
      field === 'content'
    ) {
      return field as ValidFields;
    }
    if (field === 'section' || field === 'rowLine' || field === 'columnLine') {
      return 'seat';
    }
    return null;
  };

  return {
    validateStep,
    getValidationField,
  };
};
