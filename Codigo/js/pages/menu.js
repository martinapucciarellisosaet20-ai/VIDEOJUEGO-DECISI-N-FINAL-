/* Menú principal */
DF.boot(function(){
  document.getElementById('menu-user').textContent = DF.store.state.user + ' · ' + DF.progress.totalScore() + ' ' + DF.i18n.t('pts');
  // Cambiar de cuenta: cierra la sesión (el progreso de esta cuenta queda guardado) y vuelve al registro
  document.getElementById('btn-cuenta').addEventListener('click', () => {
    DF.store.logout();
    DF.nav.go('registro.html');
  });
}, { requiresUser:true });
