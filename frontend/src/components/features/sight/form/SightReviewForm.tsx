'use client';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import { SuccessModal } from '@/components/common/SuccessModal';

interface SightReviewFormProps {
  onSubmit?: (data: SightReviewFormData) => Promise<void>;
  artist?: string;
  className?: string;
  onClose?: () => void;
}

interface FormServerError {
  message: string;
  type: 'error' | 'warning';
}

export const SightReviewForm = React.memo(
  ({ onSubmit, className = '', onClose }: SightReviewFormProps) => {
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

    const params = useParams();
    const reviewId = params.reviewId;
    const [showSuccessModal, setShowSuccessModal] = React.useState(false);
    const [serverError, setServerError] =
      React.useState<FormServerError | null>(null);
    const router = useRouter();

    const { currentStep, canProceed, handleNext, handleBack } =
      useSightReviewSteps({
        formData,
        initialStep: reviewId ? 1 : 0,
        isEditMode: !!reviewId,
      });

    const { validateStep, getValidationField } = useSightReviewValidation({
      formData,
      touched,
      setValidation,
      setError,
    });

    React.useEffect(() => {
      const validationOnly = false;
      validateStep(STEPS[currentStep].id, validationOnly);
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
      // 필드 값이 변경되면 서버 에러 메시지 초기화
      setServerError(null);
    };

    const handleModalClose = () => {
      setShowSuccessModal(false);
      router.replace('/mypage/sight');
    };

    const handleSubmit = async () => {
      if (currentStep !== STEPS.length - 1) return;

      clearErrors();
      setServerError(null);

      setValidation(
        'photo',
        formData.photo instanceof File || typeof formData.photo === 'string'
      );
      setValidation(
        'seat',
        formData.sectionNumber > 0 &&
          formData.rowLine > 0 &&
          formData.columnLine > 0
      );

      const stepValidation = validateStep(STEPS[currentStep].id);
      const formValidation = isFormValid();

      if (!stepValidation) {
        console.log('Step validation failed');
        setError('submit', '현재 단계의 모든 항목을 입력해주세요.');
        return;
      }

      const validationDetails = {
        concertId: formData.concertId > 0,
        seat:
          formData.sectionNumber > 0 &&
          formData.rowLine > 0 &&
          formData.columnLine > 0,
        photo:
          formData.photo instanceof File || typeof formData.photo === 'string',
        viewScore: formData.viewScore > 0,
        seatDistance: formData.seatDistance.length > 0,
        content: formData.content.length >= 10,
      };

      if (!formValidation) {
        console.log('Form validation failed:', validationDetails);
        setError(
          'submit',
          '이전 단계의 필수 항목이 모두 입력되지 않았습니다. 처음부터 다시 확인해주세요.'
        );
        return;
      }

      if (!validationDetails.photo || !validationDetails.seat) {
        console.log('Critical validation check failed');
        setError('submit', '사진과 좌석 정보를 다시 확인해주세요.');
        return;
      }

      if (!onSubmit) {
        console.log('No onSubmit handler provided');
        return;
      }

      try {
        setIsSubmitting(true);
        await onSubmit(formData);
        setShowSuccessModal(true);
      } catch (error) {
        console.error('Submit error:', error);

        if (error instanceof Error) {
          const isServerError = error.message.includes('서버 에러');
          setServerError({
            message: error.message,
            type: isServerError ? 'error' : 'warning',
          });
        } else {
          setServerError({
            message: '알 수 없는 오류가 발생했습니다. 다시 시도해주세요.',
            type: 'error',
          });
        }
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
                    section: formData.sectionNumber || null,
                    rowLine: formData.rowLine || null,
                    columnLine: formData.columnLine || null,
                  }}
                  onChange={(seatInfo) => {
                    handleFieldChange('sectionNumber', seatInfo.section ?? 0);
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
            <div className="h-full w-full">
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
        className={`relative flex h-full flex-col rounded-layout bg-white shadow-card-colored ${className}`}
      >
        <button
          onClick={onClose}
          className="absolute right-md top-md text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <form
          className="flex h-full flex-1 flex-col py-2xl"
          autoComplete="off"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }}
        >
          <div className="bg-white px-md pt-2xl">
            <StepProgressBar
              currentStep={currentStep}
              handleNext={handleNext}
              handleBack={handleBack}
            />
          </div>

          <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-md py-lg">
            <div className="max-w-2xl w-full">{renderStepContent()}</div>
          </div>

          <div className="bg-white px-md py-md">
            {/* 서버 에러 메시지 */}
            {serverError && (
              <div
                className={`mb-md rounded-lg p-md ${
                  serverError.type === 'error'
                    ? 'bg-status-warning/10 text-status-warning'
                    : 'bg-status-caution/10 text-status-caution'
                }`}
                role="alert"
              >
                <p className="text-sm">{serverError.message}</p>
              </div>
            )}

            {errors.submit && !serverError && (
              <div
                className="mb-md rounded-lg bg-status-warning/10 p-md"
                role="alert"
              >
                <p className="text-sm text-status-warning">{errors.submit}</p>
              </div>
            )}

            <div className="flex justify-between gap-md">
              {currentStep > 0 && !reviewId && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="hover:button h-12 flex-1 rounded-lg border border-sight-button px-md py-2 text-sight-button transition-colors"
                >
                  이전
                </button>
              )}
              {currentStep === STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    console.log('Submit button clicked manually');
                    handleSubmit();
                  }}
                  disabled={!canProceed || isSubmitting}
                  className="h-12 flex-1 rounded-lg bg-sight-button px-md py-2 text-white transition-colors hover:bg-sight-button disabled:bg-gray-300"
                >
                  {isSubmitting ? '제출 중...' : '작성하기'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed}
                  className="h-12 flex-1 rounded-lg bg-sight-button px-md py-2 text-white transition-colors hover:bg-sight-button disabled:bg-gray-300"
                >
                  다음
                </button>
              )}
            </div>
          </div>
        </form>

        <SuccessModal
          isOpen={showSuccessModal}
          onClose={handleModalClose}
          message="리뷰가 성공적으로 등록되었습니다!"
          buttonText="내 리뷰 보러가기"
        />
      </div>
    );
  }
);

SightReviewForm.displayName = 'SightReviewForm';

export default SightReviewForm;
