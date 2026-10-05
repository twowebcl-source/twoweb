// TwoWeb — Cloudflare Pages
// Cuando alguien entra a la portada del dominio propio de una barbería (ej: https://minadeoro.cl/),
// se muestra su página (barberia.html) sin cambiar la dirección. Todo lo demás se sirve normal.
// (_routes.json hace que este código solo corra para la portada "/", así no consume límites.)
const PROPIOS_DE_CLIPPERLAB = /(^|\.)(twoweb\.cl|clipperlab\.cl|pages\.dev)$/;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    if (url.pathname === '/' && !PROPIOS_DE_CLIPPERLAB.test(host) && host !== 'localhost') {
      let pagina = await env.ASSETS.fetch(new URL('/barberia', url));
      if (pagina.status >= 300 && pagina.status < 400 && pagina.headers.get('Location'))
        pagina = await env.ASSETS.fetch(new URL(pagina.headers.get('Location'), url));
      return new Response(pagina.body, { status: 200, headers: pagina.headers });
    }
    return env.ASSETS.fetch(request);
  }
};
