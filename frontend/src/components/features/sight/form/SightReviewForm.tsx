'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ConcertSelect } from './ConcertSelect';
import { SeatSelect } from './SeatSelect';
import { ImageUpload } from './ImageUpload';
import { ViewScoreSelect } from './ViewScoreSelect';
import { OtherSelect } from './OtherSelect';
import { CommentInput } from './CommentInput';
import { FormSectionHeader } from '@/components/features/sight/form/FormSectionHeader';
import { useSightReviewStore } from '@/store/useSightReviewStore';
import { SightReviewFormData } from '@/types/sightReviews';
import { STEPS, useSightReviewSteps } from '@/hooks/useSightReviewSteps';
import { useSightReviewValidation } from '@/hooks/useSightReviewValidation';

interface SightReviewFormProps {
  onSubmit?: (data: SightReviewFormData) => Promise<{ id: string }>;
  artist?: string;
  className?: string;
}

export const SightReviewForm = React.memo(
  ({ onSubmit, artist, className = '' }: SightReviewFormProps) => {
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

        const successMessage = document.createElement('div');
        successMessage.className =
          'fixed bottom-4 right-4 bg-status-success text-white px-4 py-2 rounded-lg shadow-lg';
        successMessage.textContent = '리뷰가 성공적으로 등록되었습니다!';
        document.body.appendChild(successMessage);
        setTimeout(() => document.body.removeChild(successMessage), 3000);

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
            <ConcertSelect
              artist={artist}
              value={formData.concertId}
              onChange={(concertId) =>
                handleFieldChange('concertId', Number(concertId))
              }
              error={errors.concertId}
            />
          );
        case 1:
          return (
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
          );
        case 2:
          return (
            <div className="space-y-2">
              <FormSectionHeader
                title="사진"
                description="시야를 촬영한 사진을 업로드해주세요"
              />
              <div className="flex gap-4">
                <ImageUpload
                  value={formData.images[0]}
                  onChange={(file) =>
                    handleFieldChange('images', file ? [file] : [])
                  }
                  error={errors.images?.toString()}
                />
              </div>
            </div>
          );
        case 3:
          return (
            <div className="space-y-8">
              <ViewScoreSelect
                value={formData.viewScore}
                onChange={(viewScore) =>
                  handleFieldChange('viewScore', viewScore)
                }
                error={errors.viewScore}
              />
              <OtherSelect
                seatDistance={formData.seatDistance}
                sound={formData.sound}
                onSeatDistanceChange={(seatDistance) =>
                  handleFieldChange('seatDistance', seatDistance)
                }
                onSoundChange={(sound) => handleFieldChange('sound', sound)}
                error={errors.seatDistance}
              />
            </div>
          );
        case 4:
          return (
            <CommentInput
              value={formData.content}
              onChange={(content) => handleFieldChange('content', content)}
              error={errors.content}
            />
          );
      }
    };

    return (
      <div className={`space-y-8 ${className}`}>
        <div className="mb-8 flex justify-between">
          {STEPS.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center ${
                index === STEPS.length - 1 ? '' : 'flex-1'
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  index <= currentStep
                    ? 'bg-primary-main text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index + 1}
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`mx-2 h-1 flex-1 ${
                    index < currentStep ? 'bg-primary-main' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {renderStepContent()}

          {errors.submit && (
            <p className="mt-4 text-sm text-status-warning">{errors.submit}</p>
          )}

          <div className="mt-8 flex justify-between gap-4">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 rounded-lg border border-primary-main px-4 py-2 text-primary-main transition-colors hover:bg-primary-50"
              >
                이전
              </button>
            )}

            {currentStep < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceed}
                className="flex-1 rounded-lg bg-primary-main px-4 py-2 text-white transition-colors hover:bg-primary-700 disabled:bg-gray-300"
              >
                다음
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || !canProceed}
                className="flex-1 rounded-lg bg-primary-main px-4 py-2 text-white transition-colors hover:bg-primary-700 disabled:bg-gray-300"
              >
                {isSubmitting ? '제출 중...' : '작성하기'}
              </button>
            )}
          </div>
        </form>
      </div>
    );
  }
);

SightReviewForm.displayName = 'SightReviewForm';

export default SightReviewForm;
