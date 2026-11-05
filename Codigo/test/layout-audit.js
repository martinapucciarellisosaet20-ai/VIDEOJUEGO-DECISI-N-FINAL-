/* =========================================================
   tests/layout-audit.js · Revisión automática del diseño responsive
   Se ejecuta DENTRO de la página (page.evaluate) y devuelve los
   problemas encontrados:
   - elementos que se salen del escenario o de la ventana
   - elementos importantes que se superponen entre sí
   - textos que no entran en su caja
   ========================================================= */
module.exports = function audit(){
  const problems = [];
  const stage = document.querySelector('.stage');
  const sr = stage.getBoundingClientRect();
  const vw = window.innerWidth, vh = window.innerHeight;
  const TOL = 2;
  const name = el => (el.id ? '#' + el.id : el.tagName.toLowerCase() + '.' + [...el.classList].join('.'));
  const shown = el => {
    if(!el.isConnected) return false;
    for(let e = el; e && e !== document.body; e = e.parentElement){
      const cs = getComputedStyle(e);
      if(cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false;
    }
    const r = el.getBoundingClientRect();
    return r.width > 1 && r.height > 1;
  };
  /* Para textos centrados en cajas anchas se mide el texto, no la caja */
  const TEXTY = '.title, .menu-user, .caso-hint, .caso-falta, .res-note, .res-countdown, .res-score, .res-stars';
  const box = (l, t, r, b) => ({ left: l, top: t, right: r, bottom: b, width: r - l, height: b - t });
  function rect(el){
    if(el.matches(TEXTY)){
      const range = document.createRange(); range.selectNodeContents(el);
      const r = range.getBoundingClientRect();
      // el renglón incluye espacio para acentos y descendentes: se mide la zona de las letras
      if(r.width > 0) return box(r.left, r.top + r.height * .1, r.right, r.bottom - r.height * .15);
    }
    const r = el.getBoundingClientRect();
    if(el.classList.contains('img-btn')){
      // los iconos PNG tienen márgenes transparentes: se mide el círculo visible (--hit-*)
      const cs = getComputedStyle(el);
      const pct = (n, d) => { const v = parseFloat(cs.getPropertyValue(n)); return isNaN(v) ? d : v / 100; };
      const l = pct('--hit-l', 0), t = pct('--hit-t', 0), w = pct('--hit-w', 1), h = pct('--hit-h', 1);
      return box(r.left + r.width * l, r.top + r.height * t, r.left + r.width * (l + w), r.top + r.height * (t + h));
    }
    return r;
  }

  // 1) Escenario dentro de la ventana
  if(sr.left < -TOL || sr.top < -TOL || sr.right > vw + TOL || sr.bottom > vh + TOL)
    problems.push('el escenario se sale de la ventana: ' + [sr.left, sr.top, sr.right, sr.bottom].map(Math.round));

  const BLOCKS = ['.title', '[data-nav]', '.btn', '.img-btn', '.tuto', '.lvl-list', '.lvl-track', '.rank-list', '.man-shot', '.man-keys',
    '.man-scroll', '.man-track', '.dress-card', '.dress-cap', '.dress-panel', '.banner', '.desc-panel', '.lvl-tag', '.folders', '.caso-hint',
    '.caso-falta', '.speech', '.q-hud', '.q-text', '.q-opts', '.ch-clue', '.grid', '.kb', '.res-stars', '.res-score', '.res-stats', '.res-note',
    '.res-btns', '.res-countdown', '.fin-av', '.fin-box', '.fin-btns', '.field', '.field input', '.menu-user', '.sup-block', 'label.label',
    'input[type=range]', 'select', '.splash-logo', '.doc-head', '.doc-frame', '.doc-track', '.modal'];
  const els = [...new Set(BLOCKS.flatMap(s => [...stage.querySelectorAll(s)]))].filter(shown)
    .filter(el => !el.closest('.lvl-list .lvl-row, .man-scroll, .doc-body'));   // contenido con scroll propio

  // 2) Nada importante fuera del escenario
  els.forEach(el => {
    const r = rect(el);
    if(r.left < sr.left - TOL || r.top < sr.top - TOL || r.right > sr.right + TOL || r.bottom > sr.bottom + TOL)
      problems.push(name(el) + ' se sale del escenario');
  });

  // 3) Superposiciones (salvo un elemento dentro de otro)
  const overlay = document.querySelector('.doc-overlay:not(.hidden), .tuto.big, .modal-backdrop:not(.hidden)');
  const layer = el => overlay ? overlay.contains(el) : true;
  const list = els.filter(layer);
  for(let i = 0; i < list.length; i++){
    for(let j = i + 1; j < list.length; j++){
      const a = list[i], b = list[j];
      if(a.contains(b) || b.contains(a)) continue;
      const ra = rect(a), rb = rect(b);
      const w = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
      const h = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
      if(w > TOL && h > TOL) problems.push(name(a) + ' se superpone con ' + name(b));
    }
  }

  // 4) Textos que no entran en su caja
  stage.querySelectorAll('.btn, .q-opt, .lvl-row .tag, .banner h1, .key, .tuto-time, .rank-bar .name').forEach(el => {
    if(!shown(el)) return;
    if(el.scrollWidth > el.clientWidth + 2) problems.push(name(el) + ' texto cortado (' + el.textContent.trim().slice(0, 30) + ')');
  });
  return problems;
};
