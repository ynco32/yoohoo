'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.scss';
import LogoIcon from '/public/svgs/main/logo.svg';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('');

  const loadingTexts = [
    '잠시만 기다려주시끼리...',
    '풍선에 바람 넣는 중...',
    '최고의 시야 찾아내는 중...',
    '티켓팅 연습하러 가는 중...',
    '티켓팅에 운 영끌 중...',
    '현장답사 뛰는 중...',
    '인간 크롤러 가동 중...',
    '콘서트로 도파민 충전 중...',
    '콘끼리와 함께하는 여정 시작!',
  ];

  useEffect(() => {
    // 랜덤한 로딩 문구 선택
    const randomIndex = Math.floor(Math.random() * loadingTexts.length);
    setLoadingText(loadingTexts[randomIndex]);

    // 프로그레스 바 애니메이션
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 100 / 30;
      });
    }, 100);

    // 3초 후 리다이렉트
    const redirectTimer = setTimeout(() => {
      setLoading(false);
      router.push('/onboarding');
    }, 3000);

    return () => {
      clearTimeout(redirectTimer);
      clearInterval(progressInterval);
    };
  }, [router]);

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        {/* 로고 */}
        <div className={styles.logoContainer}>
          <LogoIcon className={styles.logo} />
        </div>

        {/* 캐릭터 이미지 */}
        <div className={styles.characterContainer}>
          <Image
            src='/images/profiles/profile-1.png' // 캐릭터 이미지 경로 (적절한 경로로 수정해주세요)
            alt='콘끼리 캐릭터'
            width={180}
            height={180}
            className={styles.character}
          />
        </div>

        <div className={styles.loadingText}>{loadingText}</div>

        <div className={styles.loadingContainer}>
          <div
            className={styles.loadingBar}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
