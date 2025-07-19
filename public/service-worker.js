// public/service-worker.js
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installed');
  self.skipWaiting(); // aktifkan langsung tanpa tunggu halaman reload
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activated');
});

self.addEventListener('fetch', (event) => {
  // Log request — bisa kamu modifikasi nanti untuk cache dsb
  console.log('[Service Worker] Fetching:', event.request.url);
});
