import api from './axios';
import { AxiosError } from 'axios';
import { SharingPost } from '@/types/sharing';

export interface SharingResponse {
  sharings: SharingPost[];
  isLastPage: boolean;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const sharingAPI = {
  /**
   * 특정 공연의 나눔 게시글 목록을 가져옵니다.
   * @param concertId - 공연 ID
   * @param lastSharingId - 마지막으로 불러온 나눔 게시글 ID (페이지네이션)
   * @throws {ApiError} API 요청 실패 시 발생
   */
  getSharings: async (
    concertId: number,
    lastSharingId?: number
  ): Promise<SharingResponse> => {
    try {
      let url = `/api/v1/sharing/${concertId}`;

      if (typeof lastSharingId === 'number') {
        url += `?last=${lastSharingId}`;
      }

      const response = await api.get<SharingResponse>(url);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        if (error.response.status === 401) {
          console.error('Authentication error:', error.response.data);
          throw new ApiError(401, '다시 로그인이 필요합니다.');
        }
        throw new ApiError(
          error.response.status,
          error.response.data?.message ??
            '나눔 게시글을 불러오는데 실패했습니다.'
        );
      }
      throw new ApiError(500, '서버와의 통신 중 오류가 발생했습니다.');
    }
  },
};
