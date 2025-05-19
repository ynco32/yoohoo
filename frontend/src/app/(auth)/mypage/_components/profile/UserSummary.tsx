'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import IconBox from '@/components/common/IconBox/IconBox';
import { useRouter } from 'next/navigation';
import styles from './UserSummary.module.scss';
import { useAppSelector } from '@/store/reduxHooks';
import { getMyArtists, getMyConcerts } from '@/api/mypage/mypage';
import { reviewApi } from '@/api/sight/review';

export default function UserSummary() {
  const router = useRouter();
  const fallbackImageUrl = '/svgs/main/profile.svg';

  // 스토어에서 유저 정보 가져오기
  const user = useAppSelector((state) => state.user.data);

  // 각 카운트를 위한 상태
  const [concertCount, setConcertCount] = useState(0);
  const [artistCount, setArtistCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [concertsResponse, artistsResponse, reviewsResponse] =
          await Promise.all([
            getMyConcerts(),
            getMyArtists(),
            reviewApi.getMyReviews(),
          ]);

        setConcertCount(concertsResponse?.concerts?.length || 0);
        setArtistCount(artistsResponse?.artists?.length || 0);
        setReviewCount(reviewsResponse?.reviews?.length || 0);
      } catch (error) {
        console.error('프로필 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const handleSettingsClick = () => {
    router.push('/settings');
  };

  if (!user) {
    return <div>사용자 정보를 불러올 수 없습니다</div>;
  } else {
    return (
      <div className={styles.header}>
        <div className={styles.titleBar}>
          <h1 className={styles.title}>{user.nickname}님</h1>
          <button
            className={styles.settingsButton}
            onClick={handleSettingsClick}
          >
            <IconBox name='setting' size={26} color='#333' />
          </button>
        </div>

        <div className={styles.profileCard}>
          <div className={styles.profileImageContainer}>
            <Image
              src={
                `/images/profiles/profile-${user.profileNumber}.png` ||
                fallbackImageUrl
              }
              alt='프로필 이미지'
              width={80}
              height={80}
              className={styles.avatarImage}
            />
          </div>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>
                {loading ? '...' : concertCount}
              </span>
              <span className={styles.statLabel}>예정된 콘서트</span>
            </div>
            <div className={styles.separator}></div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>
                {loading ? '...' : artistCount}
              </span>
              <span className={styles.statLabel}>관심 아티스트</span>
            </div>
            <div className={styles.separator}></div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>
                {loading ? '...' : reviewCount}
              </span>
              <span className={styles.statLabel}>내가 쓴 시야 후기</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
