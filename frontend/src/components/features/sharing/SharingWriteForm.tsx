'use client';

import React from 'react';
import { SharingFormData } from '@/types/sharing';
import { TitleInput } from './TitleInput';
import { TimeInput } from './TimeInput';
import { ImageUpload } from '@/components/features/sight/form/ImageUpload';
import { TextArea } from '@/components/common/TextArea';
import { TextButton } from '@/components/ui/TextButton';
import { FormSectionHeader } from '@/components/features/sight/form/FormSectionHeader';
import { sharingAPI } from '@/lib/api/sharing';

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
  formData,
  onFormChange,
  onSubmitComplete,
  onLocationReset,
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

        const postData = {
          title: formData.title,
          content: formData.content,
          latitude: formData.latitude,
          longitude: formData.longitude,
          startTime: formData.startTime,
          concertId: formData.concertId,
        };

        if (formData.image) {
          await sharingAPI.createSharing(postData, formData.image);
          onSubmitComplete(); // 성공 시 콜백 호출
        } else {
          setErrors((prev) => ({
            ...prev,
            image: '이미지를 업로드해주세요.',
          }));
        }
      } catch (_error) {
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
          <div className="space-y-6 p-4">
            {/* 제목 섹션 */}
            <FormSectionHeader
              title="제목"
              description="나눔할 물건의 제목을 입력해주세요"
            />
            <TitleInput
              value={formData.title || ''}
              onChange={(title) => onFormChange({ ...formData, title })}
              error={errors.title}
            />

            {/* 시간 섹션 */}
            <FormSectionHeader
              title="시간 선택"
              description="나눔을 시작할 시간을 설정해주세요"
            />
            <TimeInput
              value={formData.startTime || ''}
              onChange={(startTime) => onFormChange({ ...formData, startTime })}
              error={errors.startTime}
            />

            {/* 사진 섹션 */}
            <FormSectionHeader
              title="사진 업로드"
              description="나눔할 물건의 사진을 업로드해주세요"
            />
            <ImageUpload
              value={formData.image || undefined}
              onChange={(image) => onFormChange({ ...formData, image })}
              error={errors.image}
            />

            {/* 상세 내용 섹션 */}
            <FormSectionHeader
              title="상세 내용"
              description="나눔할 물건에 대한 자세한 설명을 입력해주세요"
            />
            <TextArea
              value={formData.content}
              onChange={(content) => onFormChange({ ...formData, content })}
              error={errors.content}
              placeholder="상세 내용을 입력해주세요"
            />
          </div>
        </form>
      </div>

      {/* 에러 메시지 */}
      {errors.submit && (
        <p className="px-4 text-sm text-status-warning">{errors.submit}</p>
      )}

      {/* 버튼 섹션 */}
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
