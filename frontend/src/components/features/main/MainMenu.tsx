'use client';

import { MenuItem, MenuItemProps } from '@/components/features/main/MenuItem';

/**
 * @component MainMenu
 * @description 메인 화면의 네비게이션 메뉴를 표시하는 컴포넌트입니다.
 * 주요 서비스(시야 보기, 나눔 지도, 티켓팅 연습, 혼잡도 보기)로 이동할 수 있는
 * 2x2 그리드 메뉴를 제공합니다.
 *
 * @props {MenuItemProps[]} menuItems - 메뉴 아이템 배열
 * @typedef {Object} MenuItemProps
 * @property {string} icon - 메뉴에 표시될 아이콘 컴포넌트명
 * @property {string} label - 메뉴 제목
 * @property {string} description - 메뉴 설명
 * @property {'large' | 'default' | 'wide'} layout - 메뉴 아이템의 크기
 * @property {string} href - 클릭 시 이동할 경로
 * @property {string} className - 메뉴 아이템의 스타일링 클래스
 */

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
    <div className="h-[50vh] w-full flex-grow mobile:h-[65vh] tablet:h-[60vh]">
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
