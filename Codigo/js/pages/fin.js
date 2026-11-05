/* Pantalla final del juego (se llega con "VER FINAL" después del nivel 10) */
DF.boot(function(){
  const t = DF.i18n.t;
  const P = DF.progress;
  const total = DF.levels.length;
  if(!P.isPlayed(total)){ DF.nav.replace('niveles.html'); return; }

  document.getElementById('fin-av').innerHTML = DF.sprites.avatar(null, 6);
  const stars = DF.levels.map(l => {
    const r = P.result(l.id) || { stars:0 };
    return '<span>' + t('nivel', { n:l.id }) + ' ' + '★'.repeat(r.stars) + '<i style="opacity:.25;font-style:normal">' + '★'.repeat(3 - r.stars) + '</i></span>';
  }).join('');
  document.getElementById('fin-box').innerHTML =
      '<div class="sub">' + DF.esc(t('finSub', { n:total })) + '</div>'
    + '<div class="stat">' + DF.esc(t('finGanados', { a:P.wonCount(), b:total })) + '</div>'
    + '<div class="stat">' + DF.esc(t('finPuntos', { p:P.totalScore() })) + '</div>'
    + '<div class="fin-stars">' + stars + '</div>'
    + '<p>' + DF.esc(t('finTexto')) + '</p>';
  DF.audio.play('win');
}, { requiresUser:true });
