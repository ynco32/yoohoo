import api from './axios';
import { AxiosError } from 'axios';

export interface Concert {
  concertId: number;
  concertName: string;
  artist: string;
  startTime: string;
  stageType: string;
  arena: string;
}

export interface ConcertResponse {
  concerts: Concert[];
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

export const concertAPI = {
  /**
   * 공연 목록을 가져옵니다.
   * @param searchWord - 검색어 (선택사항)
   * @param lastConcertId - 마지막으로 불러온 공연 ID (페이지네이션)
   * @throws {ApiError} API 요청 실패 시 발생
   */
  getConcerts: async (
    searchWord?: string,
    lastConcertId?: number
  ): Promise<ConcertResponse> => {
    try {
      let url = '/api/v1/concert';
      const params = new URLSearchParams();

      // null, undefined, 빈 문자열 체크 명시적으로 수행
      if (typeof searchWord === 'string' && searchWord.trim().length > 0) {
        params.append('value', searchWord);
      }
      if (typeof lastConcertId === 'number') {
        params.append('last', lastConcertId.toString());
      }

      const queryString = params.toString();
      if (queryString.length > 0) {
        url += `?${queryString}`;
      }

      const response = await api.get<ConcertResponse>(url);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        if (error.response.status === 401) {
          // 인증 토큰이 만료되었거나, refresh token도 만료된 경우
          console.error('Authentication error:', error.response.data);
          throw new ApiError(401, '다시 로그인이 필요합니다.');
        }
        // 기타 API 에러의 경우
        throw new ApiError(
          error.response.status,
          error.response.data?.message ?? '공연 정보를 불러오는데 실패했습니다.'
        );
      }
      // 네트워크 에러 등 서버 응답을 받지 못한 경우
      throw new ApiError(500, '서버와의 통신 중 오류가 발생했습니다.');
    }
  },
};
