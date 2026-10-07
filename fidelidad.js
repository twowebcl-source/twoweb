// TwoWeb — Tarjeta de fidelidad (la usan agenda.html y panel.html)
// tarjetaFidelidadHTML(t) dibuja la tarjeta con el diseño del negocio:
//   t = { meta, sellos, pct, texto, titulo, imagen, color, tono, negocio, logo, listo, pendiente, icono }
(function () {
  const css = `
  .tf { position:relative; border-radius:20px; overflow:hidden; padding:18px 18px 16px; color:#fff; text-align:left;
        min-height:210px; display:flex; flex-direction:column; justify-content:space-between; gap:12px;
        box-shadow:0 14px 34px rgba(0,0,0,.35); isolation:isolate; font-family:inherit; }
  .tf::before { content:""; position:absolute; inset:0; z-index:-2; background:var(--tf-fondo); background-size:cover; background-position:center; }
  .tf::after { content:""; position:absolute; inset:0; z-index:-1; background:var(--tf-velo); }
  .tf.oscuro { color:#14161c; }
  .tf-cab { display:flex; align-items:center; gap:10px; }
  .tf-logo { width:38px; height:38px; border-radius:10px; object-fit:cover; background:rgba(255,255,255,.85); flex-shrink:0; }
  .tf-neg { font-size:11.5px; letter-spacing:.12em; text-transform:uppercase; opacity:.85; font-weight:700; }
  .tf-tit { font-size:21px; font-weight:800; line-height:1.15; text-shadow:0 2px 10px rgba(0,0,0,.25); }
  .tf.oscuro .tf-tit { text-shadow:none; }
  .tf-cont { margin-left:auto; font-size:12.5px; font-weight:700; padding:4px 10px; border-radius:999px; background:rgba(255,255,255,.2); backdrop-filter:blur(6px); white-space:nowrap; }
  .tf.oscuro .tf-cont { background:rgba(0,0,0,.08); }
  .tf-sellos { display:grid; grid-template-columns:repeat(auto-fill, minmax(36px, 1fr)); gap:8px; }
  .tf-s { aspect-ratio:1; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:17px;
          border:2px dashed rgba(255,255,255,.65); background:rgba(255,255,255,.08); }
  .tf.oscuro .tf-s { border-color:rgba(0,0,0,.35); background:rgba(255,255,255,.35); }
  .tf-s.on { border:2px solid #fff; background:#fff; color:var(--tf-acento); font-weight:900; }
  .tf.oscuro .tf-s.on { border-color:var(--tf-acento); background:var(--tf-acento); color:#fff; }
  .tf-s.premio { border-style:solid; font-size:19px; background:rgba(255,255,255,.22); }
  .tf-pie { display:flex; justify-content:space-between; align-items:flex-end; gap:10px; }
  .tf-premio small { display:block; font-size:10.5px; letter-spacing:.1em; text-transform:uppercase; opacity:.8; font-weight:700; }
  .tf-premio b { font-size:16px; line-height:1.2; }
  .tf-sello-txt { font-size:11px; opacity:.8; text-align:right; }
  `;
  function poner() {
    if (document.getElementById('tf-css')) return;
    const st = document.createElement('style'); st.id = 'tf-css'; st.textContent = css; document.head.appendChild(st);
  }
  const e = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const colorOk = c => /^#[0-9a-f]{6}$/i.test(c || '') ? c : '#7c5cff';
  // Tarjetas extra (Fase 39): cumpleaños y beneficio. t = { tipo, titulo, texto, pct, ventana, imagen, color, tono, negocio, logo, nacimiento, usado }
  const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  window.textoVentanaCumple = v => v === 'dia' ? 'el día de tu cumpleaños' : v === 'mes' ? 'tu mes de cumpleaños' : 'tu semana de cumpleaños';
  window.tarjetaExtraHTML = function (t) {
    poner();
    const c = colorOk(t.color), oscuro = t.tono === 'oscuro', cumple = t.tipo === 'cumpleanos';
    const img = /^data:image\/(jpeg|png|webp);base64,/.test(t.imagen || '') ? t.imagen : '';
    const fondo = img ? `url("${img}")` : `linear-gradient(135deg, ${c}, color-mix(in srgb, ${c} 45%, #000))`;
    const velo = oscuro ? 'linear-gradient(180deg, rgba(255,255,255,.55), rgba(255,255,255,.75))'
                        : (img ? 'linear-gradient(180deg, rgba(0,0,0,.25), rgba(0,0,0,.6))' : 'radial-gradient(circle at 85% 0%, rgba(255,255,255,.25), transparent 55%)');
    const nac = /^\d{2}-\d{2}$/.test(t.nacimiento || '') ? `${+t.nacimiento.slice(3)} de ${MESES[+t.nacimiento.slice(0, 2) - 1]}` : '';
    const premio = cumple ? (t.pct >= 100 ? 'Tu servicio gratis' : `${t.pct || 0}% de descuento`) : (t.texto || '');
    const pie = cumple ? (nac ? `🎂 ${nac}${t.usado ? ' · ya usado este año' : ''}` : `En ${textoVentanaCumple(t.ventana)}`) : '';
    return `<div class="tf ${oscuro ? 'oscuro' : ''}" style="--tf-fondo:${e(fondo)};--tf-velo:${velo};--tf-acento:${c};min-height:170px;">
      <div class="tf-cab">${t.logo ? `<img class="tf-logo" src="${e(t.logo)}" alt="">` : ''}
        <div><div class="tf-neg">${e(t.negocio || '')}</div><div class="tf-tit">${e(t.titulo || (cumple ? 'Tu cumpleaños' : 'Beneficio'))}</div></div>
        <span class="tf-cont" style="font-size:22px;padding:2px 10px;">${cumple ? '🎂' : '🎁'}</span></div>
      ${cumple && t.texto ? `<div style="font-size:14px;opacity:.9;">${e(t.texto)}</div>` : ''}
      <div class="tf-pie"><div class="tf-premio"><small>${cumple ? 'Tu regalo' : 'Beneficio'}</small><b>${e(premio)}</b></div>
        ${pie ? `<div class="tf-sello-txt">${e(pie)}</div>` : ''}</div>
    </div>`;
  };
  window.premioFidelidad = t => t.texto || (t.pct >= 100 ? 'Tu próxima atención gratis' : `${t.pct}% de descuento en tu próxima atención`);
  window.tarjetaFidelidadHTML = function (t) {
    poner();
    const meta = Math.max(1, Math.min(10, t.meta || 10)), lleno = t.listo || t.pendiente;
    const n = lleno ? meta : Math.min(t.sellos || 0, meta), c = colorOk(t.color), oscuro = t.tono === 'oscuro';
    const img = /^data:image\/(jpeg|png|webp);base64,/.test(t.imagen || '') ? t.imagen : '';
    const fondo = img ? `url("${img}")` : `linear-gradient(135deg, ${c}, color-mix(in srgb, ${c} 45%, #000))`;
    const velo = oscuro ? 'linear-gradient(180deg, rgba(255,255,255,.55), rgba(255,255,255,.75))'
                        : (img ? 'linear-gradient(180deg, rgba(0,0,0,.25), rgba(0,0,0,.6))' : 'radial-gradient(circle at 85% 0%, rgba(255,255,255,.25), transparent 55%)');
    const icono = t.icono || '★';
    return `<div class="tf ${oscuro ? 'oscuro' : ''}" style="--tf-fondo:${e(fondo)};--tf-velo:${velo};--tf-acento:${c};">
      <div class="tf-cab">${t.logo ? `<img class="tf-logo" src="${e(t.logo)}" alt="">` : ''}
        <div><div class="tf-neg">${e(t.negocio || 'Tarjeta de fidelidad')}</div><div class="tf-tit">${e(t.titulo || 'Tarjeta de fidelidad')}</div></div>
        <span class="tf-cont">${n}/${meta}</span></div>
      <div class="tf-sellos">${Array.from({ length: meta }, (_, i) => `<div class="tf-s ${i < n ? 'on' : ''}">${i < n ? '✓' : e(icono)}</div>`).join('')}<div class="tf-s premio">🎁</div></div>
      <div class="tf-pie"><div class="tf-premio"><small>Tu premio</small><b>${e(premioFidelidad(t))}</b></div>
        <div class="tf-sello-txt">${meta} ${meta === 1 ? 'atención' : 'atenciones'}<br>= premio</div></div>
    </div>`;
  };
})();
