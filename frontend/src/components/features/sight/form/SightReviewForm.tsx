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
  ({ onSubmit, artist, className = '', onClose }: SightReviewFormProps) => {
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

      if (!validateStep(STEPS[currentStep].id)) return;
      if (!isFormValid() || !onSubmit) return;

      try {
        setIsSubmitting(true);
        const result = await onSubmit(formData);
        router.push(`/reviews/${result.id}`);
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
            <>
              <StepProgressBar currentStep={0} />

              <ConcertSelect
                artist={artist}
                value={formData.concertId}
                onChange={(concertId) =>
                  handleFieldChange('concertId', Number(concertId))
                }
                error={errors.concertId}
              />
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
            </>
          );
        case 1:
          return (
            <div className="space-y-4">
              <div className="space-y-2">
                <StepProgressBar currentStep={1} />
                <ImageUpload
                  value={formData.images[0]}
                  onChange={(file) =>
                    handleFieldChange('images', file ? [file] : [])
                  }
                  error={errors.images?.toString()}
                />
              </div>
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
            <>
              <StepProgressBar currentStep={2} />
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
            </>
          );
      }
    };

    return (
      <div
        className={`relative flex h-dvh w-full flex-col rounded-layout bg-white p-6 shadow-card ${className}`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-xl font-semibold">좌석의 후기를 남겨보세요</h1>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="mt-6 flex flex-1 flex-col">
          <div className="flex-1 rounded-lg bg-white">
            {renderStepContent()}
          </div>

          {errors.submit && (
            <p className="mt-4 text-sm text-status-warning">{errors.submit}</p>
          )}

          {/* Navigation Buttons */}
          <div className="mt-6 flex justify-between gap-4">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 rounded-lg border border-primary-main px-4 py-2 text-primary-main transition-colors hover:bg-primary-50"
              >
                이전
              </button>
            )}
            <button
              type={currentStep === STEPS.length - 1 ? 'submit' : 'button'}
              onClick={currentStep < STEPS.length - 1 ? handleNext : undefined}
              disabled={!canProceed || isSubmitting}
              className="flex-1 rounded-lg bg-primary-main px-4 py-2 text-white transition-colors hover:bg-primary-700 disabled:bg-gray-300"
            >
              {currentStep === STEPS.length - 1
                ? isSubmitting
                  ? '제출 중...'
                  : '작성하기'
                : '다음'}
            </button>
          </div>
        </form>
      </div>
    );
  }
);

SightReviewForm.displayName = 'SightReviewForm';

export default SightReviewForm;
