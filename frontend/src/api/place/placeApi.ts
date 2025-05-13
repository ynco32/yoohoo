import { apiClient } from '../api';
import { Marker, MarkerCategory, MarkersResponse } from '@/types/marker';

/**
 * 특정 경기장과 카테고리의 마커 정보를 가져오는 함수
 * @param arenaId 경기장 ID
 * @param category 마커 카테고리
 * @returns 마커 목록
 */
export const getMarkersByCategory = async (
  arenaId: string | number,
  category?: MarkerCategory
): Promise<Marker[]> => {
  try {
    const params: Record<string, string> = { arena: arenaId.toString() };

    // 카테고리가 지정된 경우에만 추가
    if (category) {
      params.category = category;
    }

    const response = await apiClient.get<MarkersResponse>(
      '/api/v1/place/markers',
      {
        params,
      }
    );

    // 에러 확인
    if (response.data.error && response.data.error.name) {
      console.error('API 에러:', response.data.error.message);
      return [];
    }

    return response.data.data.markers;
  } catch (error) {
    console.error('마커 정보를 가져오는데 실패했습니다:', error);
    return [];
  }
};

/**
 * 모든 카테고리의 마커 정보를 가져오는 함수
 * @param arenaId 경기장 ID
 * @returns 카테고리별 마커 맵
 */
export const getAllMarkers = async (
  arenaId: string | number
): Promise<Record<MarkerCategory, Marker[]>> => {
  try {
    const response = await apiClient.get<MarkersResponse>(
      `/api/v1/place/markers`,
      {
        params: { arena: arenaId.toString() },
      }
    );

    // 에러 확인
    if (response.data.error && response.data.error.name) {
      console.error('API 에러:', response.data.error.message);
      return {
        TOILET: [],
        CONVENIENCE: [],
        STORAGE: [],
        TICKET: [],
      };
    }

    // 카테고리별로 마커 분류
    const markers = response.data.data.markers;
    const result: Partial<Record<MarkerCategory, Marker[]>> = {};

    // 기본값 설정
    const categories: MarkerCategory[] = [
      'TOILET',
      'CONVENIENCE',
      'STORAGE',
      'TICKET',
    ];
    categories.forEach((category) => {
      result[category] = [];
    });

    // 마커 분류
    markers.forEach((marker) => {
      if (result[marker.category]) {
        result[marker.category]!.push(marker);
      }
    });

    return result as Record<MarkerCategory, Marker[]>;
  } catch (error) {
    console.error('마커 정보를 가져오는데 실패했습니다:', error);
    return {
      TOILET: [],
      CONVENIENCE: [],
      STORAGE: [],
      TICKET: [],
    };
  }
};
