'use client';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { NavigationMenu } from './NavigationMenu';
import Image from 'next/image';

// 버튼 props 타입 정의
interface ButtonProps {
  onClick: () => void;
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const rootPaths = ['/main'];
  const shouldShowLogo = rootPaths.some((path) => path === pathname);
  // 경로에 따른 타이틀 매핑
  const getTitleByPath = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    if (pathname.startsWith('/sight/reviews/write')) return '리뷰 쓰기';
    if (pathname.startsWith('/mypage/sight')) return '나의 후기';
    if (pathname.startsWith('/mypage/sharing')) return '나의 나눔글';
    if (pathname.startsWith('/mypage/ticketing')) return '티켓팅 기록';
    if (pathSegments[0] === 'sharing' && pathSegments[2] === 'write') {
      return '나눔 등록';
    }
    if (pathSegments[0] === 'sharing' && pathSegments[3] === 'edit') {
      return '나눔글 수정';
    }
    if (pathSegments[0] === 'sight' && pathSegments[3] === 'edit') {
      return '리뷰 수정';
    }

    if (pathname.startsWith('/sight')) return '시야 보기';
    if (pathname.startsWith('/sharing')) return '나눔 지도';
    if (pathname.startsWith('/mypage')) return '나의 프로필';
    if (pathname.startsWith('/ticketing')) return '티켓팅 연습';
    if (pathname.startsWith('/congestion')) return '혼잡도 보기';
    return '';
  };

  const handleBack = () => {
    const pathSegments = pathname.split('/').filter(Boolean);

    // /sight/[arenaid]/[stageType] 경로에서는 바로 /sight로 이동
    if (pathSegments[0] === 'sight' && pathSegments.length === 3) {
      router.push('/sight');
      return;
    }

    // /sharing/0/xxx 경로에서는 /mypage/sharing으로 이동
    if (
      pathSegments[0] === 'sharing' &&
      pathSegments.length >= 2 &&
      pathSegments[1] === '0'
    ) {
      router.push('/mypage/sharing');
      return;
    }

    // 루트 레벨의 페이지들(/sight, /sharing 등)은 /main으로 이동
    if (
      pathSegments.length === 1 &&
      ['sight', 'sharing', 'mypage', 'ticketing', 'congestion'].includes(
        pathSegments[0]
      )
    ) {
      router.push('/main');
      return;
    }

    // 한 단계 위 경로로 이동
    if (pathSegments.length > 1) {
      const upperPath = '/' + pathSegments.slice(0, -1).join('/');
      router.push(upperPath);
      return;
    }

    // 그 외의 경우는 기본 뒤로가기 동작 수행
    window.history.back();
  };

  const openMenu = () => {
    setIsMenuOpen(true);
  };

  // 뒤로가기 버튼 컴포넌트 (이미지 사용)
  const BackButtonWithImage = ({ onClick }: ButtonProps) => (
    <button
      onClick={onClick}
      className="flex items-center justify-center rounded-full focus:outline-none"
      aria-label="뒤로 가기"
    >
      <Image
        src="/images/arrow.png"
        alt="뒤로 가기"
        width={24}
        height={24}
        className="transition-transform hover:scale-105"
        style={{
          filter:
            'brightness(0) saturate(100%) invert(46%) sepia(83%) saturate(1939%) hue-rotate(203deg) brightness(101%) contrast(96%)',
        }}
      />
    </button>
  );

  // 메뉴 토글 버튼 컴포넌트 (이미지 사용)
  const MenuToggleWithImage = ({ onClick }: ButtonProps) => (
    <button
      onClick={onClick}
      className="flexbitems-center justify-center rounded-full focus:outline-none"
      aria-label="메뉴 열기"
    >
      <Image
        src="/images/more.png"
        alt="메뉴 열기"
        width={24}
        height={24}
        className="transition-transform hover:scale-105"
        style={{
          filter:
            'brightness(0) saturate(100%) invert(46%) sepia(83%) saturate(1939%) hue-rotate(203deg) brightness(101%) contrast(96%)',
        }}
      />
    </button>
  );

  return (
    <div className="container sticky left-0 top-0 z-header">
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
              <BackButtonWithImage onClick={handleBack} />
            )}
          </div>
          <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-base font-medium">
            {getTitleByPath()}
          </h1>
          <div className="flex-none">
            <MenuToggleWithImage onClick={openMenu} />
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
