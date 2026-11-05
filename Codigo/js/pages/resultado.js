/* =========================================================
   Resultado del nivel
   - Muestra ganado/perdido, estrellas, puntaje y el detalle
     (correctas, incorrectas, sin responder, palabras).
   - Botones: SIGUIENTE NIVEL (o VER FINAL en el último),
     REINTENTAR NIVEL y NIVELES.
   - Tras DF.rules.redirectSeconds vuelve sola (una sola vez)
     a "Selección de nivel". Cualquier botón cancela la espera.
   ========================================================= */
DF.boot(function(){
  const n = DF.nav.level();
  const t = DF.i18n.t;
  const total = DF.levels.length;
  const last = DF.store.session.get('last');
  if(!last || last.lvl !== n){ DF.nav.replace('niveles.html'); return; }

  document.getElementById('res-titulo').textContent = last.passed ? t('aprobado') : t('fallido');
  document.getElementById('res-stars').innerHTML = [0, 1, 2].map(k => '<span class="' + (k < last.stars ? '' : 'off') + '">★</span>').join('');
  document.getElementById('res-score').textContent = t('puntos') + ': ' + last.score;
  document.getElementById('res-stats').innerHTML =
      '<span class="ok">' + t('correctas', { n:last.correct }) + '</span>'
    + '<span class="bad">' + t('incorrectas', { n:last.wrong }) + '</span>'
    + '<span class="na">' + t('sinResponder', { n:last.unanswered }) + '</span>'
    + '<span>' + t('desafioFinal', { a:last.words, b:last.wordsTotal }) + '</span>';
  last.passed ? DF.audio.play('win') : DF.audio.play('lose');

  // Avisos de desbloqueo (siguiente nivel y prendas de este nivel)
  const notes = [];
  if(last.unlockedLevel) notes.push(t('desbloqueoNivel', { n:last.unlockedLevel }));
  const hasItems = DF.sprites.categories().some(c => c.items.some(i => i.lvl === n));
  if(last.firstTime && hasItems) notes.push(t('desbloqueoPrendas'));
  document.getElementById('res-note').innerHTML = notes.map(DF.esc).join('<br>');

  // Botones (el siguiente nivel está disponible aunque se haya perdido)
  const isLast = n >= total;
  const btns = [];
  btns.push('<a class="btn" id="btn-sig" href="' + (isLast ? 'fin.html' : 'nivel-titulo.html?n=' + (n + 1)) + '">' + (isLast ? t('verFinal') : t('sigNivel')) + '</a>');
  btns.push('<a class="btn" href="nivel-titulo.html?n=' + n + '">' + t('reintentarNivel') + '</a>');
  btns.push('<a class="btn dark" href="niveles.html">' + t('alNiveles') + '</a>');
  const box = document.getElementById('res-btns');
  box.innerHTML = btns.join('');

  // Redirección automática a "Selección de nivel" (una sola vez)
  const cd = document.getElementById('res-countdown');
  let left = DF.rules.redirectSeconds;
  const paint = () => { cd.textContent = t('redirect', { s:left }); };
  paint();
  const timer = setInterval(() => {
    left--;
    if(left <= 0){ clearInterval(timer); cd.textContent = ''; DF.nav.go('niveles.html'); return; }
    paint();
  }, 1000);
  box.addEventListener('click', e => { if(e.target.closest('a')){ clearInterval(timer); cd.textContent = ''; } });
  window.addEventListener('pagehide', () => clearInterval(timer));
}, { requiresUser:true, level:true });
