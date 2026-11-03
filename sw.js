// Service worker mínimo: permite instalar la app en la pantalla de inicio.
// No guarda nada en caché para que siempre se use la versión más reciente.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
