// src/config/firebase.config.ts

// Firebase 환경 변수를 한 곳에서 관리
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 푸시 알림 관련 설정
export const firebaseMessagingConfig = {
  vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
  serviceWorkerPath: '/firebase-messaging-sw.js',
};

// 다른 Firebase 관련 상수를 추가할 수 있음
export const firebaseConstants = {
  FCM_TOKEN_STORAGE_KEY: 'fcm_token',
};
