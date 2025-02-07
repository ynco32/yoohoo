'use client';

import { useParams } from 'next/navigation';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ViewModeToggle } from './ViewModeToggle';
import { SharingList } from './SharingList';
import { SharingMap } from './SharingMap';
import { SharingPost } from '@/types/sharing';
import { VENUE_COORDINATES } from '@/lib/constans/venues';
import { WriteButton } from '@/components/common/WriteButton';
import { formatDateTime } from '@/lib/utils/dateFormat';
import { sharingAPI } from '@/lib/api/sharing';

type ViewMode = 'list' | 'map';

const SKIP_MSW_CHECK = false;

export const SharingView = () => {
  // 지도와 리스트 각각의 상태 관리
  const [mapPosts, setMapPosts] = useState<SharingPost[]>([]);
  const [listPosts, setListPosts] = useState<SharingPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastSharingId, setLastSharingId] = useState<number | undefined>(
    undefined
  );
  const [mswInitialized, setMswInitialized] = useState(false);

  // refs
  const containerRef = useRef<HTMLDivElement>(null);
  const isFetching = useRef(false);
  const isInitialized = useRef(false);

  // URL 파라미터에서 공연 ID 추출
  const params = useParams();
  const concertId =
    params.concertId !== undefined ? Number(params.concertId) : 0;

  // 뷰 모드 상태 관리
  const [viewMode, setViewMode] = useState<ViewMode>('map');

  // MSW 초기화 체크
  useEffect(() => {
    if (SKIP_MSW_CHECK) {
      setMswInitialized(true);
      return;
    }

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

  // 지도용 전체 데이터 가져오기
  const fetchMapSharings = useCallback(async () => {
    if (!SKIP_MSW_CHECK && !mswInitialized) return;

    setIsLoading(true);
    try {
      // 지도용은 전체 데이터를 한 번에 가져옴
      const response = await sharingAPI.getAllSharings(concertId);
      setMapPosts(response.sharings);
    } catch (err) {
      console.error('Error fetching map sharing posts:', err);
      setError(
        err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [concertId, mswInitialized]);

  // 리스트용 페이지네이션 데이터 가져오기
  const fetchListSharings = useCallback(async () => {
    if (!SKIP_MSW_CHECK && !mswInitialized) return;
    if (!hasMore || isFetching.current) return;

    isFetching.current = true;
    setIsLoading(true);

    try {
      const response = await sharingAPI.getSharings(concertId, lastSharingId);
      setHasMore(!response.isLastPage);

      if (response.sharings.length > 0) {
        setLastSharingId(
          response.sharings[response.sharings.length - 1].sharingId
        );
      }

      setListPosts((prev) => {
        const merged = [...prev, ...response.sharings];
        return Array.from(
          new Map(merged.map((item) => [item.sharingId, item])).values()
        );
      });
    } catch (err) {
      console.error('Error fetching list sharing posts:', err);
      setError(
        err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.'
      );
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  }, [concertId, lastSharingId, hasMore, mswInitialized]);

  // 뷰 모드 변경 핸들러
  const handleViewModeChange = useCallback(
    (newMode: ViewMode) => {
      setViewMode(newMode);
      // 모드 변경 시 해당 모드의 데이터가 없으면 가져오기
      if (newMode === 'map' && mapPosts.length === 0) {
        fetchMapSharings();
      } else if (newMode === 'list' && listPosts.length === 0) {
        fetchListSharings();
      }
    },
    [fetchMapSharings, fetchListSharings, mapPosts.length, listPosts.length]
  );

  // 초기 데이터 로드
  useEffect(() => {
    if (!isInitialized.current) {
      if (!SKIP_MSW_CHECK && !mswInitialized) return;

      isInitialized.current = true;
      if (viewMode === 'map') {
        fetchMapSharings();
      } else {
        fetchListSharings();
      }
    }
  }, [viewMode, fetchMapSharings, fetchListSharings, mswInitialized]);

  // 스크롤 리셋
  const resetScroll = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, []);

  // 에러 처리
  if (error !== null && error !== undefined && error !== '') {
    return <div className="py-4 text-center text-red-500">{error}</div>;
  }

  // 현재 뷰 모드에 따른 게시글 데이터 선택 및 포맷팅
  const currentPosts = (viewMode === 'map' ? mapPosts : listPosts).map(
    (post) => ({
      ...post,
      startTime: formatDateTime(post.startTime),
    })
  );

  return (
    <div
      className={`${
        viewMode === 'map'
          ? '-mt-[56px] h-screen'
          : 'flex h-[calc(100vh-56px)] flex-col'
      }`}
    >
      <div
        className={viewMode === 'map' ? 'absolute top-[56px] z-10 p-4' : 'p-4'}
      >
        <ViewModeToggle
          viewMode={viewMode}
          onModeChange={handleViewModeChange}
        />
      </div>

      <div
        ref={containerRef}
        className={`${viewMode === 'map' ? 'h-full' : 'flex-1 overflow-auto'}`}
      >
        {viewMode === 'list' && (
          <SharingList
            posts={currentPosts}
            onMount={resetScroll}
            concertId={concertId}
            isLoading={isLoading}
            hasMore={hasMore}
            onLoadMore={fetchListSharings}
          />
        )}
        {viewMode === 'map' && (
          <SharingMap
            posts={currentPosts}
            venueLocation={VENUE_COORDINATES.KSPO_DOME}
            concertId={concertId}
          />
        )}
      </div>
      {isLoading && <div className="py-4 text-center">로딩 중...</div>}
      <WriteButton path={`/sharing/${concertId}/write`} />
    </div>
  );
};
