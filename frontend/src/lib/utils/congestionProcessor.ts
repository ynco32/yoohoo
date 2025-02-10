import {
  ApiResponse,
  LocationInfo,
  ProcessedCongestion,
} from '@/types/congestion';

export const processCongestionData = (
  location: LocationInfo,
  data: ApiResponse
): ProcessedCongestion | null => {
  try {
    const targetData = data.contents.rltm.find((item) => item.type === 2);

    if (!targetData) {
      return null;
    }

    const locationNumber: number = location.locationNumber;
    const latitude: number = location.latitude;
    const longitude: number = location.longitude;
    const congestion: number = targetData.congestion;
    const congestionLevel: number = targetData.congestionLevel;

    return {
      locationNumber,
      latitude,
      longitude,
      congestion,
      congestionLevel,
    };
  } catch (error) {
    console.error('데이터 처리 중 오류 발생:', error);
    return null;
  }
};
