'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MenuCard } from '../../../ui/MenuCard';
import { SVGIconName, SVGIcons } from '@/assets/svgs';

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
      className={`relative flex h-64 flex-col items-center justify-between rounded-card bg-white p-2 text-center ${className}`}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-48 w-48 items-center justify-center">
          <Image
            src={SVGIcons[icon]}
            alt={name}
            fill
            className="z-10 object-contain"
          />
        </div>

        {/* 텍스트 영역 */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-title-bold text-gray-800">{name}</span>
          {description.length > 0 && (
            <span className="text-caption1 text-gray-500">{description}</span>
          )}
        </div>
      </div>
    </MenuCard>
  );
};
