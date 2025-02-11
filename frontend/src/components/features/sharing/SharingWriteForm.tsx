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
          <div className="space-y-6 p-4">
            <FormSectionHeader
              title="제목"
              description="나눔할 물건의 제목을 입력해주세요"
            />
            <TextArea
              value={formData?.title || ''}
              onChange={(title) => onFormChange({ title })}
              error={errors?.title}
              placeholder="제목을 입력해주세요"
              rows={1}
            />

            <FormSectionHeader
              title="시간 선택"
              description="나눔을 시작할 시간을 설정해주세요"
            />
            <TimeInput
              value={formData?.startTime || ''}
              onChange={(startTime) => onFormChange({ startTime })}
              error={errors?.startTime}
            />

            <FormSectionHeader
              title="사진 업로드"
              description="나눔할 물건의 사진을 업로드해주세요"
            />
            <ImageUpload
              value={formData?.image || undefined}
              onChange={(image) => onFormChange({ image })}
              error={errors?.image}
            />

            <FormSectionHeader
              title="상세 내용"
              description="나눔할 물건에 대한 자세한 설명을 입력해주세요"
            />
            <TextArea
              value={formData?.content || ''}
              onChange={(content) => onFormChange({ content })}
              error={errors?.content}
              placeholder="상세 내용을 입력해주세요"
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
