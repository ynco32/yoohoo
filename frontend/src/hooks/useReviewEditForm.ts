// src/hooks/useReviewEditForm.ts
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useReview } from '@/hooks/useReview';
import {
  ArtistGrade,
  StageGrade,
  ScreenGrade,
  ReviewUpdateRequest,
} from '@/types/review';
import { CAMERA_BRANDS, CAMERA_MODELS } from '@/lib/constants';

export const useReviewEditForm = (reviewId: string | number) => {
  const router = useRouter();
  const {
    review,
    isLoading: isLoadingReview,
    error: reviewError,
    updateReview,
  } = useReview(reviewId);

  // 폼 상태 관리
  const [reviewData, setReviewData] = useState<Partial<ReviewUpdateRequest>>({
    concertId: 0,
    section: '',
    rowLine: '',
    columnLine: 0,
    artistGrade: ArtistGrade.MODERATE,
    stageGrade: StageGrade.CLEAR,
    screenGrade: ScreenGrade.CLEAR,
    content: '',
    existingPhotoUrls: [],
  });

  // 이미지 관련 상태
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // 카메라 관련 상태
  const [selectedBrand, setSelectedBrand] = useState('');
  const [availableModels, setAvailableModels] = useState<
    { label: string; value: string }[]
  >([]);

  // 제출 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // 리뷰 데이터가 로드되면 폼 초기화
  useEffect(() => {
    if (review) {
      setReviewData({
        concertId: review.seatId,
        section: review.section,
        rowLine: review.rowLine,
        columnLine: review.columnLine,
        artistGrade: review.artistGrade,
        stageGrade: review.stageGrade,
        screenGrade: review.screenGrade,
        content: review.content,
        cameraBrand: review.cameraBrand,
        cameraModel: review.cameraModel,
        existingPhotoUrls: review.photoUrls,
      });

      // 기존 이미지 설정
      setExistingImages(review.photoUrls || []);

      // 카메라 브랜드 설정
      if (review.cameraBrand) {
        setSelectedBrand(review.cameraBrand);

        // 해당 브랜드의 모델 목록 설정
        if (CAMERA_MODELS[review.cameraBrand]) {
          setAvailableModels(CAMERA_MODELS[review.cameraBrand]);
        }
      }
    }
  }, [review]);

  // 입력 필드 변경 처리
  const handleChange = (name: string, value: any) => {
    setReviewData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 브랜드 변경 시 모델 목록 업데이트
  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    setReviewData((prev) => ({
      ...prev,
      cameraBrand: brand,
      cameraModel: '', // 브랜드 변경 시 모델 초기화
    }));

    if (brand && CAMERA_MODELS[brand]) {
      setAvailableModels(CAMERA_MODELS[brand]);
    } else {
      setAvailableModels([]);
    }
  };

  // 새 이미지 업로드 처리
  const handleImageChange = (files: File[]) => {
    setImageFiles(files);
  };

  // 기존 이미지 삭제 처리
  const handleRemoveExistingImage = (url: string) => {
    setExistingImages((prev) => prev.filter((item) => item !== url));
    setReviewData((prev) => ({
      ...prev,
      existingPhotoUrls:
        prev.existingPhotoUrls?.filter((item) => item !== url) || [],
    }));
  };

  // 폼 유효성 검사
  const isFormValid = () => {
    return (
      !!reviewData.concertId &&
      !!reviewData.section &&
      !!reviewData.rowLine &&
      !!reviewData.columnLine &&
      !!reviewData.artistGrade &&
      !!reviewData.stageGrade &&
      !!reviewData.screenGrade &&
      !!reviewData.content
    );
  };

  // 폼 제출 처리
  const handleSubmit = async () => {
    if (!isFormValid() || !reviewId) return;

    setIsSubmitting(true);
    setError(null);
    setSubmitSuccess(false);

    try {
      const updateData: ReviewUpdateRequest = {
        concertId: reviewData.concertId || 0,
        section: reviewData.section || '',
        rowLine: reviewData.rowLine || '',
        columnLine: reviewData.columnLine || 0,
        artistGrade: reviewData.artistGrade || ArtistGrade.MODERATE,
        stageGrade: reviewData.stageGrade || StageGrade.CLEAR,
        screenGrade: reviewData.screenGrade || ScreenGrade.CLEAR,
        content: reviewData.content || '',
        cameraBrand: reviewData.cameraBrand,
        cameraModel: reviewData.cameraModel,
        existingPhotoUrls: existingImages,
      };

      const updatedReview = await updateReview(
        reviewId,
        updateData,
        imageFiles
      );

      if (updatedReview) {
        setSubmitSuccess(true);
        // 성공 후 1초 후에 상세 페이지로 이동
        setTimeout(() => {
          router.push(`/sight/reviews/${reviewId}`);
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message || '리뷰 수정 중 오류가 발생했습니다.');
      console.error('리뷰 수정 오류:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    reviewData,
    imageFiles,
    existingImages,
    selectedBrand,
    availableModels,
    isLoading: isLoadingReview || isSubmitting,
    error: error || reviewError,
    submitSuccess,
    handleChange,
    handleBrandChange,
    handleImageChange,
    handleRemoveExistingImage,
    handleSubmit,
    isFormValid,
  };
};
