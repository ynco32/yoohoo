// ✅ Workbox 콘솔 로그 비활성화
self.__WB_DISABLE_DEV_LOGS = true;

// Workbox 로드
importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js'
);

// Workbox 설정
if (workbox) {
  console.log('Workbox loaded');
  workbox.setConfig({ debug: false }); // ✅ Workbox 내부 디버그 비활성화

  // 캐싱 전략: Network First
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'pages-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Days
        }),
      ],
    })
  );

  // 정적 자원 캐싱
  workbox.routing.registerRoute(
    ({ request }) =>
      request.destination === 'script' || request.destination === 'style',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'static-resources',
    })
  );
} else {
  console.log('Workbox failed to load');
}
