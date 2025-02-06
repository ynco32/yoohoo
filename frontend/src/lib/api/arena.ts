import api from './axios';
import { AxiosError } from 'axios';

export interface ArenaData {
  arenaId: number;
  arenaName: string;
  photoUrl: string;
}

export interface ArenaResponse {
  arenas: ArenaData[];
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

export const arenaAPI = {
  /**
   * 모든 공연장 정보를 가져옵니다.
   * @throws {ApiError} API 요청 실패 시 발생
   */
  getArenas: async (): Promise<ArenaResponse> => {
    // MSW 초기화가 완료된 후에만 요청을 보내도록 하기 위한 코드
    if (!window.mswInitialized) {
      return Promise.reject('MSW not initialized yet');
    }

    try {
      // axios 인스턴스의 baseURL이 설정되어 있으므로, 경로만 지정
      const response = await api.get<ArenaResponse>('/api/v1/view/arenas');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        // HTTP 에러인 경우
        const status = error.response?.status ?? 500;
        // 401 에러일 경우 처리를 위해 상세 로깅 추가
        if (status === 401) {
          console.error('Authentication error:', error.response?.data);
        }
        const message =
          error.response?.data?.message ??
          '공연장 정보를 불러오는데 실패했습니다.';
        throw new ApiError(status, message);
      }
      // 네트워크 에러 등 다른 에러인 경우
      throw new ApiError(500, '서버와의 통신 중 오류가 발생했습니다.');
    }
  },
};
