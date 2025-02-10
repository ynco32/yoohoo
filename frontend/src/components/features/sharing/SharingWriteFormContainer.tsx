'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { SharingWriteForm } from './SharingWriteForm';
import { sharingAPI } from '@/lib/api/sharing';
import { SharingFormData } from '@/types/sharing';

interface SharingWriteFormContainerProps {
  location: { latitude: number; longitude: number };
  concertId: number;
}

export function SharingWriteFormContainer({
  location,
  concertId,
}: SharingWriteFormContainerProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<SharingFormData>({
    title: '',
    content: '',
    latitude: location.latitude || 0,
    longitude: location.longitude || 0,
    startTime: '',
    image: undefined,
    concertId: concertId || 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleFormChange = (data: SharingFormData) => {
    setFormData(data);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const postData = {
        ...formData,
      };

      if (formData.image) {
        await sharingAPI.createSharing(postData, formData.image);
        router.push(`/${concertId}`);
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
      onSubmitComplete={() => router.push('/success')}
      onLocationReset={() =>
        setFormData({
          ...formData,
          latitude: location.latitude,
          longitude: location.longitude,
        })
      }
      errors={errors}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
    />
  );
}
