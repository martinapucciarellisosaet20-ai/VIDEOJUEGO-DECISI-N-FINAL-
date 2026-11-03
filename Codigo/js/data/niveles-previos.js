/* =========================================================
   niveles.js · Contenido de los casos (datos, sin lógica)
   Para agregar un nivel nuevo, sumá un objeto a DF.levels.
   Las respuestas se escriben en MAYÚSCULAS, sin tildes.
   ========================================================= */
window.DF = window.DF || {};

DF.levels = [
  {
    id: 1,
    titulo: 'LA EMPRESA ECOLÓGICA',
    descripcion: [
      'Una empresa vende productos sustentables y dice defender el medio ambiente, pero se descubre que fabrica en una planta extranjera donde los trabajadores cobran poco y tienen peores condiciones laborales.',
      'La empresa asegura que así puede mantener precios bajos y ayudar a más personas a comprar productos ecológicos.'
    ],
    testimonios: {
      encabezado: 'Testimonio de un ex empleado de planta.',
      parrafos: [
        '"Trabajé casi tres años en la planta donde se cosen las bolsas \'ecológicas\' que después se venden en Europa y Estados Unidos a precios bastante altos. Acá nos pagaban por pieza, no por hora, así que si querías llegar a un sueldo digno tenías que hacer turnos de diez, once horas. No había ventilación buena en el sector de teñido, y varias compañeras terminaron con problemas respiratorios.',
        'Cuando venía gente de la empresa madre a visitar la planta, nos avisaban con dos días de anticipación. Limpiaban todo, nos daban guantes nuevos, apagaban una de las máquinas más viejas para que no hiciera tanto ruido. Un supervisor nos dijo textual: \'hoy actuamos como que todo está bien\'.',
        'Yo entiendo el argumento de que producir acá abarata costos, pero nadie nos preguntó si queríamos ser parte de ese ahorro."'
      ]
    },
    denuncia: {
      encabezado: 'Denuncia presentada ante la justicia.',
      parrafos: [
        '1. Hechos. La empresa denunciada comercializa sus productos bajo el lema de ser "100% sustentable" y "comprometida con el bienestar de los trabajadores en toda su cadena de producción", según su publicidad web y el etiquetado de sus productos.',
        '2. Sin embargo, se constató que la fabricación se realiza en una planta donde los trabajadores perciben salarios por debajo del ingreso digno, cumplen jornadas de hasta once horas diarias y no cuentan con condiciones adecuadas de seguridad e higiene.',
        '3. Se solicita que se investigue si la publicidad induce a error a los consumidores.'
      ]
    },
    pruebas: {
      encabezado: 'Fragmento de grabación (transcripción parcial, reunión interna filtrada).',
      parrafos: [
        '— "El tema es si subimos los costos de producción en la planta, se nos cae el margen del 40% que tenemos en el segmento premium."',
        '— "Pero en la web decimos que pagamos salarios justos en toda la cadena."',
        '— "Sí, esa frase la redactamos con legal. Técnicamente pagamos el salario mínimo local, que \'legalmente\' es justo."'
      ],
      audio: true
    },
    juez: 'La empresa "Ecovida" afirma en su publicidad que es "100% sustentable" y que "paga salarios justos en toda su cadena de producción". Sin embargo, un ex empleado reveló que la planta ajustaba las condiciones de trabajo solo cuando recibía visitas de la casa matriz.',
    preguntas: [
      { pista: 'Práctica en la que una empresa comunica una imagen ambiental positiva que no se corresponde con sus acciones reales.', respuesta: 'GREENWASHING' },
      { pista: 'Documento con el que una persona informa a la justicia un hecho que considera ilegal.', respuesta: 'DENUNCIA' },
      { pista: 'Persona que presenció los hechos y los cuenta ante el juez.', respuesta: 'TESTIGO' }
    ]
  },
  {
    id: 2,
    titulo: 'DATOS EN VENTA',
    descripcion: [
      'Una aplicación gratuita de mensajería vendió información de sus usuarios a empresas de publicidad sin avisarles de manera clara.',
      'La empresa sostiene que los usuarios aceptaron los términos y condiciones al instalar la aplicación.'
    ],
    testimonios: {
      encabezado: 'Testimonio de una usuaria de la aplicación.',
      parrafos: [
        '"Empecé a recibir publicidad de cosas de las que solo había hablado por mensaje con mi hermana. Al principio pensé que era casualidad, hasta que vi que pasaba todos los días.',
        'Nunca leí los términos y condiciones, ¿quién lo hace? Son cuarenta páginas escritas para que nadie las entienda. Nadie me preguntó si quería que mis conversaciones sirvieran para vender anuncios."'
      ]
    },
    denuncia: {
      encabezado: 'Denuncia presentada por una asociación de usuarios.',
      parrafos: [
        '1. La aplicación recolecta mensajes, ubicación y contactos de sus usuarios y los cede a terceros con fines comerciales.',
        '2. La información sobre este uso figura únicamente en una cláusula del apartado número 31 de los términos y condiciones.',
        '3. Se solicita determinar si existió un consentimiento libre e informado.'
      ]
    },
    pruebas: {
      encabezado: 'Correo interno incorporado al expediente.',
      parrafos: [
        '— "Los ingresos por publicidad subieron un 60% desde que vendemos los perfiles de usuario segmentados."',
        '— "Perfecto. Mantengamos la cláusula donde está, no hace falta destacarla."'
      ]
    },
    juez: 'La aplicación "ChatLibre" obtuvo grandes ganancias vendiendo datos de sus usuarios. Debemos determinar si las personas realmente comprendieron y aceptaron ese uso de su información.',
    preguntas: [
      { pista: 'Derecho a mantener la información personal fuera del alcance de otros.', respuesta: 'PRIVACIDAD' },
      { pista: 'Conjunto de reglas que usa una aplicación para decidir qué anuncios mostrarte.', respuesta: 'ALGORITMO' },
      { pista: 'Aceptación libre e informada para que usen tus datos.', respuesta: 'CONSENTIMIENTO' }
    ]
  },
  {
    id: 3,
    titulo: 'LA OBRA COPIADA',
    descripcion: [
      'Una joven ilustradora descubre que una marca de ropa estampó en sus remeras un dibujo casi idéntico al suyo, publicado un año antes en redes sociales.',
      'La marca dice que fue una coincidencia y que las ideas no le pertenecen a nadie.'
    ],
    testimonios: {
      encabezado: 'Testimonio de la ilustradora.',
      parrafos: [
        '"Dibujé ese personaje durante meses. Lo subí a mis redes con la fecha y todo. Un año después lo vi en una vidriera, en cientos de remeras, sin mi nombre.',
        'Escribí a la marca y me bloquearon. No pido que no vendan remeras, pido que reconozcan mi trabajo."'
      ]
    },
    denuncia: {
      encabezado: 'Denuncia por uso indebido de una obra.',
      parrafos: [
        '1. La denunciante es autora del dibujo publicado en sus redes el 3 de marzo del año anterior.',
        '2. La marca comercializó prendas con una imagen sustancialmente igual sin autorización ni licencia.',
        '3. Se solicita el cese de la venta y una compensación económica.'
      ]
    },
    pruebas: {
      encabezado: 'Capturas de pantalla con fecha.',
      parrafos: [
        '— Publicación original de la ilustradora: 3 de marzo.',
        '— Lanzamiento de la colección de la marca: 14 de febrero del año siguiente.',
        '— Comentarios de seguidores: "¡Esto es igual al dibujo de ella!"'
      ]
    },
    juez: 'Estamos ante un posible caso de copia de una obra original. La fecha de publicación y la similitud de los dibujos serán claves para decidir.',
    preguntas: [
      { pista: 'Copiar una obra ajena y presentarla como propia.', respuesta: 'PLAGIO' },
      { pista: 'Persona que crea una obra original.', respuesta: 'AUTOR' },
      { pista: 'Permiso formal para usar una obra creada por otra persona.', respuesta: 'LICENCIA' }
    ]
  },
  {
    id: 4,
    titulo: 'EL DESPIDO INJUSTO',
    descripcion: [
      'Un empleado de una fábrica es despedido pocos días después de integrar una comisión que pedía mejores condiciones de seguridad para sus compañeros.',
      'La empresa afirma que lo despidió por una reestructuración y no por su actividad gremial.'
    ],
    testimonios: {
      encabezado: 'Testimonio del trabajador despedido.',
      parrafos: [
        '"Llevaba ocho años en la fábrica sin una sola sanción. Pedimos arneses nuevos porque los viejos estaban rotos. Una semana después me llamaron a una oficina y me dijeron que mi puesto ya no existía.',
        'Al mes contrataron a otra persona para hacer exactamente mi tarea."'
      ]
    },
    denuncia: {
      encabezado: 'Demanda laboral.',
      parrafos: [
        '1. El trabajador tenía ocho años de antigüedad y ninguna sanción disciplinaria.',
        '2. El despido ocurrió siete días después de que integrara la comisión de seguridad.',
        '3. Se reclama el pago de la compensación que corresponde por despido sin causa justificada.'
      ]
    },
    pruebas: {
      encabezado: 'Documentos incorporados al expediente.',
      parrafos: [
        '— Carta documento de despido: "por razones de reestructuración".',
        '— Aviso de la empresa buscando personal para el mismo puesto, publicado treinta días después.',
        '— Nota de la comisión de seguridad solicitando arneses nuevos.'
      ]
    },
    juez: 'Debemos decidir si el despido tuvo una causa real o si fue una represalia por reclamar mejoras de seguridad. Presten atención a las fechas.',
    preguntas: [
      { pista: 'Finalización del contrato de trabajo decidida por el empleador.', respuesta: 'DESPIDO' },
      { pista: 'Organización de trabajadores que defiende sus derechos laborales.', respuesta: 'SINDICATO' },
      { pista: 'Pago que corresponde cuando se despide a alguien sin causa justificada.', respuesta: 'INDEMNIZACION' }
    ]
  }
];

/* Cantidad de intentos por palabra y puntaje */
DF.rules = { attempts: 5, basePoints: 100, bonusPerAttemptLeft: 20, passMinSolved: 2 };
