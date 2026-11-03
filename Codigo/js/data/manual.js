/* =========================================================
   manual.js · Contenido del Manual de juego (solo datos)
   Describe ÚNICAMENTE mecánicas que existen en el juego.
   Si cambian las reglas (js/data/niveles.js → DF.rules) los
   números se actualizan solos porque se leen de DF.rules.
   ========================================================= */
window.DF = window.DF || {};

DF.manual = function(){
  const R = DF.rules, N = DF.levels.length;
  return [
    { t:'1. Objetivo del juego', p:[
      'En Decisión Final sos quien defiende la justicia en ' + N + ' casos de Educación Ciudadana: dignidad, Derechos Humanos, prejuicios, estereotipos, diversidad cultural, normas, Constitución Nacional y libertad con responsabilidad.',
      'En cada caso leés el expediente, escuchás al juez, respondés preguntas y superás un desafío final. Cuantas más respuestas correctas, más puntos y estrellas.' ]},
    { t:'2. Cómo iniciar una partida', p:[
      'En la portada tocá COMENZAR. En REGISTRO escribí tu correo electrónico y un usuario de jugador (de 3 a 16 caracteres) y tocá la flecha.',
      'En el MENÚ tocá el botón ▶ (Jugar) para ir a la Selección de nivel.',
      'Cada cuenta (cada correo) tiene su propio progreso, puntos, niveles y personaje, guardados en este navegador. Para que juegue otra persona, tocá CAMBIAR DE CUENTA en el menú: tu progreso queda guardado y lo recuperás al volver a entrar con tu correo.' ]},
    { t:'3. Selección y desbloqueo de niveles', p:[
      'El nivel 1 está disponible desde el principio. Los niveles con candado 🔒 todavía están bloqueados.',
      'Al TERMINAR un nivel, ganes o pierdas, se desbloquea el siguiente. Un nivel desbloqueado no vuelve a bloquearse nunca.',
      'Al lado de cada nivel ves su estado: Disponible, Ganado (con estrellas) o Perdido (podés reintentarlo cuando quieras).',
      'Abajo a la derecha hay un VIDEO TUTORIAL que muestra cómo se juega, cómo responder y cómo avanzar de nivel: tocá ▶ para verlo, pausalo cuando quieras y usá el botón de ampliar para verlo en grande.' ]},
    { t:'4. Cómo es cada nivel', p:[
      'Título del caso → descripción → INFORMACIÓN DEL CASO con tres carpetas: Testimonios, Denuncia y Pruebas. Tenés que abrir las tres para que se habilite la flecha.',
      'Después el juez presenta el caso en el tribunal y empieza el cuestionario de ' + R.perLevel + ' preguntas. Al final llega el desafío del nivel.' ]},
    { t:'5. Preguntas y opciones de respuesta', p:[
      'Cada pregunta tiene cuatro opciones (A, B, C y D) y una sola es correcta. La primera pregunta de cada nivel es la pregunta oficial del caso; al responderla se muestra la devolución del caso.',
      'Podés responder tocando una opción con el mouse, moviéndote con las flechas del teclado o W A S D y confirmando con Enter o Espacio, o apretando directamente las teclas 1, 2, 3 o 4.',
      'Cada pregunta se responde UNA sola vez: después de elegir, ya no se puede cambiar.' ]},
    { t:'6. El temporizador de ' + R.seconds + ' segundos', p:[
      'Cada pregunta tiene su propio reloj de ' + R.seconds + ' segundos. El número arriba a la derecha muestra los segundos que quedan y la barra superior se va vaciando.',
      'En los últimos 5 segundos el reloj se pone rojo. El tiempo se detiene cuando respondés y vuelve a empezar desde ' + R.seconds + ' con la pregunta siguiente.' ]},
    { t:'7. Respuesta correcta, incorrecta o sin tiempo', p:[
      'Correcta: la opción se pinta de verde y sumás ' + R.basePoints + ' puntos, más un bonus de hasta ' + R.timeBonusMax + ' puntos si respondés rápido.',
      'Incorrecta: tu opción se pinta de rojo, la correcta de verde y no sumás puntos.',
      'Tiempo agotado: la pregunta queda “sin responder”, no suma puntos, se muestra la respuesta correcta y el juego pasa solo a la siguiente. Ya no se puede responder esa pregunta.' ]},
    { t:'8. Botones de navegación (flechas)', p:[
      'La flecha ← vuelve a la pantalla anterior y la flecha → avanza. También podés usar las teclas ← y → del teclado. Una flecha aparece solo cuando tiene a dónde llevarte (por ejemplo, la → de Información del caso aparece cuando leíste las tres carpetas).',
      'Durante las preguntas y el desafío final no se puede saltear ni volver a una pregunta anterior: la flecha ← te lleva directo al MENÚ principal y ese intento del nivel no se guarda. Ahí las teclas ← y → sirven para elegir las opciones.' ]},
    { t:'9. El desafío final del nivel', p:[
      'Después de las ' + R.perLevel + ' preguntas tenés que adivinar 3 palabras clave del caso a partir de una pista. Para cada palabra tenés ' + R.attempts + ' intentos.',
      'Escribí con el teclado en pantalla o con el del equipo y confirmá con ENTER. Verde: letra en el lugar correcto. Amarillo: la letra está en otro lugar. Gris: la letra no está.',
      'Cada palabra adivinada da ' + R.wordBase + ' puntos más ' + R.wordBonus + ' por cada intento que te sobró.' ]},
    { t:'10. Resultados y siguiente nivel', p:[
      'Ganás el caso con al menos ' + R.passMinSolved + ' respuestas correctas y ' + R.wordPass + ' palabras del desafío. Estrellas: 3 con ' + R.perLevel + ' correctas, 2 con ' + (R.perLevel - 1) + ', 1 con ' + R.passMinSolved + ' u ' + (R.passMinSolved + 1) + '.',
      'La pantalla de resultado muestra tus correctas, incorrectas, sin responder, palabras y puntaje. A los ' + R.redirectSeconds + ' segundos vuelve sola a la Selección de nivel.',
      'Con el botón SIGUIENTE NIVEL pasás directo al próximo caso (también aparece en la Selección de nivel). En el último nivel el botón dice VER FINAL y muestra la pantalla de cierre del juego.' ]},
    { t:'11. Si perdés un nivel', p:[
      'No pasa nada grave: el siguiente nivel se desbloquea igual y podés seguir jugando.',
      'Podés reintentar el nivel perdido con REINTENTAR NIVEL o desde la Selección de nivel. Siempre se guarda tu mejor puntaje, y un nivel ganado sigue contando como ganado.' ]},
    { t:'12. Cambiar los accesorios del personaje', p:[
      'En el MENÚ tocá el ícono de perfil (arriba a la izquierda) para abrir ¡VESTÍ A TU PERSONAJE!.',
      'Hay 12 categorías: pelo, sombreros y gorras, auriculares, bufandas, gafas, collares, pins, mochilas y bolsos, accesorios de mano, animales, varios y barbijos. Tocá una prenda para ponértela y tocala otra vez para sacártela (el pelo siempre queda puesto).',
      'Se usa una prenda por categoría. La bufanda y el collar no se pueden usar juntos: al elegir uno se saca el otro. También podés elegir el tono de piel.',
      'Las prendas con candado se desbloquean al terminar el nivel indicado. Lo que elegís se guarda y aparece en el tribunal y en el ranking.' ]},
    { t:'13. Otras pantallas', p:[
      'RANKING: compará tu puntaje total con otros jugadores. CONFIGURACIÓN (engranaje): volumen, música, brillo, idioma y gráficos. SOPORTE (desde Configuración): preguntas frecuentes y formulario de contacto.',
      'La música de fondo empieza con tu primer clic o toque y sigue sonando al cambiar de pantalla. En CONFIGURACIÓN → Música podés bajarla, subirla o apagarla (en 0).',
      'El juego se adapta a computadoras, tablets y celulares: podés jugar con el celular parado o acostado.' ]}
  ];
};
