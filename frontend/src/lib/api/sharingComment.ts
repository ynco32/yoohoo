import api from './axios';
import { AxiosError } from 'axios';
import { Comment } from '@/types/sharing';

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

export const sharingCommentAPI = {
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

  /**
   * 댓글을 작성합니다.
   * @param content - 댓글 내용
   * @param sharingId - 나눔 게시글 ID
   */
  createComment: async (
    sharingId: number,
    content: string
  ): Promise<Comment> => {
    try {
      const response = await api.post<Comment>('/api/v1/sharing/comment', {
        content,
        sharingId,
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        if (error.response.status === 400) {
          throw new ApiError(400, '댓글을 작성할 수 없습니다.');
        }
        if (error.response.status === 401) {
          throw new ApiError(401, '다시 로그인이 필요합니다.');
        }
        throw new ApiError(
          error.response.status,
          error.response.data?.message ?? '댓글 작성에 실패했습니다.'
        );
      }
      throw new ApiError(500, '서버와의 통신 중 오류가 발생했습니다.');
    }
  },

  /**
   * 댓글을 수정합니다.
   * @param commentId - 수정할 댓글 ID
   * @param content - 수정할 댓글 내용
   */
  updateComment: async (
    commentId: number,
    content: string
  ): Promise<Comment> => {
    try {
      const response = await api.put<Comment>(
        `/api/v1/sharing/comment/${commentId}`,
        { content }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        if (error.response.status === 400) {
          throw new ApiError(400, '댓글을 수정할 수 없습니다.');
        }
        if (error.response.status === 401) {
          throw new ApiError(401, '다시 로그인이 필요합니다.');
        }
        throw new ApiError(
          error.response.status,
          error.response.data?.message ?? '댓글 수정에 실패했습니다.'
        );
      }
      throw new ApiError(500, '서버와의 통신 중 오류가 발생했습니다.');
    }
  },
};
