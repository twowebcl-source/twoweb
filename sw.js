// TwoWeb — service worker del panel (app instalable)
// · Siempre intenta la red primero (así cada cambio que subas se ve al tiro) y usa la copia guardada solo sin internet.
// · Nunca guarda datos de Supabase (reservas, clientes): solo los archivos del sitio.
// · Muestra los avisos (también los que llegan con la app cerrada, Web Push) y, al tocarlos, abre el panel.
const CACHE = 'twoweb-app-v3';
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
// Aviso que llega desde el servidor (Fase 43), aunque el panel esté cerrado o el teléfono bloqueado
self.addEventListener('push', e => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch (x) { d = { title: 'TwoWeb', body: e.data ? e.data.text() : '' }; }
  const titulo = d.title || 'TwoWeb';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    // si el panel está abierto y a la vista, él mismo ya muestra el aviso (sin repetirlo)
    // (Safari/iPhone exige mostrar siempre el aviso; ahí no se omite. Mismo "tag" = no se duplica.)
    const safari = /Safari/.test(navigator.userAgent) && !/Chrome|Chromium|Edg|Android/.test(navigator.userAgent);
    if (!safari && cs.some(c => c.visibilityState === 'visible' && c.url.includes('/panel')) && d.tag !== 'twoweb-prueba') return;
    return self.registration.showNotification(titulo, { body: d.body || '', tag: d.tag || undefined, renotify: !!d.tag,
      icon: d.icon || '/imagenes/app-192.png', badge: d.badge || '/imagenes/badge-72.png', data: { url: d.url || '/panel?app=1' }, vibrate: [120, 60, 120] });
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || '/panel?app=1';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    const p = cs.find(c => c.url.includes('/panel'));
    return p ? p.focus() : self.clients.openWindow(url);
  }));
});
// Si el navegador renueva la suscripción, el panel la vuelve a registrar la próxima vez que se abra
self.addEventListener('pushsubscriptionchange', () => {});
