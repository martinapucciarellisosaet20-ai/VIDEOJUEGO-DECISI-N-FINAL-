/* Soporte: preguntas frecuentes + formulario de contacto */
DF.boot(function(){
  const modal = document.getElementById('modal-contacto');
  const msg = document.getElementById('mensaje');
  document.getElementById('btn-contacto').addEventListener('click', () => { modal.classList.remove('hidden'); msg.focus(); });
  document.getElementById('cerrar-contacto').addEventListener('click', () => modal.classList.add('hidden'));
  document.getElementById('enviar-contacto').addEventListener('click', () => {
    if(!msg.value.trim()){ msg.focus(); return; }
    // Acá se conectaría con un servidor / correo real. Por ahora queda registrado en el navegador.
    try {
      const k = 'df_soporte';
      const list = JSON.parse(localStorage.getItem(k) || '[]');
      list.push({ user: DF.store.state.user, email: DF.store.state.email, msg: msg.value.trim(), at: new Date().toISOString() });
      localStorage.setItem(k, JSON.stringify(list));
    } catch(e){}
    msg.value = '';
    modal.classList.add('hidden');
    DF.audio.play('ok');
    DF.toast(DF.i18n.t('enviado'));
  });
}, { requiresUser:true });
