'use client';

import { Arena } from '@/components/ui/Arena';
import { useState, useEffect } from 'react';
import { SelectedArenaMenu } from './SelectedArenaMenu';
import { arenaAPI, type ArenaData, ApiError } from '@/lib/api/arena';
// 개발 중 MSW 체크를 건너뛰기 위한 플래그
const SKIP_MSW_CHECK = true;
export default function ArenaList() {
  const [selectedArenaId, setSelectedArenaId] = useState<number | null>(null);
  const [arenas, setArenas] = useState<ArenaData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mswInitialized, setMswInitialized] = useState(false); // MSW 상태 추가
  // 환경 변수 확인을 위한 초기 로그
  useEffect(() => {
    console.log('환경 설정 확인:', {
      API_URL: process.env.NEXT_PUBLIC_API_URL,
      USE_MSW: process.env.NEXT_PUBLIC_USE_MSW,
    });
  }, []);
  useEffect(() => {
    console.log('MSW 초기화 상태 체크 시작');
    console.log('현재 window.mswInitialized:', window.mswInitialized);

    if (SKIP_MSW_CHECK) {
      console.log('MSW 체크 스킵 모드 활성화');
      setMswInitialized(true);
      return;
    }
    // MSW가 초기화되었는지 확인
    if (window.mswInitialized) {
      console.log('MSW 이미 초기화됨');
      setMswInitialized(true);
    } else {
      console.log('MSW 초기화 대기 시작');
      const interval = setInterval(() => {
        console.log('MSW 초기화 체크 중:', window.mswInitialized);
        if (window.mswInitialized) {
          console.log('MSW 초기화 완료 감지');

          setMswInitialized(true);
          clearInterval(interval);
        }
      }, 100); // 100ms마다 MSW 상태를 체크
      return () => {
        console.log('MSW 체크 인터벌 정리');
        clearInterval(interval);
      };
    }
  }, []);

  // 데이터 fetch
  useEffect(() => {
    console.log('데이터 fetch useEffect 실행', {
      mswInitialized,
      isLoading,
      arenasCount: arenas.length,
    });

    if (!SKIP_MSW_CHECK && !mswInitialized) {
      console.log('MSW 초기화 대기 중 - API 호출 스킵');

      return; // MSW가 초기화되지 않으면 API 호출하지 않음
    }
    console.log('ArenaList - Component mounted, starting data fetch');

    const fetchArenas = async () => {
      console.log('API 호출 시작 전 상태:', {
        isLoading,
        mswInitialized,
        arenaCount: arenas.length,
      });
      try {
        setIsLoading(true);
        console.log('ArenaList - Calling arenaAPI.getArenas()');
        const { arenas: fetchedArenas } = await arenaAPI.getArenas();
        console.log('ArenaList - Received arenas data:', fetchedArenas);

        setArenas(fetchedArenas);

        if (fetchedArenas.length > 0) {
          console.log('초기 선택 경기장 설정:', fetchedArenas[0].arenaId);
          setSelectedArenaId(fetchedArenas[0].arenaId);
        }
      } catch (err) {
        console.error('API 에러 상세');

        if (err instanceof ApiError) {
          console.log('ApiError 발생:', err.message);
          setError(err.message);
        } else {
          console.log('알 수 없는 에러 발생');
          setError(
            '예기치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
          );
        }
      } finally {
        console.log('API 호출 완료, 로딩 상태 해제');
        setIsLoading(false);
      }
    };

    fetchArenas();
  }, [mswInitialized]);
  // 렌더링 시점 확인을 위한 로그
  console.log('ArenaList 렌더링:', {
    isLoading,
    hasError: error != null,
    arenasCount: arenas.length,
    selectedArenaId,
  });
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
