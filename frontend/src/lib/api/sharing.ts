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
   * @param data - 게시글 데이터 (JSON)
   * @param file - 업로드할 이미지 파일
   */
  createSharing: async (
    data: Omit<SharingFormData, 'image'>,
    file: File
  ): Promise<number> => {
    try {
      const formData = new FormData();
      formData.append('sharingRequestDTO', JSON.stringify(data)); // 문자열로 추가
      formData.append('file', file);

      // FormData 내부 데이터 확인
      console.log('[API 요청] 전송할 FormData:');
      for (const [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value);
      }

      const response = await api.post<{ sharingId: number }>(
        '/api/v1/sharing',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data.sharingId; // sharingId 반환
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
   * @param data - 수정할 게시글 데이터 (제목, 내용, 위치, 시작 시간)
   */
  updateSharing: async (
    sharingId: number,
    data: {
      title: string;
      content: string;
      latitude: number;
      longitude: number;
      startTime: string;
    },
    image?: File
  ) => {
    const formData = new FormData();

    // JSON 데이터를 문자열로 추가
    formData.append(
      'sharingUpdateRequestDTO',
      JSON.stringify({
        title: data.title,
        content: data.content,
        latitude: data.latitude,
        longitude: data.longitude,
        startTime: data.startTime,
      })
    );

    // 이미지 파일이 있다면 추가
    if (image) {
      formData.append('file', image);
    }

    try {
      const response = await api.put(`/api/v1/sharing/${sharingId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      // 에러 처리 로직
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
   * @param lastSharingId - 마지막으로 불러온 나눔 게시글 ID
   */
  getScrapSharings: async (
    lastSharingId?: number
  ): Promise<SharingResponse> => {
    try {
      let url = '/api/v1/mypage/scrap';

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
};
