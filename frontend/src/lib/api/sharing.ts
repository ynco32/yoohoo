import api from './axios';
import { AxiosError } from 'axios';
import { SharingPost, SharingFormData, SharingStatus } from '@/types/sharing';

export interface SharingResponse {
  sharings: SharingPost[];
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
   * 나눔 게시글을 등록합니다.
   * @param data - 게시글 데이터 (전체 데이터)
   * @param file - 업로드할 이미지 파일
   */
  createSharing: async (data: SharingFormData, file: File): Promise<number> => {
    try {
      const formData = new FormData();

      // JSON 데이터를 Blob으로 변환하여 FormData에 추가
      formData.append(
        'sharingRequestDTO',
        new Blob([JSON.stringify(data)], { type: 'application/json' })
      );

      // 이미지 파일 추가
      formData.append('file', file, file.name);

      // Content-Type은 브라우저가 자동으로 multipart/form-data로 설정
      const response = await api.post<{ sharingId: number }>(
        '/api/v1/sharing',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data.sharingId;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        if (error.response.status === 401) {
          throw new ApiError(401, '다시 로그인이 필요합니다.');
        }
        throw new ApiError(
          error.response.status,
          error.response.data?.message ?? '게시글 등록에 실패했습니다.'
        );
      }
      throw new ApiError(500, '서버와의 통신 중 오류가 발생했습니다.');
    }
  },

  /**
   * 나눔 게시글을 수정합니다.
   * @param sharingId - 수정할 나눔 게시글 ID
   * @param data - 수정할 게시글 데이터
   * @param image - 업로드할 이미지 파일
   */
  updateSharing: async (
    sharingId: number,
    data: SharingFormData,
    image?: File
  ) => {
    try {
      const formData = new FormData();

      // JSON 데이터를 Blob으로 변환하여 FormData에 추가
      formData.append(
        'sharingUpdateRequestDTO',
        new Blob([JSON.stringify(data)], { type: 'application/json' })
      );

      // 이미지 파일이 있을 경우 추가
      if (image) {
        formData.append('file', image, image.name);
      }

      // Content-Type은 브라우저가 자동으로 multipart/form-data로 설정
      const response = await api.put(`/api/v1/sharing/${sharingId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        if (error.response.status === 401) {
          throw new ApiError(401, '다시 로그인이 필요합니다.');
        }
        throw new ApiError(
          error.response.status,
          error.response.data?.message ?? '게시글 수정에 실패했습니다.'
        );
      }
      throw new ApiError(500, '서버와의 통신 중 오류가 발생했습니다.');
    }
  },

  /**
   * 나눔 게시글의 상태를 변경합니다.
   * @param sharingId - 나눔 게시글 ID
   * @param status - 변경할 상태 (UPCOMING, ONGOING, CLOSED)
   */
  updateSharingStatus: async (
    sharingId: number,
    status: SharingStatus
  ): Promise<void> => {
    try {
      await api.put(`/api/v1/sharing/${sharingId}/status`, { status });
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        if (error.response.status === 401) {
          throw new ApiError(401, '다시 로그인이 필요합니다.');
        }
        throw new ApiError(
          error.response.status,
          error.response.data?.message ?? '상태 변경에 실패했습니다.'
        );
      }
      throw new ApiError(500, '서버와의 통신 중 오류가 발생했습니다.');
    }
  },

  /**
   * 나눔 게시글을 삭제합니다.
   * @param sharingId - 삭제할 나눔 게시글 ID
   */
  deleteSharing: async (sharingId: number): Promise<void> => {
    try {
      await api.delete(`/api/v1/sharing/${sharingId}`);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        if (error.response.status === 401) {
          throw new ApiError(401, '다시 로그인이 필요합니다.');
        }
        throw new ApiError(
          error.response.status,
          error.response.data?.message ?? '게시글 삭제에 실패했습니다.'
        );
      }
      throw new ApiError(500, '서버와의 통신 중 오류가 발생했습니다.');
    }
  },

  /**
   * 나눔 게시글을 스크랩합니다.
   * @param sharingId - 나눔 게시글 ID
   * @returns Promise<{ isScraped: boolean }> - 스크랩 상태
   */
  addScrap: async (sharingId: number): Promise<{ isScraped: boolean }> => {
    try {
      const response = await api.post<{ isScraped: boolean }>(
        `/api/v1/sharing/${sharingId}/scrap`
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        if (error.response.status === 401) {
          throw new ApiError(401, '다시 로그인이 필요합니다.');
        }
        throw new ApiError(
          error.response.status,
          error.response.data?.message ?? '스크랩 처리에 실패했습니다.'
        );
      }
      throw new ApiError(500, '서버와의 통신 중 오류가 발생했습니다.');
    }
  },

  /**
   * 나눔 게시글 스크랩을 취소합니다.
   * @param sharingId - 나눔 게시글 ID
   * @returns Promise<{ isScraped: boolean }> - 스크랩 상태
   */
  deleteScrap: async (sharingId: number): Promise<{ isScraped: boolean }> => {
    try {
      const response = await api.delete<{ isScraped: boolean }>(
        `/api/v1/sharing/${sharingId}/scrap`
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        if (error.response.status === 401) {
          throw new ApiError(401, '다시 로그인이 필요합니다.');
        }
        throw new ApiError(
          error.response.status,
          error.response.data?.message ?? '스크랩 삭제에 실패했습니다.'
        );
      }
      throw new ApiError(500, '서버와의 통신 중 오류가 발생했습니다.');
    }
  },

  /**
   * 스크랩한 게시글 목록을 가져옵니다.
   * @param concertId - 공연 ID
   * @param lastSharingId - 마지막으로 불러온 나눔 게시글 ID
   */
  getScrapSharings: async (
    concertId: number,
    lastSharingId?: number
  ): Promise<SharingResponse> => {
    try {
      let url = `/api/v1/sharing/scrap/${concertId}`;

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
            '스크랩 목록을 불러오는데 실패했습니다.'
        );
      }
      throw new ApiError(500, '서버와의 통신 중 오류가 발생했습니다.');
    }
  },

  /**
   * 로그인한 유저가 작성한 나눔 게시글 목록을 가져옵니다.
   * @param concertId - 공연 ID
   * @param lastSharingId - 마지막으로 불러온 나눔 게시글 ID (페이지네이션)
   */
  getWroteSharings: async (
    concertId: number,
    lastSharingId?: number
  ): Promise<SharingResponse> => {
    try {
      let url = `/api/v1/sharing/wrote/${concertId}`;

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
            '작성한 게시글을 불러오는데 실패했습니다.'
        );
      }
      throw new ApiError(500, '서버와의 통신 중 오류가 발생했습니다.');
    }
  },
};
