'use client';

import React from 'react';
import { SharingFormData } from '@/types/sharing';
import { TimeInput } from './TimeInput';
import { ImageUpload } from '@/components/features/sight/form/ImageUpload';
import { TextArea } from '@/components/common/TextArea';
import { TextButton } from '@/components/ui/TextButton';
import { FormSectionHeader } from '@/components/features/sight/form/FormSectionHeader';

interface SharingWriteFormProps {
  mode: 'create' | 'edit';
  formData: Partial<SharingFormData>;
  onFormChange: (data: Partial<SharingFormData>) => void;
  onSubmit: () => void;
  onLocationReset?: () => void;
  onSubmitComplete: (sharingId: number) => void;
  isSubmitting: boolean;
  errors: { [key: string]: string };
}

export const SharingWriteForm = ({
  mode,
  formData,
  onFormChange,
  onSubmit,
  onLocationReset,
  isSubmitting,
  errors,
}: SharingWriteFormProps) => {
  return (
    <div className="flex h-[calc(100vh-56px)] w-full max-w-[430px] flex-col">
      <div className="h-full overflow-y-auto">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-6 p-6">
            <ImageUpload
              value={formData?.image || null}
              onChange={(image) => onFormChange({ image })}
              error={errors?.image}
            />

            <FormSectionHeader
              title="제목"
            />
            <TextArea
              value={formData?.title || ''}
              onChange={(title) => onFormChange({ title })}
              error={errors?.title}
              placeholder="제목을 입력해주세요"
              rows={1}
            />

            <FormSectionHeader
              title="나눔 시작 시간"
            />
            <TimeInput
              value={formData?.startTime || ''}
              onChange={(startTime) => onFormChange({ startTime })}
              error={errors?.startTime}
            />

            <FormSectionHeader
              title="자세한 설명"
            />
            <TextArea
              value={formData?.content || ''}
              onChange={(content) => onFormChange({ content })}
              error={errors?.content}
              placeholder="자세한 나눔 내용을 입력해주세요"
              rows={5}
            />
          </div>
        </form>
      </div>

      {errors?.submit && (
        <p className="px-4 text-sm text-status-warning">{errors.submit}</p>
      )}

      <div className="space-y-2 p-4">
        <TextButton variant="outline" onClick={onLocationReset}>
          위치 다시 선택하기
        </TextButton>
        <TextButton
          onClick={onSubmit}
          isLoading={isSubmitting}
          loadingText={mode === 'create' ? '등록 중...' : '수정 중...'}
        >
          {mode === 'create' ? '나눔 등록하기' : '나눔 수정하기'}
        </TextButton>
      </div>
    </div>
  );
};
