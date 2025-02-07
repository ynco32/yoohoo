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

interface SightReviewFormData {
  section: number;
  rowLine: number;
  columnLine: number;
  concertId: number;
  images: File[];
  content: string;
  viewScore: number;
  seatDistance: string;
  sound: string;
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
    section: 0,
    rowLine: 0,
    columnLine: 0,
    concertId: 0,
    content: '',
    images: [],
    viewScore: 0,
    seatDistance: '',
    sound: '',
  });
  const [errors, setErrors] = React.useState<FormErrors>({});

  // formData 변경 추적
  React.useEffect(() => {
    console.log('FormData 변경됨:', {
      section: formData.section,
      rowLine: formData.rowLine,
      columnLine: formData.columnLine,
      concertId: formData.concertId,
      images: formData.images,
      content: formData.content,
      viewScore: formData?.viewScore,
      seatDistance: formData.seatDistance,
      sound: formData.sound,
    });
  }, [formData]);

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
        onChange={(concertId) =>
          setFormData({ ...formData, concertId: Number(concertId) })
        }
        onValidation={(result) => {
          setErrors((prev) => ({
            ...prev,
            concertId: result.isValid ? undefined : result.error,
          }));
        }}
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
        onChange={(seatData) =>
          setFormData({
            ...formData,
            section: seatData.section ?? 0,
            rowLine: seatData.rowLine ?? 0,
            columnLine: seatData.columnLine ?? 0,
          })
        }
        onValidation={(result) => {
          // 검증 결과 처리
          console.log(result);
        }}
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
