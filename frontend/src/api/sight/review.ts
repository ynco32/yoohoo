// src/api/sight/review.ts
import { apiClient } from '../api';
import { ReviewRequest, Review, ReviewListApi } from '@/types/review'; // ReviewRequestDTO를 ReviewRequest로, ReviewResponse를 Review로 변경
import { ApiResponse } from '@/types/api';

export const reviewApi = {
  /**
   * 리뷰 조회
   */
  getReviews: (arenaId: string, section: string) =>
    apiClient.get<ReviewListApi>(
      `/api/v1/view/arenas/${arenaId}/sections/${section}/reviews`
    ),

  /**
   *
   * @param reviewData
   * @param files
   * @returns
   */
  async createReview(
    reviewData: ReviewRequest, // ReviewRequestDTO를 ReviewRequest로 변경
    files: File[]
  ): Promise<ApiResponse<Review>> {
    // ReviewResponse를 Review로 변경
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

    const response = await apiClient.post<ApiResponse<Review>>( // ReviewResponse를 Review로 변경
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
