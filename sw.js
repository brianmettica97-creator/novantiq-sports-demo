// Service worker de NOVANTIQ SPORTS.
// - Las páginas siempre se piden a la red (nunca se sirve una versión vieja de la app);
//   sin conexión se muestra una pantalla amable.
// - Los archivos con hash (/assets/) se guardan para abrir más rápido.
// - Nada de la API (Supabase) pasa por acá: los datos jamás se cachean.
const VERSION = 'nq-v1';
const SHELL = ['offline.html', 'icons/icon-192.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).catch(() => caches.match('offline.html')));
    return;
  }
  if (url.pathname.includes('/assets/')) {
    e.respondWith(caches.open(VERSION).then(async (cache) => {
      const hit = await cache.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok) cache.put(req, res.clone());
      return res;
    }));
  }
});
