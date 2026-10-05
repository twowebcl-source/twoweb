// TwoWeb — service worker del panel (app instalable)
// · Siempre intenta la red primero (así cada cambio que subas se ve al tiro) y usa la copia guardada solo sin internet.
// · Nunca guarda datos de Supabase (reservas, clientes): solo los archivos del sitio.
// · Muestra los avisos y, al tocarlos, abre el panel.
const CACHE = 'twoweb-app-v2';
const BASICOS = ['/panel', '/panel.html', '/config.js', '/fondos.js', '/manifest.webmanifest', '/imagenes/app-192.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASICOS).catch(() => {})).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;      // Supabase y otros: directo a la red
  // páginas y scripts: siempre la versión más nueva del servidor (sin caché del navegador)
  const fresco = e.request.mode === 'navigate' || /\.(html|js)$/.test(u.pathname) || !u.pathname.includes('.');
  e.respondWith(fetch(e.request, fresco ? { cache: 'no-store' } : {}).then(r => {
    if (r.ok && r.type === 'basic') { const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); }
    return r;
  }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('/panel'))));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    const p = cs.find(c => c.url.includes('/panel'));
    return p ? p.focus() : self.clients.openWindow('/panel?app=1');
  }));
});
