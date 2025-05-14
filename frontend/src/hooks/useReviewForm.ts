// src/hooks/useReviewForm.ts
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useReview } from '@/hooks/useReview';
import { ReviewRequest } from '@/types/review'; // ReviewRequestDTO를 ReviewRequest로 변경
import { CAMERA_MODELS } from '@/lib/constants';
import { validateReviewForm } from '@/lib/utils/reviewValidation';

export const useReviewForm = () => {
  const router = useRouter();
  const { createReview, isLoading, error } = useReview();

  // 리뷰 데이터 상태 관리
  const [reviewData, setReviewData] = useState<Partial<ReviewRequest>>({
    // ReviewRequestDTO를 ReviewRequest로 변경
    content: '',
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
    // ReviewRequestDTO를 ReviewRequest로 변경
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
      // ReviewRequest 타입에 맞게 데이터 변환
      const submitData: ReviewRequest = {
        // ReviewRequestDTO를 ReviewRequest로 변경
        concertId: reviewData.concertId!,
        seatId: reviewData.seatId!, // section, rowLine, columnLine 대신 seatId 사용
        artistGrade: reviewData.artistGrade!,
        stageGrade: reviewData.stageGrade!,
        screenGrade: reviewData.screenGrade!,
        content: reviewData.content!,
        cameraBrand: reviewData.cameraBrand,
        cameraModel: reviewData.cameraModel,
        photos: reviewData.photos,
        section: '',
        rowLine: '',
        columnLine: 0,
      };

      // API 호출
      const reviewId = await createReview(submitData, imageFiles);

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
