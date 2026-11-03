/* =========================================================
   stage.js · Escala el escenario a la ventana (responsive) y
   aplica Brillo y Gráficos de la configuración
   - Horizontal (computadoras, tablets y celulares acostados):
     escenario de 1280x720, el diseño original.
   - Vertical (celulares y tablets parados): escenario de 720 de
     ancho y 1280 a 1560 de alto; css/responsive.css reacomoda
     cada pantalla para esa forma (clase .portrait).
   - El fondo continúa fuera del escenario a la misma escala, así
     no quedan franjas vacías en pantallas de otra proporción.
   ========================================================= */
window.DF = window.DF || {};

DF.stage = (function(){
  const LAND = { w: 1280, h: 720 };
  const PORT = { w: 720, min: 1280, max: 1560 };
  const BG = 1306.2;              // ancho de fondo.png dentro del escenario de 1280x720 (equivale a "cover")
  let stage, viewport, shade;
  let mode = null, W = LAND.w, H = LAND.h, k = 1;

  /* Mientras se escribe, el teclado del celular achica la ventana: no se cambia la orientación */
  function typing(){
    const a = document.activeElement;
    return !!a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName) && a.type !== 'range';
  }

  function fit(){
    if(!stage) return;
    const s = DF.store.state.settings;
    const vw = window.innerWidth, vh = window.innerHeight;
    if(!vw || !vh) return;
    const m = (mode && typing()) ? mode : (vw < vh ? 'portrait' : 'landscape');
    if(m === 'portrait'){ W = PORT.w; H = Math.round(Math.min(PORT.max, Math.max(PORT.min, PORT.w * vh / vw))); }
    else { W = LAND.w; H = LAND.h; }
    // "Gráficos": 1920 permite agrandar hasta 1.5x, 1280 deja el juego en tamaño base.
    const maxScale = (+s.res || 1920) / LAND.w;
    k = Math.min(vw / W, vh / H, maxScale);
    stage.style.width = W + 'px';
    stage.style.height = H + 'px';
    stage.style.setProperty('--sh', H + 'px');
    stage.style.transform = 'scale(' + k + ')';
    stage.style.imageRendering = s.res <= 1280 ? 'pixelated' : 'auto';
    if(viewport) viewport.style.backgroundSize = (BG * k).toFixed(2) + 'px auto';

    const changed = m !== mode;
    mode = m;
    stage.classList.toggle('portrait', m === 'portrait');
    stage.classList.toggle('landscape', m !== 'portrait');
    // celular acostado: el escenario queda chico y se agrandan los textos más pequeños
    stage.classList.toggle('compact', m !== 'portrait' && k < 0.62);
    document.documentElement.setAttribute('data-layout', m);
    if(changed) window.dispatchEvent(new CustomEvent('df:layout', { detail: { mode: m, width: W, height: H } }));
  }

  function applyBrightness(){
    if(!shade) return;
    const v = DF.store.state.settings.brightness;      // 0..100
    const target = viewport || stage;
    // 55 = brillo normal. Por debajo oscurece (capa negra), por encima aclara con filtro.
    if(v <= 55){ shade.style.opacity = (1 - v / 55) * .65; target.style.filter = 'none'; }
    else { shade.style.opacity = 0; target.style.filter = 'brightness(' + (1 + (v - 55) / 45 * .35) + ')'; }
  }

  function init(){
    stage = document.querySelector('.stage');
    if(!stage) return;
    viewport = stage.closest('.viewport');
    shade = document.createElement('div');
    shade.className = 'stage-shade';
    (viewport || stage).appendChild(shade);          // el brillo también cubre el fondo exterior
    fit(); applyBrightness();
    window.addEventListener('resize', fit);
    window.addEventListener('orientationchange', () => setTimeout(fit, 120));
    // al cerrar el teclado del celular se vuelve a acomodar
    document.addEventListener('focusout', () => setTimeout(fit, 60));
  }

  return {
    init, fit, applyBrightness,
    get mode(){ return mode; },
    get portrait(){ return mode === 'portrait'; },
    get width(){ return W; },
    get height(){ return H; },
    get scale(){ return k; }
  };
})();
