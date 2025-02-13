'use client';

import React, { useState, useEffect } from 'react';
import { SharingWriteForm } from './SharingWriteForm';
import { sharingAPI } from '@/lib/api/sharing';
import { SharingFormData } from '@/types/sharing';

interface SharingFormContainerProps {
  mode: 'create' | 'edit';
  location?: { latitude: number; longitude: number };
  concertId?: number;
  sharingId?: number;
  initialData?: Partial<SharingFormData>;
  setFormData?: React.Dispatch<React.SetStateAction<SharingFormData>>;
  onSubmitComplete: (sharingId: number) => void;
  onLocationReset?: () => void;
}

export function SharingFormContainer({
  mode,
  sharingId,
  location,
  initialData = {},
  setFormData: setParentFormData,
  onSubmitComplete,
  onLocationReset,
}: SharingFormContainerProps) {
  const [formData, setFormData] = useState<SharingFormData>({
    title: '',
    content: '',
    startTime: '',
    latitude: 0,
    longitude: 0,
    image: null,
    ...initialData,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // 수정 모드일 때 초기 데이터 설정
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [mode, initialData]);

  // 폼 입력 값 변경 핸들러
  const handleFormChange = (data: Partial<SharingFormData>) => {
    const updatedFormData = { ...formData, ...data };
    setFormData(updatedFormData);

    // 부모 컴포넌트의 setFormData가 있다면 호출
    if (setParentFormData) {
      setParentFormData(updatedFormData);
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const { image, ...postData } = formData;

      const updatedData = {
        ...postData,
        ...(location && {
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      };

      if (mode === 'create') {
        if (image && image instanceof File) {
          const sharingId = await sharingAPI.createSharing(
            updatedData, // image 제외된 데이터
            image // File 타입의 이미지
          );
          onSubmitComplete(sharingId);
        } else {
          setErrors((prev) => ({ ...prev, image: '이미지를 업로드해주세요.' }));
        }
      } else {
        // 수정 모드
        if (sharingId) {
          await sharingAPI.updateSharing(
            sharingId,
            updatedData, // image 속성 제외
            image instanceof File ? image : undefined
          );
          onSubmitComplete(sharingId);
        }
      }
    } catch (error) {
      console.error(error);
      setErrors((prev) => ({
        ...prev,
        submit:
          mode === 'create'
            ? '나눔 등록에 실패했습니다. 다시 시도해주세요.'
            : '나눔 수정에 실패했습니다. 다시 시도해주세요.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // 폼 검증 함수
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) newErrors.title = '나눔할 물건을 입력해주세요';

    if (!formData.startTime) newErrors.startTime = '시작 시간을 선택해주세요';

    if (mode === 'create' && !formData.image)
      newErrors.image = '사진을 업로드해주세요';

    if (!formData.content.trim())
      newErrors.content = '상세 내용을 입력해주세요';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <SharingWriteForm
      mode={mode}
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
