/* =========================================================
   Cuestionario del nivel · 10 preguntas de opción múltiple
   - 20 s por pregunta (DF.createTimer): contador numérico + barra.
   - Cada pregunta se responde una sola vez (bloqueo `answered`).
   - Si se agota el tiempo: "sin responder", 0 puntos, sigue solo.
   - No se puede saltear ni volver a una pregunta anterior: la flecha
     ← lleva DIRECTO al menú principal (se abandona el intento) y las
     teclas ← → / WASD + Enter o 1-4 se usan para responder.
   - Al terminar pasa SIEMPRE al desafío final (palabra.html).
   ========================================================= */
DF.boot(function(){
  const n = DF.nav.level();
  const lvl = DF.levels[n - 1];
  const R = DF.rules;
  const t = DF.i18n.t;

  const court = document.getElementById('court');
  const fill = document.getElementById('qt-fill');
  const secsEl = document.getElementById('q-secs');
  const timerEl = document.getElementById('q-timer');
  const textEl = document.getElementById('q-text');
  const optsEl = document.getElementById('q-opts');
  const metaEl = document.getElementById('q-meta');

  document.querySelector('.stage').classList.add('quiz-stage');
  court.innerHTML = DF.sprites.courtScene();
  const scene = s => DF.sprites.setScene(court, s);
  DF.nav.keys(false);                                 // las flechas del teclado eligen opciones (no navegan)

  /* La pregunta oficial del PDF mantiene su orden A-D; en las demás se mezclan las opciones */
  function shuffled(q){
    const idx = [0, 1, 2, 3];
    for(let i = idx.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
    return { q:q.q, o:idx.map(i => q.o[i]), c:idx.indexOf(q.c), oficial:false };
  }
  const questions = lvl.preguntas.map(q => q.oficial ? { q:q.q, o:q.o.slice(), c:q.c, oficial:true } : shuffled(q));
  const total = questions.length;

  const st = { i:0, answered:true, sel:-1, score:0, correct:0, wrong:0, unanswered:0, nextT:0 };

  const timer = DF.createTimer({
    seconds: R.seconds,
    onTick(tk){
      fill.style.width = (tk.fraction * 100) + '%';
      const low = tk.ms <= 5000;
      fill.classList.toggle('low', low);
      timerEl.classList.toggle('low', low);
      if(tk.secondChanged){ secsEl.textContent = tk.seconds; if(low && tk.seconds > 0) DF.audio.play('key'); }
    },
    onExpire(){ settle(-1); }
  });

  /* ---------- pregunta ---------- */
  function render(){
    const q = questions[st.i];
    metaEl.textContent = t('preguntaN', { a: st.i + 1, b: total }) + ' · ' + t('puntos') + ' ' + st.score;
    textEl.className = 'q-text';
    textEl.textContent = q.q;
    optsEl.innerHTML = q.o.map((txt, i) => '<button type="button" class="q-opt" data-i="' + i + '"><b>' + 'ABCD'[i] + ')</b> ' + DF.esc(txt) + '</button>').join('');
    st.sel = -1; st.answered = false;
    timerEl.classList.remove('stopped');
    scene('ask');
    timer.start();
  }
  function mark(){ optsEl.querySelectorAll('.q-opt').forEach((b, i) => b.classList.toggle('sel', i === st.sel && !st.answered)); }
  function choose(i){                              // marcar sin confirmar (teclado / pasar el mouse)
    if(st.answered) return;
    st.sel = i; mark(); scene('answer');
  }

  /* chosen = índice elegido, o -1 si se terminó el tiempo */
  function settle(chosen){
    if(st.answered) return;                        // una pregunta no se responde dos veces
    st.answered = true;
    const left = timer.stop();
    timerEl.classList.add('stopped');
    const q = questions[st.i];
    const btns = optsEl.querySelectorAll('.q-opt');
    btns.forEach(b => { b.disabled = true; b.classList.remove('sel'); });
    btns[q.c].classList.add('right');

    let delay;
    if(chosen === -1){
      st.unanswered++;
      DF.audio.play('bad'); DF.toast(t('tiempoAgotado'));
      delay = R.feedbackBadMs;
    } else if(chosen === q.c){
      const pts = R.basePoints + Math.round(R.timeBonusMax * left / (R.seconds * 1000));
      st.score += pts; st.correct++;
      DF.audio.play('ok'); DF.toast(t('correcto') + ' +' + pts);
      delay = R.feedbackOkMs;
    } else {
      st.wrong++;
      btns[chosen].classList.add('wrong');
      DF.audio.play('bad'); DF.toast(t('incorrecto'));
      delay = R.feedbackBadMs;
    }
    metaEl.textContent = t('preguntaN', { a: st.i + 1, b: total }) + ' · ' + t('puntos') + ' ' + st.score;
    scene('verdict');

    // Pregunta oficial: se muestra la devolución del caso (texto del PDF)
    if(q.oficial && lvl.devolucion){
      textEl.className = 'q-text feedback';
      textEl.innerHTML = '<b>' + t('devolucion') + '</b>' + DF.esc(lvl.devolucion);
      delay = Math.max(delay, 5200);
    }
    st.nextT = setTimeout(advance, delay);
  }

  function advance(){
    st.nextT = 0; st.i++;
    if(st.i >= total) return finish();
    render();
  }

  function finish(){
    timer.stop();
    DF.store.session.set('quiz', { lvl:n, score:st.score, correct:st.correct, wrong:st.wrong, unanswered:st.unanswered, total });
    DF.nav.go('palabra.html', n);                  // siempre sigue el desafío final
  }

  /* ---------- entrada ---------- */
  optsEl.addEventListener('click', e => { const b = e.target.closest('.q-opt'); if(b && !b.disabled) settle(+b.dataset.i); });
  optsEl.addEventListener('mouseover', e => { const b = e.target.closest('.q-opt'); if(b && !st.answered && +b.dataset.i !== st.sel) choose(+b.dataset.i); });
  document.addEventListener('keydown', e => {
    if(e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if(st.answered){ if(k.startsWith('arrow')) e.preventDefault(); return; }
    // horizontal: opciones en 2 columnas (A,B a la izquierda y C,D a la derecha)
    // vertical: una sola columna (A, B, C, D de arriba hacia abajo)
    const cur = st.sel < 0 ? 0 : st.sel;
    const col = Math.floor(cur / 2), row = cur % 2;
    const one = DF.stage.portrait;
    let next = null;
    if(k === 'arrowleft' || k === 'a') next = one ? cur : 0 * 2 + row;
    else if(k === 'arrowright' || k === 'd') next = one ? cur : 1 * 2 + row;
    else if(k === 'arrowup' || k === 'w') next = one ? Math.max(0, cur - 1) : col * 2;
    else if(k === 'arrowdown' || k === 's') next = one ? Math.min(3, cur + 1) : col * 2 + 1;
    else if(k === 'enter' || k === ' '){ e.preventDefault(); if(st.sel >= 0) settle(st.sel); else choose(0); return; }
    else if(k >= '1' && k <= '4'){ e.preventDefault(); settle(+k - 1); return; }
    if(next !== null){ e.preventDefault(); choose(st.sel < 0 ? 0 : next); }
  });
  window.addEventListener('pagehide', () => { timer.stop(); clearTimeout(st.nextT); });

  render();
}, { requiresUser:true, level:true });
