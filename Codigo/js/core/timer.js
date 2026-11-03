/* =========================================================
   timer.js · Temporizador de cuenta regresiva reutilizable
   - Un único setInterval por instancia: start() siempre cancela
     el anterior, así nunca quedan dos temporizadores activos.
   - El tiempo se calcula con una fecha límite (no se "atrasa"
     si la pestaña queda en segundo plano).
   - onExpire se dispara una sola vez por pregunta.
   ========================================================= */
window.DF = window.DF || {};

DF.createTimer = function(opts){
  const LIMIT = opts.seconds * 1000;
  let id = 0, deadline = 0, expired = false, lastSec = -1;

  function tick(){
    const left = Math.max(0, deadline - performance.now());
    const sec = Math.ceil(left / 1000);
    if(opts.onTick) opts.onTick({ ms:left, seconds:sec, fraction:left / LIMIT, secondChanged: sec !== lastSec });
    lastSec = sec;
    if(left <= 0 && !expired){
      expired = true;
      stop();
      if(opts.onExpire) opts.onExpire();
    }
  }
  function start(){
    stop();
    expired = false; lastSec = -1;
    deadline = performance.now() + LIMIT;
    tick();
    id = setInterval(tick, 100);
  }
  let frozen = LIMIT;                 // tiempo restante al detenerse
  function stop(){
    if(id){ clearInterval(id); id = 0; frozen = Math.max(0, deadline - performance.now()); }
    if(expired) frozen = 0;
    return frozen;
  }
  function remaining(){ return id ? Math.max(0, deadline - performance.now()) : frozen; }

  window.addEventListener('pagehide', stop);
  return { start, stop, remaining, get running(){ return !!id; } };
};
