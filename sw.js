// Service worker JAWEM
// - Permite instalar la app en la pantalla de inicio.
// - Guarda una copia de la app para poder abrirla sin señal (en ruta).
//   Siempre intenta primero la versión más reciente de internet.
const CACHE = 'jawem-app-v4';
const ARCHIVOS = ['./', './index.html', './manifest.json', './img/icon-192.png', './img/icon-512.png', './img/rex-dino.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  // Solo archivos propios de la app (no el API de Apps Script)
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;

  e.respondWith(
    fetch(req)
      .then(res => {
        const copia = res.clone();
        caches.open(CACHE).then(c => c.put(req, copia)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('./index.html')))
  );
});
