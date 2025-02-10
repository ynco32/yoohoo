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
import { useMswInit } from '@/hooks/useMswInit';

type ViewMode = 'list' | 'map';

const ITEMS_PER_PAGE = 10;

export const SharingView = () => {
  // 상태 관리
  const [allPosts, setAllPosts] = useState<SharingPost[]>([]);
  const [displayedPosts, setDisplayedPosts] = useState<SharingPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const { mswInitialized } = useMswInit();

  // refs
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  // URL 파라미터
  const params = useParams();
  const concertId =
    params.concertId !== undefined ? Number(params.concertId) : 0;

  // 뷰 모드
  const [viewMode, setViewMode] = useState<ViewMode>('map');

  // 모든 데이터 가져오기
  const fetchAllSharings = useCallback(async () => {
    if (!mswInitialized) return;
    setIsLoading(true);

    try {
      let allData: SharingPost[] = [];
      let lastId: number | undefined = undefined;
      let hasMoreData = true;

      while (hasMoreData) {
        const response = await sharingAPI.getSharings(concertId, lastId);

        // response.sharings 존재 여부와 배열 여부 체크
        if (!response?.sharings || !Array.isArray(response.sharings)) {
          console.error('Invalid data format:', response);
          break;
        }

        // 빈 배열 체크
        if (response.sharings.length === 0) {
          hasMoreData = false;
          break;
        }

        allData = [...allData, ...response.sharings];

        if (response.lastPage) {
          hasMoreData = false;
        } else {
          lastId = response.sharings[response.sharings.length - 1].sharingId;
        }
      }

      const formattedPosts = allData.map((post) => ({
        ...post,
        startTime: formatDateTime(post.startTime),
      }));

      setAllPosts(formattedPosts);
      setDisplayedPosts(formattedPosts.slice(0, ITEMS_PER_PAGE));
      setHasMore(formattedPosts.length > ITEMS_PER_PAGE);
    } catch (err) {
      console.error('Error fetching all sharings:', err);
    } finally {
      setIsLoading(false);
    }
  }, [concertId, mswInitialized]);

  // 초기 데이터 로드
  useEffect(() => {
    if (!mswInitialized) return; // MSW가 초기화되지 않았다면 실행하지 않음

    isInitialized.current = false; // 새로고침 시 초기화

    if (!isInitialized.current) {
      fetchAllSharings();
      isInitialized.current = true;
    }
  }, [mswInitialized, fetchAllSharings]);

  // 더 보기 핸들러 (리스트 뷰)
  const handleLoadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;

    const nextPage = currentPage + 1;
    const start = nextPage * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const nextPosts = allPosts.slice(start, end);

    if (nextPosts.length > 0) {
      setDisplayedPosts((prev) => [...prev, ...nextPosts]);
      setCurrentPage(nextPage);
      setHasMore(end < allPosts.length);
    } else {
      setHasMore(false);
    }
  }, [allPosts, currentPage, hasMore, isLoading]);

  // 뷰 모드 변경 핸들러
  const handleViewModeChange = useCallback(
    (newMode: ViewMode) => {
      setViewMode(newMode);
      if (newMode === 'map') {
        setDisplayedPosts(allPosts);
        setCurrentPage(0);
      } else {
        setDisplayedPosts(allPosts.slice(0, ITEMS_PER_PAGE));
        setHasMore(allPosts.length > ITEMS_PER_PAGE);
      }
    },
    [allPosts]
  );

  return (
    <div
      className={`${viewMode === 'map' ? '-mt-[56px] h-screen' : 'flex h-[calc(100vh-56px)] flex-col'}`}
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
        {viewMode === 'map' && (
          <SharingMap
            posts={displayedPosts}
            venueLocation={VENUE_COORDINATES.KSPO_DOME}
            concertId={concertId}
          />
        )}
        {viewMode === 'list' && (
          <SharingList
            posts={displayedPosts}
            concertId={concertId}
            isLoading={isLoading}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
          />
        )}
      </div>
      <WriteButton path={`/sharing/${concertId}/write`} />
    </div>
  );
};
