'use client';

import { MenuItem, MenuItemProps } from '@/components/features/main/MenuItem';

export default function MainMenu() {
  const menuItems: MenuItemProps[] = [
    {
      icon: 'SightIcon',
      label: '시야 보기',
      description: '시야 후기 보기',
      layout: 'large',
      href: '/sight',
      className: 'bg-sight-menu rounded-menu shadow-menu',
    },
    {
      icon: 'SharingIcon',
      label: '나눔 지도',
      href: '/sharing',
      description: '시야 후기 보기',
      layout: 'default',
      className: 'bg-sharing-menu rounded-menu shadow-menu',
    },
    {
      icon: 'TicketIcon',
      label: '티켓팅 연습',
      href: '/ticketing',
      description: '시야 후기 보기',
      layout: 'default',
      className: 'bg-ticket-menu rounded-menu shadow-menu',
    },
    {
      icon: 'CongestionIcon',
      label: '혼잡도 보기',
      href: '/congestion',
      description: '시야 후기 보기',
      layout: 'wide',
      className: 'bg-congestion-menu rounded-menu shadow-menu',
    },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[50vh] w-full mobile:h-[65vh] tablet:h-[60vh]">
      <div className="grid h-full grid-cols-2 gap-sm bg-white p-sm tablet:gap-md tablet:p-md">
        {menuItems.map((item) => (
          <MenuItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            description={item.description}
            layout={item.layout}
            href={item.href}
            className={item.className}
          />
        ))}
      </div>
    </div>
  );
}
