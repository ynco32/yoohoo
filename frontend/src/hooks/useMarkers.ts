import { useState, useEffect } from 'react';
import { MarkerCategory, Marker, CATEGORY_LABELS } from '@/types/marker';
import { getAllMarkers } from '@/api/place/placeApi';

interface UseMarkersResult {
  markers: Marker[];
  loading: boolean;
  error: Error | null;
  categories: MarkerCategory[];
  categoryLabels: Record<MarkerCategory, string>;
  activeCategory: MarkerCategory;
  setActiveCategory: (category: MarkerCategory) => void;
}

/**
 * 경기장의 마커 정보를 관리하는 훅
 * @param arenaId 경기장 ID
 * @returns 마커 관련 상태와 함수들
 */
export default function useMarkers(arenaId: string | number): UseMarkersResult {
  const [markersMap, setMarkersMap] = useState<
    Record<MarkerCategory, Marker[]>
  >({
    TOILET: [],
    CONVENIENCE: [],
    STORAGE: [],
    TICKET: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeCategory, setActiveCategory] =
    useState<MarkerCategory>('TOILET');

  // 카테고리 목록
  const categories: MarkerCategory[] = [
    'TOILET',
    'CONVENIENCE',
    'STORAGE',
    'TICKET',
  ];

  // 마커 데이터 가져오기
  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        setLoading(true);
        const data = await getAllMarkers(arenaId);
        setMarkersMap(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('마커 데이터를 가져오는 중 오류가 발생했습니다.')
        );
      } finally {
        setLoading(false);
      }
    };

    if (arenaId) {
      fetchMarkers();
    }
  }, [arenaId]);

  // 활성 카테고리의 마커들
  const markers = markersMap[activeCategory] || [];

  return {
    markers,
    loading,
    error,
    categories,
    categoryLabels: CATEGORY_LABELS,
    activeCategory,
    setActiveCategory,
  };
}
