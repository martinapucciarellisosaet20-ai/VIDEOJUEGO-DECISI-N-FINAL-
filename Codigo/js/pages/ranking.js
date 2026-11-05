/* Ranking: jugadores de ejemplo + tu puntaje real */
DF.boot(function(){
  const R = DF.rules;
  const MAX = DF.levels.length * (R.perLevel * (R.basePoints + R.timeBonusMax) + 3 * (R.wordBase + R.wordBonus * (R.attempts - 1)));
  const rivals = [
    { name:'JusticiaPixel', score:Math.round(MAX*.82), avatar:{ pelo:'melena', gafas:'redondas', piel:'clara' } },
    { name:'Fiscala_8bit',  score:Math.round(MAX*.61), avatar:{ pelo:'semi', gorros:'gorraNegra', piel:'trigo' } },
    { name:'MazoDeOro',     score:Math.round(MAX*.4),  avatar:{ pelo:'cortoNegro', auriculares:'negros', piel:'oscura' } },
    { name:'Novato_Legal',  score:Math.round(MAX*.2),  avatar:{ pelo:'carre', gorros:'rana', piel:'media' } }
  ];
  const me = { name:DF.store.state.user, score:DF.progress.totalScore(), avatar:DF.store.state.avatar, me:true };
  const all = rivals.concat(me).sort((a, b) => b.score - a.score).slice(0, 5);
  if(!all.includes(me)) all[4] = me;                                   // tu fila siempre se ve

  const list = document.getElementById('rank-list');
  list.innerHTML = all.map((p, i) => {
    const pct = Math.max(8, Math.round(p.score / MAX * 100));
    const stars = p.score / MAX > .66 ? 3 : p.score / MAX > .33 ? 2 : p.score > 0 ? 1 : 0;
    const st = [0,1,2].map(k => '<span class="' + (k < stars ? '' : 'off') + '">★</span>').join('');
    return '<div class="rank-row' + (p.me ? ' me' : '') + '">'
      + '<div class="rank-pos">' + (i + 1) + '</div>'
      + '<div class="rank-avatar">' + DF.sprites.avatar(p.avatar, 7, { crop:'face' }) + '</div>'
      + '<div class="rank-bar"><div class="fill" style="width:0" data-w="calc(250px + (100% - 250px) * ' + (pct / 100) + ')"></div><span class="name">' + p.name.replace(/</g,'&lt;') + '</span></div>'
      + '<div class="rank-pts">' + p.score + ' ' + DF.i18n.t('pts') + '</div>'
      + '<div class="rank-stars">' + st + '</div></div>';
  }).join('');
  requestAnimationFrame(() => requestAnimationFrame(() => list.querySelectorAll('.fill').forEach(f => f.style.width = f.dataset.w)));
}, { requiresUser:true });
