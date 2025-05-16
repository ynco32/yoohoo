// src/components/notification/NotificationProvider.tsx
'use client';

import React, { useEffect } from 'react';
import {
  messagingInstance,
  requestFCMToken,
  registerServiceWorker,
} from '@/firebase';
import { apiRequest } from '@/api/api';

export function NotificationProvider() {
  useEffect(() => {
    // 서비스 워커 등록
    const registerSW = async () => {
      try {
        await registerServiceWorker();
        console.log('서비스 워커가 성공적으로 등록되었습니다.');
      } catch (error) {
        console.error('서비스 워커 등록 실패:', error);
      }
    };

    // FCM 토큰 요청 및 서버에 등록
    const initNotifications = async () => {
      try {
        // 현재 알림 권한 상태 확인
        if ('Notification' in window) {
          const permission = Notification.permission;

          // 권한이 이미 허용된 경우에만 토큰 요청
          if (permission === 'granted') {
            const token = await requestFCMToken();
            if (token) {
              console.log('FCM 토큰:', token);

              // 토큰을 서버에 등록
              try {
                await apiRequest('POST', '/api/notifications/register', {
                  token,
                });
                console.log('FCM 토큰이 서버에 성공적으로 등록되었습니다.');
              } catch (error) {
                console.error('서버에 FCM 토큰 등록 실패:', error);
              }
            }
          }
        }
      } catch (error) {
        console.error('알림 초기화 오류:', error);
      }
    };

    registerSW();
    initNotifications();
  }, []);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않습니다
}
