// src/components/Header.tsx
'use client';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.scss';
import { useHeader } from './HeaderProvider';

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

  // 상세 정보 헤더 렌더링 (shouldShowDetail이 true일 때)
  if (shouldShowDetail && arenaInfo) {
    return (
      <div className={styles.detailContainer}>
        <button
          onClick={handleBack}
          className={styles.backButton}
          aria-label='뒤로 가기'
        >
          <Image
            src='/images/arrow.png'
            alt='뒤로 가기'
            width={24}
            height={24}
            className={styles.backIcon}
          />
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
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoContainer}>
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
              <div>??</div>
              //   <button
              //     onClick={handleBack}
              //     className={styles.backButton}
              //     aria-label='뒤로 가기'
              //   >
              //     <Image
              //       src='/images/arrow.png'
              //       alt='뒤로 가기'
              //       width={24}
              //       height={24}
              //       className={styles.backIcon}
              //     />
              //   </button>
            )}
          </div>
          <h1 className={styles.headerTitle}>{title}</h1>
          <div className={styles.menuContainer}>
            {/* 마이페이지 가기 버튼 추가 */}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
