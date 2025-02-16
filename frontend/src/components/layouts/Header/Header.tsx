'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { BackButton } from './BackButton';
import { MenuToggleButton } from './MenuToggleButton';
import { NavigationMenu } from './NavigationMenu';
import Image from 'next/image';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const rootPaths = ['/main'];
  const shouldShowLogo = rootPaths.some((path) => path === pathname);
  // 경로에 따른 타이틀 매핑
  const getTitleByPath = () => {
    if (pathname.startsWith('/sight')) return '시야 보기';
    if (pathname.startsWith('/sharing')) return '나눔 지도';
    if (pathname.startsWith('/mypage')) return '마이페이지';
    if (pathname.startsWith('/ticketing')) return '티켓팅';
    if (pathname.startsWith('/congestion')) return '혼잡도';
    return '';
  };

  const handleBack = () => {
    window.history.back();
  };

  const openMenu = () => {
    setIsMenuOpen(true);
  };

  return (
    <div className="container left-0 top-0 z-header">
      <header className="h-16">
        <div className="relative flex h-full items-center justify-between">
          <div className="flex-none">
            {shouldShowLogo ? (
              <Link href="/main" className="h-8 w-auto">
                <Image
                  src="/svgs/logo.svg"
                  alt="Logo"
                  width={109}
                  height={109}
                  priority
                />
              </Link>
            ) : (
              <BackButton onClick={handleBack} />
            )}
          </div>
          <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-base font-medium">
            {getTitleByPath()}
          </h1>
          <div className="flex-none">
            <MenuToggleButton onClick={openMenu} />
          </div>
        </div>
      </header>

      <NavigationMenu
        isMenuOpen={isMenuOpen}
        onItemClick={() => {
          setIsMenuOpen(false);
        }}
      />
    </div>
  );
};

export default Header;
