const CACHE = 'onebuddy-v26';

self.addEventListener('install', e => {
  // Skip waiting immediately so new SW takes over without requiring tab close
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['/manifest.json'])));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => {
        // Tell ALL open clients to reload so they get the latest HTML immediately
        return self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      })
      .then(clients => {
        clients.forEach(client => client.postMessage({ type: 'SW_UPDATED' }));
      })
  );
});

self.addEventListener('fetch', e => {
  // HTML navigation: always network-first with no-store, fall back to cache offline
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request, { cache: 'no-store' })
        .then(res => {
          // Clone BEFORE returning so body isn't consumed when we write to cache
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }
  // Cache-first for everything else (fonts, manifest, icons)
  e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request)));
});
