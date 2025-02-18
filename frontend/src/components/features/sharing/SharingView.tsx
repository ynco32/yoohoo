'use client';

import { ViewTabItem } from '@/types/sharing';
import { useParams } from 'next/navigation';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ViewTab } from './ViewTap';
import { SharingList } from './SharingList';
import { SharingMap } from './SharingMap';
import { SharingPost } from '@/types/sharing';
import { VENUE_COORDINATES } from '@/lib/constants/venues';
import { formatDateTime } from '@/lib/utils/dateFormat';
import { sharingAPI } from '@/lib/api/sharing';
import { useMswInit } from '@/hooks/useMswInit';
import { BottomControls } from './BottomControls';

type ViewMode = 'list' | 'map';

const ITEMS_PER_PAGE = 10;

export const SharingView = () => {
  // 상태 관리
  const [allPosts, setAllPosts] = useState<SharingPost[]>([]);
  const [displayedPosts, setDisplayedPosts] = useState<SharingPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentTab, setCurrentTab] = useState<ViewTabItem | null>(null);
  const { mswInitialized } = useMswInit();

  // refs
  const containerRef = useRef<HTMLDivElement>(null);

  // URL 파라미터
  const params = useParams();
  const concertId =
    params.concertId !== undefined ? Number(params.concertId) : 0;

  // 뷰 모드
  const [viewMode, setViewMode] = useState<ViewMode>('map');

  // 모든 데이터 가져오기
  const fetchData = useCallback(async () => {
    if (!mswInitialized) return;
    setIsLoading(true);

    try {
      let allData: SharingPost[] = [];
      let lastId: number | undefined = undefined;
      let hasMoreData = true;

      while (hasMoreData) {
        let response;

        switch (currentTab) {
          case 'scrap':
            response = await sharingAPI.getScrapSharings(concertId, lastId);
            break;
          case 'my':
            response = await sharingAPI.getWroteSharings(concertId, lastId);
            break;
          default:
            response = await sharingAPI.getSharings(concertId, lastId);
        }

        if (!response?.sharings || !Array.isArray(response.sharings)) {
          console.error('Invalid data format:', response);
          break;
        }

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
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [concertId, mswInitialized, currentTab]);

  // 초기 데이터 로드
  useEffect(() => {
    if (!mswInitialized) return;

    setCurrentPage(0);
    fetchData();
  }, [mswInitialized, currentTab, fetchData]);

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
      className={`relative mx-auto max-w-[430px] ${viewMode === 'map' ? '-mt-[56px] h-[calc(100vh)]' : 'flex h-[calc(100vh-56px)] flex-col'}`}
    >
      <div className="fixed left-1/2 top-[56px] z-20 w-full max-w-[430px] -translate-x-1/2 bg-white">
        <ViewTab currentTab={currentTab} onTabChange={setCurrentTab} />
      </div>
      <div
        ref={containerRef}
        className={`pt-[44px] ${viewMode === 'map' ? 'h-full' : 'flex-1 overflow-auto'}`}
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
            currentTab={currentTab} 
          />
        )}
      </div>
      <BottomControls
        viewMode={viewMode}
        onModeChange={handleViewModeChange}
        concertId={concertId}
      />
    </div>
  );
};
