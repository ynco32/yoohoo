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

type SeatDistanceStatus = '좁아요' | '평범해요' | '넓어요';
type SoundStatus = '나쁨' | '보통' | '좋음';

interface SightReviewFormData {
  section: number;
  rowLine: number;
  columnLine: number;
  concertId: number;
  images: File[];
  content: string;
  viewScore: number;
  seatDistance: SeatDistanceStatus;
  sound: SoundStatus;
}

type FormErrors = Partial<Record<keyof SightReviewFormData | 'submit', string>>;

interface SightReviewFormProps {
  onSubmit?: (data: SightReviewFormData) => Promise<{ id: string }>;
  artist?: string;
  className?: string;
}

export const SightReviewForm = React.memo(
  ({ onSubmit, artist, className = '' }: SightReviewFormProps) => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [formData, setFormData] = React.useState<SightReviewFormData>({
      section: 0,
      rowLine: 0,
      columnLine: 0,
      concertId: 0,
      content: '',
      images: [],
      viewScore: 0,
      seatDistance: '평범해요',
      sound: '보통',
    });
    const [errors, setErrors] = React.useState<FormErrors>({});

    // 콜백 함수들을 useCallback으로 메모이제이션
    const handleConcertValidation = React.useCallback(
      (result: { isValid: boolean; error?: string }) => {
        setErrors((prev) => ({
          ...prev,
          concertId: result.isValid ? undefined : result.error,
        }));
      },
      []
    );

    const handleSeatValidation = React.useCallback(
      (result: { isValid: boolean; error?: string }) => {
        console.log(result);
      },
      []
    );

    const handleImageValidation = React.useCallback((isValid: boolean) => {
      setErrors((prev) => ({
        ...prev,
        images: isValid ? undefined : '이미지를 업로드해주세요',
      }));
    }, []);

    const handleViewScoreValidation = React.useCallback(
      (result: { isValid: boolean; error?: string }) => {
        setErrors((prev) => ({
          ...prev,
          viewScore: result.isValid ? undefined : result.error,
        }));
      },
      []
    );

    const handleOtherValidation = React.useCallback(
      (result: { isValid: boolean; error?: string }) => {
        setErrors((prev) => ({
          ...prev,
          seatDistance: result.isValid ? undefined : result.error,
        }));
      },
      []
    );

    const handleCommentValidation = React.useCallback(
      (result: { isValid: boolean; error?: string }) => {
        setErrors((prev) => ({
          ...prev,
          content: result.isValid ? undefined : result.error,
        }));
      },
      []
    );

    // 폼 데이터 업데이트 핸들러들을 useCallback으로 메모이제이션
    const handleConcertChange = React.useCallback((concertId: number) => {
      setFormData((prev) => ({ ...prev, concertId: Number(concertId) }));
    }, []);

    const handleSeatChange = React.useCallback(
      (seatData: {
        section?: number;
        rowLine?: number;
        columnLine?: number;
      }) => {
        setFormData((prev) => ({
          ...prev,
          section: seatData.section ?? prev.section,
          rowLine: seatData.rowLine ?? prev.rowLine,
          columnLine: seatData.columnLine ?? prev.columnLine,
        }));
      },
      []
    );

    const handleImageChange = React.useCallback((file: File | null) => {
      setFormData((prev) => {
        const newImages = [...prev.images];
        if (file) {
          newImages[0] = file;
        } else {
          newImages.splice(0, 1);
        }
        return { ...prev, images: newImages };
      });
    }, []);

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

        // 여기에 제출 로직 추가
      },
      []
    );

    // formData 디버깅을 위한 useEffect는 개발 환경에서만 실행
    if (process.env.NODE_ENV === 'development') {
      React.useEffect(() => {
        console.log('FormData 변경됨:', formData);
      }, [formData]);
    }

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
          onChange={handleConcertChange}
          onValidation={handleConcertValidation}
        />
        {errors.concertId != null && (
          <p className="mt-1 text-sm text-status-warning">{errors.concertId}</p>
        )}
        <SeatSelect
          value={{
            section: formData.section,
            rowLine: formData.rowLine,
            columnLine: formData.columnLine,
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
          onChange={(viewScore) =>
            setFormData((prev) => ({ ...prev, viewScore }))
          }
          onValidation={handleViewScoreValidation}
        />
        <OtherSelect
          seatDistance={formData.seatDistance}
          sound={formData.sound}
          onSeatDistanceChange={(seatDistance) =>
            setFormData((prev) => ({ ...prev, seatDistance }))
          }
          onSoundChange={(sound) => setFormData((prev) => ({ ...prev, sound }))}
          onValidation={handleOtherValidation}
        />
        <CommentInput
          value={formData.content}
          onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
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
