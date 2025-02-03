// IconWrapper.tsx
'use client';

import Image from 'next/image';
import { SVGIcons, SVGIconName } from '@/assets/svgs';

interface IconWrapperProps {
  icon: SVGIconName;
  label: string;
  description: string;
}
export const IconWrapper = ({ icon, label, description }: IconWrapperProps) => {
  return (
    <div className="relative flex h-full w-full flex-col items-start gap-[1.023px]">
      <div className="flex flex-col">
        {/* Pretendard 폰트 적용 */}
        <span className="text-menu text-text-menu font-pretendard">
          {label}
        </span>
        <span className="text-menu-description text-text-description font-pretendard">
          {description}
        </span>
      </div>

      {/* 아이콘 (우측 하단 정렬 - absolute로 위치 조정) */}
      <div className="absolute bottom-0" style={{ right: '0%' }}>
        <Image
          src={SVGIcons[icon]}
          alt={label}
          width={icon === 'SightIcon' ? 100 : 40} // 예시로 아이콘별 크기 조정
          height={icon === 'SightIcon' ? 100 : 40} // 예시로 아이콘별 크기 조정
          className="object-contain"
        />
      </div>
    </div>
  );
};
