'use client';

import { MenuItem, MenuItemProps } from '@/components/features/main/MenuItem';
import { SVGIcons } from '@/assets/svgs';

export default function MainMenu() {
  const menuItems: MenuItemProps[] = [
    {
      icon: 'SightIcon', // string으로 변경
      label: '시야 보기',
      description: '시야 후기 보기',
      layout: 'large',
      href: '/sight',
    },
    {
      icon: 'SharingIcon',
      label: '나눔 지도',
      href: '/sharing',
      description: '시야 후기 보기',
      layout: 'default',
    },
    {
      icon: 'TicketIcon',
      label: '티켓팅 연습',
      href: '/ticketing',
      description: '시야 후기 보기',
      layout: 'default',
    },
    {
      icon: 'CongestionIcon',
      label: '혼잡도 보기',
      href: '/congestion',
      description: '시야 후기 보기',
      layout: 'wide',
    },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[50vh] w-full mobile:h-[65vh] tablet:h-[60vh]">
      <div className="grid h-full grid-cols-2 gap-sm rounded-t-layout bg-white p-sm tablet:gap-md tablet:p-md">
        {menuItems.map((item) => (
          <MenuItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            description={item.description}
            layout={item.layout}
            href={item.href}
          />
        ))}
      </div>
    </div>
  );
}
