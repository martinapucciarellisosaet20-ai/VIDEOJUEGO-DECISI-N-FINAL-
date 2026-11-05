/* Pantalla de título del nivel (tocar el cartel o la flecha → descripción) */
DF.boot(function(){
  const lvl = DF.levels[DF.nav.level() - 1];
  document.getElementById('nv-titulo').textContent = lvl.titulo;
  document.getElementById('banner').addEventListener('click', () => DF.nav.follow('next'));   // mismo destino que la flecha →
}, { requiresUser:true, level:true });
