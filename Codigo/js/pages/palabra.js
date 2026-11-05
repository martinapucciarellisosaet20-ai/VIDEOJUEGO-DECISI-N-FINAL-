/* =========================================================
   Desafío de palabras · final de cada nivel (estilo "adiviná la palabra")
   - Se juega SIEMPRE después de las 10 preguntas.
   - Cada palabra tiene una pista y 6 intentos. Verde = letra y lugar correctos,
     amarillo = la letra está en otro lugar, gris = no está.
   - Al terminar se guarda el nivel como JUGADO (desbloquea el siguiente
     aunque se pierda) y se pasa al resultado.
   ========================================================= */
DF.boot(function(){
  const lvlNum = DF.nav.level();
  const t = DF.i18n.t;
  const lvl = DF.levels[lvlNum - 1];
  const R = DF.rules;
  const gridEl = document.getElementById('grid');
  const kbEl = document.getElementById('kb');

  // solo se entra desde el final del cuestionario del mismo nivel
  const quiz = DF.store.session.get('quiz');
  if(!quiz || quiz.lvl !== lvlNum){ DF.nav.replace('niveles.html'); return; }
  DF.nav.keys(false);                        // el teclado escribe letras (las teclas ← → no navegan)
  // La flecha ← lleva DIRECTO al menú principal: el intento del nivel se abandona
  document.querySelector('[data-nav="back"]').addEventListener('click', () => DF.store.session.remove('quiz'));

  const state = { q: 0, row: 0, buf: [], busy: false, score: 0, solved: 0, words: [], keys: {} };
  const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
  const word = () => norm(lvl.palabras[state.q].respuesta);

  document.getElementById('clue-judge').innerHTML = DF.sprites.judge(2);

  /* ---------- tablero ---------- */
  /* Tamaño de las casillas según el ancho del escenario (horizontal 1280 / vertical 720) */
  function cellSize(){
    const len = word().length;
    const portrait = DF.stage.portrait;
    const cs = Math.min(portrait ? 64 : 50, Math.floor((DF.stage.width - (portrait ? 60 : 140) - (len - 1) * 6) / len));
    gridEl.style.setProperty('--cs', cs + 'px');
  }
  window.addEventListener('df:layout', () => { if(state.q < lvl.palabras.length) cellSize(); });

  function buildGrid(){
    const len = word().length;
    cellSize();
    gridEl.innerHTML = '';
    for(let r = 0; r < R.attempts; r++){
      const row = document.createElement('div'); row.className = 'row';
      for(let c = 0; c < len; c++){ const cell = document.createElement('div'); cell.className = 'cell'; row.appendChild(cell); }
      gridEl.appendChild(row);
    }
    const q = lvl.palabras[state.q];
    document.getElementById('clue-txt').textContent = q.pista;
    document.getElementById('clue-meta').innerHTML = DF.i18n.t('palabra', { a: state.q + 1, b: lvl.palabras.length }) + '<br>' + DF.i18n.t('letras', { n: len });
    state.row = 0; state.buf = []; state.keys = {}; state.busy = false;
    resetKeys(); highlight();
  }
  const rowEl = r => gridEl.children[r];
  function highlight(){
    gridEl.querySelectorAll('.cell.active').forEach(c => c.classList.remove('active'));
    const row = rowEl(state.row); if(!row) return;
    const c = row.children[state.buf.length]; if(c) c.classList.add('active');
  }

  /* ---------- teclado en pantalla ---------- */
  const KEYS = ['QWERTYUIOP', 'ASDFGHJKLÑ', 'ZXCVBNM'];
  function buildKeyboard(){
    kbEl.innerHTML = '';
    KEYS.forEach((letters, i) => {
      const row = document.createElement('div'); row.className = 'krow';
      if(i === 2){ row.appendChild(mkKey('ENTER', DF.i18n.t('enter'), true)); }
      letters.split('').forEach(l => row.appendChild(mkKey(l, l)));
      if(i === 2){ row.appendChild(mkKey('BACK', DF.i18n.t('borrar'), true)); }
      kbEl.appendChild(row);
    });
  }
  function mkKey(code, label, wide){
    const b = document.createElement('button');
    b.className = 'key' + (wide ? ' wide' : ''); b.textContent = label; b.dataset.k = code; b.type = 'button';
    b.addEventListener('click', () => press(code));
    return b;
  }
  function resetKeys(){ kbEl.querySelectorAll('.key').forEach(k => k.classList.remove('good', 'near', 'miss')); }
  const rank = { miss: 1, near: 2, good: 3 };
  function paintKey(letter, status){
    const prev = state.keys[letter];
    if(prev && rank[prev] >= rank[status]) return;
    state.keys[letter] = status;
    const el = kbEl.querySelector('.key[data-k="' + letter + '"]');
    if(el){ el.classList.remove('good', 'near', 'miss'); el.classList.add(status); }
  }

  /* ---------- entrada ---------- */
  function press(code){
    if(state.busy) return;
    const len = word().length;
    if(code === 'ENTER') return submit();
    if(code === 'BACK'){ if(state.buf.length){ state.buf.pop(); const c = rowEl(state.row).children[state.buf.length]; c.textContent = ''; highlight(); DF.audio.play('key'); } return; }
    if(state.buf.length >= len) return;
    const c = rowEl(state.row).children[state.buf.length];
    c.textContent = code; c.classList.add('pop'); setTimeout(() => c.classList.remove('pop'), 130);
    state.buf.push(code); highlight(); DF.audio.play('key');
  }

  document.addEventListener('keydown', e => {
    if(e.ctrlKey || e.metaKey || e.altKey) return;
    if(e.key === 'Enter'){ e.preventDefault(); return press('ENTER'); }
    if(e.key === 'Backspace'){ e.preventDefault(); return press('BACK'); }
    if(e.key.length === 1){
      let ch = e.key.toUpperCase();
      if(ch !== 'Ñ') ch = norm(ch);
      if(/^[A-ZÑ]$/.test(ch)) press(ch);
    }
  });

  /* ---------- evaluación ---------- */
  function evaluate(guess, target){
    const res = Array(guess.length).fill('miss');
    const left = {};
    for(let i = 0; i < target.length; i++){
      if(guess[i] === target[i]) res[i] = 'good'; else left[target[i]] = (left[target[i]] || 0) + 1;
    }
    for(let i = 0; i < guess.length; i++){
      if(res[i] === 'good') continue;
      if(left[guess[i]] > 0){ res[i] = 'near'; left[guess[i]]--; }
    }
    return res;
  }

  function submit(){
    const target = word();
    if(state.buf.length < target.length){
      DF.toast(DF.i18n.t('pocasLetras'));
      const r = rowEl(state.row); r.classList.add('shake'); setTimeout(() => r.classList.remove('shake'), 380);
      DF.audio.play('bad'); return;
    }
    state.busy = true;
    const guess = state.buf.join('');
    const res = evaluate(guess, target);
    const row = rowEl(state.row);
    gridEl.querySelectorAll('.cell.active').forEach(c => c.classList.remove('active'));

    res.forEach((st, i) => {
      setTimeout(() => {
        const c = row.children[i]; c.classList.add('flip');
        setTimeout(() => { c.classList.add(st); paintKey(guess[i], st); }, 220);
      }, i * 110);
    });

    const done = res.length * 110 + 500;
    setTimeout(() => {
      const win = guess === target;
      state.row++; state.buf = [];
      if(win){
        const left = R.attempts - state.row;           // intentos que sobraron
        const pts = R.wordBase + R.wordBonus * left;
        state.score += pts; state.solved++;
        state.words.push({ w: target, ok: true, pts });
        DF.audio.play('ok'); DF.toast(DF.i18n.t('correcto') + ' +' + pts);
        setTimeout(next, 1400);
      } else if(state.row >= R.attempts){
        state.words.push({ w: target, ok: false, pts: 0 });
        DF.audio.play('bad'); DF.toast(DF.i18n.t('respuestaEra', { w: target }));
        setTimeout(next, 2400);
      } else {
        state.busy = false; highlight();
      }
    }, done);
  }

  function next(){
    state.q++;
    if(state.q >= lvl.palabras.length) return finish();
    buildGrid();
  }

  /* El nivel se gana con passMinSolved aciertos Y wordPass palabras.
     Ganado o perdido, el nivel queda terminado y se desbloquea el siguiente. */
  let finished = false;
  function finish(){
    if(finished) return; finished = true;
    const total = quiz.total;
    const passed = quiz.correct >= R.passMinSolved && state.solved >= R.wordPass;
    const stars = !passed ? 0 : quiz.correct === total ? 3 : quiz.correct >= total - 1 ? 2 : 1;
    const score = quiz.score + state.score;
    const info = DF.progress.finishLevel(lvlNum, { score, stars, passed, correct:quiz.correct, wrong:quiz.wrong, unanswered:quiz.unanswered, words:state.solved, wordsTotal:lvl.palabras.length });
    DF.store.session.set('last', { lvl:lvlNum, score, stars, passed, correct:quiz.correct, wrong:quiz.wrong, unanswered:quiz.unanswered,
      total, words:state.solved, wordsTotal:lvl.palabras.length, firstTime:info.firstTime, unlockedLevel:info.unlockedLevel });
    DF.store.session.remove('quiz');             // el desafío no se puede repetir recargando
    DF.nav.go('resultado.html', lvlNum);
  }

  buildKeyboard(); buildGrid();
}, { requiresUser:true, level:true });
