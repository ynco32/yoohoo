// src/components/main/UserProfile/UserProfile.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile } from '@/api/auth/auth';
import { setUser, setLoading, setError } from '@/store/slices/userSlice';
import { RootState } from '@/store';
import styles from './UserProfile.module.scss';
import ProfileBackground from '/public/svgs/main/profile-bg.svg';

export default function UserProfile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    data: userInfo,
    loading,
    isLoggedIn,
  } = useSelector((state: RootState) => state.user);

  // 프로필 번호에 따른 이미지 경로 생성 함수
  const getProfileImagePath = (profileNumber?: number) => {
    // 프로필 번호가 없으면 기본 이미지 반환
    if (profileNumber === undefined) {
      return '/images/profiles/profile-1.png';
    }

    // 프로필 번호에 따른 이미지 경로 반환
    return `/images/profiles/profile-${profileNumber}.png`;
  };

  useEffect(() => {
    console.log('UserProfile 마운트됨, 현재 페이지:', window.location.pathname);
    // 랜덤 메시지 선택
    const randomIndex = Math.floor(Math.random() * messages.length);
    setRandomMessage(messages[randomIndex]);

    const fetchUserInfo = async () => {
      try {
        console.log('사용자 정보 가져오기 시작');
        dispatch(setLoading(true));
        const response = await getUserProfile();
        console.log('API 응답 받음:', response);

        if (response) {
          dispatch(setUser(response));
          console.log('사용자 정보 저장 완료');
        }
      } catch (error) {
        console.error('사용자 정보를 가져오는 중 오류:', error);
        dispatch(
          setError(
            error instanceof Error
              ? error.message
              : '사용자 정보를 가져오는 중 오류가 발생했습니다.'
          )
        );
      } finally {
        dispatch(setLoading(false));
      }
    };

    // 사용자 정보가 없거나 로그인 상태인데 정보가 없는 경우 API 호출
    if (!userInfo || (isLoggedIn && !userInfo.nickname)) {
      console.log('사용자 정보 없음, API 호출 필요');
      fetchUserInfo();
    }
  }, [dispatch, userInfo, isLoggedIn]);

  const handleClick = () => {
    router.push('/mypage');
  };

  // 랜덤 메시지를 저장할 상태 추가
  const [randomMessage, setRandomMessage] = useState('');

  // 랜덤 메시지 배열
  const messages = [
    '안녕하세요 🐘',
    '티켓팅 준비 완료되셨나요? 🎟️',
    '티켓팅 성공을 응원합니다 ✨',
    '최고의 시야를 찾아보세요 👀',
    '공연장에서 만나요 🏟️',
    '오늘도 좋은 관람 되세요 🎵',
  ];

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
          {loading ? (
            <div className={styles.loadingState}>로딩 중...</div>
          ) : (
            <>
              {/* 프로필 캐릭터 이미지 */}
              <div className={styles.characterImageContainer}>
                <Image
                  src={getProfileImagePath(userInfo?.profileNumber)}
                  alt={`${userInfo?.nickname || '사용자'} 프로필 이미지`}
                  width={255}
                  height={250}
                  className={styles.characterImage}
                  priority
                />
              </div>

              {/* 닉네임 */}
              <div className={styles.nicknameSection}>
                <div className={styles.nickname}>
                  <span className={styles.userName}>
                    {userInfo?.nickname || '사용자'}
                  </span>
                  님, {randomMessage}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
