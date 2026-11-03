/* =========================================================
   store.js · Estado persistente del juego (localStorage)
   Solo guarda y carga. La lógica de niveles está en progress.js.
   Si el navegador bloquea localStorage, el juego funciona en memoria.

   CUENTAS SEPARADAS
   - Cada cuenta (identificada por su correo) se guarda en SU PROPIA
     clave:  df_decision_final_v2:cuenta:<correo>
     con su progreso, puntos, estadísticas, registros de partidas y
     personaje. Una cuenta nunca lee ni escribe la clave de otra.
   - Los ajustes del dispositivo (volumen, música, brillo, idioma,
     gráficos) van en df_decision_final_v2:ajustes y valen para todas.
   - La sesión es de cada pestaña (sessionStorage): al cerrar la
     pestaña o tocar CAMBIAR DE CUENTA hay que volver a registrarse.
     Así, quien abra el juego después nunca entra a la cuenta anterior.
   - Las partidas en curso (cuestionario, resultado, carpetas leídas)
     usan claves de sesión propias de cada cuenta (DF.store.session).
   ========================================================= */
window.DF = window.DF || {};

DF.store = (function(){
  const PREFIX = 'df_decision_final_v2:';
  const SETTINGS_KEY = PREFIX + 'ajustes';
  const ACCOUNT_PREFIX = PREFIX + 'cuenta:';
  const OLD_KEY = 'df_decision_final_v1';         // versión anterior: una sola partida para todos
  const SESSION_ACCOUNT = 'df_account';           // cuenta activa de esta pestaña
  const SESSION_PREFIX = 'df_s:';                 // datos de partida en curso, por cuenta
  const LEGACY_SESSION = /^df_(quiz|last|read_\d+)$/;

  const SETTINGS = { volume: 70, music: 40, brightness: 55, lang: 'es', res: 1920 };
  const AVATAR = { piel: 'media', pelo: 'largo', varios: 'cadena' };

  const clone = o => JSON.parse(JSON.stringify(o));
  const isObj = o => !!o && typeof o === 'object' && !Array.isArray(o);
  const now = () => new Date().toISOString();
  function merge(base, extra){
    const out = clone(base);
    if(!isObj(extra)) return out;
    for(const k in extra){
      if(isObj(out[k]) && isObj(extra[k])) out[k] = merge(out[k], extra[k]);
      else out[k] = extra[k];
    }
    return out;
  }

  /* Identificador de cuenta = correo normalizado (mayúsculas/espacios no importan) */
  function idFor(email, user){
    const e = String(email || '').trim().toLowerCase();
    if(e) return e;
    const u = String(user || '').trim().toLowerCase();
    return u ? 'usuario:' + u : null;
  }

  function newAccount(email, user){
    return { email: email || null, user: user || null, progress: { levels: {} }, avatar: clone(AVATAR), created: now(), lastLogin: null };
  }

  /* Progreso guardado por la primera versión (progress.completed = solo niveles ganados) */
  function migrateProgress(p){
    p = isObj(p) ? clone(p) : {};
    p.levels = isObj(p.levels) ? p.levels : {};
    if(isObj(p.completed)){
      Object.keys(p.completed).forEach(n => {
        const old = p.completed[n] || {};
        if(!p.levels[n]) p.levels[n] = { played:true, passed:true, score: old.score || 0, stars: old.stars || 0, attempts:1 };
      });
    }
    delete p.completed;
    return p;
  }
  function migrateAvatar(a){
    if(!isObj(a)) return clone(AVATAR);
    // la primera versión guardaba un avatar de "acc/ropa"; se reemplaza por el del prototipo
    if('acc' in a || 'ropa' in a) return { piel: a.piel || 'media', pelo: 'largo', varios: 'cadena' };
    return a;
  }
  function normalizeAccount(a){
    if(!isObj(a)) return null;
    const acc = merge(newAccount(a.email, a.user), a);
    acc.progress = migrateProgress(a.progress);
    acc.avatar = migrateAvatar(a.avatar);
    return acc;
  }
  /* Une dos registros de niveles conservando lo mejor de cada uno */
  function mergeLevels(a, b){
    const out = clone(a || {});
    Object.keys(b || {}).forEach(n => {
      const x = out[n], y = b[n];
      if(!x){ out[n] = y; return; }
      out[n] = Object.assign({}, x, {
        played: !!(x.played || y.played), passed: !!(x.passed || y.passed),
        score: Math.max(x.score || 0, y.score || 0), stars: Math.max(x.stars || 0, y.stars || 0),
        attempts: Math.max(x.attempts || 0, y.attempts || 0)
      });
    });
    return out;
  }

  /* ---------- acceso a localStorage (cada dato en su clave) ---------- */
  let memory = false;                     // localStorage bloqueado o lleno: se sigue en memoria
  const cache = {};
  function read(key){
    if(!memory){
      try { const v = localStorage.getItem(key); cache[key] = v ? JSON.parse(v) : null; } catch(e){}
    }
    return cache[key] === undefined ? null : cache[key];
  }
  function write(key, value){
    cache[key] = clone(value);
    if(memory) return;
    try { localStorage.setItem(key, JSON.stringify(value)); } catch(e){ memory = true; }
  }
  function ss(fn){ try { return fn(window.sessionStorage); } catch(e){ return null; } }

  const loadSettings = () => merge(SETTINGS, read(SETTINGS_KEY));
  const loadAccount = id => (id ? normalizeAccount(read(ACCOUNT_PREFIX + id)) : null);

  /* ---------- carga inicial ---------- */
  let settings = loadSettings();
  let accId = ss(s => s.getItem(SESSION_ACCOUNT)) || null;     // sesión de ESTA pestaña
  let account = loadAccount(accId);
  if(!account) accId = null;

  /* Partida de la versión anterior (un único jugador): pasa UNA vez a la cuenta de su correo */
  (function importV1(){
    let old = null;
    try { old = JSON.parse(localStorage.getItem(OLD_KEY)); } catch(e){}
    if(!isObj(old)) return;
    try { localStorage.removeItem(OLD_KEY); } catch(e){}
    const id = idFor(old.email, old.user);
    if(!read(SETTINGS_KEY)) write(SETTINGS_KEY, settings = merge(SETTINGS, old.settings));
    if(!id) return;
    let acc = loadAccount(id);
    if(acc){
      // la cuenta ya existe: solo se suman los niveles (gana el mejor resultado), nunca se pisa
      acc.progress.levels = mergeLevels(acc.progress.levels, migrateProgress(old.progress).levels);
    } else {
      acc = newAccount(old.email, old.user);
      acc.progress = migrateProgress(old.progress);
      acc.avatar = migrateAvatar(old.avatar);
    }
    write(ACCOUNT_PREFIX + id, acc);
    if(!accId){ accId = id; account = acc; ss(s => s.setItem(SESSION_ACCOUNT, id)); }   // nunca cambia una sesión abierta
  })();

  /* Sin cuenta (antes de registrarse): datos temporales que NUNCA se guardan */
  const guest = { progress: { levels: {} }, avatar: clone(AVATAR) };

  /* Vista del estado de la cuenta activa (misma forma que la versión anterior) */
  const view = {
    get user(){ return account ? account.user : null; },
    get email(){ return account ? account.email : null; },
    get accountId(){ return account ? accId : null; },
    get settings(){ return settings; },
    set settings(v){ settings = merge(SETTINGS, v); },
    get progress(){ return account ? account.progress : guest.progress; },
    set progress(v){ if(account) account.progress = v; else guest.progress = v; },
    get avatar(){ return account ? account.avatar : guest.avatar; },
    set avatar(v){ if(account) account.avatar = v; else guest.avatar = v; }
  };

  /* Lee lo último guardado (otra pestaña pudo cambiarlo), aplica el cambio y
     escribe SOLO los ajustes y la clave de la cuenta activa. */
  function update(fn){
    settings = loadSettings();
    if(accId) account = loadAccount(accId) || account;
    fn(view);
    write(SETTINGS_KEY, settings);
    if(accId && account) write(ACCOUNT_PREFIX + accId, account);
  }

  /* ---------- partidas en curso (sessionStorage) por cuenta ---------- */
  const skey = name => SESSION_PREFIX + (accId || 'invitado') + ':' + name;
  const session = {
    get(name){ const v = ss(s => s.getItem(skey(name))); try { return v ? JSON.parse(v) : null; } catch(e){ return null; } },
    set(name, value){ ss(s => s.setItem(skey(name), JSON.stringify(value))); },
    remove(name){ ss(s => s.removeItem(skey(name))); },
    key: skey
  };
  /* Borra las partidas en curso de TODAS las cuentas de esta pestaña */
  function clearSession(){
    ss(s => {
      const keys = [];
      for(let i = 0; i < s.length; i++){ const k = s.key(i); if(k && (k.indexOf(SESSION_PREFIX) === 0 || LEGACY_SESSION.test(k))) keys.push(k); }
      keys.forEach(k => s.removeItem(k));
    });
  }

  /* Inicia sesión con una cuenta (la crea si el correo es nuevo) */
  function login(email, user){
    const id = idFor(email, user);
    if(!id) return null;
    clearSession();
    accId = id;
    account = loadAccount(id) || newAccount();
    account.email = String(email || '').trim() || account.email;
    account.user = String(user || '').trim() || account.user;
    account.lastLogin = now();
    write(ACCOUNT_PREFIX + id, account);
    ss(s => s.setItem(SESSION_ACCOUNT, id));
    return id;
  }

  /* Cierra la sesión de esta pestaña (los datos de la cuenta quedan guardados) */
  function logout(){
    clearSession();
    accId = null;
    account = null;
    ss(s => s.removeItem(SESSION_ACCOUNT));
  }

  return {
    get state(){ return view; },
    update,
    login,
    logout,
    session,
    clearSession,
    idFor,
    get accountId(){ return view.accountId; },
    /* Reinicia el progreso de la cuenta activa (no toca las demás) */
    reset(){ update(s => { s.progress = { levels: {} }; s.avatar = clone(AVATAR); }); },
    KEYS: { prefix: PREFIX, settings: SETTINGS_KEY, account: ACCOUNT_PREFIX }
  };
})();
