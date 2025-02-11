'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ConcertSelect } from './ConcertSelect';
import { SeatSelect } from './SeatSelect';
import { ImageUpload } from './ImageUpload';
import { ViewScoreSelect } from './ViewScoreSelect';
import { OtherSelect } from './OtherSelect';
import { CommentInput } from './CommentInput';
import { useSightReviewStore } from '@/store/useSightReviewStore';
import { SightReviewFormData } from '@/types/sightReviews';
import { STEPS, useSightReviewSteps } from '@/hooks/useSightReviewSteps';
import { useSightReviewValidation } from '@/hooks/useSightReviewValidation';
import StepProgressBar from './StepProgressBar';

interface SightReviewFormProps {
  onSubmit?: (data: SightReviewFormData) => Promise<{ id: string }>;
  artist?: string;
  className?: string;
  onClose?: () => void;
}

export const SightReviewForm = React.memo(
  ({ onSubmit, className = '', onClose }: SightReviewFormProps) => {
    const router = useRouter();
    const {
      formData,
      errors,
      isSubmitting,
      touched,
      setFormField,
      setError,
      setIsSubmitting,
      setValidation,
      setTouched,
      clearErrors,
      isFormValid,
    } = useSightReviewStore();

    const { currentStep, canProceed, handleNext, handleBack } =
      useSightReviewSteps({
        formData,
      });

    const { validateStep, getValidationField } = useSightReviewValidation({
      formData,
      touched,
      setValidation,
      setError,
    });

    React.useEffect(() => {
      validateStep(STEPS[currentStep].id);
    }, [formData, currentStep, validateStep]);

    const handleFieldChange = <K extends keyof SightReviewFormData>(
      field: K,
      value: SightReviewFormData[K]
    ) => {
      setFormField(field, value);
      const validationField = getValidationField(field);
      if (validationField) {
        setTouched(validationField);
      }
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      clearErrors();

      // 디버깅을 위한 콘솔 로그 추가
      console.log('Form validation:', validateStep(STEPS[currentStep].id));
      console.log('Form is valid:', isFormValid());
      console.log('onSubmit exists:', !!onSubmit);

      if (!validateStep(STEPS[currentStep].id)) return;
      if (!isFormValid() || !onSubmit) return;

      try {
        setIsSubmitting(true);
        // 디버깅을 위한 콘솔 로그 추가
        console.log('Submitting form data:', formData);
        const result = await onSubmit(formData);
        console.log('Submit result:', result);
        router.push(`/sight/success`);
      } catch (error) {
        console.error('Submit error:', error);
        setError('submit', '제출 중 오류가 발생했습니다. 다시 시도해주세요.');
      } finally {
        setIsSubmitting(false);
      }
    };

    const renderStepContent = () => {
      switch (currentStep) {
        case 0:
          return (
            <div className="w-full">
              <ConcertSelect
                value={formData.concertId}
                onChange={(concertId) =>
                  handleFieldChange('concertId', Number(concertId))
                }
                error={errors.concertId}
              />
              <div className="mt-md">
                <SeatSelect
                  value={{
                    section: formData.section || null,
                    rowLine: formData.rowLine || null,
                    columnLine: formData.columnLine || null,
                  }}
                  onChange={(seatInfo) => {
                    handleFieldChange('section', seatInfo.section ?? 0);
                    handleFieldChange('rowLine', seatInfo.rowLine ?? 0);
                    handleFieldChange('columnLine', seatInfo.columnLine ?? 0);
                  }}
                  error={errors.seat}
                />
              </div>
            </div>
          );
        case 1:
          return (
            <div className="w-full">
              <ImageUpload
                value={formData.photo}
                onChange={(file) => handleFieldChange('photo', file)}
                error={errors.photo?.toString()}
              />
              <ViewScoreSelect
                value={formData.viewScore}
                onChange={(viewScore) =>
                  handleFieldChange('viewScore', viewScore)
                }
                error={errors.viewScore}
              />
            </div>
          );
        case 2:
          return (
            <div className="w-full space-y-4">
              <OtherSelect
                seatDistance={formData.seatDistance}
                sound={formData.sound}
                onSeatDistanceChange={(seatDistance) =>
                  handleFieldChange('seatDistance', seatDistance)
                }
                onSoundChange={(sound) => handleFieldChange('sound', sound)}
                error={errors.seatDistance}
              />
              <CommentInput
                value={formData.content}
                onChange={(content) => handleFieldChange('content', content)}
                error={errors.content}
              />
            </div>
          );
      }
    };

    return (
      <div
        className={`relative flex h-dvh flex-col rounded-layout bg-white shadow-card-colored ${className}`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-md top-md text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col py-2xl">
          {/* 상단 고정 영역 */}
          <div className="bg-white px-md pt-2xl">
            <StepProgressBar
              currentStep={currentStep}
              handleNext={handleNext}
              handleBack={handleBack}
            />
          </div>

          {/* 중앙 컨텐츠 영역 */}
          <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-md py-lg">
            <div className="w-full max-w-2xl">{renderStepContent()}</div>
          </div>

          {/* 하단 고정 영역 */}
          <div className="bg-white px-md py-md">
            {errors.submit && (
              <p className="mb-md text-sm text-status-warning">
                {errors.submit}
              </p>
            )}
            <div className="flex justify-between gap-md">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="hover:button h-12 flex-1 rounded-lg border border-sight-button px-md py-2 text-sight-button transition-colors"
                >
                  이전
                </button>
              )}
              <button
                type={currentStep === STEPS.length - 1 ? 'submit' : 'button'}
                onClick={
                  currentStep < STEPS.length - 1 ? handleNext : undefined
                }
                disabled={!canProceed || isSubmitting}
                className="h-12 flex-1 rounded-lg bg-sight-button px-md py-2 text-white transition-colors hover:bg-sight-button disabled:bg-gray-300"
              >
                {currentStep === STEPS.length - 1
                  ? isSubmitting
                    ? '제출 중...'
                    : '작성하기'
                  : '다음'}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
);

SightReviewForm.displayName = 'SightReviewForm';

export default SightReviewForm;
