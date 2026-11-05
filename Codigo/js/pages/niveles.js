/* =========================================================
   Selección de nivel
   - Estados: bloqueado 🔒, disponible, ganado (estrellas), perdido.
   - Terminar un nivel (ganado o perdido) desbloquea el siguiente.
   - Botón "SIGUIENTE NIVEL" al primer nivel desbloqueado sin jugar
     (o "VER FINAL" cuando ya se jugaron todos).
   - Mini video tutorial abajo a la derecha (ver tutorial() más abajo).
   ========================================================= */
DF.boot(function(){
  const t = DF.i18n.t;
  const P = DF.progress;
  const list = document.getElementById('lvl-list');
  const play = '<svg viewBox="0 0 24 28" aria-hidden="true"><path d="M3 2l19 12L3 26z" fill="#fbebd3"/></svg>';
  const lock = '<svg viewBox="0 0 24 28" aria-hidden="true" style="margin:0"><rect x="3" y="12" width="18" height="14" rx="2" fill="#fbebd3"/><path d="M7 12V8a5 5 0 0 1 10 0v4" fill="none" stroke="#fbebd3" stroke-width="3"/></svg>';
  const pending = P.nextPending();

  list.innerHTML = DF.levels.map(l => {
    const st = P.status(l.id);
    const res = P.result(l.id);
    const label = { available:t('nivelDisp'), won:t('nivelGanado'), lost:t('nivelPerdido'), locked:t('nivelBloq', { n:l.id - 1 }) }[st];
    const stars = res ? '<div class="stars">' + [0, 1, 2].map(k => '<span class="' + (k < res.stars ? '' : 'off') + '">★</span>').join('') + '</div>' : '';
    const inner = '<div class="dot">' + (st === 'locked' ? lock : play) + '</div>'
      + '<div class="tag">' + t('nivel', { n:l.id }) + '</div>'
      + '<div class="info">' + stars + '<div class="state">' + label + '</div></div>';
    const cls = 'lvl-row ' + st + (l.id === pending ? ' next' : '');
    return st === 'locked'
      ? '<div class="' + cls + '" data-n="' + l.id + '" aria-disabled="true">' + inner + '</div>'
      : '<a class="' + cls + '" data-n="' + l.id + '" href="nivel-titulo.html?n=' + l.id + '">' + inner + '</a>';
  }).join('');

  list.querySelectorAll('.lvl-row.locked').forEach(el => el.addEventListener('click', () => {
    DF.audio.play('bad'); DF.toast(t('nivelBloq', { n:+el.dataset.n - 1 }));
    el.classList.add('shake'); setTimeout(() => el.classList.remove('shake'), 400);
  }));

  // Botón "Siguiente nivel" (una vez que se jugó al menos un nivel)
  const btn = document.getElementById('lvl-next');
  if(P.playedCount() > 0){
    if(pending){ btn.href = 'nivel-titulo.html?n=' + pending; btn.textContent = t('sigNivel'); btn.classList.remove('hidden'); }
    else if(P.allPlayed()){ btn.href = 'fin.html'; btn.textContent = t('verFinal'); btn.classList.remove('hidden'); }
  }

  // Lleva a la vista el próximo nivel a jugar
  const target = list.querySelector('.lvl-row.next');
  if(target && target.offsetTop + target.offsetHeight > list.clientHeight) list.scrollTop = target.offsetTop - 20;
  DF.scrollbar(list, document.getElementById('lvl-track'));

  tutorial(btn.classList.contains('hidden'));
}, { requiresUser:true });

/* ---------------------------------------------------------
   Mini video tutorial
   - Archivo: assets/video/tutorial.mp4 (cómo se juega, cómo
     responder y cómo avanzar de nivel). Sin sonido.
   - Controles: reproducir / pausar, barra de avance (tocar o
     arrastrar para ir a un momento) y ampliar / achicar.
   - Si el video no se puede cargar, el reproductor se oculta
     (nunca queda un reproductor que no funcione).
   --------------------------------------------------------- */
function tutorial(solo){
  const t = DF.i18n.t;
  const box = document.getElementById('tuto');
  const video = document.getElementById('tuto-video');
  const playBtn = document.getElementById('tuto-play');
  const sizeBtn = document.getElementById('tuto-size');
  const prog = document.getElementById('tuto-prog');
  const fill = document.getElementById('tuto-fill');
  const time = document.getElementById('tuto-time');
  const backdrop = document.getElementById('tuto-backdrop');
  if(!box || !video) return;

  const ICON = {
    play:  '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.2l10 5.8-10 5.8z" fill="currentColor"/></svg>',
    pause: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="2.5" width="3.6" height="11" rx="1" fill="currentColor"/><rect x="9.4" y="2.5" width="3.6" height="11" rx="1" fill="currentColor"/></svg>',
    grow:  '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    shrink:'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 2v4H2M14 6h-4V2M10 14v-4h4M2 10h4v4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  const fmt = s => { s = Math.max(0, Math.floor(s || 0)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const label = (el, key) => { const v = t(key); el.setAttribute('aria-label', v); el.title = v; };

  /* Sin archivo o con error de carga → no se muestra el reproductor */
  let failed = false;
  function fail(){ failed = true; box.classList.add('hidden'); setBig(false); }
  video.addEventListener('error', fail);
  if(video.error || video.networkState === 3) return fail();
  box.classList.toggle('solo', !!solo);
  box.classList.remove('hidden');

  function paint(){
    const playing = !video.paused && !video.ended;
    playBtn.innerHTML = playing ? ICON.pause : ICON.play;
    label(playBtn, playing ? 'pausar' : 'reproducir');
    const d = video.duration || 0;
    const pct = d ? (video.currentTime / d) * 100 : 0;
    fill.style.width = pct + '%';
    prog.setAttribute('aria-valuenow', Math.round(pct));
    time.textContent = fmt(playing || video.currentTime ? video.currentTime : d);
  }
  function toggle(){
    if(failed) return;
    if(video.paused || video.ended){ const p = video.play(); if(p && p.catch) p.catch(() => {}); }
    else video.pause();
  }
  playBtn.addEventListener('click', toggle);
  video.addEventListener('click', toggle);
  ['play', 'pause', 'ended', 'timeupdate', 'loadedmetadata', 'durationchange'].forEach(ev => video.addEventListener(ev, paint));

  /* Barra de avance: tocar o arrastrar (corrige la escala del escenario) */
  function seek(e){
    const r = prog.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    if(video.duration) video.currentTime = x * video.duration;
    paint();
  }
  let dragging = false;
  prog.addEventListener('pointerdown', e => { dragging = true; prog.setPointerCapture(e.pointerId); seek(e); });
  prog.addEventListener('pointermove', e => { if(dragging) seek(e); });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => prog.addEventListener(ev, () => { dragging = false; }));
  // ← → sobre la barra adelantan / atrasan 5 s (y nunca cambian de pantalla)
  prog.addEventListener('keydown', e => {
    if(e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault(); e.stopPropagation();
    if(video.duration) video.currentTime = Math.min(video.duration, Math.max(0, video.currentTime + (e.key === 'ArrowRight' ? 5 : -5)));
  });

  /* Ampliar / achicar: el mismo reproductor, grande y centrado */
  function setBig(on){
    box.classList.toggle('big', on);
    backdrop.classList.toggle('hidden', !on);
    sizeBtn.innerHTML = on ? ICON.shrink : ICON.grow;
    label(sizeBtn, on ? 'tutoAchicar' : 'tutoAmpliar');
    DF.nav.keys(!on);                                 // con el video ampliado, ← → no cambian de pantalla
  }
  sizeBtn.addEventListener('click', () => setBig(!box.classList.contains('big')));
  backdrop.addEventListener('click', () => setBig(false));
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && box.classList.contains('big')) setBig(false); });

  setBig(false);
  paint();
}
