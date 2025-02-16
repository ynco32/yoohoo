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

  useEffect(() => {
    const fetchArenas = async () => {
      try {
        setIsLoading(true);
        const { arenas: fetchedArenas } = await arenaAPI.getArenas();

        setArenas(fetchedArenas);
        if (fetchedArenas.length > 0) {
          setSelectedArenaId(fetchedArenas[0].arenaId);
        }
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError(
            '예기치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchArenas();
  }, []);

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
                onClick={() => setSelectedArenaId(arena.arenaId)}
              />
            ))}
            <div className="w-xl flex-none"></div>
          </div>
        </div>
      </div>
      <div className="flex-1 px-4">
        {selectedArenaId != null && (
          <SelectedArenaMenu arenaId={selectedArenaId} />
        )}
      </div>
    </div>
  );
}
