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
    <>
      <div 
        className="fixed inset-0 z-dropdown bg-gray-900/50" 
        onClick={onItemClick} 
      />
      <nav className={`
        fixed right-0 top-0 z-overlay translate-x-0 
        transform bg-white shadow-card transition-transform 
        duration-slow ease-out-expo h-[100vh] ${
          window.innerWidth >= 768 ? 'w-[280px]' : 'w-[50%]'
        }`
      }>
        <ul className="flex flex-col gap-xs p-md">
          {MENU_ITEMS.map(({ href, label }, index) => (
            <li key={href}>
              <Link
                href={href}
                className="px-md py-sm text-body text-gray-800 hover:bg-gray-50"
                onClick={onItemClick}
              >
                {label}
              </Link>
              {index === 0 && <hr className="my-sm border-t border-gray-100" />}
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};