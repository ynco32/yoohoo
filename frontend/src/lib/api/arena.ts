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
    try {
      // axios 인스턴스의 baseURL이 설정되어 있으므로, 경로만 지정
      const response = await api.get<ArenaResponse>('/v1/view/arenas');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        // HTTP 에러인 경우
        const status = error.response?.status ?? 500;
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
