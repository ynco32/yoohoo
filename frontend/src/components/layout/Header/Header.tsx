// src/components/Header.tsx
'use client';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.scss';
import { useHeader } from './HeaderProvider';
import { usePathname } from 'next/navigation';
import ChevronLeftIcon from '@/assets/icons/chevron-left.svg';
import NotificationIcon from '@/assets/icons/notification.svg'; // 알림 아이콘 추가
import MenuIcon from '@/assets/icons/menu.svg'; // 햄버거 메뉴 아이콘 추가
import LogoIcon from '/public/svgs/main/logo.svg';

const Header = () => {
  const {
    title,
    shouldShowDetail,
    shouldShowLogo,
    arenaInfo,
    seatDetail,
    handleBack,
    setIsMenuOpen,
    handleArenaInfoClick,
  } = useHeader();

  const pathname = usePathname();
  const isPlacePage = pathname.startsWith('/place'); // 현장 페이지 확인

  // 알림 클릭 핸들러
  const handleNotificationClick = () => {
    // 알림 관련 로직 구현
    console.log('Notification clicked');
  };

  // 메뉴 클릭 핸들러
  const handleMenuClick = () => {
    setIsMenuOpen(true);
  };

  // 상세 정보 헤더 렌더링 (shouldShowDetail이 true일 때)
  if (shouldShowDetail && arenaInfo) {
    return (
      <div className={styles.detailContainer}>
        <button
          onClick={handleBack}
          className={styles.backButton}
          aria-label='뒤로 가기'
        >
          <ChevronLeftIcon className={styles.backIcon} />
        </button>
        <div
          className={styles.detailImageContainer}
          // 현장 페이지에서만 클릭 기능 활성화
          onClick={isPlacePage ? handleArenaInfoClick : undefined}
          style={{
            cursor: isPlacePage ? 'pointer' : 'default',
          }}
        >
          <Image
            src={arenaInfo.photoUrl || '/images/dummy.png'}
            alt={arenaInfo.arenaName}
            width={40}
            height={40}
            className={styles.detailImage}
          />
          <div className={styles.detailOverlay}>
            <div className={styles.venueInfoContainer}>
              <p className={styles.venueDetail}>{seatDetail || '시야보기'}</p>
              <h1 className={styles.venueName}>{arenaInfo.arenaName}</h1>
            </div>
          </div>
        </div>
        <div className={styles.iconContainer}>
          <button
            onClick={handleNotificationClick}
            className={styles.iconButton}
            aria-label='알림'
          >
            <NotificationIcon className={styles.icon} />
          </button>
          <button
            onClick={handleMenuClick}
            className={styles.iconButton}
            aria-label='메뉴'
          >
            <MenuIcon className={styles.icon} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.leftSection}>
            {shouldShowLogo ? (
              <Link href='/main' className={styles.logo}>
                <LogoIcon width={109} height={40} />
              </Link>
            ) : (
              <button
                onClick={handleBack}
                className={styles.backButton}
                aria-label='뒤로 가기'
              >
                <ChevronLeftIcon className={styles.backIcon} />
              </button>
            )}
          </div>
          <div className={styles.centerSection}>
            <h1 className={styles.headerTitle}>{title}</h1>
          </div>
          <div className={styles.rightSection}>
            <Link href='/notification' className={styles.logo}>
              <NotificationIcon className={styles.icon} />
            </Link>
            <button
              onClick={handleMenuClick}
              className={styles.iconButton}
              aria-label='메뉴'
            >
              <MenuIcon className={styles.icon} />
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};
export default Header;
