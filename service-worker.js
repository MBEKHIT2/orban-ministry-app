
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open('orban-cache-v2').then(cache => {
    return cache.addAll([
      './index.html',
      './manifest.webmanifest',
      './orban.png'
    ]);
  }));
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
``
