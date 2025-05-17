'use client';

import styles from './MyPageContent.module.scss';
import UserSummary from './_components/profile/UserSummary';
import ConcertSection from './_components/concerts/ConcertSection';
import ArtistSection from './_components/artists/ArtistSection';
import ReviewSection from './_components/reviews/ReviewSection';

export default function MyPageContent() {
  return (
    <div className={styles.container}>
      {/* 사용자 정보 요약 섹션 */}
      <UserSummary />

      <div className={styles.content}>
        {/* 예정된 콘서트 섹션 */}
        <ConcertSection />
        <hr className={styles.divider} />

        {/* 관심 아티스트 섹션 */}
        <ArtistSection />
        <hr className={styles.divider} />

        {/* 후기 섹션 */}
        <ReviewSection />
      </div>
    </div>
  );
}
