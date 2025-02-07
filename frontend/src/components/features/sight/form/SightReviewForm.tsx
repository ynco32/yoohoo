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
import { SeatInfo, SightReviewFormData } from '@/types/sightReviews';

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
    const setIsSubmitting = useSightReviewStore(
      (state) => state.setIsSubmitting
    );

    // 검증 콜백들을 useCallback으로 메모이제이션
    const handleConcertValidation = React.useCallback(
      (result: { isValid: boolean; error?: string }) => {
        setError('concertId', result.isValid ? undefined : result.error);
      },
      [setError]
    );

    const handleImageValidation = React.useCallback(
      (isValid: boolean) => {
        setError('images', isValid ? undefined : '이미지를 업로드해주세요');
      },
      [setError]
    );

    const handleViewScoreValidation = React.useCallback(
      (result: { isValid: boolean; error?: string }) => {
        setError('viewScore', result.isValid ? undefined : result.error);
      },
      [setError]
    );

    const handleSeatValidation = React.useCallback(
      (_result: { isValid: boolean; error?: string }) => {
        // 좌석 검증 로직 추가
      },
      []
    );

    const handleOtherValidation = React.useCallback(
      (result: { isValid: boolean; error?: string }) => {
        setError('seatDistance', result.isValid ? undefined : result.error);
      },
      [setError]
    );

    const handleCommentValidation = React.useCallback(
      (result: { isValid: boolean; error?: string }) => {
        setError('content', result.isValid ? undefined : result.error);
      },
      [setError]
    );

    // 이미지 업로드 핸들러
    const handleImageChange = React.useCallback(
      (file: File | undefined) => {
        setFormField('images', file ? [file] : []);
      },
      [setFormField]
    );

    // 좌석 선택 핸들러
    const handleSeatChange = React.useCallback(
      (seatInfo: SeatInfo) => {
        setFormField('section', seatInfo.section ?? 0);
        setFormField('rowLine', seatInfo.rowLine ?? 0);
        setFormField('columnLine', seatInfo.columnLine ?? 0);
      },
      [setFormField]
    );

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

        if (onSubmit) {
          try {
            setIsSubmitting(true);
            const result = await onSubmit(formData);
            router.push(`/reviews/${result.id}`);
          } catch (error) {
            setError('submit', '제출 중 오류가 발생했습니다.');
            console.log(error);
          } finally {
            setIsSubmitting(false);
          }
        }
      },
      [formData, onSubmit, router, setError, setIsSubmitting]
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
          onChange={(concertId) => setFormField('concertId', Number(concertId))}
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
          onChange={handleSeatChange}
          onValidation={handleSeatValidation}
        />
        <div className="space-y-2">
          <FormSectionHeader
            title="사진"
            description="시야를 촬영한 사진을 업로드해주세요"
          />
          <div className="flex gap-4">
            {[0].map((index) => (
              <ImageUpload
                key={index}
                value={formData.images[0]}
                onChange={handleImageChange}
                required
                error={errors.images?.toString()}
                onValidationChange={handleImageValidation}
              />
            ))}
          </div>
        </div>
        <ViewScoreSelect
          value={formData.viewScore}
          onChange={(viewScore) => setFormField('viewScore', viewScore)}
          onValidation={handleViewScoreValidation}
        />
        <OtherSelect
          seatDistance={formData.seatDistance}
          sound={formData.sound}
          onSeatDistanceChange={(seatDistance) =>
            setFormField('seatDistance', seatDistance)
          }
          onSoundChange={(sound) => setFormField('sound', sound)}
          onValidation={handleOtherValidation}
        />
        <CommentInput
          value={formData.content}
          onChange={(content) => setFormField('content', content)}
          onValidation={handleCommentValidation}
        />
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
