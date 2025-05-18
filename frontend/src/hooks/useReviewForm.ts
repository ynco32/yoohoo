// src/hooks/useReviewForm.ts
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useReview } from '@/hooks/useReview';
import {
  ReviewRequest,
  ArtistGrade,
  StageGrade,
  ScreenGrade,
} from '@/types/review';
import { CAMERA_MODELS } from '@/lib/constants';
import { validateReviewForm } from '@/lib/utils/reviewValidation';

export const useReviewForm = () => {
  const router = useRouter();
  const { createReview, isLoading, error } = useReview();

  // 리뷰 데이터 상태 관리
  const [reviewData, setReviewData] = useState<ReviewRequest>({
    concertId: 0, // 초기값 설정
    section: '', // 초기값 설정
    rowLine: '', // 초기값 설정
    columnLine: 0, // 초기값 설정
    artistGrade: ArtistGrade.MODERATE, // 초기값 설정
    stageGrade: StageGrade.CLEAR, // 초기값 설정
    screenGrade: ScreenGrade.CLEAR, // 초기값 설정
    content: '',
    cameraBrand: undefined,
    cameraModel: undefined,
    photos: undefined,
  });

  // 이미지 파일 상태 관리
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  // 카메라 브랜드 상태
  const [selectedBrand, setSelectedBrand] = useState<string | undefined>(
    undefined
  );

  // 제출 성공 상태
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // 선택된 브랜드에 따라 사용 가능한 모델 목록 결정
  const availableModels = useMemo(() => {
    if (!selectedBrand) return [];
    return CAMERA_MODELS[selectedBrand] || [];
  }, [selectedBrand]);

  // 값 변경 핸들러
  const handleChange = (key: keyof ReviewRequest, value: any) => {
    setReviewData((prev) => ({ ...prev, [key]: value }));
  };

  // 브랜드 변경 핸들러
  const handleBrandChange = (brandValue: string) => {
    setSelectedBrand(brandValue);
    // 브랜드가 변경되면 기존에 선택한 기종 초기화
    setReviewData((prev) => ({
      ...prev,
      cameraBrand: brandValue,
      cameraModel: undefined,
    }));
  };

  // 이미지 변경 핸들러
  const handleImageChange = (files: (File | string)[] | null) => {
    if (files) {
      // File 타입만 추출
      const fileObjects = files.filter(
        (file) => file instanceof File
      ) as File[];
      // 최대 3개로 제한
      const limitedFiles = fileObjects.slice(0, 3);
      setImageFiles(limitedFiles);
    } else {
      setImageFiles([]);
    }
  };

  // 폼 유효성 검사
  const isFormValid = () => {
    return validateReviewForm(reviewData);
  };

  // 완료 버튼 클릭 핸들러 - API 연결
  const handleSubmit = async () => {
    if (!isFormValid()) return;

    try {
      // API 호출 (수정된 부분: reviewData를 그대로 전달)
      const reviewId = await createReview(reviewData, imageFiles);

      if (reviewId) {
        // 성공 처리
        setSubmitSuccess(true);
        setTimeout(() => {
          // 성공 후 페이지 이동
          router.push(`/reviews/${reviewId}`);
        }, 2000);
      }
    } catch (err) {
      console.error('리뷰 제출 오류:', err);
    }
  };

  return {
    reviewData,
    imageFiles,
    selectedBrand,
    availableModels,
    isLoading,
    error,
    submitSuccess,
    handleChange,
    handleBrandChange,
    handleImageChange,
    handleSubmit,
    isFormValid,
  };
};
