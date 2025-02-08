import { useState, useCallback, useMemo } from 'react';
import { SightReviewFormData } from '@/types/sightReviews';

export const STEPS = [
  { id: 'concert', title: '공연 선택' },
  { id: 'seat', title: '좌석 정보' },
  { id: 'photos', title: '사진 업로드' },
  { id: 'rating', title: '평가' },
  { id: 'comment', title: '코멘트' },
] as const;

export type StepId = (typeof STEPS)[number]['id'];

interface UseSightReviewStepsProps {
  formData: SightReviewFormData;
}

export const useSightReviewSteps = ({ formData }: UseSightReviewStepsProps) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const checkStepValidity = useCallback(
    (stepId: StepId): boolean => {
      switch (stepId) {
        case 'concert':
          return formData.concertId > 0;
        case 'seat':
          return (
            formData.section > 0 &&
            formData.rowLine > 0 &&
            formData.columnLine > 0
          );
        case 'photos':
          return formData.images.length > 0;
        case 'rating':
          return formData.viewScore > 0 && formData.seatDistance.length > 0;
        case 'comment':
          return formData.content.length >= 10;
        default:
          return false;
      }
    },
    [formData]
  );

  const canProceed = useMemo(() => {
    return checkStepValidity(STEPS[currentStep].id);
  }, [currentStep, checkStepValidity]);

  const handleNext = useCallback(() => {
    if (
      checkStepValidity(STEPS[currentStep].id) &&
      currentStep < STEPS.length - 1
    ) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, checkStepValidity]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  return {
    currentStep,
    canProceed,
    handleNext,
    handleBack,
  };
};
