/* Manual de juego: vista de "Vestí a tu personaje" + teclas (izq.) y el manual completo con scroll (der.) */
DF.boot(function(){
  const S = DF.sprites;
  const picks = [['pelo','largo'],['pelo','semi'],['pelo','carre'],['gorros','gorraBordo'],['gorros','lana'],
                 ['auriculares','negros'],['bufandas','bordo'],['gafas','redondas'],['collares','plata'],['pins','corazon'],
                 ['bolsos','mochila'],['mano','tea'],['mascotas','gato'],['varios','cadena'],['barbijos','blanco']];
  document.getElementById('man-shot').innerHTML =
      '<span class="ms-arrow"></span><span class="ms-title">' + DF.i18n.t('vestir') + '</span>'
    + '<div class="ms-av">' + S.avatar(null, 2.4, { noPet:true }) + '</div>'
    + '<div class="ms-grid">' + picks.map(p => S.itemPreview(p[0], p[1], 2)).join('') + '</div>'
    + '<div class="ms-cap">' + DF.esc(DF.i18n.t('vestirHint')) + '</div>';

  const box = document.getElementById('man-scroll');
  box.innerHTML = DF.manual().map(s => '<h2>' + DF.esc(s.t) + '</h2>' + s.p.map(p => '<p>' + DF.esc(p) + '</p>').join('')).join('');
  DF.scrollbar(box, document.getElementById('man-track'));
}, { requiresUser:true });
