import api from './axios';
import { AxiosError } from 'axios';

export interface Concert {
  concertId: number;
  arenaId: number;
  concertName: string;
  artist: string;
  startTime: string;
  stageType: string;
}

export interface ConcertListResponse {
  concerts: Concert[];
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

export const concertAPI = {
  /**
   * 아티스트별 콘서트 목록을 조회합니다.
   * @param artist - 아티스트 이름 (선택사항)
   * @throws {ApiError} API 요청 실패 시 발생
   */
  getConcertsByArtist: async (
    artist?: string
  ): Promise<ConcertListResponse> => {
    try {
      let url = '/api/v1/view/concerts';
      const params = new URLSearchParams();

      if (typeof artist === 'string' && artist.trim().length > 0) {
        params.append('artist', artist);
      }

      const queryString = params.toString();
      if (queryString.length > 0) {
        url += `?${queryString}`;
      }

      const response = await api.get<ConcertListResponse>(url);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        if (error.response.status === 401) {
          throw new ApiError(401, '인증이 필요합니다.');
        }
        throw new ApiError(
          error.response.status,
          error.response.data?.message ??
            '콘서트 목록을 불러오는데 실패했습니다.'
        );
      }
      throw new ApiError(500, '서버와의 통신 중 오류가 발생했습니다.');
    }
  },
};
