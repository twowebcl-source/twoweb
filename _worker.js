// TwoWeb — Cloudflare Pages
// 1) Cuando alguien entra a la portada del dominio propio de una barbería (ej: https://minadeoro.cl/),
//    se muestra su página (barberia.html) sin cambiar la dirección.
// 2) /app/<negocio>.webmanifest y /app/<negocio>/icono-512.png: la app instalable del panel con el
//    nombre y el logo de cada negocio (Fase 42). Sin logo, se usa el ícono de two.
// Todo lo demás se sirve normal. (_routes.json hace que este código solo corra para "/" y "/app/*".)
const PROPIOS_DE_TWOWEB = /(^|\.)(twoweb\.cl|pages\.dev)$/;

// Lee la URL y la llave publishable desde config.js (así no se repiten en dos lados)
let CONF = null;
async function conf(env, url){
  if (CONF) return CONF;
  const t = await (await env.ASSETS.fetch(new URL('/config.js', url))).text();
  const u = (t.match(/SUPABASE_URL:\s*'([^']+)'/) || [])[1], k = (t.match(/SUPABASE_KEY:\s*'([^']+)'/) || [])[1];
  if (u && k) CONF = { u, k };
  return CONF || {};
}
async function rpc(env, url, fn, args){
  const c = await conf(env, url); if (!c.u) return null;
  const r = await fetch(`${c.u}/rest/v1/rpc/${fn}`, { method: 'POST', body: JSON.stringify(args),
    headers: { apikey: c.k, Authorization: `Bearer ${c.k}`, 'Content-Type': 'application/json' } });
  return r.ok ? r.json() : null;
}
const ICONOS_TWO = [
  { src: '/imagenes/app-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
  { src: '/imagenes/app-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
  { src: '/imagenes/app-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }];

async function app(request, env, url){
  const m = url.pathname.match(/^\/app\/([a-z0-9-]{3,40})(\.webmanifest|\/icono-512\.png)$/);
  if (!m) return new Response('No encontrado', { status: 404 });
  const [, slug, que] = m;
  if (que === '/icono-512.png'){
    const d = await rpc(env, url, 'app_icono', { p_slug: slug });
    const p = typeof d === 'string' && d.match(/^data:(image\/(?:png|jpeg|webp));base64,(.+)$/);
    if (!p) return Response.redirect(new URL('/imagenes/app-512.png', url), 302);
    const bin = Uint8Array.from(atob(p[2]), ch => ch.charCodeAt(0));
    return new Response(bin, { headers: { 'Content-Type': p[1], 'Cache-Control': 'public, max-age=3600' } });
  }
  const n = await rpc(env, url, 'app_datos', { p_slug: slug });
  if (!n || !n.slug) return Response.redirect(new URL('/manifest.webmanifest', url), 302);
  const color = /^#[0-9a-f]{6}$/i.test(n.color || '') ? n.color : '#342d2d';
  const ic = n.icono ? [
    { src: `/app/${slug}/icono-512.png?v=${n.version}`, sizes: '512x512', purpose: 'any' },
    { src: `/app/${slug}/icono-512.png?v=${n.version}`, sizes: '192x192', purpose: 'any' },
    { src: `/app/${slug}/icono-512.png?v=${n.version}`, sizes: '512x512', purpose: 'maskable' }] : ICONOS_TWO;
  const nombre = String(n.nombre || 'Panel').slice(0, 45);
  const man = {
    name: `${nombre} · Panel`, short_name: nombre.slice(0, 12), description: `Agenda y panel de ${nombre}.`,
    id: `/panel?n=${slug}`, start_url: `/panel?n=${slug}&app=1`, scope: '/', display: 'standalone', orientation: 'any',
    background_color: '#342d2d', theme_color: color, lang: 'es-CL', icons: ic,
    shortcuts: [{ name: 'Mi día', url: `/panel?n=${slug}&app=1`, icons: [ic[1] || ic[0]] }] };
  return new Response(JSON.stringify(man), { headers: { 'Content-Type': 'application/manifest+json', 'Cache-Control': 'public, max-age=300' } });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/app/')) {
      try { return await app(request, env, url); } catch (e) { return Response.redirect(new URL('/manifest.webmanifest', url), 302); }
    }
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    if (url.pathname === '/' && !PROPIOS_DE_TWOWEB.test(host) && host !== 'localhost') {
      let pagina = await env.ASSETS.fetch(new URL('/barberia', url));
      if (pagina.status >= 300 && pagina.status < 400 && pagina.headers.get('Location'))
        pagina = await env.ASSETS.fetch(new URL(pagina.headers.get('Location'), url));
      return new Response(pagina.body, { status: 200, headers: pagina.headers });
    }
    return env.ASSETS.fetch(request);
  }
};
