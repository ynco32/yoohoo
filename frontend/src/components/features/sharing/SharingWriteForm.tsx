'use client';

import React from 'react';
import { SharingFormData } from '@/types/sharing';
import { TitleInput } from './TitleInput';
import { TimeInput } from './TimeInput';
import { PhotoUpload } from './PhotoUpload';
import { ContentInput } from './ContentInput';

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
        setErrors(prev => ({
          ...prev,
          submit: '나눔 등록에 실패했습니다. 다시 시도해주세요.'
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="w-full max-w-[430px] mx-auto h-[calc(100vh-56px)] flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="h-full">
          <div className="p-4 space-y-4">
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
            />
            <ContentInput
              value={formData.content || ''}
              onChange={(content) => onFormChange({ ...formData, content })}
              error={errors.content}
            />
          </div>
        </form>
      </div>

      {errors.submit && (
        <p className="text-sm text-status-warning px-4">{errors.submit}</p>
      )}

      <div className="p-4 space-y-2">
        <button
          type="button"
          onClick={onLocationReset}
          className="w-full rounded-lg border border-primary-main py-4 text-primary-main"
        >
          위치 다시 선택하기
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full rounded-lg bg-primary-main py-4 text-white transition-colors disabled:bg-gray-300"
        >
          {isSubmitting ? '등록 중...' : '나눔 등록하기'}
        </button>
      </div>
    </div>
  );
};

export default SharingWriteForm;