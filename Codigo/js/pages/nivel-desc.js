/* Descripción del caso */
DF.boot(function(){
  const lvl = DF.levels[DF.nav.level() - 1];
  document.getElementById('nv-tag').textContent = DF.i18n.t('nivel', { n: lvl.id });
  document.getElementById('nv-desc').innerHTML = lvl.descripcion.map(p => '<p>' + DF.esc(p) + '</p>').join('');
}, { requiresUser:true, level:true });
