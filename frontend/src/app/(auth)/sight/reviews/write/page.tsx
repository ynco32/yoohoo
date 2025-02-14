'use client';

import { useEffect } from 'react';
import { SightReviewFormContainer } from '@/components/features/sight/form/SightReviewFormContainer';
import { useSightReviewStore } from '@/store/useSightReviewStore';

export default function ReviewFormPage() {
  useEffect(() => {
    // 페이지 마운트 시 store 초기화
    useSightReviewStore.getState().reset();
  }, []);

  return <SightReviewFormContainer />;
}
