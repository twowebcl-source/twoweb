// =====================================================================
// TwoWeb — fondos.js: fondos con movimiento + fuentes (panel, agenda, tienda y página del negocio)
// Cada fondo = un MOTOR (agua, partículas, degradado, neón, galaxia, imagen…) + sus ajustes.
// El catálogo lo administra el super admin (tabla "fondos"). Se dibuja en un <canvas> fijo
// detrás de la página: 30 cuadros/s, se pausa si la pestaña no se ve y respeta "reducir movimiento".
// =====================================================================
const FONDOS_BASE = [{"codigo": "agua", "nombre": "Agua", "icono": "🌊", "descripcion": "Olas y reflejos", "motor": "agua", "params": {"c1": "#22d3ee", "c2": "#2563eb", "tinte": "degradado", "tinte_alpha": 0.18}}, {"codigo": "aire", "nombre": "Aire", "icono": "☁️", "descripcion": "Nubes que flotan", "motor": "aire", "params": {"c1": "#a78bfa", "c2": "#f0abfc", "densidad": 1.2, "blur": 22}}, {"codigo": "burbujas", "nombre": "Burbujas", "icono": "🫧", "descripcion": "Suben despacio", "motor": "particulas", "params": {"c1": "#38bdf8", "c2": "#a5f3fc", "direccion": "arriba", "particula": "forma", "forma": "circulo", "estilo": "burbuja", "tmin": 5, "tmax": 24, "densidad": 1.3, "vel": 1}}, {"codigo": "aurora", "nombre": "Aurora", "icono": "🌌", "descripcion": "Luces del norte", "motor": "aurora", "params": {"c1": "#34d399", "c2": "#8b5cf6", "c3": "#22d3ee", "blur": 20, "tinte": "radial", "tinte_alpha": 0.12}}, {"codigo": "constelacion", "nombre": "Constelación", "icono": "✨", "descripcion": "Estrellas unidas", "motor": "constelacion", "params": {"c1": "#fde68a", "c2": "#93c5fd", "densidad": 1.3}}, {"codigo": "gotas", "nombre": "Gotas", "icono": "💧", "descripcion": "Ondas en el agua", "motor": "gotas", "params": {"c1": "#67e8f9", "c2": "#818cf8", "densidad": 1.4}}, {"codigo": "formas", "nombre": "Formas", "icono": "🔷", "descripcion": "Figuras flotantes", "motor": "particulas", "params": {"c1": "#f472b6", "c2": "#facc15", "c3": "#60a5fa", "direccion": "arriba", "particula": "forma", "forma": "mezcla", "estilo": "relleno", "giro": true, "tmin": 8, "tmax": 34, "densidad": 1}}, {"codigo": "degradado", "nombre": "Degradado vivo", "icono": "🎨", "descripcion": "Colores que se mezclan", "motor": "gradiente", "params": {"c1": "#7c3aed", "c2": "#db2777", "c3": "#f59e0b", "blur": 40, "alpha": 0.55}}, {"codigo": "oceano", "nombre": "Océano profundo", "icono": "🐋", "descripcion": "Azules en movimiento", "motor": "gradiente", "params": {"c1": "#0ea5e9", "c2": "#1e3a8a", "c3": "#14b8a6", "blur": 40, "alpha": 0.5}}, {"codigo": "neon", "nombre": "Neón retro", "icono": "🌆", "descripcion": "Sol y grilla de los 80", "motor": "neon", "params": {"c1": "#f0abfc", "c2": "#22d3ee", "c3": "#f97316"}}, {"codigo": "seda", "nombre": "Seda", "icono": "🎐", "descripcion": "Líneas que ondulan", "motor": "ondas", "params": {"c1": "#f472b6", "c2": "#60a5fa", "densidad": 1.2}}, {"codigo": "galaxia", "nombre": "Galaxia", "icono": "🌀", "descripcion": "Espiral de estrellas", "motor": "espiral", "params": {"c1": "#c4b5fd", "c2": "#f9a8d4", "c3": "#93c5fd", "densidad": 1.3, "tinte": "radial", "tinte_alpha": 0.15}}, {"codigo": "nieve", "nombre": "Nieve", "icono": "❄️", "descripcion": "Copos que caen", "motor": "particulas", "params": {"c1": "#ffffff", "c2": "#bae6fd", "direccion": "abajo", "particula": "forma", "forma": "circulo", "estilo": "relleno", "tmin": 1.5, "tmax": 5, "densidad": 2.6, "vel": 0.7, "alpha": 0.85}}, {"codigo": "lluvia", "nombre": "Lluvia", "icono": "🌧️", "descripcion": "Gotas de lluvia", "motor": "particulas", "params": {"c1": "#93c5fd", "c2": "#c7d2fe", "direccion": "diagonal", "particula": "linea", "tmin": 10, "tmax": 24, "densidad": 2.6, "vel": 2.6, "alpha": 0.5, "tinte": "degradado", "tinte_alpha": 0.12}}, {"codigo": "confeti", "nombre": "Confeti", "icono": "🎉", "descripcion": "Fiesta de colores", "motor": "particulas", "params": {"c1": "#f43f5e", "c2": "#facc15", "c3": "#22c55e", "direccion": "abajo", "particula": "forma", "forma": "mezcla", "estilo": "relleno", "giro": true, "tmin": 4, "tmax": 9, "densidad": 2, "vel": 1.2, "alpha": 0.85}}, {"codigo": "petalos", "nombre": "Pétalos", "icono": "🌸", "descripcion": "Flores al viento", "motor": "particulas", "params": {"c1": "#f9a8d4", "c2": "#fbcfe8", "direccion": "diagonal", "particula": "emoji", "emojis": "🌸🌸🌺", "giro": true, "tmin": 9, "tmax": 16, "densidad": 0.9, "vel": 0.8, "alpha": 0.85}}, {"codigo": "barberia", "nombre": "Barbería", "icono": "💈", "descripcion": "Tijeras y navajas", "motor": "particulas", "params": {"c1": "#ef4444", "c2": "#3b82f6", "direccion": "flotar", "particula": "emoji", "emojis": "💈✂️🪒", "giro": true, "tmin": 10, "tmax": 18, "densidad": 0.6, "vel": 0.6, "alpha": 0.6, "tinte": "degradado", "tinte_alpha": 0.12}}, {"codigo": "chispas", "nombre": "Chispas", "icono": "🔥", "descripcion": "Brasas que suben", "motor": "particulas", "params": {"c1": "#f97316", "c2": "#facc15", "direccion": "arriba", "particula": "forma", "forma": "circulo", "estilo": "relleno", "brillo": true, "tmin": 1.5, "tmax": 4, "densidad": 1.8, "vel": 1.4, "alpha": 0.9, "tinte": "degradado", "tinte_alpha": 0.14}}, {"codigo": "corazones", "nombre": "Corazones", "icono": "💗", "descripcion": "Para enamorar", "motor": "particulas", "params": {"c1": "#f43f5e", "c2": "#f9a8d4", "direccion": "arriba", "particula": "forma", "forma": "corazon", "estilo": "relleno", "giro": true, "tmin": 7, "tmax": 20, "densidad": 1, "vel": 0.9, "alpha": 0.6}}];            // respaldo si la base aún no tiene el catálogo
let FONDOS_CAT = FONDOS_BASE.slice();
const MOTORES = {
  agua:        { n: 'Agua (olas)', colores: 2 },          aire:     { n: 'Aire (nubes)', colores: 2 },
  aurora:      { n: 'Aurora', colores: 3 },              gotas:    { n: 'Gotas (ondas)', colores: 2 },
  constelacion:{ n: 'Constelación', colores: 2, forma: true },
  particulas:  { n: 'Partículas (burbujas, nieve, confeti, emojis…)', colores: 3, forma: true, particulas: true },
  gradiente:   { n: 'Degradado vivo', colores: 3 },      neon:     { n: 'Neón retro (sol y grilla)', colores: 3 },
  ondas:       { n: 'Seda (líneas que ondulan)', colores: 2 }, espiral: { n: 'Galaxia (espiral)', colores: 3 },
  imagen:      { n: 'Imagen con movimiento', colores: 2, imagen: true }
};
const FORMAS_FONDO = { circulo: '●', cuadrado: '■', triangulo: '▲', rombo: '◆', estrella: '★', corazon: '♥', mezcla: '✦ Mezcla' };
// Fuentes (como en Instagram): títulos con personalidad y textos que se siguen leyendo bien
const FUENTES_ESTILO = {
  defecto:  { n: 'Default' },
  bubble:   { n: 'Bubble',    tit: "'Rubik Bubbles'",    txt: "'Nunito'",        g: 'Rubik+Bubbles&family=Nunito:wght@400;600;700;800' },
  deco:     { n: 'Deco',      tit: "'Poiret One'",       txt: "'Josefin Sans'",  g: 'Poiret+One&family=Josefin+Sans:wght@400;600;700' },
  editor:   { n: 'Editor',    tit: "'IBM Plex Mono'",    txt: "'IBM Plex Mono'", g: 'IBM+Plex+Mono:wght@400;600;700' },
  serif:    { n: 'Serif',     tit: "'DM Serif Display'", txt: "'Lora'",          g: 'DM+Serif+Display&family=Lora:wght@400;600;700' },
  poster:   { n: 'Poster',    tit: "'Abril Fatface'",    txt: "'Archivo'",       g: 'Abril+Fatface&family=Archivo:wght@400;600;700;800' },
  firma:    { n: 'Signature', tit: "'Dancing Script'",   txt: "'Inter'",         g: 'Dancing+Script:wght@600;700&family=Inter:wght@400;600;700;800' },
  redonda:  { n: 'Redonda',   tit: "'Fredoka'",          txt: "'Fredoka'",       g: 'Fredoka:wght@400;500;600;700' },
  moderna:  { n: 'Moderna',   tit: "'Space Grotesk'",    txt: "'Space Grotesk'", g: 'Space+Grotesk:wght@400;500;600;700' }
};
const fondoDe = cod => FONDOS_CAT.find(f => f.codigo === cod) || FONDOS_BASE.find(f => f.codigo === cod);
// sel = { codigo | 'propio', efecto, color, color2, color3, intensidad, velocidad, forma, vidrio }; imagenPropia = foto de la persona/negocio
function resolverFondo(sel, imagenPropia){
  if (!sel || !sel.codigo && !sel.tipo || sel.codigo === 'ninguno') return null;
  if (sel.codigo === 'propio'){
    if (!imagenPropia) return null;
    return { motor: 'imagen', propia: true, imagen: imagenPropia, params: { tinte: 'degradado', tinte_alpha: .12, c1: '#000000', c2: '#000000' }, capaItem: sel.efecto ? fondoDe(sel.efecto) : null };
  }
  const f = fondoDe(sel.codigo || sel.tipo); if (!f) return null;
  return { ...f, capaItem: f.motor === 'imagen' && f.params?.capa ? fondoDe(f.params.capa) : null };
}
(function(){   // estilos que necesita el fondo (una sola vez por página)
  const st = document.createElement('style');
  st.textContent = `#fondoAnim{position:fixed;inset:0;width:100vw;height:100vh;z-index:-1;pointer-events:none;display:none}
  html.con-fondo{background:var(--fondo,var(--grafito,#111)) !important}
  html.con-fondo body{background:transparent !important}
  html.fuente-propia :is(h1,h2,h3,.marca,.marca-neg,.p-nombre,.serv-nom,.titulo h2){font-family:var(--fuente-tit) !important;letter-spacing:normal}
  html.con-fondo.vidrio :is(.tarjeta,.kpi,.cita,.resumen-dia div,.ped,.trab,.agenda-scroll,.reserva,.hueco,.proxima.libre,.fondo-card,.link-pro,
    .serv,.barbero,.local,.personas,.item-res,.prod,.extra,.dia,.pro-cab,.vitrina-mini,.vit,.contacto a,.info-compra,.total,.res-item){
    background:color-mix(in srgb,var(--panel) 62%,transparent) !important;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}
  html.con-fondo.vidrio .agenda :is(.ag-col,.ag-cab,.ag-horas){background-color:transparent}`;
  document.head.appendChild(st);
})();
function vidrio(on){ document.documentElement.classList.toggle('vidrio', !!on); }
function aplicarFuente(cod){
  const f = FUENTES_ESTILO[cod], r = document.documentElement;
  if (!f || !f.tit){ r.classList.remove('fuente-propia'); r.style.removeProperty('--fuente'); r.style.removeProperty('--fuente-tit'); return; }
  if (!document.getElementById('fuenteEst-' + cod)){
    const l = document.createElement('link'); l.id = 'fuenteEst-' + cod; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=' + f.g + '&display=swap'; document.head.appendChild(l);
  }
  r.style.setProperty('--fuente', f.txt + ',system-ui,sans-serif'); r.style.setProperty('--fuente-tit', f.tit + ',' + f.txt + ',system-ui,sans-serif');
  r.classList.add('fuente-propia');
}
const FondoAnim = (() => {
  let cv, cx, cfg = null, M = null, raf = 0, t0 = 0, ult = 0, W = 0, H = 0, dpr = 1, items = [], ondas = [], proxGota = 0, img = null, imgSrc = '';
  const quieto = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rgba = (hex, a) => { const n = parseInt((hex || '#888888').slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${Math.max(0, Math.min(1, a))})`; };
  const R = (a, b) => a + Math.random() * (b - a);
  const oscuro = () => (getComputedStyle(document.documentElement).getPropertyValue('--esquema') || 'dark').trim() !== 'light';
  const glifos = t => { try { return [...new Intl.Segmenter('es', { granularity: 'grapheme' }).segment(t)].map(x => x.segment).filter(x => x.trim()); } catch(e) { return Array.from(t).filter(x => x.trim()); } };
  function lienzo(){
    if (cv) return;
    cv = document.createElement('canvas'); cv.id = 'fondoAnim'; cv.setAttribute('aria-hidden', 'true');
    document.body.prepend(cv); cx = cv.getContext('2d');
    addEventListener('resize', medir);
    document.addEventListener('visibilitychange', () => { cancelAnimationFrame(raf); if (!document.hidden && cfg && !quieto()) bucle(performance.now()); });
  }
  function medir(){
    if (!cv) return;
    dpr = Math.min(1.5, devicePixelRatio || 1); W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (cfg) sembrar();
  }
  const colorAl = i => [M.c1, M.c2, M.c3 || M.c1][i % 3];
  function sembrar(){
    const P = M, dens = (P.densidad || 1) * [0, .6, 1, 1.4, 1.9][P.intensidad], area = W * H / 1e5;
    items = []; ondas = [];
    const base = { particulas: 7, constelacion: 7, aire: .55, espiral: 40 }[P.motor] || 0;
    const tope = { constelacion: 120, espiral: 700, particulas: 160 }[P.motor] || 60;
    const cant = Math.round(Math.min(tope, Math.max(P.motor === 'aire' ? 5 : 8, base * area * dens)));
    const em = P.particula === 'emoji' ? glifos(P.emojis || '✨') : [];
    const formas = Object.keys(FORMAS_FONDO).filter(k => k !== 'mezcla');
    for (let i = 0; i < cant; i++) items.push({ x: R(0, W), y: R(0, H), r: P.motor === 'aire' ? R(.22, .45) * Math.max(W, H) : R(P.tmin || 4, P.tmax || 18),
      vx: R(-1, 1), vy: R(-1, 1), f: R(0, 6.3), g: R(.5, 1.2), rot: R(0, 6.3), vr: R(-.8, .8), col: Math.floor(R(0, 3)),
      forma: P.forma === 'mezcla' ? formas[Math.floor(R(0, formas.length))] : (P.forma || 'circulo'),
      glifo: em.length ? em[Math.floor(R(0, em.length))] : '', ang: R(0, 6.3), rad: Math.pow(Math.random(), .6), brazo: Math.floor(R(0, 3)) });
  }
  function figura(forma, x, y, r, rot){
    cx.save(); cx.translate(x, y); cx.rotate(rot); cx.beginPath();
    if (forma === 'cuadrado') cx.rect(-r * .8, -r * .8, r * 1.6, r * 1.6);
    else if (forma === 'triangulo'){ cx.moveTo(0, -r); cx.lineTo(r * .9, r * .7); cx.lineTo(-r * .9, r * .7); cx.closePath(); }
    else if (forma === 'rombo'){ cx.moveTo(0, -r); cx.lineTo(r * .75, 0); cx.lineTo(0, r); cx.lineTo(-r * .75, 0); cx.closePath(); }
    else if (forma === 'estrella'){ for (let i = 0; i < 10; i++){ const a = i * Math.PI / 5 - Math.PI / 2, rr = i % 2 ? r * .45 : r; cx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } cx.closePath(); }
    else if (forma === 'corazon'){ const s = r / 16; cx.moveTo(0, 5 * s); cx.bezierCurveTo(-16 * s, -6 * s, -6 * s, -16 * s, 0, -7 * s); cx.bezierCurveTo(6 * s, -16 * s, 16 * s, -6 * s, 0, 5 * s); cx.closePath(); }
    else cx.arc(0, 0, r, 0, Math.PI * 2);
    cx.restore();
  }
  function halo(x, y, r, color, a){ const g = cx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(color, a)); g.addColorStop(1, rgba(color, 0)); cx.fillStyle = g; cx.fillRect(x - r, y - r, r * 2, r * 2); }
  function tinte(k){
    const P = cfg, a = (P.tinte_alpha ?? .15) * k; if (!P.tinte || P.tinte === 'ninguno' || a <= 0) return;
    if (P.tinte === 'solido'){ cx.fillStyle = rgba(P.c1, a); cx.fillRect(0, 0, W, H); return; }
    if (P.tinte === 'radial'){ halo(W / 2, H / 2, Math.max(W, H) * .75, P.c1, a); return; }
    const g = cx.createLinearGradient(0, 0, W, H); g.addColorStop(0, rgba(P.c1, a)); g.addColorStop(1, rgba(P.c2, a)); cx.fillStyle = g; cx.fillRect(0, 0, W, H);
  }
  function cuadro(t){
    const k = [0, .55, 1, 1.5, 2.1][cfg.intensidad] * (oscuro() ? 1 : .8), d0 = Math.min(.05, (t - ult) / 1000) || 0; ult = t;
    cx.clearRect(0, 0, W, H);
    if (cfg.motor === 'imagen' && img && img.complete && img.naturalWidth){
      const s = t / 1000 * [0, .45, 1, 1.9][cfg.velocidad];
      const z = 1.12 + Math.sin(s * .05) * .06, iw = img.naturalWidth, ih = img.naturalHeight, e = Math.max(W / iw, H / ih) * z;
      const dx = (W - iw * e) / 2 + Math.sin(s * .07) * W * .03, dy = (H - ih * e) / 2 + Math.cos(s * .06) * H * .03;
      cx.globalAlpha = cfg.propia ? 1 : Math.min(1, .35 + .25 * k); cx.drawImage(img, dx, dy, iw * e, ih * e); cx.globalAlpha = 1;
    }
    tinte(k);
    // capa animada: el motor propio del fondo, o el "efecto encima" de una imagen
    const P = M, kk = k * (P.alpha ?? 1), v = [0, .45, 1, 1.9][P.velocidad] * (P.vel || 1), s = t / 1000 * v, dt = d0 * v;
    const C = P.c1, C2 = P.c2, C3 = P.c3 || P.c1;
    if (P.motor === 'agua'){
      for (let c = 0; c < 5; c++){
        const base = H * (.5 + c * .1), amp = 18 + c * 8, fr = .006 - c * .0008, vel = .6 + c * .25;
        cx.beginPath(); cx.moveTo(0, H);
        for (let x = 0; x <= W + 10; x += 10) cx.lineTo(x, base + Math.sin(x * fr + s * vel + c) * amp + Math.sin(x * fr * 2.3 - s * vel * .7) * amp * .35);
        cx.lineTo(W, H); cx.closePath(); cx.fillStyle = rgba(c % 2 ? C2 : C, (.09 + c * .03) * kk); cx.fill();
      }
      for (let i = 0; i < 6; i++) halo(W * (i + .5) / 6 + Math.sin(s * .4 + i) * 70, H * .22 + Math.cos(s * .3 + i * 2) * 50, 140 + 40 * Math.sin(s + i), C, .09 * kk);
    } else if (P.motor === 'aire'){
      items.forEach((b, i) => halo(b.x + Math.sin(s * .12 * b.g + b.f) * W * .2, b.y + Math.cos(s * .1 * b.g + b.f * 1.3) * H * .14, b.r, colorAl(i), .24 * kk));
    } else if (P.motor === 'gradiente'){
      const M = Math.max(W, H);
      [[.2, .25, C, 0], [.8, .3, C2, 1.7], [.5, .85, C3, 3.1], [.85, .85, C, 4.4]].forEach(([px, py, col, f], i) =>
        halo(W * px + Math.sin(s * .16 + f) * W * .25, H * py + Math.cos(s * .13 + f * 1.4) * H * .25, M * (.55 + .1 * Math.sin(s * .2 + i)), col, .55 * kk));
    } else if (P.motor === 'aurora'){
      for (let b = 0; b < 4; b++){
        const col1 = [C, C2, C3, C][b], col2 = [C2, C3, C, C2][b];
        const g = cx.createLinearGradient(0, 0, W, 0); g.addColorStop(0, rgba(col1, 0)); g.addColorStop(.3, rgba(col1, .26 * kk)); g.addColorStop(.7, rgba(col2, .22 * kk)); g.addColorStop(1, rgba(col2, 0));
        cx.beginPath();
        const yb = H * (.12 + b * .12), gros = 90 + b * 30;
        for (let x = 0; x <= W + 12; x += 12) cx.lineTo(x, yb + Math.sin(x * .004 + s * (.35 + b * .12) + b) * 60 + Math.sin(x * .011 - s * .3) * 22);
        for (let x = W + 12; x >= 0; x -= 12) cx.lineTo(x, yb + gros + Math.sin(x * .005 + s * (.3 + b * .1) + b * 2) * 70);
        cx.closePath(); cx.fillStyle = g; cx.fill();
      }
    } else if (P.motor === 'neon'){
      const hz = H * .58, sol = Math.min(W, H) * .22;
      halo(W / 2, hz - sol * .3, sol * 2.2, C, .25 * kk);
      const gs = cx.createLinearGradient(0, hz - sol * 1.3, 0, hz); gs.addColorStop(0, rgba(C3, .75 * kk)); gs.addColorStop(1, rgba(C, .75 * kk));
      cx.save(); cx.beginPath(); cx.arc(W / 2, hz - sol * .25, sol, Math.PI, 0); cx.closePath(); cx.clip(); cx.fillStyle = gs; cx.fillRect(0, 0, W, H);
      for (let i = 0; i < 7; i++){ const yy = hz - sol * .25 - i * sol * .14; cx.clearRect(0, yy - i * .9, W, 2 + i * .7); }
      cx.restore();
      cx.strokeStyle = rgba(C2, .55 * kk); cx.lineWidth = 1.4;
      for (let i = -14; i <= 14; i++){ cx.beginPath(); cx.moveTo(W / 2 + i * 8, hz); cx.lineTo(W / 2 + i * W * .16, H); cx.stroke(); }
      const fase = (s * .35) % 1;
      for (let i = 0; i < 14; i++){ const z = (i + fase) / 14, yy = hz + Math.pow(z, 2.2) * (H - hz); cx.globalAlpha = Math.min(1, z * 1.6); cx.beginPath(); cx.moveTo(0, yy); cx.lineTo(W, yy); cx.stroke(); }
      cx.globalAlpha = 1;
      const gh = cx.createLinearGradient(0, hz - 2, 0, hz + 30); gh.addColorStop(0, rgba(C2, .6 * kk)); gh.addColorStop(1, rgba(C2, 0)); cx.fillStyle = gh; cx.fillRect(0, hz - 2, W, 32);
    } else if (P.motor === 'ondas'){
      const n = Math.round(10 + 8 * (P.densidad || 1));
      for (let i = 0; i < n; i++){
        const g = cx.createLinearGradient(0, 0, W, 0); g.addColorStop(0, rgba(C, .4 * kk)); g.addColorStop(1, rgba(C2, .4 * kk));
        cx.beginPath();
        for (let x = 0; x <= W + 8; x += 8){
          const y = H * .5 + Math.sin(x * .003 + s * .5 + i * .18) * H * .18 + Math.sin(x * .007 - s * .3 + i * .1) * H * .06 + (i - n / 2) * 6;
          x ? cx.lineTo(x, y) : cx.moveTo(x, y);
        }
        cx.strokeStyle = g; cx.lineWidth = 1.3; cx.stroke();
      }
    } else if (P.motor === 'espiral'){
      const cxm = W / 2, cym = H / 2, M = Math.min(W, H) * .62;
      halo(cxm, cym, M * .55, C, .35 * kk); halo(cxm, cym, M * .18, '#ffffff', .25 * kk);
      items.forEach((p, i) => {
        const r = p.rad * M, a = p.brazo * 2.094 + p.rad * 5.5 + p.f * .25 - s * .25 / (0.35 + p.rad);
        const x = cxm + Math.cos(a) * r, y = cym + Math.sin(a) * r * .62;
        cx.fillStyle = rgba(colorAl(p.col), (.35 + .55 * (1 - p.rad)) * kk); cx.fillRect(x, y, 1.2 + p.g * 1.4, 1.2 + p.g * 1.4);
      });
    } else if (P.motor === 'constelacion'){
      const lim = Math.min(170, Math.max(W, H) * .15);
      items.forEach(p => { p.x += p.vx * 9 * dt; p.y += p.vy * 9 * dt; if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1; });
      for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++){
        const a = items[i], b = items[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < lim){ cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(b.x, b.y); cx.strokeStyle = rgba(C2, (1 - d / lim) * .32 * kk); cx.lineWidth = 1; cx.stroke(); }
      }
      items.forEach(p => { const tw = .55 + .45 * Math.sin(s * 2 + p.f); figura(p.forma, p.x, p.y, 1.8 + p.g * 2.4, p.rot); cx.fillStyle = rgba(C, (.45 + .55 * tw) * kk); cx.fill(); });
    } else if (P.motor === 'gotas'){
      if (t > proxGota){ ondas.push({ x: R(0, W), y: R(0, H), r: 0, c: Math.floor(R(0, 3)) }); proxGota = t + R(180, 560) / v / ((P.densidad || 1) * [0, .6, 1, 1.4, 1.9][P.intensidad]); }
      ondas = ondas.filter(o => o.r < 260);
      ondas.forEach(o => {
        o.r += 50 * dt;
        for (let a = 0; a < 3; a++){ const rr = o.r - a * 20; if (rr <= 0) continue;
          cx.beginPath(); cx.ellipse(o.x, o.y, rr, rr * .55, 0, 0, 7); cx.strokeStyle = rgba(colorAl(o.c), (1 - o.r / 260) * .6 * kk); cx.lineWidth = 2; cx.stroke(); }
      });
    } else if (P.motor === 'particulas'){
      const dir = P.direccion || 'arriba', est = P.estilo || 'relleno';
      items.forEach(p => {
        const sp = (14 + p.r * 1.4) * p.g * dt;
        p.f += dt * 1.5; if (P.giro) p.rot += p.vr * dt * 1.5;
        if (dir === 'arriba') p.y -= sp; else if (dir === 'abajo') p.y += sp; else if (dir === 'izquierda') p.x -= sp; else if (dir === 'derecha') p.x += sp;
        else if (dir === 'diagonal'){ p.y += sp; p.x += sp * .45; }
        else { p.x += p.vx * sp * .6; p.y += p.vy * sp * .6; }
        const m = p.r * 2 + 30;
        if (p.y < -m) { p.y = H + m; p.x = R(0, W); } if (p.y > H + m) { p.y = -m; p.x = R(0, W); }
        if (p.x < -m) { p.x = W + m; } if (p.x > W + m) { p.x = -m; }
        const x = p.x + (dir === 'arriba' || dir === 'abajo' ? Math.sin(p.f) * 14 : 0), col = colorAl(p.col);
        if (P.brillo) halo(x, p.y, p.r * 5, col, .35 * kk);
        if (P.particula === 'emoji'){
          cx.save(); cx.translate(x, p.y); cx.rotate(P.giro ? p.rot : 0); cx.globalAlpha = Math.min(1, .55 * kk + .15);
          cx.font = `${Math.round(p.r * 2)}px serif`; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText(p.glifo, 0, 0); cx.restore();
        } else if (P.particula === 'linea'){
          const dx = dir === 'diagonal' ? p.r * .45 : 0, dy = p.r;
          cx.beginPath(); cx.moveTo(x, p.y); cx.lineTo(x - dx, p.y - dy); cx.strokeStyle = rgba(col, .55 * kk); cx.lineWidth = 1.3; cx.stroke();
        } else {
          figura(p.forma, x, p.y, p.r, P.giro ? p.rot : Math.sin(p.f) * .25);
          if (est === 'contorno' || est === 'burbuja'){ cx.strokeStyle = rgba(col, .6 * kk); cx.lineWidth = 1.5; cx.stroke(); }
          cx.fillStyle = rgba(col, (est === 'relleno' ? .55 : .1) * kk); cx.fill();
          if (est === 'burbuja'){ cx.beginPath(); cx.arc(x - p.r * .35, p.y - p.r * .35, p.r * .2, 0, 7); cx.fillStyle = rgba('#ffffff', .45 * kk); cx.fill(); }
        }
      });
    }
  }
  const cada = 1000 / 30;
  function bucle(t){ if (!cfg) return; if (t - t0 >= cada){ t0 = t; cuadro(t); } raf = requestAnimationFrame(bucle); }
  return {
    // sel = elección de la persona { codigo, color, color2, color3, intensidad, velocidad, forma, vidrio }; item = fondo del catálogo (opcional, para probar)
    poner(sel, item){
      cancelAnimationFrame(raf);
      const f = item || resolverFondo(sel);
      vidrio(!!f && (sel?.vidrio ?? true));
      if (!sel || !f || !MOTORES[f.motor]){ cfg = null; if (cv){ cx.clearRect(0, 0, W, H); cv.style.display = 'none'; } document.documentElement.classList.remove('con-fondo'); return; }
      lienzo(); cv.style.display = 'block'; document.documentElement.classList.add('con-fondo');
      const p = f.params || {};
      const mezcla = (q, motor) => ({ ...q, motor, c1: sel.color || q.c1 || '#22d3ee', c2: sel.color2 || q.c2 || '#6366f1', c3: sel.color3 || q.c3 || q.c1,
              forma: sel.forma || q.forma || 'circulo', intensidad: sel.intensidad || 2, velocidad: sel.velocidad || 2 });
      cfg = { ...mezcla(p, f.motor), propia: !!f.propia };
      const capa = f.capaItem && MOTORES[f.capaItem.motor] && f.capaItem.motor !== 'imagen' ? f.capaItem : null;
      M = capa ? mezcla({ ...(capa.params || {}), tinte: 'ninguno' }, capa.motor) : cfg;
      cv.style.filter = f.motor !== 'imagen' && p.blur ? `blur(${p.blur}px)` : 'none';
      if (f.motor === 'imagen' && f.imagen && f.imagen !== imgSrc){ img = null; imgSrc = f.imagen; img = new Image(); img.onload = () => { if (cfg) cuadro(performance.now()); }; img.src = f.imagen; }
      medir(); ult = performance.now();
      if (quieto()){ cuadro(ult); return; }     // "reducir movimiento": una imagen fija
      bucle(ult);
    }
  };
})();

// Página pública (agenda, tienda, página web): aplica el estilo que eligió el admin del negocio
function aplicarEstiloPublico(n){
  const e = n && n.estilo; if (!e) return;
  if (e.fuente) aplicarFuente(e.fuente);
  if (e.fondo && e.sel) FondoAnim.poner(e.sel, { ...e.fondo, capaItem: e.capa || null });
}