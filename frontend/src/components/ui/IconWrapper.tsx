// IconWrapper.tsx
'use client';

import Image from 'next/image';
import { SVGIcons, SVGIconName } from '@/assets/svgs';

interface IconWrapperProps {
  icon: SVGIconName;
  label: string;
  description: string;
  className?: string;
}
export const IconWrapper = ({ icon, label, description }: IconWrapperProps) => {
  return (
    <div className="relative flex h-full w-full flex-col items-start gap-[1.023px]">
      <div className="z-50 flex flex-col">
        {/* Pretendard 폰트 적용 */}
        <span className="font-pretendard text-menu text-text-menu">
          {label}
        </span>
        <span className="font-pretendard text-menu-description text-text-description">
          {description}
        </span>
      </div>

      {/* 아이콘 (우측 하단 정렬 - absolute로 위치 조정) */}
      <div className="absolute -bottom-4 -right-4" /*style={{ right: '0%' }}*/>
        <div className="relative h-full w-full">
          <Image
            src={SVGIcons[icon]}
            alt={label}
            // fill
            width={icon === 'SightIcon' ? 150 : icon === 'TicketIcon' ? 90 : 80} // 예시로 아이콘별 크기 조정
            height={
              icon === 'SightIcon' ? 150 : icon === 'TicketIcon' ? 90 : 80
            } // 예시로 아이콘별 크기 조정
            className="rounded-lg object-contain"
          />
        </div>
      </div>
    </div>
  );
};
