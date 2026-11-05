/* =========================================================
   tests/e2e.js · Pruebas funcionales de punta a punta
   Ejecuta los 12 casos obligatorios y los de esta versión
   (cuentas separadas, flechas, música, video tutorial y
   responsive) en Chromium (Playwright), con un reloj simulado
   (los 20 s se adelantan sin esperar).

   Uso:   npm install   (una vez)   →   npm test
   ========================================================= */
const { chromium } = require('playwright');
const path = require('path');
const assert = require('assert');
const audit = require('./layout-audit');

const ROOT = 'file://' + path.resolve(__dirname, '..');
const PREFIX = 'df_decision_final_v2:';          // claves: <PREFIX>ajustes y <PREFIX>cuenta:<correo>
const results = [];

/* ---------- utilidades ---------- */
/* Datos guardados con una cuenta con sesión abierta (formato de store.js) */
function db(acc, extra){
  acc = Object.assign({ user:'Tester', email:'t@test.com' }, acc);
  const id = acc.email.toLowerCase();
  return Object.assign({ current:id, settings:{}, accounts:{ [id]: acc } }, extra);
}
/* Escribe esos datos en el navegador (cada cuenta en su clave; la sesión en la pestaña) */
const seed = (page, data) => page.evaluate(([P, d]) => {
  localStorage.clear(); sessionStorage.clear();
  if(!d) return;
  localStorage.setItem(P + 'ajustes', JSON.stringify(d.settings || {}));
  Object.keys(d.accounts || {}).forEach(id => localStorage.setItem(P + 'cuenta:' + id, JSON.stringify(d.accounts[id])));
  if(d.current) sessionStorage.setItem('df_account', d.current);
}, [PREFIX, data]);
const settingsOf = page => page.evaluate(P => JSON.parse(localStorage.getItem(P + 'ajustes')), PREFIX);
const accountsOf = page => page.evaluate(P => Object.keys(localStorage).filter(k => k.indexOf(P + 'cuenta:') === 0).map(k => k.slice((P + 'cuenta:').length)).sort(), PREFIX);
async function open(browser, data, opts){
  opts = opts || {};
  const context = await browser.newContext({ viewport: opts.viewport || { width:1280, height:720 } });
  if(opts.clock !== false) await context.clock.install();
  const page = await context.newPage();
  page.errors = [];
  page.on('pageerror', e => page.errors.push(String(e)));
  page.on('console', m => { if(m.type() === 'error') page.errors.push(m.text()); });
  // (net::ERR_ABORTED = carga cancelada al cambiar de pantalla, por ej. el video del tutorial: no es un error)
  page.on('requestfailed', r => { if(!/ERR_ABORTED/.test((r.failure() || {}).errorText || '')) page.errors.push('No cargó: ' + r.url()); });
  await page.goto(ROOT + '/pages/portada.html');
  await seed(page, data === null ? null : (data || db()));
  return { context, page };
}
const go = (page, p) => page.goto(ROOT + '/pages/' + p);
const tick = (page, ms) => page.clock.runFor(ms);
const url = page => page.url().split('/pages/')[1] || page.url();
/* Datos guardados de la cuenta con sesión en esta pestaña (o de la cuenta indicada) */
const state = (page, id) => page.evaluate(([P, id]) => JSON.parse(localStorage.getItem(P + 'cuenta:' + (id || sessionStorage.getItem('df_account')))), [PREFIX, id || null]);
const session = (page, name) => page.evaluate(n => DF.store.session.get(n), name);
const played = n => { const o = {}; for(let i = 1; i <= n; i++) o[i] = { played:true, passed:true, score:1000, stars:2, attempts:1 }; return o; };
const visible = (page, sel) => page.$eval(sel, el => getComputedStyle(el).visibility !== 'hidden' && !el.classList.contains('nav-off'));
async function register(page, email, user){
  await go(page, 'registro.html');
  await page.fill('#correo', email);
  await page.fill('#usuario', user);
  await page.click('#btn-registro');
  await page.waitForURL(/menu\.html/);
}

/* Responde la pregunta visible. mode: 'right' | 'wrong' */
async function answer(page, mode){
  const idx = await page.evaluate(m => {
    const n = +new URLSearchParams(location.search).get('n');
    const text = document.getElementById('q-text').textContent;
    const q = DF.levels[n - 1].preguntas.find(x => x.q === text);
    const ok = q.o[q.c];
    const btns = [...document.querySelectorAll('.q-opt')];
    const i = btns.findIndex(b => b.textContent.slice(3).trim() === ok);
    return m === 'right' ? i : (i + 1) % 4;
  }, mode);
  await page.click('.q-opt >> nth=' + idx);
  await tick(page, 5300);                         // espera la corrección (máx. 5,2 s en la oficial)
}
async function playQuiz(page, n, mode){
  await go(page, 'desafio.html?n=' + n);
  for(let i = 0; i < 10; i++) await answer(page, typeof mode === 'function' ? mode(i) : mode);
  await page.waitForURL(/palabra\.html/);
}
/* Desafío final: 'right' adivina las 3 palabras; 'wrong' agota los intentos */
async function playWords(page, n, mode){
  const words = await page.evaluate(n => DF.levels[n - 1].palabras.map(p => p.respuesta), n);
  for(const w of words){
    const tries = mode === 'right' ? [w] : Array(6).fill('Z'.repeat(w.length));
    for(const tr of tries){
      await page.keyboard.type(tr.toLowerCase());
      await page.keyboard.press('Enter');
      await tick(page, w.length * 110 + 600);
    }
    await tick(page, 2600);
  }
  await page.waitForURL(/resultado\.html/);
}

/* Servidor local que imita a los hostings con "URLs limpias" (Netlify, Vercel, Cloudflare Pages…) */
function cleanUrlServer(){
  const http = require('http'), fs = require('fs');
  const base = path.resolve(__dirname, '..');
  const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css', '.png':'image/png', '.svg':'image/svg+xml',
    '.woff2':'font/woff2', '.jpg':'image/jpeg', '.mp4':'video/mp4', '.ogg':'audio/ogg', '.mp3':'audio/mpeg' };
  const server = http.createServer((req, res) => {
    const u = new URL(req.url, 'http://x');
    if(u.pathname.endsWith('.html') && u.pathname !== '/index.html'){ res.writeHead(301, { Location: u.pathname.slice(0, -5) + u.search }); return res.end(); }
    let file = path.join(base, decodeURIComponent(u.pathname));
    if(!path.extname(file)) file += '.html';
    if(!file.startsWith(base) || !fs.existsSync(file)){ res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise(ok => server.listen(0, '127.0.0.1', () => ok({ url: 'http://127.0.0.1:' + server.address().port, close: () => server.close() })));
}

async function test(name, fn, launch){
  const browser = await chromium.launch(launch);
  try { await fn(browser); results.push(['✔', name]); }
  catch(e){ results.push(['✘', name + '\n     ' + (e && e.message || e)]); }
  finally { await browser.close(); }
}

/* ---------- casos ---------- */
(async () => {

await test('1. Completar las 10 preguntas de un nivel', async b => {
  const { page } = await open(b);
  await go(page, 'desafio.html?n=1');
  const seen = new Set();
  for(let i = 0; i < 10; i++){
    seen.add(await page.textContent('#q-text'));
    assert.strictEqual(await page.textContent('#q-meta').then(t => t.split('·')[0].trim()), 'Pregunta ' + (i + 1) + ' de 10');
    await answer(page, 'right');
  }
  await page.waitForURL(/palabra\.html\?n=1/);
  assert.strictEqual(seen.size, 10, 'deben verse 10 preguntas distintas');
  const quiz = await session(page, 'quiz');
  assert.strictEqual(quiz.correct, 10);
  assert.deepStrictEqual(page.errors, []);
});

await test('2. Dejar que una pregunta llegue a 0 segundos', async b => {
  const { page } = await open(b);
  await go(page, 'desafio.html?n=1');
  assert.strictEqual(await page.textContent('#q-secs'), '20');
  await tick(page, 10050);
  assert.strictEqual(await page.textContent('#q-secs'), '10', 'el contador baja de a 1 segundo');
  await tick(page, 10050);
  assert.strictEqual(await page.textContent('#q-secs'), '0');
  assert.strictEqual(await page.locator('.q-opt.right').count(), 1, 'se muestra la correcta');
  assert.strictEqual(await page.locator('.q-opt.wrong').count(), 0);
  assert.strictEqual(await page.locator('.q-opt:disabled').count(), 4, 'opciones bloqueadas');
  await tick(page, 5300);
  assert.match(await page.textContent('#q-meta'), /Pregunta 2 de 10/, 'pasa sola a la siguiente');
  assert.strictEqual(await page.textContent('#q-secs'), '20', 'el temporizador se reinicia');
});

await test('3. Intentar responder después de que se termine el tiempo', async b => {
  const { page } = await open(b);
  await go(page, 'desafio.html?n=1');
  await tick(page, 20100);
  const before = await page.textContent('#q-meta');
  await page.evaluate(() => document.querySelectorAll('.q-opt').forEach(x => x.click()));
  await page.keyboard.press('1'); await page.keyboard.press('Enter');
  assert.strictEqual(await page.textContent('#q-meta'), before, 'no suma puntos');
  assert.strictEqual(await page.locator('.q-opt.wrong').count(), 0, 'no registra otra respuesta');
  await tick(page, 30000);                         // si quedara un temporizador viejo, saltaría preguntas
  const q = await page.textContent('#q-meta');
  assert.match(q, /Pregunta 3 de 10/, 'avanza exactamente de a una pregunta: ' + q);
  // termina el cuestionario con todo sin responder y se registra
  for(let i = 3; i <= 10; i++) await tick(page, 22300 + 5300);
  await page.waitForURL(/palabra\.html/);
  const quiz = await session(page, 'quiz');
  assert.strictEqual(quiz.unanswered, 10);
});

await test('4. Flechas dentro y fuera del cuestionario', async b => {
  const { page } = await open(b);
  // fuera: avanzar y volver con las flechas (y con las teclas ← →)
  await go(page, 'nivel-titulo.html?n=1');
  await page.click('.btn-next', { force:true }); await page.waitForURL(/nivel-desc\.html\?n=1/);
  await page.keyboard.press('ArrowRight'); await page.waitForURL(/caso\.html\?n=1/);
  assert.strictEqual(await visible(page, '#btn-empezar'), false, 'sin leer las carpetas la flecha → no se muestra');
  assert.strictEqual(await page.getAttribute('#btn-empezar', 'href'), null);
  await page.keyboard.press('ArrowRight'); await tick(page, 300);
  assert.match(url(page), /^caso\.html/, 'no avanza sin leer las carpetas');
  for(let i = 0; i < 3; i++){ await page.click('.folder >> nth=' + i); await page.click('#doc-back'); }
  assert.strictEqual(await visible(page, '#btn-empezar'), true, 'con las carpetas leídas aparece la flecha');
  assert.strictEqual(await page.getAttribute('#btn-empezar', 'href'), 'juicio.html?n=1');
  await page.keyboard.press('ArrowLeft'); await page.waitForURL(/nivel-desc\.html\?n=1/);
  // dentro del cuestionario: ← lleva al menú; las teclas ← → eligen opciones (no navegan)
  await go(page, 'desafio.html?n=1');
  assert.strictEqual(await visible(page, '.btn-back'), true);
  assert.strictEqual(await page.getAttribute('.btn-back', 'href'), 'menu.html');
  await page.keyboard.press('ArrowLeft'); await tick(page, 300);
  assert.match(url(page), /^desafio\.html/, 'la tecla ← no saca del cuestionario');
  assert.strictEqual(await page.locator('.q-opt.sel').count(), 1, 'las flechas del teclado eligen opciones');
  // al terminar, la navegación sigue funcionando (resultado → niveles → menú)
  for(let i = 0; i < 10; i++) await answer(page, 'right');
  await page.waitForURL(/palabra\.html/);
  assert.strictEqual(await page.getAttribute('.btn-back', 'href'), 'menu.html', 'en el desafío final ← también va al menú');
  await playWords(page, 1, 'right');
  await tick(page, 9000);
  await page.waitForURL(/niveles\.html/);
  await page.keyboard.press('ArrowLeft'); await page.waitForURL(/menu\.html/);
});

await test('5. Terminar el desafío y redirección automática a "Selección de nivel"', async b => {
  const { page } = await open(b);
  await playQuiz(page, 1, 'right');
  await playWords(page, 1, 'right');
  assert.match(await page.textContent('#res-titulo'), /GANADO/);
  assert.match(await page.textContent('#res-countdown'), /8 s/);
  const navs = [];
  page.on('framenavigated', f => { if(f === page.mainFrame()) navs.push(f.url()); });
  await tick(page, 7000);
  assert.match(url(page), /^resultado\.html/, 'todavía espera');
  await tick(page, 1500);
  await page.waitForURL(/niveles\.html/);
  await tick(page, 5000);
  assert.strictEqual(navs.length, 1, 'redirige una sola vez');
  assert.ok((await state(page)).progress.levels[1].passed);
});

await test('6. Perder un nivel y verificar que se desbloquea el siguiente', async b => {
  const { page } = await open(b);
  await playQuiz(page, 1, 'wrong');
  await playWords(page, 1, 'wrong');
  assert.match(await page.textContent('#res-titulo'), /PERDIDO/);
  const s = await state(page);
  assert.strictEqual(s.progress.levels[1].passed, false);
  await go(page, 'niveles.html');
  assert.ok(await page.locator('a.lvl-row[data-n="2"]').count(), 'nivel 2 desbloqueado');
  assert.ok(await page.locator('.lvl-row.lost[data-n="1"]').count(), 'nivel 1 figura como perdido');
  assert.ok(await page.locator('.lvl-row.locked[data-n="3"]').count(), 'nivel 3 sigue bloqueado');
  await go(page, 'nivel-titulo.html?n=2');
  assert.match(url(page), /nivel-titulo\.html\?n=2/);
  // volver a perder no lo bloquea de nuevo
  await playQuiz(page, 1, 'wrong'); await playWords(page, 1, 'wrong');
  await go(page, 'niveles.html');
  assert.ok(await page.locator('a.lvl-row[data-n="2"]').count());
});

await test('7. Avanzar con el botón "Siguiente nivel"', async b => {
  const { page } = await open(b);
  await playQuiz(page, 1, 'wrong');
  await playWords(page, 1, 'wrong');
  assert.strictEqual(await page.textContent('#btn-sig'), 'SIGUIENTE NIVEL');
  await page.click('#btn-sig');
  await page.waitForURL(/nivel-titulo\.html\?n=2/);
  assert.strictEqual(await page.textContent('#nv-titulo'), 'UN DERECHO VULNERADO');
  await tick(page, 10000);
  assert.match(url(page), /nivel-titulo\.html\?n=2/, 'la redirección automática se canceló');
  // también desde "Selección de nivel"
  await go(page, 'niveles.html');
  assert.strictEqual(await page.getAttribute('#lvl-next', 'href'), 'nivel-titulo.html?n=2');
});

await test('8. Cambiar accesorios y que se mantengan', async b => {
  const { page } = await open(b, db({ progress:{ levels:played(3) } }));
  await go(page, 'vestir.html');
  const before = await page.innerHTML('#avatar-box');
  await page.click('.ditem[data-cat="gorros"][data-key="gorraBordo"]');
  assert.notStrictEqual(await page.innerHTML('#avatar-box'), before, 'el personaje se actualiza');
  await page.click('.ditem[data-cat="mascotas"][data-key="gato"]');                 // nivel 3 terminado
  await page.click('.ditem[data-cat="bufandas"][data-key="bordo"]');
  await page.click('.ditem[data-cat="collares"][data-key="plata"]');               // excluye la bufanda
  let s = await state(page);
  assert.strictEqual(s.avatar.gorros, 'gorraBordo');
  assert.strictEqual(s.avatar.mascotas, 'gato');
  assert.strictEqual(s.avatar.collares, 'plata');
  assert.strictEqual(s.avatar.bufandas, undefined, 'bufanda y collar no se superponen');
  await page.click('.ditem[data-cat="gorros"][data-key="rana"]');                  // bloqueado (nivel 10)
  s = await state(page);
  assert.strictEqual(s.avatar.gorros, 'gorraBordo', 'una prenda bloqueada no se aplica');
  await page.click('.ditem[data-cat="gorros"][data-key="gorraBordo"]');            // tocar de nuevo = sacar
  assert.strictEqual((await state(page)).avatar.gorros, undefined);
  await page.click('.ditem[data-cat="gorros"][data-key="gorraBordo"]');
  // se mantiene al navegar y aparece en el tribunal
  await go(page, 'menu.html'); await go(page, 'vestir.html');
  assert.ok(await page.locator('.ditem.sel[data-key="gorraBordo"]').count());
  await go(page, 'juicio.html?n=1');
  const html = await page.innerHTML('[data-role="player-side"]');
  assert.ok(html.includes('#7a2333'), 'la gorra se ve en el tribunal');
});

await test('9. Consultar el manual de usuario', async b => {
  const { page } = await open(b);
  await go(page, 'menu.html');
  await page.click('.menu-manual'); await page.waitForURL(/manual\.html/);
  const titles = await page.$$eval('#man-scroll h2', h => h.map(x => x.textContent));
  assert.ok(titles.length >= 12, 'secciones: ' + titles.length);
  const txt = await page.textContent('#man-scroll');
  for(const k of ['20 segundos', 'Siguiente nivel'.toUpperCase(), 'desbloquea', 'Tiempo agotado', 'desafío final', 'VESTÍ A TU PERSONAJE', 'perdés'])
    assert.ok(txt.toLowerCase().includes(k.toLowerCase()), 'el manual explica: ' + k);
  const y0 = await page.$eval('.sb-thumb', e => e.style.transform);
  await page.$eval('#man-scroll', e => e.scrollTop = e.scrollHeight);
  let y1 = y0;
  for(let i = 0; i < 10 && y1 === y0; i++){ await tick(page, 200); y1 = await page.$eval('.sb-thumb', e => e.style.transform); }
  assert.notStrictEqual(y1, y0, 'la barra de desplazamiento acompaña');
});

await test('10. Completar el décimo nivel y ver la pantalla final', async b => {
  const { page } = await open(b, db({ progress:{ levels:played(9) } }));
  await playQuiz(page, 10, 'right');
  await playWords(page, 10, 'right');
  assert.strictEqual(await page.textContent('#btn-sig'), 'VER FINAL');
  await page.click('#btn-sig'); await page.waitForURL(/fin\.html/);
  assert.match(await page.textContent('.title'), /CASOS CERRADOS/);
  assert.match(await page.textContent('#fin-box'), /Casos ganados: 10 de 10/);
  await go(page, 'niveles.html');
  assert.strictEqual(await page.getAttribute('#lvl-next', 'href'), 'fin.html');
  assert.deepStrictEqual(page.errors, []);
});

await test('11. Los botones no ejecutan acciones duplicadas', async b => {
  const { page } = await open(b);
  // doble respuesta en la misma pregunta
  await go(page, 'desafio.html?n=1');
  const opt = page.locator('.q-opt >> nth=0');
  await opt.dblclick();
  await page.keyboard.press('2'); await page.keyboard.press('Enter');
  const answered = await page.evaluate(() => document.querySelectorAll('.q-opt.right, .q-opt.wrong').length);
  assert.ok(answered <= 2, 'una sola respuesta marcada');
  const meta = await page.textContent('#q-meta');
  assert.ok(/PUNTOS (0|1\d\d)$/i.test(meta.trim()), 'puntaje sumado una vez: ' + meta);
  // doble clic en una flecha / botón: una sola navegación
  await go(page, 'nivel-titulo.html?n=1');
  const navs = [];
  page.on('framenavigated', f => { if(f === page.mainFrame()) navs.push(f.url()); });
  await page.dblclick('.btn-next', { force:true });
  await page.waitForURL(/nivel-desc/); await tick(page, 500);
  assert.strictEqual(navs.length, 1, 'navegaciones: ' + navs.length);
  // URL inexistente o nivel bloqueado → vuelve a la Selección de nivel
  await go(page, 'desafio.html?n=99'); await page.waitForURL(/niveles\.html/);
  await go(page, 'desafio.html?n=5');  await page.waitForURL(/niveles\.html/);
  await go(page, 'palabra.html?n=1');  await page.waitForURL(/niveles\.html/);
});

await test('12. Imágenes, estilos, fuentes y sin errores en consola', async b => {
  const { page } = await open(b, db({ progress:{ levels:played(10) } }));
  const pages = ['portada.html','registro.html','menu.html','config.html','soporte.html','ranking.html','manual.html','vestir.html','niveles.html',
    'nivel-titulo.html?n=3','nivel-desc.html?n=3','caso.html?n=3','juicio.html?n=3','desafio.html?n=3','fin.html'];
  for(const p of pages){
    await go(page, p); await tick(page, 300);
    const r = await page.evaluate(async () => {
      await document.fonts.ready;
      const imgs = [...document.images].filter(i => !i.complete || i.naturalWidth === 0).map(i => i.src);
      const css = [...document.styleSheets].length;
      const bg = getComputedStyle(document.querySelector('.stage')).backgroundImage;
      const faces = [...document.fonts];
      return { imgs, css, bg, broken: faces.filter(f => f.status === 'error').map(f => f.family), bebas: faces.some(f => f.family.includes('Bebas') && f.status === 'loaded') };
    });
    assert.deepStrictEqual(r.imgs, [], p + ' imágenes rotas');
    assert.strictEqual(r.css, 5, p + ' hojas de estilo');
    assert.ok(r.bg.includes('fondo.png'), p + ' fondo');
    assert.deepStrictEqual(r.broken, [], p + ' fuentes con error');
    assert.ok(r.bebas, p + ' fuente Bebas Neue');
  }
  await go(page, '../index.html'); await tick(page, 500);
  assert.ok(page.frame({ name:'df-shell' }), 'index.html carga el juego en su contenedor');
  assert.deepStrictEqual(page.errors, [], 'errores: ' + page.errors.join(' | '));
});

/* ================= Pruebas de esta versión ================= */

await test('13. Cada cuenta tiene sus propios datos (puntos, niveles, partidas y personaje)', async b => {
  const { context, page } = await open(b, null);                       // navegador sin datos guardados
  await register(page, 'ana@test.com', 'Ana');
  await playQuiz(page, 1, 'right'); await playWords(page, 1, 'right');
  await go(page, 'vestir.html'); await page.click('.ditem[data-cat="gorros"][data-key="gorraBordo"]');
  const ana = await state(page);
  assert.ok(ana.progress.levels[1].passed, 'Ana ganó el nivel 1');
  const anaPts = ana.progress.levels[1].score;
  await playQuiz(page, 2, 'right');                           // partida a medio terminar en esta pestaña
  assert.ok(await session(page, 'quiz'));
  // Cambiar de cuenta desde el menú
  await go(page, 'menu.html');
  await page.click('#btn-cuenta'); await page.waitForURL(/registro\.html/);
  assert.strictEqual(await page.inputValue('#correo'), '', 'el registro no muestra datos de la cuenta anterior');
  await page.fill('#correo', 'beto@test.com'); await page.fill('#usuario', 'Beto');
  await page.click('#btn-registro'); await page.waitForURL(/menu\.html/);
  assert.strictEqual(await page.textContent('#menu-user'), 'Beto · 0 pts', 'Beto no ve los puntos de Ana');
  await go(page, 'niveles.html');
  assert.strictEqual(await page.locator('.lvl-row.won, .lvl-row.lost, .lvl-row .stars').count(), 0, 'sin niveles jugados ni estrellas de Ana');
  assert.ok(await page.locator('.lvl-row.locked[data-n="2"]').count(), 'el nivel 2 está bloqueado para Beto');
  assert.ok(await page.locator('#lvl-next.hidden').count(), 'sin botón "Siguiente nivel"');
  await go(page, 'ranking.html');
  const names = await page.$$eval('.rank-row .name', n => n.map(x => x.textContent));
  assert.ok(!names.includes('Ana'), 'Ana no aparece en el ranking de Beto');
  assert.match(await page.textContent('.rank-row.me .rank-pts'), /^0 pts$/);
  await go(page, 'vestir.html');
  assert.strictEqual(await page.locator('.ditem.sel[data-key="gorraBordo"]').count(), 0, 'Beto tiene su propio personaje');
  // la partida en curso y el último resultado de Ana no pasan a Beto
  await go(page, 'palabra.html?n=2'); await page.waitForURL(/niveles\.html/);
  await go(page, 'resultado.html?n=1'); await page.waitForURL(/niveles\.html/);
  // Beto juega y pierde: se guarda solo en su cuenta
  await playQuiz(page, 1, 'wrong'); await playWords(page, 1, 'wrong');
  assert.deepStrictEqual(await accountsOf(page), ['ana@test.com', 'beto@test.com'], 'cada cuenta en su propia clave');
  assert.strictEqual((await state(page, 'beto@test.com')).progress.levels[1].passed, false);
  const anaSaved = await state(page, 'ana@test.com');
  assert.strictEqual(anaSaved.progress.levels[1].passed, true, 'el resultado de Beto no pisa el de Ana');
  assert.strictEqual(anaSaved.progress.levels[1].attempts, 1);
  // Ana vuelve a entrar (mayúsculas en el correo = misma cuenta) y recupera lo suyo
  await go(page, 'menu.html'); await page.click('#btn-cuenta'); await page.waitForURL(/registro/);
  await page.fill('#correo', 'ANA@test.com'); await page.fill('#usuario', 'Ana');
  await page.click('#btn-registro'); await page.waitForURL(/menu\.html/);
  assert.strictEqual(await page.textContent('#menu-user'), 'Ana · ' + anaPts + ' pts');
  await go(page, 'niveles.html');
  assert.ok(await page.locator('.lvl-row.won[data-n="1"]').count(), 'Ana conserva su nivel ganado');
  await go(page, 'vestir.html');
  assert.ok(await page.locator('.ditem.sel[data-key="gorraBordo"]').count(), 'Ana conserva su personaje');
  // Una pestaña nueva (o quien abra el juego después) no entra a la cuenta de otra persona
  const tab2 = await context.newPage();
  await tab2.goto(ROOT + '/pages/menu.html'); await tab2.waitForURL(/registro\.html/);
  assert.strictEqual(await tab2.inputValue('#correo'), '', 'la pestaña nueva no muestra el correo de Ana');
  // Dos pestañas con cuentas distintas: cerrar sesión en una no la pasa a la cuenta de la otra
  await tab2.fill('#correo', 'beto@test.com'); await tab2.fill('#usuario', 'Beto');
  await tab2.click('#btn-registro'); await tab2.waitForURL(/menu\.html/);
  await go(page, 'menu.html');
  assert.strictEqual(await page.textContent('#menu-user'), 'Ana · ' + anaPts + ' pts', 'cada pestaña sigue con su cuenta');
  await page.click('#btn-cuenta'); await page.waitForURL(/registro\.html/);
  assert.strictEqual(await page.inputValue('#correo'), '');
  await go(page, 'menu.html'); await page.waitForURL(/registro\.html/);
  assert.strictEqual(await tab2.textContent('#menu-user'), 'Beto · 0 pts');
  assert.deepStrictEqual(page.errors, []);
});

await test('14. Una partida de la versión anterior pasa a la cuenta de su correo', async b => {
  const { page } = await open(b, null);
  await page.evaluate(() => localStorage.setItem('df_decision_final_v1', JSON.stringify({ user:'Viejo', email:'viejo@test.com',
    settings:{ volume:30, brightness:55, lang:'es', res:1920 }, progress:{ levels:{ 1:{ played:true, passed:true, score:777, stars:1, attempts:1 } } },
    avatar:{ piel:'oscura', pelo:'semi', varios:'cadena' } })));
  await go(page, 'menu.html');
  assert.strictEqual(await page.textContent('#menu-user'), 'Viejo · 777 pts');
  assert.strictEqual(await page.evaluate(() => localStorage.getItem('df_decision_final_v1')), null, 'la clave vieja se elimina');
  assert.strictEqual((await state(page, 'viejo@test.com')).avatar.piel, 'oscura');
  assert.strictEqual((await settingsOf(page)).volume, 30);
  await page.click('#btn-cuenta'); await page.waitForURL(/registro/);
  await register(page, 'nueva@test.com', 'Nueva');
  assert.strictEqual(await page.textContent('#menu-user'), 'Nueva · 0 pts', 'una cuenta nueva empieza de cero');
  // Si la clave vieja reaparece (otra copia del juego abierta), no pisa lo nuevo ni cambia la sesión
  await page.evaluate(() => localStorage.setItem('df_decision_final_v1', JSON.stringify({ user:'Viejo', email:'viejo@test.com',
    progress:{ levels:{ 1:{ played:true, passed:false, score:100, stars:0, attempts:1 }, 2:{ played:true, passed:true, score:50, stars:1, attempts:1 } } } })));
  await go(page, 'menu.html');
  assert.strictEqual(await page.textContent('#menu-user'), 'Nueva · 0 pts', 'la pestaña sigue en su cuenta');
  const v = await state(page, 'viejo@test.com');
  assert.strictEqual(v.progress.levels[1].score, 777, 'conserva el mejor puntaje');
  assert.strictEqual(v.progress.levels[1].passed, true);
  assert.strictEqual(v.progress.levels[2].score, 50, 'suma los niveles nuevos');
});

await test('15. Flechas: cada una lleva a su pantalla, ← de las preguntas va al menú y no hay flechas sin acción', async b => {
  const { page } = await open(b, db({ progress:{ levels:played(9) } }));
  const fs = require('fs');
  const routes = await page.evaluate(() => { const r = {}; Object.keys(DF.nav.ROUTES).forEach(k => r[k] = DF.nav.ROUTES[k]); return r; });
  for(const [from, r] of Object.entries(routes)){
    for(const dir of ['back', 'next']){
      if(!r[dir]) continue;
      const target = typeof r[dir] === 'string' ? r[dir] : r[dir].page;
      assert.ok(fs.existsSync(path.join(__dirname, '..', 'pages', target)), from + ' ' + dir + ' → ' + target + ' existe');
    }
  }
  // Cada flecha visible lleva exactamente a su destino (clic real)
  const cases = [
    ['config.html', 'back', 'menu.html'], ['soporte.html', 'back', 'config.html'], ['ranking.html', 'back', 'menu.html'],
    ['manual.html', 'back', 'menu.html'], ['vestir.html', 'back', 'menu.html'], ['niveles.html', 'back', 'menu.html'],
    ['nivel-titulo.html?n=4', 'back', 'niveles.html'], ['nivel-titulo.html?n=4', 'next', 'nivel-desc.html?n=4'],
    ['nivel-desc.html?n=4', 'back', 'nivel-titulo.html?n=4'], ['nivel-desc.html?n=4', 'next', 'caso.html?n=4'],
    ['caso.html?n=4', 'back', 'nivel-desc.html?n=4'], ['juicio.html?n=4', 'back', 'caso.html?n=4'],
    ['juicio.html?n=4', 'next', 'desafio.html?n=4'], ['desafio.html?n=4', 'back', 'menu.html']
  ];
  for(const [from, dir, to] of cases){
    await go(page, from); await tick(page, 100);
    await page.click('[data-nav="' + dir + '"]', { force:true });    // force: algunas flechas laten (animación)
    await page.waitForURL(u => u.href.endsWith('/pages/' + to));
  }
  // Servidores con "URLs limpias" (redirigen /pages/caso.html → /pages/caso): las flechas siguen funcionando
  const srv = await cleanUrlServer();
  try {
    await page.goto(srv.url + '/pages/portada'); await seed(page, db({ progress:{ levels:played(9) } }));
    await page.goto(srv.url + '/pages/nivel-desc.html?n=3');
    assert.ok(page.url().endsWith('/pages/nivel-desc?n=3'), 'el servidor usa URLs limpias: ' + page.url());
    assert.strictEqual(await page.getAttribute('[data-nav="back"]', 'href'), 'nivel-titulo.html?n=3');
    await page.click('[data-nav="next"]', { force:true });
    await page.waitForURL(/\/pages\/caso\?n=3$/);
    assert.strictEqual(await page.getAttribute('[data-nav="back"]', 'href'), 'nivel-desc.html?n=3');
  } finally { srv.close(); }
  // ← en las preguntas de cualquier nivel: directo al menú (sin pasar por otras pantallas)
  for(const n of [1, 5, 10]){
    await go(page, 'desafio.html?n=' + n);
    await answer(page, 'right');
    const navs = [];
    const onNav = f => { if(f === page.mainFrame()) navs.push(url(page)); };
    page.on('framenavigated', onNav);
    await page.click('.btn-back');
    await page.waitForURL(/menu\.html$/); await tick(page, 300);
    page.off('framenavigated', onNav);
    assert.deepStrictEqual(navs, ['menu.html'], 'nivel ' + n + ': una sola navegación, al menú');
  }
  // ← en el desafío final: menú, y el intento se descarta
  await playQuiz(page, 2, 'right');
  assert.strictEqual(await visible(page, '.btn-back'), true);
  await page.click('.btn-back'); await page.waitForURL(/menu\.html$/);
  assert.strictEqual(await session(page, 'quiz'), null, 'el intento abandonado no queda guardado');
  await go(page, 'palabra.html?n=2'); await page.waitForURL(/niveles\.html/);
  // Ninguna pantalla muestra flechas sin acción (ni su "sombra")
  for(const p of ['portada.html', 'registro.html', 'menu.html', 'config.html', 'niveles.html', 'nivel-titulo.html?n=2', 'nivel-desc.html?n=2', 'caso.html?n=2', 'juicio.html?n=2', 'desafio.html?n=2', 'fin.html']){
    await go(page, p); await tick(page, 200);
    const bad = await page.$$eval('[data-nav]', els => els.filter(a => {
      const shown = getComputedStyle(a).visibility !== 'hidden' && +getComputedStyle(a).opacity > 0;
      return shown ? !a.getAttribute('href') : a.getAttribute('tabindex') !== '-1';
    }).map(a => a.dataset.nav));
    assert.deepStrictEqual(bad, [], p + ': flechas visibles sin destino');
  }
});

await test('16. El área de clic de las flechas y los iconos coincide con el dibujo', async b => {
  const { page } = await open(b, db({ progress:{ levels:played(1) } }));
  // Todo el círculo de cada flecha responde, y nada fuera de él (ni lo tapan títulos u otros elementos)
  await page.evaluate(() => { DF.store.session.set('quiz', { lvl:1, score:1, correct:1, wrong:0, unanswered:0, total:10 }); DF.store.session.set('read_1', { testimonios:1, denuncia:1, pruebas:1 }); });
  for(const vp of [{ width:1280, height:720 }, { width:390, height:844 }]){
    await page.setViewportSize(vp);
    for(const p of ['config.html', 'soporte.html', 'ranking.html', 'manual.html', 'vestir.html', 'niveles.html', 'nivel-titulo.html?n=1',
      'nivel-desc.html?n=1', 'caso.html?n=1', 'juicio.html?n=1', 'desafio.html?n=1', 'palabra.html?n=1', 'registro.html']){
      await go(page, p); await tick(page, 200);
      const res = await page.evaluate(() => [...document.querySelectorAll('[data-nav], #btn-registro')].filter(a => getComputedStyle(a).visibility !== 'hidden').map(a => {
        const b = a.getBoundingClientRect(); let ok = 0, tot = 0, out = 0;
        const cx = b.left + b.width * .505, cy = b.top + b.height * .492, rr = b.width * .39;
        for(let x = b.left + 1; x < b.right; x += 3) for(let y = b.top + 1; y < b.bottom; y += 3){
          const d = (x - cx) ** 2 + (y - cy) ** 2, el = document.elementFromPoint(x, y), hit = !!el && a.contains(el);
          if(d < (rr - 2) ** 2){ tot++; if(hit) ok++; } else if(d > (rr + 3) ** 2 && hit) out++;
        }
        return { dir: a.dataset.nav || 'enviar', circle: ok / tot, corners: out };
      }));
      assert.ok(res.length > 0, p + ': tiene flechas');
      res.forEach(r => {
        assert.strictEqual(r.circle, 1, vp.width + 'x' + vp.height + ' ' + p + ' flecha ' + r.dir + ': solo ' + Math.round(r.circle * 100) + '% del círculo responde');
        assert.strictEqual(r.corners, 0, p + ' flecha ' + r.dir + ': responde fuera del círculo');
      });
    }
  }
  await page.setViewportSize({ width:1280, height:720 });
  await go(page, 'nivel-titulo.html?n=1');
  const box = await page.locator('.btn-next').boundingBox();
  for(const [dx, dy] of [[3, 3], [box.width - 3, 3], [3, box.height - 3], [box.width - 3, box.height - 3]]){
    await page.mouse.click(box.x + dx, box.y + dy); await tick(page, 300);
    assert.match(url(page), /^nivel-titulo/, 'una esquina transparente no navega');
  }
  await page.mouse.move(box.x + 3, box.y + 3);
  assert.strictEqual(await page.$eval('.btn-next', el => el.matches(':hover')), false, 'sin efecto hover fuera del círculo');
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForURL(/nivel-desc\.html\?n=1/);
  await go(page, 'menu.html');
  const r = await page.locator('.menu-ranking').boundingBox();
  await page.mouse.click(r.x + 4, r.y + 4); await tick(page, 300);
  assert.match(url(page), /^menu/, 'el margen transparente del ícono no navega');
  await page.mouse.click(r.x + r.width / 2, r.y + r.height / 2);
  await page.waitForURL(/ranking\.html/);
});

await test('17. Música de fondo: arranca con la interacción, no se reinicia y respeta el volumen', async b => {
  const { page } = await open(b, null, { clock:false });
  await page.goto(ROOT + '/index.html'); await page.waitForTimeout(800);
  const A = () => page.evaluate(() => { const a = document.getElementById('df-music'); return { paused:a.paused, t:a.currentTime, vol:a.volume }; });
  assert.strictEqual((await A()).paused, true, 'no suena antes de que el jugador interactúe');
  const f = page.frameLocator('#df-frame');
  await f.locator('.splash-btn').click(); await page.waitForTimeout(1200);
  let m = await A();
  assert.strictEqual(m.paused, false, 'suena después del primer clic');
  assert.ok(m.vol > 0 && m.vol <= 0.25, 'volumen moderado: ' + m.vol);
  const t1 = m.t;
  await f.locator('#correo').fill('m@test.com'); await f.locator('#usuario').fill('Musico');
  await f.locator('#btn-registro').click(); await page.waitForTimeout(700);
  await f.locator('.menu-play').click(); await page.waitForTimeout(700);
  await f.locator('[data-nav="back"]').click(); await page.waitForTimeout(700);
  m = await A();
  assert.strictEqual(m.paused, false);
  assert.ok(m.t > t1 + 1, 'sigue sonando sin volver a empezar (' + t1.toFixed(1) + ' → ' + m.t.toFixed(1) + ')');
  assert.strictEqual(await page.evaluate(() => location.hash), '#pages/menu.html', 'la dirección recuerda la pantalla');
  await f.locator('.menu-config').click(); await page.waitForTimeout(700);
  await f.locator('#musica').fill('0'); await f.locator('#musica').dispatchEvent('input'); await page.waitForTimeout(300);
  assert.strictEqual((await A()).paused, true, 'Música en 0 la apaga');
  await f.locator('#musica').fill('80'); await f.locator('#musica').dispatchEvent('input'); await page.waitForTimeout(500);
  m = await A();
  assert.strictEqual(m.paused, false); assert.ok(m.vol > 0.2 && m.vol <= 0.5, 'volumen ' + m.vol);
  assert.strictEqual((await settingsOf(page)).music, 80, 'se guarda en Configuración');
  // Una dirección mal escrita no deja la pantalla en blanco
  await page.goto('about:blank'); await page.goto(ROOT + '/index.html#%E0%A4%A'); await page.waitForTimeout(600);
  assert.ok((page.frame({ name:'df-shell' }).url() || '').endsWith('pages/portada.html'), 'carga la portada');
  // Pantallas abiertas sueltas: la música retoma donde iba
  await page.goto(ROOT + '/pages/menu.html'); await page.mouse.click(5, 5); await page.waitForTimeout(1500);
  const a = await page.evaluate(() => DF.music.info());
  assert.ok(a.playing && a.time > 1, 'suena también sin el contenedor: ' + JSON.stringify(a));
  await page.goto(ROOT + '/pages/niveles.html'); await page.waitForTimeout(300); await page.mouse.click(5, 5); await page.waitForTimeout(600);
  const c = await page.evaluate(() => DF.music.info());
  assert.ok(c.playing && c.time >= a.time, 'retoma la posición: ' + a.time.toFixed(1) + ' → ' + c.time.toFixed(1));
  assert.deepStrictEqual(page.errors, []);
}, { args:['--autoplay-policy=document-user-activation-required'] });

await test('18. Video tutorial en la Selección de nivel', async b => {
  const { page } = await open(b, db({ progress:{ levels:played(1) } }), { clock:false });
  await go(page, 'niveles.html'); await page.waitForTimeout(1000);
  assert.strictEqual(await page.locator('#tuto.hidden').count(), 0, 'el reproductor se muestra');
  const v = await page.evaluate(() => { const v = document.getElementById('tuto-video'); return { d:v.duration, poster:v.poster, muted:v.muted }; });
  assert.ok(v.d > 30, 'el video dura ' + v.d + ' s');
  assert.ok(v.poster.endsWith('tutorial-poster.jpg'));
  const pos = await page.evaluate(() => {
    const s = document.querySelector('.stage').getBoundingClientRect(), t = document.getElementById('tuto').getBoundingClientRect();
    return { right: s.right - t.right, bottom: s.bottom - t.bottom, w: t.width / s.width, left: t.left - (s.left + s.width / 2), top: t.top - (s.top + s.height / 2) };
  });
  assert.ok(pos.left > 0 && pos.top > 0 && pos.right >= 0 && pos.bottom >= 0, 'abajo a la derecha: ' + JSON.stringify(pos));
  assert.ok(pos.w < 0.25, 'chico: ' + pos.w);
  await page.click('#tuto-play'); await page.waitForTimeout(1500);
  let st = await page.evaluate(() => { const v = document.getElementById('tuto-video'); return { paused:v.paused, t:v.currentTime }; });
  assert.ok(!st.paused && st.t > 0.5, 'reproduce');
  await page.click('#tuto-play');
  assert.strictEqual(await page.evaluate(() => document.getElementById('tuto-video').paused), true, 'pausa');
  await page.click('#tuto-size');
  assert.ok(await page.locator('#tuto.big').count(), 'se puede ampliar');
  await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(300);
  assert.match(url(page), /^niveles/, 'con el video ampliado las flechas del teclado no cambian de pantalla');
  await page.keyboard.press('Escape');
  assert.strictEqual(await page.locator('#tuto.big').count(), 0);
  // la selección de niveles sigue funcionando con el reproductor
  await page.click('.lvl-row[data-n="2"]'); await page.waitForURL(/nivel-titulo\.html\?n=2/);
  // si el archivo no se puede cargar, el reproductor no queda roto en pantalla
  await go(page, 'niveles.html'); await page.waitForTimeout(500);
  await page.evaluate(() => { document.getElementById('tuto-video').src = '../assets/video/no-existe.mp4'; });
  await page.waitForTimeout(800);
  assert.ok(await page.locator('#tuto.hidden').count(), 'sin video no se muestra el reproductor');
});

await test('19. Todas las pantallas se adaptan a celulares, tablets y computadoras', async b => {
  const sizes = [[1280, 720], [1920, 1080], [1366, 768], [1024, 768], [844, 390], [390, 844], [360, 640], [768, 1024], [412, 915]];
  const pages = ['portada.html', 'registro.html', 'menu.html', 'config.html', 'soporte.html', 'ranking.html', 'manual.html', 'vestir.html',
    'niveles.html', 'nivel-titulo.html?n=10', 'nivel-desc.html?n=1', 'caso.html?n=1', 'juicio.html?n=5', 'desafio.html?n=1', 'palabra.html?n=1', 'resultado.html?n=1', 'fin.html'];
  const problems = [];
  for(const [w, h] of sizes){
    const mobile = Math.min(w, h) < 800;
    const context = await b.newContext({ viewport:{ width:w, height:h }, hasTouch:mobile, isMobile:mobile });
    const page = await context.newPage();
    await page.goto(ROOT + '/pages/portada.html');
    await seed(page, db({ user:'Usuario_Largo16', progress:{ levels:played(10) } }));
    for(const p of pages){
      await page.evaluate(() => {
        DF.store.session.set('quiz', { lvl:1, score:900, correct:8, wrong:1, unanswered:1, total:10 });
        DF.store.session.set('last', { lvl:1, score:1500, stars:2, passed:true, correct:9, wrong:1, unanswered:0, total:10, words:3, wordsTotal:3, firstTime:true, unlockedLevel:2 });
      });
      await go(page, p); await page.waitForTimeout(300);
      const layout = await page.evaluate(() => document.documentElement.getAttribute('data-layout'));
      if(layout !== (h > w ? 'portrait' : 'landscape')) problems.push(w + 'x' + h + ' ' + p + ': orientación ' + layout);
      (await page.evaluate(audit)).forEach(x => problems.push(w + 'x' + h + ' ' + p + ': ' + x));
    }
    await context.close();
  }
  assert.deepStrictEqual(problems, []);
});

console.log('\nDecisión Final · pruebas funcionales\n');
results.forEach(r => console.log(' ' + r[0] + ' ' + r[1]));
const failed = results.filter(r => r[0] === '✘').length;
console.log('\n' + (results.length - failed) + ' de ' + results.length + ' pruebas OK\n');
process.exit(failed ? 1 : 0);
})();
