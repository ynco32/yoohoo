'use client';

// {menuItems.map((item) => (
//   <div
//     key={item.id}
//     className="flex h-32 items-center justify-center rounded border border-none bg-primary-main p-2 text-white shadow"
//     onClick={() => router.push(`/sight/${arenaId}`)}
//   >
//     {item.name}
//   </div>

// id: 1,
// name: '전체보기',
// description: '시야 및 직관 후기 모음',
// icon: '',

import { useRouter } from 'next/navigation';
import { IconWrapper } from '../../ui/IconWrapper';
import { MenuCard } from '../../ui/MenuCard';
import { SVGIconName } from '@/assets/svgs';

export interface StageMenuItemProps {
  icon: SVGIconName;
  name: string;
  description?: string;
  className?: string;
  stageType: number;
  arenaId: number;
}

export const StageMenuItem = ({
  icon,
  name,
  className = '',
  description = '',
  stageType,
  arenaId,
}: StageMenuItemProps) => {
  const router = useRouter();

  return (
    <MenuCard
      onClick={() => router.push(`/sight/${arenaId}/${stageType}`)}
      className={`relative flex h-64 flex-col items-center justify-between p-6 ${className}`}
    >
      <IconWrapper
        icon={icon}
        label={name}
        description={description}
        className="flex flex-col items-center gap-4"
      />
    </MenuCard>
  );
};
