// src/firebase.ts
import { initializeApp } from 'firebase/app';
import {
  getMessaging,
  getToken,
  onMessage,
  Messaging,
} from 'firebase/messaging';
import { firebaseConfig, firebaseMessagingConfig } from './firebase.config';

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// 메시징 인스턴스 생성 (브라우저 환경에서만)
const messaging =
  typeof window !== 'undefined' && 'serviceWorker' in navigator
    ? getMessaging(app)
    : null;

// FCM 토큰 요청 함수
export const requestFCMToken = async (): Promise<string | null> => {
  try {
    if (!messaging) {
      console.log(
        '메시징 인스턴스가 없습니다. 브라우저 환경이 아니거나 서비스 워커가 지원되지 않습니다.'
      );
      return null;
    }

    const currentToken = await getToken(messaging, {
      vapidKey: firebaseMessagingConfig.vapidKey,
    });

    if (currentToken) {
      console.log('FCM 토큰:', currentToken);
      return currentToken;
    } else {
      console.log('FCM 토큰을 받을 수 없습니다. 권한을 요청하세요.');
      return null;
    }
  } catch (error) {
    console.error('FCM 토큰 요청 오류:', error);
    return null;
  }
};

// 포그라운드 메시지 핸들러
export const onMessageListener = (): Promise<any> => {
  return new Promise((resolve) => {
    if (!messaging) {
      console.log(
        '메시징 인스턴스가 없습니다. 브라우저 환경이 아니거나 서비스 워커가 지원되지 않습니다.'
      );
      resolve(null);
      return;
    }

    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
};

// 서비스 워커 등록 함수
export const registerServiceWorker =
  async (): Promise<ServiceWorkerRegistration | null> => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register(
          firebaseMessagingConfig.serviceWorkerPath,
          { scope: '/' }
        );
        console.log('서비스 워커 등록 성공:', registration);
        return registration;
      } catch (error) {
        console.error('서비스 워커 등록 실패:', error);
        return null;
      }
    }
    return null;
  };

// 메시징 인스턴스와 앱 인스턴스 내보내기
export { messaging as messagingInstance, app };
