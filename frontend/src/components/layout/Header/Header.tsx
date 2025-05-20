// src/components/Header.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.scss';
import { useHeader } from './HeaderProvider';
import { usePathname } from 'next/navigation';
import ChevronLeftIcon from '@/assets/icons/chevron-left.svg';
import NotificationIcon from '@/assets/icons/notification.svg';
import MenuIcon from '@/assets/icons/menu.svg';
import LogoIcon from '/public/svgs/main/logo.svg';
import { notificationApi } from '@/api/notification/notification'; // 알림 API 임포트

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
  const isPlacePage = pathname.startsWith('/place');

  // 읽지 않은 알림 상태 추가
  const [hasUnread, setHasUnread] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 컴포넌트 마운트 시 읽지 않은 알림 정보 가져오기
  useEffect(() => {
    const fetchUnreadStatus = async () => {
      try {
        setIsLoading(true);
        const hasUnreadData = await notificationApi.hasUnreadNotification();
        setHasUnread(!!hasUnreadData);
      } catch (error) {
        console.error('알림 상태 로딩 실패:', error);
        setHasUnread(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUnreadStatus();
  }, []);

  const handleNotificationClick = () => {
    console.log('Notification clicked');
  };

  const handleMenuClick = () => {
    setIsMenuOpen(true);
  };

  // 알림 아이콘 렌더링 함수
  const renderNotificationIcon = () => (
    <div className={styles.notificationContainer}>
      <NotificationIcon className={styles.icon} />
      {hasUnread && !isLoading && <span className={styles.unreadBadge}></span>}
    </div>
  );

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
          <Link href='/notification' className={styles.logo}>
            {renderNotificationIcon()}
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
              {renderNotificationIcon()}
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
