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
  const prevSearchTermRef = useRef(searchTerm);

  // MSW 초기화 상태
  const { mswInitialized } = useMswInit();

  /**
   * 공연 데이터를 불러오는 함수
   */
  const fetchConcerts = useCallback(
    async (isNewSearch: boolean = false) => {
      if (!mswInitialized) {
        console.log('MSW 초기화 대기 중 - API 호출 스킵');
        return;
      }

      // 새로운 검색일 때는 hasMore 체크 스킵
      if (!isNewSearch && (!hasMore || isFetching.current)) {
        console.log('fetchConcerts 실행 중단: 조건 미충족', {
          isFetching: isFetching.current,
          hasMore,
        });
        return;
      }

      isFetching.current = true;
      setIsLoading(true);

      try {
        console.log('API 호출 시작', {
          searchTerm,
          lastConcertId: isNewSearch ? undefined : lastConcertId,
        });
        const response = await concertAPI.getConcerts(
          searchTerm || undefined,
          isNewSearch ? undefined : lastConcertId
        );

        const isLastPage = response.lastPage;
        setHasMore(!isLastPage);

        if (response.concerts.length > 0) {
          setLastConcertId(
            response.concerts[response.concerts.length - 1].concertId
          );
        }

        setConcerts((prev) => {
          if (isNewSearch) {
            return response.concerts;
          }
          const merged = [...prev, ...response.concerts];
          const uniqueConcerts = Array.from(
            new Map(merged.map((item) => [item.concertId, item])).values()
          );
          return uniqueConcerts;
        });
      } catch (err) {
        console.error('ConcertList - Error fetching concerts:', err);
        setError(
          err instanceof Error
            ? err.message
            : '데이터를 불러오는데 실패했습니다.'
        );
      } finally {
        setIsLoading(false);
        isFetching.current = false;
      }
    },
    [lastConcertId, hasMore, mswInitialized, searchTerm]
  );
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

  // 검색어 변경 시 상태 초기화 및 검색 실행을 위한 훅
  useEffect(() => {
    const executeSearch = async () => {
      // 기존 검색과 동일한 경우 스킵
      if (searchTerm === prevSearchTermRef.current) {
        return;
      }

      // 새로운 검색 시작
      prevSearchTermRef.current = searchTerm;

      // 먼저 모든 상태를 초기화
      setLastConcertId(undefined);
      setHasMore(true);
      setConcerts([]);
      isFetching.current = false;

      // 상태 초기화가 완료된 후 검색 실행을 위해 짧은 지연 추가
      await new Promise((resolve) => setTimeout(resolve, 0));
      if (mswInitialized) {
        fetchConcerts(true);
      }
    };

    executeSearch();
  }, [searchTerm, fetchConcerts, mswInitialized]);

  // 초기 데이터 로드를 위한 훅
  useEffect(() => {
    if (!isInitialized.current && mswInitialized) {
      isInitialized.current = true;
      fetchConcerts(true);
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
    <div className="space-y-4 pt-1">
      {concerts.map((concert, index) => (
        <div
          key={concert.concertId}
          ref={
            index === concerts.length - 1 ? lastConcertElementRef : undefined
          }
          className="relative z-0"
        >
          <ConcertItem {...concert} />
        </div>
      ))}
      {isLoading && <div className="py-4 text-center">로딩 중...</div>}
      {!isLoading && concerts.length === 0 && (
        <div className="py-4 text-center text-gray-500">
          검색 결과가 없습니다.
        </div>
      )}
    </div>
  );
};
