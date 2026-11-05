/* =========================================================
   tools/build_tutorial.js · Genera el video tutorial del juego
   Graba una partida real (Chromium + Playwright) con carteles
   que explican cómo se juega, cómo responder las preguntas y
   cómo avanzar de nivel, y la convierte en un MP4 liviano.

   Uso:     node tools/build_tutorial.js
   Salida:  assets/video/tutorial.mp4 (sin sonido, 960x540)
            assets/video/tutorial-poster.jpg (imagen de portada)
   Requiere: playwright (npm install) y ffmpeg con libx264.
   Si cambian las pantallas, se vuelve a ejecutar y el video
   queda actualizado. Para usar otro video, reemplazá los dos
   archivos manteniendo los mismos nombres.
   ========================================================= */
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const URL = 'file://' + ROOT;
const OUT = path.join(ROOT, 'assets', 'video');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'df-tuto-'));
const frames = [];                       // { file, t } (t = segundos en el video)
let clock = 0;

/* Carteles y marca de toque, con la estética del juego (solo durante la grabación) */
const OVERLAY = `
  (() => {
    const css = document.createElement('style');
    css.textContent = \`
      .tuto, .tuto-backdrop{ display:none !important; }
      #rec-cap{ position:fixed; left:50%; transform:translateX(-50%); z-index:99999; max-width:1140px; width:max-content;
        display:flex; align-items:center; gap:18px; background:#fbeeda; color:#3a1a07; border-radius:18px;
        padding:14px 30px 10px 16px; box-shadow:0 6px 0 #b9a58a, 0 14px 34px rgba(0,0,0,.45);
        font-family:'Bebas Neue', Impact, sans-serif; font-size:42px; letter-spacing:1px; line-height:1.05; transition:opacity .2s; }
      #rec-cap.bottom{ bottom:24px; } #rec-cap.top{ top:24px; } #rec-cap.high{ top:140px; } #rec-cap.mid{ top:50%; transform:translate(-50%,-50%); }
      #rec-cap b{ flex:none; width:62px; height:62px; border-radius:50%; background:#3a1a07; color:#fbeeda; font-weight:400;
        display:flex; align-items:center; justify-content:center; font-size:40px; padding-top:4px; }
      #rec-cap.big{ font-size:76px; padding:24px 50px 18px; flex-direction:column; gap:6px; text-align:center; }
      #rec-cap.big small{ font-family:'Quicksand', sans-serif; font-weight:700; font-size:32px; letter-spacing:0; }
      #rec-tap{ position:fixed; z-index:99998; width:84px; height:84px; margin:-42px 0 0 -42px; border-radius:50%;
        border:6px solid #fbeeda; box-shadow:0 0 0 5px #3a1a07, 0 0 24px rgba(0,0,0,.5); pointer-events:none;
        animation:rec-tap 1s ease-in-out infinite; }
      @keyframes rec-tap{ 50%{ transform:scale(.8); } }
    \`;
    const ensure = () => { if(!css.isConnected) (document.head || document.documentElement).appendChild(css); };
    if(document.documentElement) ensure(); else document.addEventListener('DOMContentLoaded', ensure);
    window.__rec = {
      caption(text, opts){
        ensure();
        opts = opts || {};
        let el = document.getElementById('rec-cap');
        if(!el){ el = document.createElement('div'); el.id = 'rec-cap'; document.body.appendChild(el); }
        el.className = (opts.pos || 'bottom') + (opts.big ? ' big' : '');
        el.innerHTML = (opts.step ? '<b>' + opts.step + '</b>' : '') + '<span>' + text + '</span>' + (opts.sub ? '<small>' + opts.sub + '</small>' : '');
      },
      tap(x, y){
        ensure();
        let el = document.getElementById('rec-tap');
        if(!el){ el = document.createElement('div'); el.id = 'rec-tap'; document.body.appendChild(el); }
        el.style.left = x + 'px'; el.style.top = y + 'px';
      },
      untap(){ const el = document.getElementById('rec-tap'); if(el) el.remove(); }
    };
  })();`;

async function main(){
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
  await ctx.addInitScript(OVERLAY);
  const page = await ctx.newPage();
  const go = async p => { await page.goto(URL + '/pages/' + p); await page.waitForTimeout(350); };

  /* Graba durante ms milisegundos (tiempo real) */
  async function rec(ms){
    const start = Date.now();
    let last = null;
    while(Date.now() - start < ms){
      const now = Date.now();
      try {
        const file = path.join(TMP, String(frames.length).padStart(5, '0') + '.jpg');
        await page.screenshot({ path: file, type: 'jpeg', quality: 92 });
        if(last) last.d = (now - last.at) / 1000;
        last = { file, at: now, d: 0 };
        frames.push(last);
      } catch(e){ await page.waitForTimeout(40); }
    }
    if(last) last.d = Math.max(0.04, (start + ms - last.at) / 1000);
  }
  const caption = (text, opts) => page.evaluate(([t, o]) => window.__rec.caption(t, o), [text, opts || {}]);
  async function tapOn(selector){
    const box = await page.locator(selector).first().boundingBox();
    await page.evaluate(([x, y]) => window.__rec.tap(x, y), [box.x + box.width / 2, box.y + box.height / 2]);
  }
  const untap = () => page.evaluate(() => window.__rec.untap());
  /* Muestra el toque, graba y hace clic */
  async function press(selector, before){
    await tapOn(selector);
    await rec(before || 900);
    await untap();
    await page.click(selector, { force: true });
  }

  // Cuenta nueva para el tutorial: solo el nivel 1 disponible
  await page.goto(URL + '/pages/portada.html');
  await page.evaluate(() => {
    localStorage.clear(); sessionStorage.clear();
    localStorage.setItem('df_decision_final_v2:ajustes', JSON.stringify({ volume: 0 }));
    localStorage.setItem('df_decision_final_v2:cuenta:tutorial@df.com', JSON.stringify({ user: 'Jugador', email: 'tutorial@df.com', progress: { levels: {} } }));
    sessionStorage.setItem('df_account', 'tutorial@df.com');
  });

  /* 0 · Portada */
  await go('portada.html');
  await page.addStyleTag({ content: '.splash-btn{ visibility:hidden; }' });
  await caption('TUTORIAL: CÓMO SE JUEGA', { pos: 'bottom', big: true, sub: 'Decisión Final · Defendiendo la justicia' });
  await rec(3200);
  const posterFrame = frames[Math.floor(frames.length / 2)].file;

  /* 1 · Selección de nivel */
  await go('niveles.html');
  await caption('Elegí un nivel disponible ▶. Los que tienen candado se desbloquean al terminar el anterior.', { step: 1, pos: 'bottom' });
  await rec(2600);
  await press('.lvl-row[data-n="1"] .dot', 1400);
  await page.waitForURL(/nivel-titulo/);

  /* 2 · Título y descripción */
  await page.waitForTimeout(250);
  await caption('Tocá la flecha → para avanzar.', { step: 2, pos: 'bottom' });
  await rec(1200);
  await press('[data-nav="next"]', 1000);
  await page.waitForURL(/nivel-desc/);
  await page.waitForTimeout(250);
  await caption('Leé de qué se trata el caso.', { step: 2, pos: 'bottom' });
  await rec(2000);
  await press('[data-nav="next"]', 900);
  await page.waitForURL(/caso\.html/);

  /* 3 · Las tres carpetas */
  await page.waitForTimeout(250);
  await caption('Abrí las 3 carpetas: Testimonios, Denuncia y Pruebas.', { step: 3, pos: 'bottom' });
  await rec(1600);
  for(let i = 0; i < 3; i++){
    await press('.folder >> nth=' + i, 700);
    await rec(i === 0 ? 1800 : 1000);
    await press('#doc-back', 500);
    await rec(300);
  }
  await caption('Con las 3 carpetas leídas aparece la flecha →', { step: 3, pos: 'bottom' });
  await rec(800);
  await press('[data-nav="next"]', 1200);
  await page.waitForURL(/juicio/);

  /* 4 · El juez presenta el caso */
  await caption('El juez presenta el caso. Después tocá → para empezar las preguntas.', { step: 4, pos: 'high' });
  await rec(3600);
  await press('[data-nav="next"]', 1000);
  await page.waitForURL(/desafio/);

  /* 5 · Preguntas */
  await page.waitForTimeout(200);
  await caption('Respondé tocando A, B, C o D (o las teclas 1-4). Tenés 20 segundos.', { step: 5, pos: 'high' });
  await rec(3000);
  const pick = async right => page.evaluate(ok => {
    const text = document.getElementById('q-text').textContent;
    const q = DF.levels[0].preguntas.find(x => x.q === text);
    const btns = [...document.querySelectorAll('.q-opt')];
    const i = btns.findIndex(b => b.textContent.slice(3).trim() === q.o[q.c]);
    return ok ? i : (i + 1) % 4;
  }, right);
  await press('.q-opt >> nth=' + await pick(true), 1000);
  await caption('Verde: correcta y sumás puntos (más rápido, más puntos).', { step: 5, pos: 'high' });
  await rec(5400);
  await caption('Rojo: incorrecta. Si el tiempo llega a 0, queda sin responder.', { step: 5, pos: 'high' });
  await press('.q-opt >> nth=' + await pick(false), 1200);
  await rec(2000);
  await caption('La flecha ← te lleva directo al menú (el intento se pierde).', { step: 5, pos: 'high' });
  await tapOn('[data-nav="back"]');
  await rec(2600);
  await untap();

  /* (salto: se completan las 10 preguntas) */
  await page.evaluate(() => DF.store.session.set('quiz', { lvl: 1, score: 1180, correct: 9, wrong: 1, unanswered: 0, total: 10 }));
  await go('palabra.html?n=1');

  /* 6 · Desafío final */
  await caption('Desafío final: adiviná 3 palabras con la pista. Escribí y tocá ENTER.', { step: 6, pos: 'mid' });
  await rec(2600);
  await caption('Desafío final: adiviná 3 palabras con la pista. Escribí y tocá ENTER.', { step: 6, pos: 'top' });
  await Promise.all([rec(2200), page.keyboard.type('daniados'.toUpperCase(), { delay: 160 })]);
  await page.keyboard.press('Enter');
  await rec(1600);
  await caption('Verde: letra en su lugar · Amarillo: está en otro lugar · Gris: no está.', { step: 6, pos: 'top' });
  await rec(2600);
  await Promise.all([rec(2000), page.keyboard.type('DIGNIDAD', { delay: 140 })]);
  await page.keyboard.press('Enter');
  await rec(2600);
  // (salto: las otras dos palabras)
  for(const w of ['EXCLUSION', 'RESPETO']){
    await page.waitForTimeout(800);
    await page.keyboard.type(w, { delay: 20 });
    await page.keyboard.press('Enter');
    await page.waitForTimeout(3300);            // corrección (letra por letra) + pasa a la palabra siguiente
  }
  await page.waitForURL(/resultado/, { timeout: 15000 });

  /* 7 · Resultado y siguiente nivel */
  await page.waitForTimeout(300);
  await caption('Ganás con 7 respuestas correctas y 2 palabras. Ganes o pierdas, se desbloquea el siguiente nivel.', { step: 7, pos: 'top' });
  await rec(3400);
  await caption('Seguí con SIGUIENTE NIVEL o volvé a NIVELES.', { step: 7, pos: 'top' });
  await tapOn('#btn-sig');
  await rec(2400);
  await untap();
  await go('niveles.html');
  await caption('¡Nivel 2 desbloqueado! Repetí niveles para ganar más estrellas ★', { step: 8, pos: 'top' });
  await rec(3400);

  /* Cierre */
  await go('portada.html');
  await page.addStyleTag({ content: '.splash-btn{ visibility:hidden; }' });
  await caption('¡A JUGAR!', { pos: 'bottom', big: true, sub: 'Defendiendo la justicia. Un píxel a la vez.' });
  await rec(2400);

  await browser.close();

  /* ---- armado del video ---- */
  fs.mkdirSync(OUT, { recursive: true });
  const list = frames.map(f => "file '" + f.file + "'\nduration " + f.d.toFixed(3)).join('\n') + "\nfile '" + frames[frames.length - 1].file + "'\n";
  fs.writeFileSync(path.join(TMP, 'list.txt'), list);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(TMP, 'list.txt'),
    '-vf', 'fps=20,scale=960:540:flags=lanczos,format=yuv420p', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '27',
    '-tune', 'animation', '-movflags', '+faststart', '-an',
    '-metadata', 'title=Decisión Final · Tutorial', path.join(OUT, 'tutorial.mp4')]);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', posterFrame, '-vf', 'scale=960:540:flags=lanczos', '-q:v', '4', path.join(OUT, 'tutorial-poster.jpg')]);
  fs.rmSync(TMP, { recursive: true, force: true });
  const secs = frames.reduce((a, f) => a + f.d, 0);
  console.log('Tutorial generado: ' + secs.toFixed(1) + ' s, ' + frames.length + ' cuadros → ' + OUT);
}

main().catch(e => { console.error(e); process.exit(1); });
