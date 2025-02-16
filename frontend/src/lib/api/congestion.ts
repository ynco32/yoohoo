import axios from 'axios';
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
  getCongestionData: async (
    location: LocationInfo
  ): Promise<ProcessedCongestion> => {
    try {
      const url = process.env.NEXT_PUBLIC_SKT_API_URL ?? ``;
      const appKey = process.env.NEXT_PUBLIC_SKT_API_KEY ?? '';

      const response = await axios.get(url, {
        params: {
          lat: location.latitude,
          lng: location.longitude,
        },
        headers: {
          Accept: 'application/json',
          appKey: appKey,
        },
      });

      const data = response.data;
      // const data = JSON.parse(`
      //   {
      //       "status": {
      //           "code": "00",
      //           "message": "success",
      //           "totalCount": 1
      //       },
      //       "contents": {
      //           "poiId": "188633",
      //           "poiName": "올림픽공원",
      //           "rltm": [
      //               {
      //                   "datetime": "20250206154000",
      //                   "congestion": 0.0070319381,
      //                   "congestionLevel": 1,
      //                   "type": 1
      //               },
      //               {
      //                   "datetime": "20250206160500",
      //                   "congestion": 0.0805,
      //                   "congestionLevel": 3,
      //                   "type": 2
      //               }
      //           ]
      //       }
      //   }
      //   `);

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
