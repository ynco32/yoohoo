// src/firebase.ts
import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getMessaging,
  getToken,
  onMessage,
  Messaging,
} from 'firebase/messaging';
import {
  firebaseConfig,
  firebaseMessagingConfig,
  isFirebaseConfigValid,
} from '@/firebase.config';

// Firebase 앱과 메시징 인스턴스 초기 선언
let app: FirebaseApp | null = null;
let messaging: Messaging | null = null;

// 클라이언트 사이드에서만 초기화하는 함수
const initializeFirebase = (): {
  app: FirebaseApp | null;
  messaging: Messaging | null;
} => {
  // 서버 사이드에서는 초기화하지 않음
  if (typeof window === 'undefined') {
    return { app: null, messaging: null };
  }

  // 이미 초기화된 경우 기존 인스턴스 반환
  if (app) {
    return { app, messaging };
  }

  try {
    // 설정 유효성 검사
    if (isFirebaseConfigValid()) {
      // Firebase 앱 초기화
      app = initializeApp(firebaseConfig);
      console.log('Firebase가 성공적으로 초기화되었습니다.');

      // 메시징 인스턴스 생성 (브라우저 환경에서만)
      if ('serviceWorker' in navigator) {
        messaging = getMessaging(app);
        console.log('Firebase 메시징이 초기화되었습니다.');
      }
    } else {
      console.warn(
        'Firebase 설정이 유효하지 않습니다. Firebase 기능이 비활성화됩니다.'
      );
      const missingFields = Object.entries(firebaseConfig)
        .filter(([_, value]) => !value)
        .map(([key]) => key);
      console.log('누락된 설정:', missingFields);
    }
  } catch (error) {
    console.error('Firebase 초기화 중 오류 발생:', error);
    app = null;
    messaging = null;
  }

  return { app, messaging };
};

// 페이지 로드 시 지연 초기화 (환경변수가 완전히 로드될 시간을 주기 위해)
if (typeof window !== 'undefined') {
  if (document.readyState === 'complete') {
    const { app: initializedApp, messaging: initializedMessaging } =
      initializeFirebase();
    app = initializedApp;
    messaging = initializedMessaging;
  } else {
    window.addEventListener('load', () => {
      const { app: initializedApp, messaging: initializedMessaging } =
        initializeFirebase();
      app = initializedApp;
      messaging = initializedMessaging;
    });
  }
}

// FCM 토큰 요청 함수
export const requestFCMToken = async (): Promise<string | null> => {
  try {
    // 필요시 초기화
    if (!app) {
      const { app: initializedApp, messaging: initializedMessaging } =
        initializeFirebase();
      app = initializedApp;
      messaging = initializedMessaging;
    }

    if (!messaging || !app) {
      console.log(
        '메시징 인스턴스가 없습니다. 브라우저 환경이 아니거나 설정이 유효하지 않거나 서비스 워커가 지원되지 않습니다.'
      );
      return null;
    }

    // vapidKey가 존재하는지 확인
    if (!firebaseMessagingConfig.vapidKey) {
      console.error('Firebase vapidKey가 설정되지 않았습니다.');
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
    // 필요시 초기화
    if (!app) {
      const { app: initializedApp, messaging: initializedMessaging } =
        initializeFirebase();
      app = initializedApp;
      messaging = initializedMessaging;
    }

    if (!messaging || !app) {
      console.log(
        '메시징 인스턴스가 없습니다. 브라우저 환경이 아니거나 설정이 유효하지 않거나 서비스 워커가 지원되지 않습니다.'
      );
      resolve(null);
      return;
    }

    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
};

// 서비스 워커 등록 함수 - Firebase 초기화와 독립적으로 동작
export const registerServiceWorker =
  async (): Promise<ServiceWorkerRegistration | null> => {
    // 서버 사이드 또는 서비스 워커를 지원하지 않는 환경에서는 실행하지 않음
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      console.log('서비스 워커를 지원하지 않는 환경입니다.');
      return null;
    }

    try {
      // Firebase 설정과 관계없이 서비스 워커 등록 시도
      const swPath =
        firebaseMessagingConfig.serviceWorkerPath ||
        '/firebase-messaging-sw.js';
      const registration = await navigator.serviceWorker.register(swPath, {
        scope: '/',
      });
      console.log('서비스 워커 등록 성공:', registration);
      return registration;
    } catch (error) {
      console.error('서비스 워커 등록 실패:', error);
      return null;
    }
  };

// 메시징 인스턴스와 앱 인스턴스 내보내기
export { messaging as messagingInstance, app };

// 수동 초기화 함수 내보내기
export { initializeFirebase };
