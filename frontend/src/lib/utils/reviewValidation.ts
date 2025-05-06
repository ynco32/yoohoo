// src/utils/reviewValidations.ts
import { ReviewRequestDTO } from '@/types/review';

export const validateReviewForm = (
  reviewData: Partial<ReviewRequestDTO>
): boolean => {
  // 필수 필드 검사
  const requiredFields = [
    reviewData.concertId !== undefined,
    reviewData.section !== undefined && reviewData.section.trim() !== '',
    reviewData.rowLine !== undefined && reviewData.rowLine > 0,
    reviewData.columnLine !== undefined && reviewData.columnLine > 0,
    reviewData.artistGrade !== undefined,
    reviewData.stageGrade !== undefined,
    reviewData.screenGrade !== undefined,
    reviewData.content !== undefined && reviewData.content.trim() !== '',
  ];

  return requiredFields.every((field) => field === true);
};
