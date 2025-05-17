// src/components/notification/NotificationProvider.tsx
'use client';

import React, { useEffect } from 'react';
import {
  messagingInstance,
  requestFCMToken,
  registerServiceWorker,
} from '@/firebase';

export function NotificationProvider() {
  useEffect(() => {
    // 서비스 워커 등록
    const registerSW = async () => {
      try {
        await registerServiceWorker();
        console.log('PROVIDER:: 서비스 워커가 성공적으로 등록되었습니다.');
      } catch (error) {
        console.error('PROVIDER:: 서비스 워커 등록 실패:', error);
      }
    };

    // FCM 토큰 요청 (서버 등록은 제외)
    const initNotifications = async () => {
      try {
        // 현재 알림 권한 상태 확인
        if ('Notification' in window) {
          const permission = Notification.permission;

          // 권한이 이미 허용된 경우에만 토큰 요청 - 단, 서버 등록은 하지 않음
          if (permission === 'granted') {
            // 토큰 요청만 하고 서버 등록은 PushNotificationManager에 맡김
            await requestFCMToken();
          }
        }
      } catch (error) {
        console.error('PROVIDER:: 알림 초기화 오류:', error);
      }
    };

    registerSW();
    initNotifications();
  }, []);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않습니다
}
