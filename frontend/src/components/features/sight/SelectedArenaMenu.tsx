/**
 * 공연장 좌석 메뉴를 표시하는 컴포넌트
 * @param {number} arenaId - 공연장 ID
 */
'use client';
import { StageMenuItem, StageMenuItemProps } from './StageMenuItem';

interface SelectedArenaMenuProps {
  arenaId: number; // 공연장 고유 ID
}

export const SelectedArenaMenu = ({ arenaId }: SelectedArenaMenuProps) => {
  /**
   * 공연장 ID에 따른 좌석 메뉴 목록을 반환
   * @param {number} arenaId - 공연장 ID
   * @returns {Array<{id: number, name: string}>} 좌석 메뉴 배열
   */

  const getMenuByArenaId = (
    arenaId: number
  ): Array<Omit<StageMenuItemProps, 'arenaId'>> => {
    // DUMMY_DATA: Arena venues - TO BE REMOVED
    // TODO: Replace with real API data
    switch (arenaId) {
      case 1: // 올림픽체조경기장
        return [
          {
            stageType: 1,
            name: '전체보기',
            description: '시야 및 직관 후기 모음',
            icon: 'SightIcon',
            className: '',
          },
          {
            stageType: 2,
            name: '360도',
            description: '시야 및 직관 후기 모음',
            icon: 'SightIcon',
            className: '',
          },
          {
            stageType: 3,
            name: '돌출형',
            description: '시야 및 직관 후기 모음',
            icon: 'SightIcon',
            className: '',
          },
          {
            stageType: 4,
            name: '일반형',
            description: '시야 및 직관 후기 모음',
            icon: 'SightIcon',
            className: '',
          },
        ];
      case 2: // 고척스카이돔
        return [
          {
            stageType: 5,
            name: '일반형',
            description: '시야 및 직관 후기 모음',
            icon: 'SightIcon',
            className: '',
          },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuByArenaId(arenaId);

  return (
    <div className="mt-4 px-4">
      <div className="container mx-auto max-w-6xl p-6">
        <div className="grid grid-cols-2 gap-8">
          {menuItems.map((item) => (
            <StageMenuItem
              key={item.stageType}
              icon={item.icon}
              name={item.name}
              description={item.description}
              arenaId={arenaId}
              className={item.className}
              stageType={item.stageType}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
