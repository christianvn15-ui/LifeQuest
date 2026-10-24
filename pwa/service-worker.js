const CACHE = 'lifequest-shell-v2';
const SHELL = [
  '/', '/index.html', '/css/main.css', '/css/variables.css', '/css/themes.css', '/css/auth.css',
  '/js/app.js', '/js/router.js', '/js/state.js', '/js/ui.js', '/js/pwa.js', '/js/firebase.js',
  '/js/views/auth.js', '/js/views/dashboard.js', '/js/views/quests.js', '/js/views/avatar.js',
  '/js/views/campaigns.js', '/js/views/settings.js', '/firebase/firebase-config.js',
  '/pwa/manifest.json', '/assets/icons/icon-192.png', '/assets/icons/icon-512.png', '/assets/icons/icon.svg'
];

self.addEventListener('install', event => event.waitUntil(
  caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting())
));
self.addEventListener('activate', event => event.waitUntil(
  caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('lifequest-') && key !== CACHE).map(key => caches.delete(key))))
    .then(() => self.clients.claim())
));
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('/index.html')));
    return;
  }
  event.respondWith(caches.match(request).then(cached => {
    if (cached) return cached;
    return fetch(request).then(response => {
      if (response.ok && response.type === 'basic') {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(request, copy));
      }
      return response;
    });
  }));
});
