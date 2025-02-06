'use client';

/**
 * 공연 목록을 표시하는 컴포넌트
 * 무한 스크롤 기능 구현: 스크롤이 마지막 항목에 도달하면 추가 데이터를 자동으로 로드
 */
import { useEffect, useState, useRef, useCallback } from 'react';
import { ConcertItem } from './ConcertItem';
import { Concert, concertAPI } from '@/lib/api/concert';

export const ConcertList = () => {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터가 있는지 여부
  const [lastConcertId, setLastConcertId] = useState<number | undefined>(
    undefined
  ); // 마지막으로 불러온 공연의 ID

  // Intersection Observer 인스턴스를 저장할 ref
  const observer = useRef<IntersectionObserver | null>(null);

  /**
   * 공연 데이터를 불러오는 함수
   * - 초기 로드: lastConcertId가 undefined일 때 처음부터 데이터를 가져옴
   * - 추가 로드: lastConcertId 이후의 데이터를 가져와 기존 목록에 추가
   * - 데이터 상태 관리: 로딩 상태, 에러 처리, 추가 데이터 존재 여부를 관리
   */
  const fetchConcerts = useCallback(async () => {
    setIsLoading(true);
    try {
      // lastConcertId를 기준으로 다음 페이지 데이터 요청
      const response = await concertAPI.getConcerts(undefined, lastConcertId);

      // 새로운 데이터를 기존 배열에 추가
      setConcerts((prev) => [...prev, ...response.concerts]);
      // lastPage가 true면 hasMore를 false로 설정하여 추가 요청 중단
      setHasMore(!response.lastPage);

      // 다음 요청을 위해 마지막 공연의 ID 저장
      if (response.concerts.length > 0) {
        setLastConcertId(
          response.concerts[response.concerts.length - 1].concertId
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [lastConcertId]); // lastConcertId를 의존성으로 추가

  // 마지막 아이템이 화면에 보일 때 호출될 콜백
  // isLoading 중이거나 더 불러올 데이터가 없으면(hasMore가 false) 실행하지 않음
  const lastConcertElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchConcerts();
        }
      });

      if (node !== null && node !== undefined) {
        observer.current.observe(node);
      }
    },
    [isLoading, hasMore, fetchConcerts]
  );

  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    fetchConcerts();
  }, [fetchConcerts]);

  if (typeof error === 'string' && error.length > 0) {
    return <div className="py-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {concerts.map((concert, index) => (
        <div
          key={concert.concertId}
          // 마지막 아이템에 ref 설정하여 화면에 보이는지 감지
          ref={
            index === concerts.length - 1 ? lastConcertElementRef : undefined
          }
        >
          <ConcertItem {...concert} />
        </div>
      ))}
      {isLoading && <div className="py-4 text-center">로딩 중...</div>}
    </div>
  );
};
