/* Registro / inicio de sesión: valida correo y usuario.
   Cada correo es una cuenta con su propio progreso (ver store.js):
   si el correo es nuevo se crea una cuenta vacía; si ya existe,
   se recupera SU progreso (nunca el de otra cuenta).
   Los campos solo se completan solos con la cuenta abierta en esta
   pestaña: quien entra después no ve el correo de otra persona. */
DF.boot(function(){
  const form = document.getElementById('form-registro');
  const correo = document.getElementById('correo');
  const usuario = document.getElementById('usuario');
  const mC = document.getElementById('msg-correo');
  const mU = document.getElementById('msg-usuario');
  const s = DF.store.state;

  if(s.email) correo.value = s.email;
  if(s.user)  usuario.value = s.user;

  function check(){
    const okMail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo.value.trim());
    const u = usuario.value.trim();
    const okUser = u.length >= 3 && u.length <= 16;
    correo.classList.toggle('error', !okMail);
    usuario.classList.toggle('error', !okUser);
    mC.textContent = okMail ? '' : DF.i18n.t('errCorreo');
    mU.textContent = okUser ? '' : DF.i18n.t('errUsuario');
    return okMail && okUser;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    if(!check()){ DF.audio.play('bad'); return; }
    DF.store.login(correo.value.trim(), usuario.value.trim());
    DF.nav.go('menu.html');
  });
  [correo, usuario].forEach(i => i.addEventListener('input', () => { i.classList.remove('error'); }));
});
