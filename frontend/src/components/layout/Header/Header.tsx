// src/components/Header.tsx
'use client';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.scss';
import { useHeader } from './HeaderProvider';
import ChevronLeftIcon from '@/assets/icons/chevron-left.svg';
import NotificationIcon from '@/assets/icons/notification.svg'; // 알림 아이콘 추가
import MenuIcon from '@/assets/icons/menu.svg'; // 햄버거 메뉴 아이콘 추가

const Header = () => {
  const {
    title,
    shouldShowDetail,
    shouldShowLogo,
    arenaInfo,
    seatDetail,
    handleBack,
    setIsMenuOpen,
  } = useHeader();

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
        <div className={styles.detailImageContainer}>
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
                <Image
                  src='/images/logo.png'
                  alt='Logo'
                  width={109}
                  height={40}
                  priority
                />
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
      </header>
    </div>
  );
};
export default Header;
