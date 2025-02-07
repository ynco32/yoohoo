'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ConcertSelect } from './ConcertSelect';
import { SeatSelect } from './SeatSelect';
import { ImageUpload } from './ImageUpload';
import ViewScoreSelect from './ViewScoreSelect';
import { OtherSelect } from './OtherSelect';
import { CommentInput } from './CommentInput';
import { FormSectionHeader } from '@/components/features/sight/form/FormSectionHeader';
import { useSightReviewStore } from '@/store/useSightReviewStore';
import { SightReviewFormData } from '@/types/sightReviews';
import { ValidationState } from '@/types/validation';

interface SightReviewFormProps {
  onSubmit?: (data: SightReviewFormData) => Promise<{ id: string }>;
  artist?: string;
  className?: string;
}

export const SightReviewForm = React.memo(
  ({ onSubmit, artist, className = '' }: SightReviewFormProps) => {
    const router = useRouter();
    const formData = useSightReviewStore((state) => state.formData);
    const errors = useSightReviewStore((state) => state.errors);
    const isSubmitting = useSightReviewStore((state) => state.isSubmitting);
    const setFormField = useSightReviewStore((state) => state.setFormField);
    const setError = useSightReviewStore((state) => state.setError);
    const setValidation = useSightReviewStore((state) => state.setValidation);
    const setIsSubmitting = useSightReviewStore(
      (state) => state.setIsSubmitting
    );
    const clearErrors = useSightReviewStore((state) => state.clearErrors);
    const isFormValid = useSightReviewStore((state) => state.isFormValid);

    // Validation 상태를 담을 ref 객체
    const pendingValidation = React.useRef<{
      field: string;
      isValid: boolean;
      error?: string;
    } | null>(null);

    // validation 상태 업데이트를 처리하는 useEffect
    React.useEffect(() => {
      if (pendingValidation.current) {
        const { field, isValid, error } = pendingValidation.current;
        setValidation(field as keyof ValidationState, isValid);
        setError(field, isValid ? undefined : error);
        pendingValidation.current = null;
      }
    }, [setValidation, setError]);

    // validation 콜백들
    const handleConcertValidation = React.useCallback(
      (result: { isValid: boolean; error?: string }) => {
        pendingValidation.current = {
          field: 'concertId',
          isValid: result.isValid,
          error: result.error,
        };
      },
      []
    );

    const handleImageValidation = React.useCallback((isValid: boolean) => {
      pendingValidation.current = {
        field: 'images',
        isValid,
        error: isValid ? undefined : '이미지를 업로드해주세요',
      };
    }, []);

    const handleViewScoreValidation = React.useCallback(
      (result: { isValid: boolean; error?: string }) => {
        pendingValidation.current = {
          field: 'viewScore',
          isValid: result.isValid,
          error: result.error,
        };
      },
      []
    );

    const handleSeatValidation = React.useCallback(
      (result: { isValid: boolean; error?: string }) => {
        pendingValidation.current = {
          field: 'seat',
          isValid: result.isValid,
          error: result.error,
        };
      },
      []
    );

    const handleOtherValidation = React.useCallback(
      (result: { isValid: boolean; error?: string }) => {
        pendingValidation.current = {
          field: 'seatDistance',
          isValid: result.isValid,
          error: result.error,
        };
      },
      []
    );

    const handleCommentValidation = React.useCallback(
      (result: { isValid: boolean; error?: string }) => {
        pendingValidation.current = {
          field: 'content',
          isValid: result.isValid,
          error: result.error,
        };
      },
      []
    );

    // Form submission handler
    const handleSubmit = React.useCallback(
      async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const target = e.nativeEvent.target as HTMLFormElement;
        const submitButton = target.querySelector('button[type="submit"]');
        const isButtonSubmit = document.activeElement === submitButton;

        if (!isButtonSubmit) {
          console.log('❌ 제출 버튼을 통하지 않은 제출');
          return;
        }

        clearErrors();

        if (!isFormValid()) {
          console.log('❌ 폼 검증 실패');
          return;
        }

        if (onSubmit) {
          try {
            setIsSubmitting(true);
            const result = await onSubmit(formData);

            const successMessage = document.createElement('div');
            successMessage.className =
              'fixed bottom-4 right-4 bg-status-success text-white px-4 py-2 rounded-lg shadow-lg';
            successMessage.textContent = '리뷰가 성공적으로 등록되었습니다!';
            document.body.appendChild(successMessage);

            setTimeout(() => {
              document.body.removeChild(successMessage);
            }, 3000);

            router.push(`/reviews/${result.id}`);
          } catch (error) {
            console.error('Submit error:', error);
            setError(
              'submit',
              '제출 중 오류가 발생했습니다. 다시 시도해주세요.'
            );
          } finally {
            setIsSubmitting(false);
          }
        }
      },
      [
        clearErrors,
        formData,
        isFormValid,
        onSubmit,
        router,
        setError,
        setIsSubmitting,
      ]
    );

    return (
      <form
        onSubmit={handleSubmit}
        className={`space-y-8 ${className}`}
        onKeyDown={(e) => {
          if (
            e.key === 'Enter' &&
            (e.target as HTMLElement).tagName.toLowerCase() !== 'textarea'
          ) {
            e.preventDefault();
          }
        }}
      >
        <ConcertSelect
          artist={artist}
          value={formData.concertId}
          onChange={(concertId) => {
            setFormField('concertId', Number(concertId));
          }}
          onValidation={handleConcertValidation}
        />
        {errors.concertId && (
          <p className="mt-1 text-sm text-status-warning">{errors.concertId}</p>
        )}

        <SeatSelect
          value={{
            section: formData.section || null,
            rowLine: formData.rowLine || null,
            columnLine: formData.columnLine || null,
          }}
          onChange={(seatInfo) => {
            setFormField('section', seatInfo.section ?? 0);
            setFormField('rowLine', seatInfo.rowLine ?? 0);
            setFormField('columnLine', seatInfo.columnLine ?? 0);
          }}
          onValidation={handleSeatValidation}
        />
        {errors.seat && (
          <p className="mt-1 text-sm text-status-warning">{errors.seat}</p>
        )}

        <div className="space-y-2">
          <FormSectionHeader
            title="사진"
            description="시야를 촬영한 사진을 업로드해주세요"
          />
          <div className="flex gap-4">
            <ImageUpload
              value={formData.images[0]}
              onChange={(file) => {
                setFormField('images', file ? [file] : []);
              }}
              required
              error={errors.images?.toString()}
              onValidationChange={handleImageValidation}
            />
          </div>
        </div>

        <ViewScoreSelect
          value={formData.viewScore}
          onChange={(viewScore) => {
            setFormField('viewScore', viewScore);
          }}
          onValidation={handleViewScoreValidation}
        />
        {errors.viewScore && (
          <p className="mt-1 text-sm text-status-warning">{errors.viewScore}</p>
        )}

        <OtherSelect
          seatDistance={formData.seatDistance}
          sound={formData.sound}
          onSeatDistanceChange={(seatDistance) => {
            setFormField('seatDistance', seatDistance);
          }}
          onSoundChange={(sound) => setFormField('sound', sound)}
          onValidation={handleOtherValidation}
        />
        {errors.seatDistance && (
          <p className="mt-1 text-sm text-status-warning">
            {errors.seatDistance}
          </p>
        )}

        <CommentInput
          value={formData.content}
          onChange={(content) => {
            setFormField('content', content);
          }}
          onValidation={handleCommentValidation}
        />
        {errors.content && (
          <p className="mt-1 text-sm text-status-warning">{errors.content}</p>
        )}

        {errors.submit && (
          <p className="text-sm text-status-warning">{errors.submit}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-primary-main py-4 text-white transition-colors hover:bg-primary-700 disabled:bg-gray-300"
        >
          {isSubmitting ? '제출 중...' : '작성하기'}
        </button>
      </form>
    );
  }
);

SightReviewForm.displayName = 'SightReviewForm';

export default SightReviewForm;
