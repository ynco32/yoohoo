'use client';

import React from 'react';
import { SharingFormData } from '@/types/sharing';
import { TitleInput } from './TitleInput';
import { TimeInput } from './TimeInput';
import { PhotoUpload } from '@/components/common/PhotoUpload';
import { TextArea } from '@/components/common/TextArea';
import { TextButton } from '@/components/ui/TextButton';

interface SharingWriteFormProps {
  location: { latitude: number; longitude: number };
  onSubmitComplete: () => void;
  formData: SharingFormData;
  onFormChange: (data: SharingFormData) => void;
  onLocationReset: () => void;
  concertId: number;
}

type FormErrors = {
  title?: string;
  startTime?: string;
  content?: string;
  image?: string;
  submit?: string;
};

export const SharingWriteForm = ({
  location,
  formData,
  onFormChange,
  onSubmitComplete,
  onLocationReset,
  concertId,
}: SharingWriteFormProps) => {
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title?.trim()) {
      newErrors.title = '나눔할 물건을 입력해주세요';
    }
    if (!formData.startTime) {
      newErrors.startTime = '시작 시간을 선택해주세요';
    }
    if (!formData.image) {
      newErrors.image = '사진을 업로드해주세요';
    }
    if (!formData.content?.trim()) {
      newErrors.content = '상세 내용을 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        setIsSubmitting(true);
        await onSubmitComplete();
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          submit: '나눔 등록에 실패했습니다. 다시 시도해주세요.',
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="flex h-[calc(100vh-56px)] w-full max-w-[430px] flex-col">
      <div className="h-full overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 p-4">
            <TitleInput
              value={formData.title || ''}
              onChange={(title) => onFormChange({ ...formData, title })}
              error={errors.title}
            />
            <TimeInput
              value={formData.startTime || ''}
              onChange={(startTime) => onFormChange({ ...formData, startTime })}
              error={errors.startTime}
            />
            <PhotoUpload
              value={formData.image}
              onChange={(image) => onFormChange({ ...formData, image })}
              error={errors.image}
              label="사진"
              placeholder="사진을 업로드해주세요"
            />
            <TextArea
              value={formData.content}
              onChange={(content) => onFormChange({ ...formData, content })}
              error={errors.content}
              label="상세 내용"
              placeholder="상세 내용을 입력해주세요"
            />
          </div>
        </form>
      </div>

      {errors.submit && (
        <p className="px-4 text-sm text-status-warning">{errors.submit}</p>
      )}

      <div className="space-y-2 p-4">
        <TextButton variant="outline" onClick={onLocationReset}>
          위치 다시 선택하기
        </TextButton>
        <TextButton
          onClick={handleSubmit}
          isLoading={isSubmitting}
          loadingText="등록 중..."
        >
          나눔 등록하기
        </TextButton>
      </div>
    </div>
  );
};

export default SharingWriteForm;
