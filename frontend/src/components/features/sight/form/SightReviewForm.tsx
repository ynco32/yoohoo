'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ConcertSelect } from './ConcertSelect';
import { SeatSelect } from './SeatSelect';
import { ImageUpload } from './ImageUpload';
import VisibilitySelect from './VisibilitySelect';
import { OtherSelect } from './OtherSelect';
import { CommentInput } from './CommentInput';
import { FormSectionHeader } from '@/components/features/sight/form/FormSectionHeader';

interface SeatInfo {
  section: string;
  row: string;
  number: string;
}

interface SightReviewFormData {
  concertId?: string;
  seat?: SeatInfo;
  images: File[];
  visibility?: number;
  comfort?: string;
  sightLevel?: string;
  comment?: string;
}

type FormErrors = Partial<Record<keyof SightReviewFormData | 'submit', string>>;

interface SightReviewFormProps {
  onSubmit?: (data: SightReviewFormData) => Promise<{ id: string }>;
  artist?: string;
  className?: string;
}

export const SightReviewForm = ({
  onSubmit,
  artist,
  className = '',
}: SightReviewFormProps) => {
  console.log('=== SightReviewForm 렌더링 ===');

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState<SightReviewFormData>({
    images: [],
  });
  const [errors, setErrors] = React.useState<FormErrors>({});

  // formData 변경 추적
  React.useEffect(() => {
    console.log('FormData 변경됨:', {
      concertId: formData.concertId,
      seat: formData.seat,
      imagesCount: formData.images.length,
      visibility: formData.visibility,
      comfort: formData.comfort,
      sightLevel: formData.sightLevel,
      commentLength: formData.comment?.length,
    });
  }, [formData]);

  const validateForm = (): boolean => {
    console.log('=== validateForm 실행 시작 ===');
    const newErrors: FormErrors = {};

    if (!formData.concertId) {
      newErrors.concertId = '콘서트를 선택해주세요';
      console.log('❌ Concert ID missing');
    }
    if (
      !formData.seat?.section ||
      !formData.seat?.row ||
      !formData.seat?.number
    ) {
      newErrors.seat = '좌석 정보를 모두 입력해주세요';
      console.log('❌ Seat info missing');
    }
    if (!formData.visibility) {
      newErrors.visibility = '시야 정보를 선택해주세요';
      console.log('❌ Visibility missing');
    }
    if (!formData.comfort) {
      newErrors.comfort = '음향 정보를 선택해주세요';
      console.log('❌ Comfort missing');
    }
    if (!formData.sightLevel) {
      newErrors.sightLevel = '좌석 간격 정보를 선택해주세요';
      console.log('❌ Sight level missing');
    }
    if (!formData.comment) {
      newErrors.comment = '총평을 입력해주세요';
      console.log('❌ Comment missing');
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log('=== validateForm 결과 ===');
    console.log('검증 결과:', isValid ? '✅ 성공' : '❌ 실패');
    console.log('발견된 에러:', newErrors);

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log('=== handleSubmit 실행 ===');

    e.preventDefault();
    e.stopPropagation();

    // button click state를 활용
    const target = e.nativeEvent.target as HTMLFormElement;
    const submitButton = target.querySelector('button[type="submit"]');
    const isButtonSubmit = document.activeElement === submitButton;

    if (!isButtonSubmit) {
      console.log('❌ 제출 버튼을 통하지 않은 제출');
      return;
    }

    console.log('폼 검증 시작');
    if (validateForm()) {
      try {
        console.log('폼 검증 성공, 제출 시작');
        setIsSubmitting(true);
        const result = await onSubmit?.(formData);
        console.log('제출 결과:', result);

        if (result?.id) {
          console.log('제출 성공, 페이지 이동 준비');
          await Promise.resolve();
          console.log('success 페이지로 이동 시도');
          router.push('/sight/success');
        }
      } catch (error) {
        console.error('제출 실패:', error);
        setErrors((prev) => ({
          ...prev,
          submit: '리뷰 제출에 실패했습니다. 다시 시도해주세요.',
        }));
      } finally {
        setIsSubmitting(false);
      }
    } else {
      console.log('폼 검증 실패');
    }
  };

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
        onChange={(concertId) => setFormData({ ...formData, concertId })}
      />
      {errors.concertId && (
        <p className="mt-1 text-sm text-status-warning">{errors.concertId}</p>
      )}

      <SeatSelect
        value={formData.seat}
        onChange={(seat) => setFormData({ ...formData, seat })}
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
          {[0].map((index) => (
            <ImageUpload
              key={index}
              value={formData.images[index]}
              onChange={(file) => {
                const newImages = [...formData.images];
                if (file) {
                  newImages[index] = file;
                } else {
                  newImages.splice(index, 1);
                }
                setFormData({ ...formData, images: newImages });
              }}
            />
          ))}
        </div>
      </div>

      <VisibilitySelect
        value={formData.visibility}
        onChange={(visibility) => setFormData({ ...formData, visibility })}
      />
      {errors.visibility && (
        <p className="mt-1 text-sm text-status-warning">{errors.visibility}</p>
      )}

      <OtherSelect
        comfort={formData.comfort}
        sightLevel={formData.sightLevel}
        onComfortChange={(comfort) => setFormData({ ...formData, comfort })}
        onSightLevelChange={(sightLevel) =>
          setFormData({ ...formData, sightLevel })
        }
      />
      {(errors.comfort || errors.sightLevel) && (
        <p className="mt-1 text-sm text-status-warning">
          {errors.comfort || errors.sightLevel}
        </p>
      )}

      <CommentInput
        value={formData.comment}
        onChange={(comment) => setFormData({ ...formData, comment })}
        error={errors.comment}
      />

      {errors.submit && (
        <p className="text-sm text-status-warning">{errors.submit}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        onClick={() => console.log('제출 버튼 클릭됨')}
        className="w-full rounded-lg bg-primary-main py-4 text-white transition-colors hover:bg-primary-700 disabled:bg-gray-300"
      >
        {isSubmitting ? '제출 중...' : '작성하기'}
      </button>
    </form>
  );
};

export default SightReviewForm;
