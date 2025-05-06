// src/api/sight/review.ts
import { apiClient } from '../api';
import { ReviewRequestDTO, ReviewResponse } from '@/types/review';
import { ApiResponse } from '@/types/api';

export const reviewApi = {
  async createReview(
    reviewData: ReviewRequestDTO,
    files: File[]
  ): Promise<ApiResponse<ReviewResponse>> {
    const formData = new FormData();

    // reviewRequestDTO를 JSON으로 변환하여 Blob으로 추가
    const reviewBlob = new Blob([JSON.stringify(reviewData)], {
      type: 'application/json',
    });
    formData.append('reviewRequestDTO', reviewBlob);

    // 파일들 추가
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await apiClient.post<ApiResponse<ReviewResponse>>(
      '/api/v1/view/reviews',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  },
};
