import { apiClient, apiRequest, serverApiRequest } from '../api';
import {
  ReviewRequest,
  Review,
  ReviewListApi,
  ReviewUpdateRequest,
} from '@/types/review';
import { ApiResponse } from '@/types/api';

export const reviewApi = {
  /**
   * 리뷰 조회
   */
  getReviews: async (arenaId: string, section: string) => {
    const response = await apiClient.get<ApiResponse<ReviewListApi>>(
      `/api/v1/view/arenas/${arenaId}/sections/${section}/reviews`
    );
    return response.data.data;
  },

  /**
   * 단일 리뷰 조회
   * @param reviewId 리뷰 ID
   * @returns 단일 리뷰 정보
   */
  getReviewById: async (reviewId: string | number) => {
    const response = await apiClient.get<ApiResponse<Review>>(
      `/api/v1/view/reviews/${reviewId}`
    );
    return response.data.data;
  },

  /**
   * 리뷰 수정
   * @param reviewId 리뷰 ID
   * @param reviewData 수정할 리뷰 데이터
   * @param files 새로 추가할 파일들
   * @returns 수정된 리뷰 정보
   */
  async updateReview(
    reviewId: string | number,
    reviewData: ReviewUpdateRequest,
    files: File[]
  ): Promise<Review> {
    const formData = new FormData();

    // reviewRequestDTO를 JSON으로 변환하여 Blob으로 추가
    const reviewBlob = new Blob([JSON.stringify(reviewData)], {
      type: 'application/json',
    });
    formData.append('reviewRequestDTO', reviewBlob);

    // 새 파일들 추가
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await apiClient.put<ApiResponse<Review>>(
      `/api/v1/view/reviews/${reviewId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.data;
  },

  /**
   * 리뷰 삭제
   * @param reviewId 삭제할 리뷰 ID
   * @returns 삭제 결과
   */
  deleteReview: async (reviewId: string | number) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/api/v1/view/reviews/${reviewId}`
    );
    return response.data;
  },

  /**
   *
   * @param reviewData
   * @param files
   * @returns
   */
  async createReview(
    reviewData: ReviewRequest,
    files: File[]
  ): Promise<Review> {
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

    const response = await apiClient.post<ApiResponse<Review>>(
      '/api/v1/view/reviews',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.data;
  },

  getMyReviews: async () => {
    return await serverApiRequest<ReviewListApi>(
      'GET',
      '/api/v1/mypage/reviews'
    );
  },
};
