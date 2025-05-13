import { useState, useEffect } from 'react';
import { arenaApi } from '@/api/sight/arena';
import { SectionSeatsApi } from '@/types/arena';

export const useSeatMap = (arenaId: string, sectionId: string) => {
  const [seatData, setSeatData] = useState<SectionSeatsApi | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeatData = async () => {
      try {
        setIsLoading(true);
        const response = await arenaApi.getSectionSeats(arenaId, sectionId);
        setSeatData(response.data.data);
        setError(null);
      } catch (err) {
        setError('좌석 정보를 불러오는데 실패했습니다.');
        console.error('좌석 데이터 로딩 에러:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeatData();
  }, [arenaId, sectionId]);

  return { seatData, isLoading, error };
}; 