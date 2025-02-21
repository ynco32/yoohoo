/**
 * 공연장 목록을 표시하고 선택된 공연장의 메뉴를 보여주는 컴포넌트
 * @description
 * - 상단에 공연장 목록을 가로 스크롤로 표시
 * - 선택된 공연장의 상세 메뉴를 하단에 표시
 * - API로부터 공연장 데이터를 불러와 상태 관리
 * - 로딩 및 에러 상태 처리
 */

'use client';

import { Arena } from '@/components/ui/Arena';
import { useState, useEffect } from 'react';
import { SelectedArenaMenu } from './SelectedArenaMenu';
import { arenaAPI, type ArenaData, ApiError } from '@/lib/api/arena';

/**
 * 공연장 목록 컴포넌트
 * @returns {JSX.Element} 공연장 목록과 선택된 공연장의 메뉴를 포함한 페이지
 */
export default function ArenaList() {
  // 선택된 공연장 ID 상태
  const [selectedArenaId, setSelectedArenaId] = useState<number | null>(null);
  // 공연장 목록 데이터 상태
  const [arenas, setArenas] = useState<ArenaData[]>([]);
  // 데이터 로딩 상태
  const [isLoading, setIsLoading] = useState(true);
  // 에러 메시지 상태
  const [error, setError] = useState<string | null>(null);

  /**
   * 컴포넌트 마운트 시 공연장 데이터 fetch
   * - API 호출 성공 시 첫 번째 공연장을 자동 선택
   * - API 에러 발생 시 에러 메시지 표시
   */
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

  // 로딩 중 표시
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  // 에러 발생 시 에러 메시지 표시
  if (error != null) {
    return (
      <div className="p-4">
        <div className="rounded-lg bg-red-50 p-4 text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* 공연장 목록 영역 - 가로 스크롤 */}
      <div className="scrollbar-hide shrink-0 overflow-x-auto">
        <div className="flex items-center gap-2 px-6 py-2">
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
      {/* 선택된 공연장 메뉴 영역 */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {selectedArenaId != null && (
          <SelectedArenaMenu arenaId={selectedArenaId} />
        )}
      </div>
    </div>
  );
}
