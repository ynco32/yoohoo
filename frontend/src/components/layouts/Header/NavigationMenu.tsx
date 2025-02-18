'use client';
import Link from 'next/link';

const MENU_ITEMS = [
  { href: '/main', label: '메인' },
  { href: '/mypage', label: '마이페이지' },
  { href: '/sight', label: '시야' },
  { href: '/sharing', label: '나눔' },
  { href: '/ticketing', label: '티켓팅' },
  { href: '/congestion', label: '혼잡도' },
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
    <div className="fixed top-0 left-1/2 -translate-x-1/2 z-overlay h-full max-w-layout w-full">
      {/* 모바일 화면 내부에만 적용되는 오버레이 */}
      <div 
        className="absolute inset-0 z-dropdown bg-gray-900/50" 
        onClick={onItemClick} 
      />
      
      {/* 네비게이션 메뉴 (모바일 화면의 오른쪽 절반만 차지) */}
      <nav className="
        absolute right-0 top-0 h-full w-[50%] 
        bg-white shadow-card z-[151]
        transition-transform duration-slow ease-out-expo
      ">
        <ul className="flex flex-col gap-xs p-md">
          {MENU_ITEMS.map(({ href, label }, index) => (
            <li key={href}>
              <Link
                href={href}
                className="block px-md py-sm text-body text-gray-800 hover:bg-gray-50"
                onClick={onItemClick}
              >
                {label}
              </Link>
              {index === 0 && <hr className="my-sm border-t border-gray-100" />}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};