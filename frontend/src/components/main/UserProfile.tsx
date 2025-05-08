// src/components/main/UserProfile/UserProfile.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './UserProfile.module.scss';
import ProfileBackground from '/public/svgs/main/profile-bg.svg';

type UserProfileProps = {
  nickname: string;
  profileImage: string;
  onClick?: () => void;
};

export default function UserProfile({
  nickname,
  profileImage,
  onClick,
}: UserProfileProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push('/mypage');
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileWrapper} onClick={handleClick}>
        {/* 배경 이미지 레이어 */}
        <div className={styles.backgroundImageContainer}>
          <Image
            src='/images/profile-bg.png'
            alt='Profile background'
            fill
            className={styles.backgroundImage}
            priority
          />
        </div>

        {/* SVG 배경 레이어 */}
        <div className={styles.backgroundContainer}>
          <ProfileBackground className={styles.backgroundSvg} />
        </div>

        {/* 컨텐츠 컨테이너 */}
        <div className={styles.contentContainer}>
          {/* 프로필 캐릭터 이미지 */}
          <div className={styles.characterImageContainer}>
            <Image
              src={profileImage}
              alt={nickname}
              width={255}
              height={250}
              className={styles.characterImage}
              priority
            />
          </div>

          {/* 닉네임 */}
          <div className={styles.nicknameSection}>
            <span className={styles.nickname}>{nickname}님</span>
          </div>
        </div>
      </div>
    </div>
  );
}
