import { UserProfile, UserConcert, UserArtist } from '@/api/auth/user';
import styles from './MyPageContent.module.scss';
import UserSummary from './_components/profile/UserSummary';
import ConcertSection from './_components/concerts/ConcertSection';
import ArtistSection from './_components/artists/ArtistSection';

import { Review } from '@/types/review';
import ReviewSection from './_components/reviews/ReviewSection';
interface MyPageContentProps {
  user: UserProfile;
  concerts: UserConcert[];
  artists: UserArtist[];
  reviews: Review[];
}

export default function MyPageContent({
  user,
  concerts,
  artists,
  reviews,
}: MyPageContentProps) {
  return (
    <div className={styles.container}>
      {/* 사용자 정보 요약 섹션 */}
      <UserSummary
        nickname={user.nickname}
        concertCount={concerts.length}
        artistCount={artists.length}
        reviewCount={reviews.length}
        profileImageUrl={user.profileImageUrl}
      />

      <div className={styles.content}>
        {/* 예정된 콘서트 섹션 */}
        <ConcertSection concerts={concerts} />
        <hr className={styles.divider} />

        {/* 관심 아티스트 섹션 */}
        <ArtistSection artists={artists} />
        <hr className={styles.divider} />

        {/* 후기 섹션 */}
        <ReviewSection reviews={reviews} />
      </div>
    </div>
  );
}
