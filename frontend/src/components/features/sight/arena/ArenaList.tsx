'use client';

import { Arena } from '@/components/ui/Arena';
import { useState, useEffect } from 'react';
import { SelectedArenaMenu } from './SelectedArenaMenu';
import { arenaAPI, type ArenaData, ApiError } from '@/lib/api/arena';

export default function ArenaList() {
  const [selectedArenaId, setSelectedArenaId] = useState<number | null>(null);
  const [arenas, setArenas] = useState<ArenaData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mswInitialized, setMswInitialized] = useState(false); // MSW 상태 추가

  useEffect(() => {
    // MSW가 초기화되었는지 확인
    if (window.mswInitialized) {
      setMswInitialized(true);
    } else {
      const interval = setInterval(() => {
        if (window.mswInitialized) {
          setMswInitialized(true);
          clearInterval(interval);
        }
      }, 100); // 100ms마다 MSW 상태를 체크
    }
  }, []);

  useEffect(() => {
    if (!mswInitialized) return; // MSW가 초기화되지 않으면 API 호출하지 않음

    console.log('ArenaList - Component mounted, starting data fetch');

    const fetchArenas = async () => {
      console.log('ArenaList - Fetching arenas data');
      try {
        setIsLoading(true);
        console.log('ArenaList - Calling arenaAPI.getArenas()');
        const { arenas: fetchedArenas } = await arenaAPI.getArenas();
        console.log('ArenaList - Received arenas data:', fetchedArenas);

        setArenas(fetchedArenas);

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
  }, [mswInitialized]); // mswInitialized 상태에 의존

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error != null) {
    return (
      <div className="p-4">
        <div className="rounded-lg bg-red-50 p-4 text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div>
        <div className="scrollbar-hide overflow-x-auto">
          <div className="flex gap-8 px-2xl py-sm">
            {arenas.map((arena) => (
              <Arena
                key={arena.arenaId}
                arenaId={arena.arenaId}
                arenaName={arena.arenaName}
                imageSrc={arena.photoUrl}
                imageAlt={arena.arenaName}
                onClick={() => {
                  setSelectedArenaId(arena.arenaId);
                }}
              />
            ))}
            <div className="w-xl flex-none"></div>
          </div>
        </div>
      </div>
      <div className="flex-1 px-2xl">
        {selectedArenaId != null && (
          <SelectedArenaMenu arenaId={selectedArenaId} />
        )}
      </div>
    </div>
  );
}
