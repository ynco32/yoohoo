import { useState, useCallback, useMemo } from 'react';
import { SightReviewFormData } from '@/types/sightReviews';

export const STEPS = [
  { id: 'concertInfo', title: '정보 입력력' },
  { id: 'reviweSight', title: '리뷰 입력 - 시야' },
  { id: 'reviewOthers', title: '리뷰 입력 - 그 외' },
] as const;

export type StepId = (typeof STEPS)[number]['id'];

interface UseSightReviewStepsProps {
  formData: SightReviewFormData;
}

export const useSightReviewSteps = ({ formData }: UseSightReviewStepsProps) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  function isValidPhoto(photo: File | null): photo is File {
    return photo instanceof File && photo.size > 0;
  }

  const checkStepValidity = useCallback(
    (stepId: StepId): boolean => {
      switch (stepId) {
        case 'concertInfo':
          return (
            formData.concertId > 0 &&
            formData.section > 0 &&
            formData.rowLine > 0 &&
            formData.columnLine > 0
          );
        case 'reviweSight':
          return isValidPhoto(formData.photo) && formData.viewScore > 0;
        case 'reviewOthers':
          return (
            formData.seatDistance.length > 0 && formData.content.length >= 10
          );
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
