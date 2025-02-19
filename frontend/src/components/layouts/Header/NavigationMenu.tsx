'use client';
import Link from 'next/link';
import Image from 'next/image';
import {
  UserIcon,
  EyeIcon,
  MapIcon,
  TicketIcon,
  ChartBarIcon,
} from '@heroicons/react/24/solid';

// 메인 메뉴는 로고를 사용하고, 나머지는 아이콘 사용
const MENU_ITEMS = [
  {
    href: '/main',
    label: '메인',
    icon: (
      <Image
        src="/svgs/logo.svg"
        alt="로고"
        width={90}
        height={90}
        className="object-contain"
        priority
      />
    ),
  },
  {
    href: '/mypage',
    label: '내 프로필',
    icon: <UserIcon className="h-5 w-5 text-sight-button" />,
  },
  {
    href: '/sight',
    label: '시야 보기',
    icon: <EyeIcon className="h-5 w-5 text-sight-button" />,
  },
  {
    href: '/sharing',
    label: '나눔 지도',
    icon: <MapIcon className="h-5 w-5 text-sight-button" />,
  },
  {
    href: '/ticketing',
    label: '티켓팅 연습',
    icon: <TicketIcon className="h-5 w-5 text-sight-button" />,
  },
  {
    href: '/congestion',
    label: '혼잡도 보기',
    icon: <ChartBarIcon className="h-5 w-5 text-sight-button" />,
  },
] as const;

interface NavigationMenuProps {
  isMenuOpen: boolean;
  onItemClick: () => void;
}

export const NavigationMenu = ({
  isMenuOpen,
  onItemClick,
}: NavigationMenuProps) => {
  if (!isMenuOpen) return null;

  return (
    <div className="fixed left-1/2 top-0 z-overlay h-full w-full max-w-layout -translate-x-1/2">
      {/* 모바일 화면 내부에만 적용되는 오버레이 */}
      <div
        className="absolute inset-0 z-dropdown bg-gray-900/50"
        onClick={onItemClick}
      />

      {/* 네비게이션 메뉴 (모바일 화면의 오른쪽 절반만 차지) */}
      <nav className="absolute right-0 top-0 z-[151] h-full w-[50%] bg-white shadow-card transition-transform duration-slow ease-out-expo">
        <ul className="flex flex-col gap-xs p-md">
          {MENU_ITEMS.map(({ href, label, icon }, index) => (
            <li key={href}>
              {index === 0 ? (
                // 메인 메뉴 항목 (로고 포함)
                <Link
                  href={href}
                  className="flex items-start px-md"
                  onClick={onItemClick}
                >
                  <div className="-mx-1 mb-3.5 hover:scale-110">{icon}</div>
                </Link>
              ) : (
                // 일반 메뉴 항목
                <Link
                  href={href}
                  className="flex items-center rounded-md px-md py-sm text-body text-gray-800 hover:bg-gray-50"
                  onClick={onItemClick}
                >
                  <span className="mr-3 flex w-6 items-center justify-start">
                    {icon}
                  </span>
                  {label}
                </Link>
              )}
              {index === 0 && <hr className="my-s border-t border-gray-100" />}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
