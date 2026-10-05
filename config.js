// =====================================================================
// TwoWeb — CONFIGURACIÓN ÚNICA (la usan panel, agenda, página de barbería y tienda)
// Cambia aquí y se aplica en todo el sitio.
// =====================================================================
window.TWOWEB = {
  // Supabase › Project Settings › API (o "API Keys")
  SUPABASE_URL: 'https://krckrwuwqsiybsoncjsg.supabase.co',
  SUPABASE_KEY: 'sb_publishable_WKTQY94olXvMNOSbl4kDqQ_wzfYsMjW',   // la "publishable" (sb_publishable_...). NUNCA la secret/service_role.

  MARCA: 'TwoWeb',                    // nombre de la plataforma (pie de página de cada negocio, avisos del panel)
  SITIO: 'https://twoweb.cl',         // link del "con TwoWeb" en el pie de cada página
  // Dominios de la plataforma: en estos se usan links cortos (twoweb.cl/minadeoro). Cualquier otro = dominio propio de un negocio.
  DOMINIOS: ['twoweb.cl', 'pages.dev', 'github.io', 'github.dev', 'githubpreview.dev'],
  // "Nombre del link" del negocio principal (el primero que se creó en la base). Su página es index.html.
  PRINCIPAL: 'twoweb',
  WHATSAPP: '56940263337',            // WhatsApp de TwoWeb: +56 9 4026 3337
  CORREO: 'twoweb.cl@gmail.com',      // correo de TwoWeb
  FORMSPREE: 'myezvagb',              // aviso por correo de las reservas del negocio principal (formspree.io/f/...)
};
// ¿Esta página se abrió desde el dominio propio de un negocio? (ej: minadeoro.cl) → devuelve ese dominio, si no ''
window.TWOWEB.dominioPropio = function(){
  var h = location.hostname.toLowerCase().replace(/^www\./, '');
  if (!/\./.test(h) || /^\d+(\.\d+){3}$/.test(h)) return '';
  for (var i = 0; i < window.TWOWEB.DOMINIOS.length; i++){
    var d = window.TWOWEB.DOMINIOS[i];
    if (h === d || h.slice(-(d.length + 1)) === '.' + d) return '';
  }
  return h;
};
