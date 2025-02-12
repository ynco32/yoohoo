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
    (stepId: StepId, validationOnly = false) => {
      const validateConcertInfo = () => {
        const isConcertValid = formData.concertId > 0;
        const isSeatValid =
          formData.section > 0 &&
          formData.rowLine > 0 &&
          formData.columnLine > 0;

        if (!validationOnly) {
          setValidation('concertId', isConcertValid);
          setValidation('seat', isSeatValid);

          if (!isConcertValid && touched.concertId) {
            setError('concertId', '공연을 선택해주세요');
          } else {
            setError('concertId', undefined);
          }

          if (!isSeatValid && touched.seat) {
            setError('seat', '좌석 정보를 모두 입력해주세요');
          } else {
            setError('seat', undefined);
          }
        }

        return isConcertValid && isSeatValid;
      };

      const validateReviewSight = () => {
        // File 객체이거나 string(URL)인 경우 모두 유효하도록 수정
        const isPhotoValid =
          formData.photo instanceof File || typeof formData.photo === 'string';
        const isViewScoreValid = formData.viewScore > 0;

        if (!validationOnly) {
          setValidation('photo', isPhotoValid);
          setValidation('viewScore', isViewScoreValid);

          if (!isPhotoValid && touched.photo) {
            setError('photo', '이미지를 업로드해주세요');
          } else {
            setError('photo', undefined);
          }

          if (!isViewScoreValid && touched.viewScore) {
            setError('viewScore', '시야 점수를 선택해주세요');
          } else {
            setError('viewScore', undefined);
          }
        }

        return isPhotoValid && isViewScoreValid;
      };

      const validateReviewOthers = () => {
        const isSeatDistanceValid = formData.seatDistance.length > 0;
        const isCommentValid = formData.content.length >= 10;

        if (!validationOnly) {
          setValidation('seatDistance', isSeatDistanceValid);
          setValidation('content', isCommentValid);

          if (!isSeatDistanceValid && touched.seatDistance) {
            setError('seatDistance', '좌석 간격을 선택해주세요');
          } else {
            setError('seatDistance', undefined);
          }

          if (!isCommentValid && touched.content) {
            setError('content', '최소 10자 이상 입력해주세요');
          } else {
            setError('content', undefined);
          }
        }

        return isSeatDistanceValid && isCommentValid;
      };

      switch (stepId) {
        case 'concertInfo':
          return validateConcertInfo();
        case 'reviweSight':
          return validateReviewSight();
        case 'reviewOthers':
          return validateReviewOthers();
        default:
          return false;
      }
    },
    [formData, touched, setValidation, setError]
  );

  // getValidationField는 변경 없음
  const getValidationField = (
    field: keyof SightReviewFormData
  ): ValidFields | null => {
    if (
      field === 'concertId' ||
      field === 'photo' ||
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
