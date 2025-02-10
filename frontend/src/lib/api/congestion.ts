import api from './axios';
import axios, { AxiosError } from 'axios';
import { LocationInfo, ProcessedCongestion } from '@/types/congestion';
import { processCongestionData } from '../utils/congestionProcessor';

export interface LocationResponse {
  locations: LocationInfo[];
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

export const congestionAPI = {
  getLocations: async (arenaId: number): Promise<LocationResponse> => {
    try {
      const url = `api/v1/congestion/${arenaId}`;

      const response = await api.get<LocationResponse>(url);

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        if (error.response.status === 401) {
          throw new ApiError(401, '다시 로그인이 필요합니다');
        }
      }
      throw new ApiError(500, '서버와의 통신 중 오류가 발생했습니다');
    }
  },

  getCongestionData: async (
    location: LocationInfo
  ): Promise<ProcessedCongestion> => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_SKT_API_URL ??
          `https://apis.openapi.sk.com/puzzle/place/congestion/rltm/pois/188633`,
        {
          params: {
            lat: location.latitude,
            lng: location.longitude,
          },
          headers: {
            Accept: 'application/json',
            appKey: process.env.NEXT_SKT_API_KEY || '',
          },
        }
      );

      const data = response.data;

      const processedData = processCongestionData(location, data);

      if (!processedData) {
        throw new Error('혼잡도 데이터를 찾을 수 없습니다');
      }

      return processedData;
    } catch (error) {
      console.error('혼잡도 데이터 조회 중 오류:', error);
      throw error;
    }
  },
};
