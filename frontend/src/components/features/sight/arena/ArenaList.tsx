'use client';

import { Arena } from '@/components/ui/Arena';
import { useState, useEffect } from 'react';
import { SelectedArenaMenu } from './SelectedArenaMenu';
import { arenaAPI, type ArenaData, ApiError } from '@/lib/api/arena';

/**
 * @component ArenaList
 * @description 공연장 목록을 표시하고 선택된 공연장의 좌석 메뉴를 관리하는 컴포넌트
 */
export default function ArenaList() {
  const [selectedArenaId, setSelectedArenaId] = useState<number | null>(null);
  const [arenas, setArenas] = useState<ArenaData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('ArenaList - Component mounted, starting data fetch');

    const fetchArenas = async () => {
      console.log('ArenaList - Fetching arenas data');
      try {
        setIsLoading(true);
        console.log('ArenaList - Calling arenaAPI.getArenas()');
        const { arenas: fetchedArenas } = await arenaAPI.getArenas();
        console.log('ArenaList - Received arenas data:', fetchedArenas);

        setArenas(fetchedArenas);

        // 첫 번째 아레나를 기본 선택
        if (fetchedArenas.length > 0) {
          console.log(
            'ArenaList - Setting initial selected arena:',
            fetchedArenas[0].arenaId
          );
          setSelectedArenaId(fetchedArenas[0].arenaId);
        }
      } catch (err) {
        console.error('ArenaList - Error details:', err);
        if (err instanceof ApiError) {
          console.log('ArenaList - ApiError occurred:', err.message);
          setError(err.message);
        } else {
          console.log('ArenaList - Unknown error occurred');
          setError(
            '예기치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
          );
        }
        console.error('Failed to fetch arenas:', err);
      } finally {
        console.log('ArenaList - Fetch completed, setting loading to false');
        setIsLoading(false);
      }
    };

    fetchArenas();
  }, []);

  console.log('ArenaList - Current state:', {
    isLoading,
    error,
    selectedArenaId,
    arenasCount: arenas.length,
  });

  if (isLoading) {
    console.log('ArenaList - Rendering loading state');
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error != null) {
    console.log('ArenaList - Rendering error state:', error);
    return (
      <div className="p-4">
        <div className="rounded-lg bg-red-50 p-4 text-red-500">{error}</div>
      </div>
    );
  }

  console.log('ArenaList - Rendering main content');
  return (
    <div className="flex h-full flex-col">
      <div className="bg-white">
        <div className="scrollbar-hide overflow-x-auto">
          <div className="flex gap-4 p-4">
            {arenas.map((arena) => (
              <Arena
                key={arena.arenaId}
                arenaId={arena.arenaId}
                arenaName={arena.arenaName}
                imageSrc={arena.photoUrl}
                imageAlt={arena.arenaName}
                onClick={() => {
                  console.log('ArenaList - Arena selected:', arena.arenaId);
                  setSelectedArenaId(arena.arenaId);
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {selectedArenaId != null && (
          <SelectedArenaMenu arenaId={selectedArenaId} />
        )}
      </div>
    </div>
  );
}
