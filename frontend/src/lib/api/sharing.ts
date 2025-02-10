import api from './axios';
import { AxiosError } from 'axios';
import { SharingPost, Comment } from '@/types/sharing';

export interface SharingResponse {
  sharings: SharingPost[];
  lastPage: boolean;
}

export interface CommentResponse {
  comments: Comment[];
  lastPage: boolean;
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
   * @param lastSharingId - 마지막으로 불러온 나눔 게시글 ID (페이지네이션)
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

  /**
   * 나눔 게시글 상세 정보를 가져옵니다.
   * @param sharingId - 나눔 게시글 ID
   */
  getSharingDetail: async (sharingId: number): Promise<SharingPost> => {
    try {
      const response = await api.get<SharingPost>(
        `/api/v1/sharing/detail/${sharingId}`
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        if (error.response.status === 401) {
          throw new ApiError(401, '다시 로그인이 필요합니다.');
        }
        throw new ApiError(
          error.response.status,
          error.response.data?.message ?? '게시글을 불러오는데 실패했습니다.'
        );
      }
      throw new ApiError(500, '서버와의 통신 중 오류가 발생했습니다.');
    }
  },

  /**
   * 댓글 목록을 가져옵니다.
   * @param sharingId - 나눔 게시글 ID
   * @param lastCommentId - 마지막으로 불러온 댓글 ID (페이지네이션)
   */
  getComments: async (
    sharingId: number,
    lastCommentId?: number
  ): Promise<CommentResponse> => {
    try {
      let url = `/api/v1/sharing/${sharingId}/comment`;

      if (typeof lastCommentId === 'number') {
        url += `?last=${lastCommentId}`;
      }

      const response = await api.get<CommentResponse>(url);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        // 400: 잘못된 요청 (게시글이나 사용자를 찾을 수 없음)
        if (error.response.status === 400) {
          throw new ApiError(400, '댓글을 불러올 수 없습니다.');
        }
        // 401: 인증 토큰 만료 또는 유효하지 않음
        if (error.response.status === 401) {
          throw new ApiError(401, '다시 로그인이 필요합니다.');
        }
        // 기타 에러
        throw new ApiError(
          error.response.status,
          error.response.data?.message ?? '댓글을 불러오는데 실패했습니다.'
        );
      }
      // 서버 연결 실패 등
      throw new ApiError(500, '서버와의 통신 중 오류가 발생했습니다.');
    }
  },
};
