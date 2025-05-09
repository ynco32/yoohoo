import {
  UserProfile,
  UserConcert,
  UserArtist,
  UserReview,
} from '@/api/auth/user';
import styles from './MyPageContent.module.scss';
import UserSummary from './_components/profile/UserSummary';

interface MyPageContentProps {
  user: UserProfile;
  concerts: UserConcert[];
  artists: UserArtist[];
  reviews: UserReview[];
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
    </div>
  );
}
