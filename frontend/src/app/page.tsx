'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.scss';
import Splash from '@/components/splash/Splash';
import { useAuthStatus } from '@/hooks/useAuthState';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();
  const { isLoggedIn, isNamed, isLoading, error } = useAuthStatus();

  useEffect(() => {
    // 방문 기록 확인
    const checkVisitStatus = () => {
      if (typeof window !== 'undefined') {
        const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');

        if (hasVisitedBefore) {
          // 이전에 방문한 적이 있으면 스플래시 화면 건너뛰기
          setShowSplash(false);
        } else {
          // 첫 방문 기록 저장
          localStorage.setItem('hasVisitedBefore', 'true');
        }
      }
    };

    checkVisitStatus();
  }, []);

  // 로그인 상태가 변경되면 리다이렉트
  useEffect(() => {
    // 로딩 중이 아니고 스플래시 화면이 표시되지 않을 때만 리다이렉트
    if (!isLoading && !showSplash) {
      redirectBasedOnAuthStatus();
    }
  }, [isLoading, showSplash, isLoggedIn, isNamed]);

  // 인증 상태에 따라 리다이렉트
  const redirectBasedOnAuthStatus = () => {
    if (isLoggedIn) {
      if (isNamed) {
        // 로그인 상태이고 닉네임이 설정된 경우 메인으로 이동
        router.push('/main');
      } else {
        // 로그인 상태이지만 닉네임이 설정되지 않은 경우 닉네임 설정 페이지로 이동
        router.push('/nickname-setting');
      }
    } else {
      // 로그인 상태가 아닌 경우 온보딩 페이지로 이동
      router.push('/onboarding');
    }
  };

  // 스플래시 화면이 끝났을 때 호출될 함수
  const handleSplashComplete = () => {
    setShowSplash(false);
    // 이미 로그인 상태 확인이 완료된 경우 바로 리다이렉트
    if (!isLoading) {
      redirectBasedOnAuthStatus();
    }
  };

  // 로딩 중이면서 스플래시 화면이 표시되지 않는 경우 로딩 표시
  if (isLoading && !showSplash) {
    return (
      <div className={styles.loading}>
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <>
      {showSplash ? (
        <Splash onComplete={handleSplashComplete} duration={1000} />
      ) : (
        <div className={styles.page}>
          <h1>콘끼리 홈</h1>
          <div>랜딩페이지!!</div>
        </div>
      )}
    </>
  );
}
