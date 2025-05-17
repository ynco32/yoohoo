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

  // const notificationTitle = payload.notification.title;
  // const notificationOptions = {
  //   body: payload.notification.body,
  //   icon: '/character.png',
  // };

  // self.registration.showNotification(notificationTitle, notificationOptions);
});

// 알림 클릭 이벤트 처리
self.addEventListener('notificationclick', function (event) {
  console.log('알림 클릭됨', event);
  event.notification.close();

  // FCM 데이터 가져오기 (FCM 자동 알림의 경우 FCM 페이로드가 notification.data에 저장됨)
  const fcmData =
    event.notification.data?.FCM_MSG?.data || event.notification.data || {};

  // 알림에 포함된 URL 정보 가져오기
  const urlToOpen = fcmData.url || '/';
  console.log('이동할 URL:', urlToOpen);

  // 클라이언트 창이 이미 열려있는지 확인하고 해당 URL로 이동
  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      .then(function (clientList) {
        // 이미 열린 창이 있는지 확인
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          // 이미 열린 창이 있으면 포커스하고 라우팅
          if ('focus' in client) {
            client.focus();
            // 라우팅 처리
            if ('navigate' in client) {
              return client.navigate(urlToOpen);
            }
          }
        }

        // 열린 창이 없으면 새 창 열기
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
