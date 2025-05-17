// public/firebase-messaging-sw.js
importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js'
);

firebase.initializeApp({
  apiKey: 'AIzaSyC4eZWjyqoOmUZzwF_Poe1pzY6WPhkSoQ4',
  authDomain: 'conkiri-25f05.firebaseapp.com',
  projectId: 'conkiri-25f05',
  storageBucket: 'conkiri-25f05.firebasestorage.app',
  messagingSenderId: '899058733794',
  appId: '1:899058733794:web:ca5fc6c8857cae3bbd44bb',
});

const messaging = firebase.messaging();

// 백그라운드 메시지 처리
messaging.onBackgroundMessage((payload) => {
  console.log('백그라운드 메시지 수신:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/character.png',
  };

  // self.registration.showNotification(notificationTitle, notificationOptions);
});
