'use client';

import React, { useState } from 'react';
import { SharingWriteForm } from './SharingWriteForm';
import { sharingAPI } from '@/lib/api/sharing';
import { SharingFormData } from '@/types/sharing';

interface SharingWriteFormContainerProps {
  location: { latitude: number; longitude: number };
  concertId: number;
  formData: SharingFormData; // ✅ 기존 데이터 유지
  setFormData: React.Dispatch<React.SetStateAction<SharingFormData>>; // ✅ 상태 업데이트 함수
  onLocationReset: () => void;
  onSubmitComplete: () => void;
}

export function SharingWriteFormContainer({
  formData,
  setFormData,
  onLocationReset,
  onSubmitComplete,
}: SharingWriteFormContainerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // 폼 입력 값 변경 핸들러
  const handleFormChange = (data: SharingFormData) => {
    setFormData(data); // 부모 컴포넌트에서 상태 유지
  };

  // 폼 제출 핸들러
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const postData = { ...formData };

      if (formData.image) {
        await sharingAPI.createSharing(postData, formData.image);
        onSubmitComplete();
      } else {
        setErrors((prev) => ({ ...prev, image: '이미지를 업로드해주세요.' }));
      }
    } catch {
      setErrors((prev) => ({
        ...prev,
        submit: '나눔 등록에 실패했습니다. 다시 시도해주세요.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ 폼 검증 함수
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.title.trim()) newErrors.title = '나눔할 물건을 입력해주세요';
    if (!formData.startTime) newErrors.startTime = '시작 시간을 선택해주세요';
    if (!formData.image) newErrors.image = '사진을 업로드해주세요';
    if (!formData.content.trim())
      newErrors.content = '상세 내용을 입력해주세요';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <SharingWriteForm
      formData={formData}
      onFormChange={handleFormChange}
      onSubmitComplete={onSubmitComplete}
      onLocationReset={onLocationReset}
      errors={errors}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
    />
  );
}
