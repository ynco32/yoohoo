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
    switch (arenaId) {
      case 1: // 올림픽체조경기장
        return [
          {
            stageType: 0,
            name: '전체보기',
            description: '모든 무대 유형 후기',
            icon: 'StageTypeAll',
            className: '',
          },
          {
            stageType: 3,
            name: '360도',
            description: '모든 구역이 개방된 무대',
            icon: 'StageTypeCircular',
            className: '',
          },
          {
            stageType: 2,
            name: '돌출형',
            description: '돌출 무대가 있는 무대',
            icon: 'StageTypeExtended',
            className: '',
          },
          {
            stageType: 1,
            name: '일반형',
            description: '돌출 무대가 없는 무대',
            icon: 'StageTypeBasic',
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
    <div className="max-w-4xl h-full">
      <div className="grid h-full grid-cols-2 gap-3 tablet:gap-4">
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
  );
};
