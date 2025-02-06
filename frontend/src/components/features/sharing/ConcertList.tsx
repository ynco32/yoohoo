'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { ConcertItem } from './ConcertItem';
import { Concert, concertAPI } from '@/lib/api/concert';

export const ConcertList = () => {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastConcertId, setLastConcertId] = useState<number | undefined>(
    undefined
  );
  const [mswInitialized, setMswInitialized] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);
  const isFetching = useRef(false);
  const isInitialized = useRef(false);
  const lastElementRef = useRef<HTMLDivElement | null>(null);

  /**
   * MSW 초기화 상태 확인
   */
  useEffect(() => {
    if (window.mswInitialized) {
      setMswInitialized(true);
    } else {
      const interval = setInterval(() => {
        if (window.mswInitialized) {
          setMswInitialized(true);
          clearInterval(interval);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, []);

  /**
   * 공연 데이터를 불러오는 함수
   */
  const fetchConcerts = useCallback(async () => {
    if (!hasMore || !mswInitialized || isFetching.current) {
      console.log('fetchConcerts 실행 중단: 조건 미충족', {
        mswInitialized,
        isFetching: isFetching.current,
        hasMore,
        reason: !hasMore ? '더 이상 불러올 데이터 없음' : '기타 조건',
      });
      return;
    }

    isFetching.current = true;
    setIsLoading(true);

    try {
      const response = await concertAPI.getConcerts(undefined, lastConcertId);
      console.log('ConcertList - API Response:', response);

      // 마지막 페이지 상태를 먼저 업데이트
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

      // 마지막 페이지일 경우 명시적 로그 추가
      if (isLastPage) {
        console.log('마지막 페이지에 도달했습니다.');
      }
    } catch (err) {
      console.error('ConcertList - Error fetching concerts:', err);
      setError(
        err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.'
      );
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  }, [lastConcertId, hasMore, mswInitialized]);

  /**
   * Intersection Observer 설정
   */
  const setupIntersectionObserver = useCallback(() => {
    // 기존 옵저버 해제
    if (observer.current) {
      observer.current.disconnect();
    }

    // 마지막 요소가 없으면 중단
    if (!lastElementRef.current) return;

    // 새 옵저버 생성
    observer.current = new IntersectionObserver(
      (entries) => {
        // 마지막 요소가 뷰포트에 들어오고, 현재 fetching 중이 아니며, 더 불러올 데이터가 있을 때
        if (entries[0].isIntersecting && !isFetching.current && hasMore) {
          console.log('Intersection Observer triggered');
          fetchConcerts();
        }
      },
      {
        rootMargin: '0px 0px 200px 0px',
      }
    );

    // 마지막 요소 관찰 시작
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
    if (!isInitialized.current && mswInitialized) {
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
      {concerts.map((concert, index) => (
        <div
          key={concert.concertId}
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
