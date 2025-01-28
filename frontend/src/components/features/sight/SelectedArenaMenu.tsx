/**
 * 공연장 좌석 메뉴를 표시하는 컴포넌트
 * @param {number} arenaId - 공연장 ID
 */
'use client';
import { useRouter } from 'next/navigation';

interface SelectedArenaMenuProps {
  arenaId: number; // 공연장 고유 ID
}

export const SelectedArenaMenu = ({ arenaId }: SelectedArenaMenuProps) => {
  /**
   * 공연장 ID에 따른 좌석 메뉴 목록을 반환
   * @param {number} arenaId - 공연장 ID
   * @returns {Array<{id: number, name: string}>} 좌석 메뉴 배열
   */
  const router = useRouter();
  const getMenuByArenaId = (arenaId: number) => {
    // DUMMY_DATA: Arena venues - TO BE REMOVED
    // TODO: Replace with real API data
    switch (arenaId) {
      case 1: // 올림픽체조경기장
        return [
          { id: 1, name: '전체보기' },
          { id: 2, name: '360도 무대' },
          { id: 3, name: '270도 무대' },
          { id: 4, name: '180도 무대' },
        ];
      case 2: // 고척스카이돔
        return [
          { id: 1, name: '내야 지정석' },
          { id: 2, name: '외야 자유석' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuByArenaId(arenaId);

  return (
    <div className="mt-4 px-4">
      <h2>Arena {arenaId} Menu</h2>
      {/* 2열 그리드 레이아웃으로 메뉴 아이템 표시 */}
      <div className="grid grid-cols-2 gap-4">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="flex h-32 items-center justify-center rounded border border-none bg-primary-main p-2 text-white shadow"
            onClick={() => router.push(`/sight/${arenaId}`)}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};
