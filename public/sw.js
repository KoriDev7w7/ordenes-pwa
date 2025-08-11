const CACHE = 'ordenes-cache-v1';
const OFFLINE_URL = '/';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(['/','/index.html','/styles.css','/app.js','/manifest.json']))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request).catch(()=>caches.match(OFFLINE_URL)))
  );
});
