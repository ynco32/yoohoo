'use client';

import React from 'react';
import Image from 'next/image';
import IconBox from '@/components/common/IconBox/IconBox';
import { useRouter } from 'next/navigation';
import styles from './UserSummary.module.scss';

interface UserSummaryProps {
  nickname: string;
  concertCount: number;
  artistCount: number;
  reviewCount: number;
  profileImageUrl?: string;
}

export default function UserSummary({
  nickname,
  concertCount,
  artistCount,
  reviewCount,
  profileImageUrl,
}: UserSummaryProps) {
  const router = useRouter();
  const fallbackImageUrl = '/svgs/main/profile.svg';

  const handleSettingsClick = () => {
    router.push('/settings');
  };

  return (
    <div className={styles.header}>
      <div className={styles.titleBar}>
        <h1 className={styles.title}>{nickname}님</h1>
        <button className={styles.settingsButton} onClick={handleSettingsClick}>
          <IconBox name='setting' size={26} color='#333' />
        </button>
      </div>

      <div className={styles.profileCard}>
        <div className={styles.profileImageContainer}>
          <Image
            src={profileImageUrl || fallbackImageUrl}
            alt='프로필 이미지'
            width={80}
            height={80}
            className={styles.avatarImage}
          />
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{concertCount}</span>
            <span className={styles.statLabel}>예정된 콘서트</span>
          </div>
          <div className={styles.separator}></div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{artistCount}</span>
            <span className={styles.statLabel}>관심 아티스트</span>
          </div>
          <div className={styles.separator}></div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{reviewCount}</span>
            <span className={styles.statLabel}>내가 쓴 시야 후기</span>
          </div>
        </div>
      </div>
    </div>
  );
}
