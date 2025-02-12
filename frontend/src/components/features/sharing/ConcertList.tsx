'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { ConcertItem } from './ConcertItem';
import { Concert, concertAPI } from '@/lib/api/concert';
import { useMswInit } from '@/hooks/useMswInit';

interface ConcertListProps {
  searchTerm?: string;
}

export const ConcertList = ({ searchTerm = '' }: ConcertListProps) => {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastConcertId, setLastConcertId] = useState<number | undefined>(
    undefined
  );

  const observer = useRef<IntersectionObserver | null>(null);
  const isFetching = useRef(false);
  const isInitialized = useRef(false);
  const lastElementRef = useRef<HTMLDivElement | null>(null);

  // MSW 초기화 상태
  const { mswInitialized } = useMswInit();

  const filteredConcerts = concerts.filter((concert) =>
    concert.concertName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * 공연 데이터를 불러오는 함수
   */
  const fetchConcerts = useCallback(async () => {
    if (!mswInitialized) {
      console.log('MSW 초기화 대기 중 - API 호출 스킵');
      return;
    }

    if (!hasMore || isFetching.current) {
      console.log('fetchConcerts 실행 중단: 조건 미충족', {
        isFetching: isFetching.current,
        hasMore,
      });
      return;
    }

    isFetching.current = true;
    setIsLoading(true);

    try {
      console.log('API 호출 시작');
      const response = await concertAPI.getConcerts(undefined, lastConcertId);
      console.log('ConcertList - API Response:', response);

      const isLastPage = response.lastPage;
      setHasMore(!isLastPage);

      if (response.concerts.length > 0) {
        setLastConcertId(
          response.concerts[response.concerts.length - 1].concertId
        );
      }

      setConcerts((prev) => {
        const merged = [...prev, ...response.concerts];
        const uniqueConcerts = Array.from(
          new Map(merged.map((item) => [item.concertId, item])).values()
        );
        return uniqueConcerts;
      });

      if (isLastPage) {
        console.log('마지막 페이지에 도달했습니다.');
      }
    } catch (err) {
      console.error('ConcertList - Error fetching concerts:', err);
      setError(
        err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.'
      );
    } finally {
      console.log('API 호출 완료, 로딩 상태 해제');
      setIsLoading(false);
      isFetching.current = false;
    }
  }, [lastConcertId, hasMore, mswInitialized]);

  /**
   * Intersection Observer 설정
   */
  const setupIntersectionObserver = useCallback(() => {
    if (observer.current) {
      observer.current.disconnect();
    }

    if (!lastElementRef.current) return;

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching.current && hasMore) {
          console.log('Intersection Observer triggered');
          fetchConcerts();
        }
      },
      {
        rootMargin: '0px 0px 200px 0px',
      }
    );

    observer.current.observe(lastElementRef.current);
  }, [fetchConcerts, hasMore]);

  /**
   * 마지막 요소 ref 콜백
   */
  const lastConcertElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      lastElementRef.current = node;
      setupIntersectionObserver();
    },
    [setupIntersectionObserver]
  );

  /**
   * 초기 데이터 로드
   */
  useEffect(() => {
    if (!isInitialized.current) {
      if (!mswInitialized) {
        console.log('MSW 초기화 대기 중 - 초기 데이터 로드 스킵');
        return;
      }

      isInitialized.current = true;
      console.log('ConcertList - Component mounted, starting data fetch');
      fetchConcerts();
    }
  }, [fetchConcerts, mswInitialized]);

  /**
   * Cleanup: 컴포넌트 언마운트 시 Observer 해제
   */
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  /**
   * 에러 처리
   */
  if (typeof error === 'string' && error.length > 0) {
    return <div className="py-4 text-center text-red-500">{error}</div>;
  }

  /**
   * 렌더링
   */
  return (
    <div className="space-y-4">
      {filteredConcerts.map((concert, index) => (
        <div
          key={concert.concertId}
          ref={
            index === filteredConcerts.length - 1
              ? lastConcertElementRef
              : undefined
          }
        >
          <ConcertItem {...concert} />
        </div>
      ))}
      {isLoading && <div className="py-4 text-center">로딩 중...</div>}
      {!isLoading && filteredConcerts.length === 0 && (
        <div className="py-4 text-center text-gray-500">
          검색 결과가 없습니다.
        </div>
      )}
    </div>
  );
};
