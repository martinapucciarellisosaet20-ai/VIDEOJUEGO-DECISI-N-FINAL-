/* Configuración: volumen, música, brillo, idioma, gráficos (todo se guarda y se aplica en vivo).
   Son preferencias del dispositivo: valen para todas las cuentas. */
DF.boot(function(){
  const s = DF.store.state.settings;
  const vol = document.getElementById('volumen');
  const mus = document.getElementById('musica');
  const bri = document.getElementById('brillo');
  const idi = document.getElementById('idioma');
  const gra = document.getElementById('graficos');
  vol.value = s.volume; mus.value = s.music; bri.value = s.brightness; idi.value = s.lang; gra.value = String(s.res);

  vol.addEventListener('input', () => { DF.store.update(st => st.settings.volume = +vol.value); DF.music.sync(true); });
  vol.addEventListener('change', () => DF.audio.play('ok'));            // vista previa del volumen
  mus.addEventListener('input', () => { DF.store.update(st => st.settings.music = +mus.value); DF.music.sync(true); });
  bri.addEventListener('input', () => { DF.store.update(st => st.settings.brightness = +bri.value); DF.stage.applyBrightness(); });
  idi.addEventListener('change', () => { DF.store.update(st => st.settings.lang = idi.value); DF.i18n.apply(); if(DF.shell) DF.shell.announce(); });
  gra.addEventListener('change', () => { DF.store.update(st => st.settings.res = +gra.value); DF.stage.fit(); });
}, { requiresUser:true });
