/* Escena del juicio: el juez presenta el caso (efecto máquina de escribir).
   La flecha → lleva al cuestionario; tocar el texto lo muestra completo. */
DF.boot(function(){
  const lvl = DF.levels[DF.nav.level() - 1];
  const court = document.getElementById('court');
  court.innerHTML = DF.sprites.courtScene();
  DF.sprites.setScene(court, 'judge');

  const speech = document.getElementById('speech');
  const out = document.getElementById('speech-txt');
  const next = document.getElementById('juicio-next');
  const text = '"' + lvl.juez + '"';
  let i = 0;
  DF.audio.play('gavel');
  const done = () => { clearInterval(timer); out.textContent = text; speech.classList.add('done'); next.classList.add('pulse'); };
  const timer = setInterval(() => {
    out.textContent = text.slice(0, ++i);
    if(i % 3 === 0) DF.audio.play('key');
    if(i >= text.length) done();
  }, 24);
  speech.addEventListener('click', done);
  window.addEventListener('pagehide', () => clearInterval(timer));
}, { requiresUser:true, level:true });
