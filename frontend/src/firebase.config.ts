// src/config/firebase.config.ts

// 환경변수가 비어있을 때 사용할 기본값 설정
const getEnvOrDefault = (key: string, defaultValue: string = ''): string => {
  const value = process.env[key];
  return value !== undefined && value !== null && value !== ''
    ? value
    : defaultValue;
};

// 클라이언트 사이드에서만 동작하도록 설정
const isClient = typeof window !== 'undefined';

// Firebase 환경 변수를 한 곳에서 관리
export const firebaseConfig = {
  apiKey: getEnvOrDefault('NEXT_PUBLIC_FIREBASE_API_KEY'),
  authDomain: getEnvOrDefault('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvOrDefault('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvOrDefault('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvOrDefault(
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'
  ),
  appId: getEnvOrDefault('NEXT_PUBLIC_FIREBASE_APP_ID'),
};

// 푸시 알림 관련 설정
export const firebaseMessagingConfig = {
  vapidKey: getEnvOrDefault('NEXT_PUBLIC_FIREBASE_VAPID_KEY'),
  serviceWorkerPath: '/firebase-messaging-sw.js',
};

// 다른 Firebase 관련 상수를 추가할 수 있음
export const firebaseConstants = {
  FCM_TOKEN_STORAGE_KEY: 'fcm_token',
};

// 설정 유효성 검사 함수
export const isFirebaseConfigValid = (): boolean => {
  const requiredFields = ['apiKey', 'projectId', 'messagingSenderId', 'appId'];
  return requiredFields.every((field) => {
    const value = firebaseConfig[field as keyof typeof firebaseConfig];
    return value !== undefined && value !== null && value !== '';
  });
};

// 개발 환경에서만 로깅
if (process.env.NODE_ENV !== 'production' && isClient) {
  console.log('Firebase 설정 상태:');
  Object.entries(firebaseConfig).forEach(([key, value]) => {
    console.log(`${key}: ${value ? '설정됨' : '설정안됨'}`);
  });
  console.log(
    '설정 유효성:',
    isFirebaseConfigValid() ? '유효함' : '유효하지 않음'
  );
}
