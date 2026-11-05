/* Información del caso: hay que abrir las 3 carpetas para habilitar la flecha */
DF.boot(function(){
  const lvl = DF.levels[DF.nav.level() - 1];
  const KEY = 'read_' + lvl.id;                       // carpetas leídas (sesión de ESTA cuenta)
  const read = DF.store.session.get(KEY) || {};

  const docs = ['testimonios', 'denuncia', 'pruebas'];
  /* Carpeta marrón con hoja crema, como en el prototipo */
  const folderSvg = '<svg viewBox="0 0 200 150" aria-hidden="true"><path d="M8 26a12 12 0 0 1 12-12h52l16 16h92a12 12 0 0 1 12 12v90a12 12 0 0 1-12 12H20a12 12 0 0 1-12-12z" fill="#4a2410"/><path d="M26 44h150l-8 22H22z" fill="#fbebd3"/><path d="M14 66h172l-10 72H24z" fill="#5a2c12"/></svg>';

  const wrap = document.getElementById('folders');
  wrap.innerHTML = docs.map(d => '<button class="folder' + (read[d] ? ' read' : '') + '" data-doc="' + d + '">' + folderSvg + '<span class="nm">' + DF.i18n.t(d) + '</span><span class="chk">✓ ' + DF.i18n.t('leer') + '</span></button>').join('');

  const btn = document.getElementById('btn-empezar');
  const falta = document.getElementById('caso-falta');
  /* La flecha → aparece (y late) recién cuando se leyeron las 3 carpetas */
  function refresh(){
    const left = docs.filter(d => !read[d]).length;
    DF.nav.enable('next', left === 0);
    btn.classList.toggle('pulse', left === 0);
    falta.textContent = left ? DF.i18n.t('carpetaFalta', { n: left }) : '';
  }
  refresh();

  const overlay = document.getElementById('doc-overlay');
  const sb = DF.scrollbar(document.getElementById('doc-body'), document.getElementById('doc-track'));
  wrap.addEventListener('click', e => {
    const f = e.target.closest('.folder'); if(!f) return;
    const d = f.dataset.doc, data = lvl[d];
    document.getElementById('doc-tab').innerHTML = folderSvg + '<span>' + DF.i18n.t(d).toUpperCase() + '</span>';
    document.getElementById('doc-sub').textContent = data.encabezado;
    const body = document.getElementById('doc-body');
    body.innerHTML = data.parrafos.map(p => '<p>' + DF.esc(p) + '</p>').join('') + (data.audio ? audioPlayer() : '');
    body.scrollTop = 0;
    overlay.classList.remove('hidden');
    sb.update();
    wireAudio(body);
    read[d] = true; f.classList.add('read');
    DF.store.session.set(KEY, read);
    refresh();
  });
  document.getElementById('doc-back').addEventListener('click', () => { stopWave(); overlay.classList.add('hidden'); });

  /* ---- forma de onda animada para la grabación (decorativa) ---- */
  let waveTimer = null;
  function audioPlayer(){
    return '<div class="wave" id="wave">' + Array.from({ length: 48 }, () => '<span style="height:' + (8 + Math.random() * 44) + 'px"></span>').join('') + '</div>'
      + '<button class="btn dark play-audio" id="play-audio">▶ ' + DF.i18n.t('reproducir') + '</button>';
  }
  function stopWave(){
    clearInterval(waveTimer); waveTimer = null;
    const w = document.getElementById('wave'); if(w) w.classList.remove('playing');
    const b = document.getElementById('play-audio'); if(b) b.textContent = '▶ ' + DF.i18n.t('reproducir');
  }
  function wireAudio(body){
    const b = body.querySelector('#play-audio'); if(!b) return;
    b.addEventListener('click', () => {
      const w = document.getElementById('wave');
      if(waveTimer){ stopWave(); return; }
      w.classList.add('playing'); b.textContent = '❚❚ ' + DF.i18n.t('pausar');
      waveTimer = setInterval(() => w.querySelectorAll('span').forEach(s => s.style.height = (8 + Math.random() * 44) + 'px'), 140);
    });
  }
}, { requiresUser:true, level:true });
