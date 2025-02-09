import api from './axios';
import { AxiosError } from 'axios';
import { SharingPost } from '@/types/sharing';

export interface SharingResponse {
  sharings: SharingPost[];
  isLastPage: boolean;
}

export interface GetSharingsOptions {
  usePagination?: boolean;
  lastSharingId?: number;
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
   * 나눔 게시글 목록을 가져옵니다.
   * @param concertId - 공연 ID
   * @param options - 옵션 (페이지네이션 사용 여부, 마지막 게시글 ID)
   */
  getSharings: async (
    concertId: number,
    options: GetSharingsOptions = {}
  ): Promise<SharingResponse> => {
    try {
      const params = new URLSearchParams();

      if (options.usePagination) {
        params.append('paginate', 'true');
        if (typeof options.lastSharingId === 'number') {
          params.append('last', String(options.lastSharingId));
        }
      }

      const url = `/api/v1/sharing/${concertId}${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get<SharingResponse>(url);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        if (error.response.status === 401) {
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
