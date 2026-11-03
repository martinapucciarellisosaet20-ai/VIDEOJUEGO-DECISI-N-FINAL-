/* =========================================================
   niveles.js · Contenido de los 10 casos (datos, sin lógica)
   Fuente: "Casos definitivos" (PDF). Cada nivel tiene 10 preguntas
   de opción múltiple: la 1.ª es la pregunta oficial del PDF (oficial:true)
   y las otras 9 se redactaron SOLO con los hechos del propio caso
   (descripción, testimonios, pruebas, denuncia y devolución del PDF),
   porque el PDF trae una única pregunta por caso.
   Q(enunciado, A, B, C, D, letraCorrecta)
   ========================================================= */
window.DF = window.DF || {};

(function(){
  const Q = (q, a, b, c, d, ok, oficial) => ({ q, o:[a, b, c, d], c:'ABCD'.indexOf(ok), oficial: !!oficial });
  const P = (n, t, x) => 'Prueba ' + n + ' — ' + t + '. ' + x;

  DF.levels = [
  { id:1, titulo:'EL VALOR DE UNA PERSONA',
    descripcion:[
      'Sofía comenzó este año en una nueva escuela. Durante una actividad grupal, algunos compañeros descubrieron que su familia atravesaba dificultades económicas.',
      'A partir de ese momento, comenzaron a excluirla de algunas actividades y realizaron comentarios sobre su situación. Sofía considera que está recibiendo un trato diferente por una circunstancia que no debería determinar su valor como persona.'],
    testimonios:{ encabezado:'Testimonios del expediente.', parrafos:[
      'Testimonio de Sofía: “No me molesta que sepan que mi familia tiene problemas económicos. Lo que me duele es que ahora me traten como si yo valiera menos.”',
      'Testimonio de un compañero: “Pensamos que iba a sentirse incómoda con nosotros porque no puede hacer las mismas cosas que nosotros.”'] },
    denuncia:{ encabezado:'Denuncia presentada.', parrafos:[
      'Denunciante: Sofía.', 'Motivo: “Considero que estoy siendo tratada de manera diferente por mi situación económica.”'] },
    pruebas:{ encabezado:'Pruebas incorporadas al expediente.', parrafos:[
      P('01','Registro de la actividad','Sofía fue excluida de un grupo de trabajo después de que sus compañeros conocieran su situación familiar.'),
      P('02','Material de clase','La dignidad de la persona humana es fundamento de los derechos y todas las personas son sujetos de derechos.')] },
    juez:'Caso 01: El valor de una persona. Una estudiante comienza a ser excluida por sus compañeros después de que conocen la situación económica de su familia.',
    preguntas:[
      Q('¿Qué principio permite comprender principalmente por qué Sofía debe recibir el mismo respeto que cualquier otra persona?','La dignidad humana.','La situación económica.','La popularidad.','La capacidad de realizar determinadas actividades.','A',true),
      Q('¿Qué descubrieron algunos compañeros de Sofía durante una actividad grupal?','Que su familia atravesaba dificultades económicas.','Que había cambiado de escuela por problemas de conducta.','Que tenía mejores notas que el resto.','Que su familia vivía en otra provincia.','A'),
      Q('¿Qué comenzaron a hacer sus compañeros a partir de ese momento?','Invitarla a todas las actividades.','Excluirla de algunas actividades y hacer comentarios sobre su situación.','Elegirla como delegada del curso.','Ayudarla con sus tareas.','B'),
      Q('Según su testimonio, ¿qué es lo que más le duele a Sofía?','Que sepan que su familia tiene problemas económicos.','Haber cambiado de escuela este año.','Que ahora la traten como si valiera menos.','No poder hacer las mismas cosas que sus compañeros.','C'),
      Q('¿Por qué dijo un compañero que no la incluían en las actividades?','Porque ella había pedido que no la incluyeran.','Porque no sabía trabajar en grupo.','Porque llegó tarde a la escuela.','Porque pensaban que se sentiría incómoda al no poder hacer lo mismo que ellos.','D'),
      Q('¿Qué muestra la Prueba 01 (Registro de la actividad)?','Que Sofía fue excluida de un grupo de trabajo después de que conocieran su situación familiar.','Que Sofía abandonó el grupo por voluntad propia.','Que Sofía no participó de la actividad por faltar a clase.','Que todos los grupos fueron reorganizados por la docente.','A'),
      Q('¿Qué afirma el material de clase presentado como Prueba 02?','Que los derechos dependen de la situación económica.','Que la dignidad de la persona humana es fundamento de los derechos y todas las personas son sujetos de derechos.','Que solo algunas personas son sujetos de derechos.','Que la dignidad se pierde con las dificultades económicas.','B'),
      Q('¿Quién presenta la denuncia y por qué?','Un compañero, porque no lo dejaron participar.','La escuela, porque hubo faltas de respeto en clase.','Sofía, porque considera que la tratan diferente por su situación económica.','La familia de Sofía, porque ella cambió de escuela.','C'),
      Q('Según Sofía, ¿qué no debería determinar su valor como persona?','Una circunstancia como la situación económica de su familia.','Su rendimiento en las actividades grupales.','Su opinión en una discusión.','Su lugar de origen.','A'),
      Q('Según el material de clase, ¿quiénes son sujetos de derechos?','Solo quienes tienen una buena situación económica.','Todas las personas.','Solo las personas mayores de edad.','Quienes forman parte de la mayoría.','B')
    ] },

  { id:2, titulo:'UN DERECHO VULNERADO',
    descripcion:[
      'Tomás participa en una actividad escolar. Durante una discusión, algunos compañeros comienzan a impedirle participar porque no están de acuerdo con sus opiniones.',
      'Tomás sostiene que no pretende imponer su pensamiento, sino poder expresar su posición. La institución debe analizar la situación.'],
    testimonios:{ encabezado:'Testimonios del expediente.', parrafos:[
      'Testimonio de Tomás: “No estoy diciendo que todos tengan que pensar como yo. Solo quiero poder expresar mi opinión.”',
      'Testimonio de un compañero: “Como somos mayoría, pensamos que nuestra opinión debería ser la única que se escuche.”'] },
    denuncia:{ encabezado:'Denuncia presentada.', parrafos:[
      'Denunciante: Tomás.', 'Motivo: “Me impidieron participar porque mi opinión era diferente a la de la mayoría.”'] },
    pruebas:{ encabezado:'Pruebas incorporadas al expediente.', parrafos:[
      P('01','Registro de la actividad','Tomás fue interrumpido varias veces y se le pidió que no participara.'),
      P('02','Material de Educación Ciudadana','Los Derechos Humanos constituyen un núcleo de valores comunes de una sociedad plural y permiten valorar conductas y realidades sociales.')] },
    juez:'Caso 02: Un derecho vulnerado. Un estudiante intenta participar de una discusión, pero sus compañeros quieren impedir que exprese una opinión diferente.',
    preguntas:[
      Q('¿Cuál de las siguientes afirmaciones representa mejor el enfoque de los Derechos Humanos?','Solo deben escucharse las opiniones de la mayoría.','Las personas son sujetos de derechos y deben ser respetadas.','Los derechos dependen de la popularidad.','Una persona pierde sus derechos al pensar diferente.','B',true),
      Q('¿Qué intentaba hacer Tomás durante la discusión de la actividad escolar?','Participar y expresar su opinión.','Imponer su pensamiento a los demás.','Cambiar las reglas de la actividad.','Retirarse de la actividad.','A'),
      Q('¿Por qué algunos compañeros comenzaron a impedirle participar?','Porque Tomás llegó tarde a la actividad.','Porque Tomás interrumpía a todos.','Porque no estaban de acuerdo con sus opiniones.','Porque la docente se lo pidió.','C'),
      Q('¿Qué sostiene Tomás sobre su participación?','Que todos deberían pensar como él.','Que no pretende imponer su pensamiento, sino poder expresar su posición.','Que su opinión vale más que la de los demás.','Que prefiere no participar de las discusiones.','B'),
      Q('¿Qué argumento dio un compañero para justificar lo ocurrido?','Que Tomás no conocía el tema.','Que la actividad ya había terminado.','Que había poco tiempo para escuchar a todos.','Que como son mayoría, su opinión debería ser la única que se escuche.','D'),
      Q('¿Qué registra la Prueba 01 (Registro de la actividad)?','Que Tomás fue interrumpido varias veces y se le pidió que no participara.','Que Tomás se negó a participar de la discusión.','Que todos los estudiantes hablaron por turnos.','Que Tomás insultó a sus compañeros.','A'),
      Q('Según el material de Educación Ciudadana, ¿qué constituyen los Derechos Humanos?','Un conjunto de reglas que solo rigen en la escuela.','Un núcleo de valores comunes de una sociedad plural.','Una opinión compartida por la mayoría.','Una lista de normas que cambian según la popularidad.','B'),
      Q('¿Qué permiten hacer los Derechos Humanos según ese material?','Imponer las costumbres de un grupo.','Reemplazar todas las normas de una institución.','Valorar conductas y realidades sociales.','Elegir quién puede participar de una discusión.','C'),
      Q('¿Quién presenta la denuncia y cuál es su motivo?','Un compañero, porque la discusión fue muy larga.','La docente, porque la actividad se interrumpió.','El grupo mayoritario, porque no lo escucharon.','Tomás, porque le impidieron participar por tener una opinión diferente a la mayoría.','D'),
      Q('¿Qué debe hacer la institución ante la situación?','Analizar la situación.','Ignorar el conflicto.','Prohibir las discusiones escolares.','Expulsar a quienes no coinciden con la mayoría.','A')
    ] },

  { id:3, titulo:'JUZGAR SIN CONOCER',
    descripcion:[
      'Mateo llega a una nueva escuela después de mudarse desde otra provincia.',
      'Antes de conocerlo, algunos compañeros dicen que probablemente tendrá dificultades para integrarse y deciden no incluirlo en un trabajo grupal.'],
    testimonios:{ encabezado:'Testimonios del expediente.', parrafos:[
      'Mateo: “Nunca me preguntaron nada. Decidieron cómo era antes de conocerme.”',
      'Compañero: “Por su lugar de origen seguramente va a ser complicado trabajar con él.”'] },
    denuncia:{ encabezado:'Denuncia presentada.', parrafos:[
      'Denunciante: Mateo.', 'Motivo: “Fui excluido por comentarios relacionados con mi lugar de origen.”'] },
    pruebas:{ encabezado:'Pruebas incorporadas al expediente.', parrafos:[
      P('01','Registro del trabajo','Mateo fue excluido antes de comenzar la actividad.'),
      P('02','Conversación del grupo','Los estudiantes justificaron la decisión haciendo referencia a su lugar de origen.'),
      P('03','Material de clase','El programa propone analizar los mecanismos que favorecen la formación de prejuicios y estereotipos y su relación con juicios discriminatorios.')] },
    juez:'Caso 03: Juzgar sin conocer. Un estudiante es excluido por sus compañeros debido a ideas que tienen sobre su lugar de origen.',
    preguntas:[
      Q('¿Qué concepto explica principalmente la situación?','Prejuicio.','Norma jurídica.','Constitución.','Responsabilidad.','A',true),
      Q('¿Desde dónde llegó Mateo a la nueva escuela?','Desde otro país.','Desde otra provincia.','Desde otra ciudad del exterior.','Desde otra escuela del mismo barrio.','B'),
      Q('¿Qué dijeron algunos compañeros antes de conocerlo?','Que probablemente tendría dificultades para integrarse.','Que sería el mejor de la clase.','Que ya lo conocían de otra escuela.','Que necesitaba un tutor.','A'),
      Q('¿Qué decidieron hacer esos compañeros?','Invitarlo a integrar el grupo.','Pedirle que presentara su trabajo antes.','No incluirlo en un trabajo grupal.','Cambiar el tema del trabajo.','C'),
      Q('Según Mateo, ¿qué hicieron sus compañeros antes de conocerlo?','Le hicieron muchas preguntas.','Le ofrecieron ayuda.','Le pidieron sus datos personales.','Nunca le preguntaron nada y decidieron cómo era.','D'),
      Q('¿Qué argumento dio un compañero para no trabajar con él?','Que por su lugar de origen seguramente sería complicado trabajar con él.','Que Mateo había faltado a clase.','Que ya había demasiados integrantes en el grupo.','Que Mateo prefería trabajar solo.','A'),
      Q('¿Qué registra la Prueba 01 (Registro del trabajo)?','Que Mateo abandonó el trabajo a mitad de camino.','Que Mateo fue excluido antes de comenzar la actividad.','Que Mateo entregó el trabajo fuera de término.','Que Mateo fue evaluado con la nota más baja.','B'),
      Q('¿Qué muestra la Prueba 02 (Conversación del grupo)?','Que los estudiantes eligieron a Mateo como coordinador.','Que el grupo no tuvo ninguna conversación sobre Mateo.','Que los estudiantes justificaron la decisión haciendo referencia a su lugar de origen.','Que Mateo aceptó quedar afuera del trabajo.','C'),
      Q('Según el material de clase, ¿qué propone analizar el programa?','Los mecanismos que favorecen la formación de prejuicios y estereotipos y su relación con juicios discriminatorios.','Las costumbres de cada provincia.','Las reglas de convivencia de cada escuela.','Los artículos de la Constitución Nacional.','A'),
      Q('¿Cuál es el motivo de la denuncia de Mateo?','Que le pusieron una nota injusta.','Que lo cambiaron de curso sin avisarle.','Que le impidieron hablar en una discusión.','Que fue excluido por comentarios relacionados con su lugar de origen.','D')
    ] },

  { id:4, titulo:'NO TODOS SOMOS IGUALES',
    descripcion:[
      'Durante una actividad grupal, los estudiantes deben distribuir diferentes tareas.',
      'Algunos compañeros deciden que las chicas deben encargarse de la decoración y los chicos de la tecnología porque consideran que “es lo que naturalmente hace cada uno”. Una estudiante cuestiona la decisión.'],
    testimonios:{ encabezado:'Testimonios del expediente.', parrafos:[
      'Estudiante: “Me interesa la tecnología y tengo experiencia con computadoras. No entiendo por qué no puedo ocuparme de esa parte.”',
      'Compañero: “Siempre se hizo así. Las chicas son mejores para unas cosas y los chicos para otras.”'] },
    denuncia:{ encabezado:'Denuncia presentada.', parrafos:[
      'Denunciante: Estudiante afectada.', 'Motivo: “No me permitieron realizar una tarea por considerar que no corresponde a mi género.”'] },
    pruebas:{ encabezado:'Pruebas incorporadas al expediente.', parrafos:[
      P('01','Distribución de tareas','Las tareas fueron asignadas según el género de los estudiantes.'),
      P('02','Material de clase','La planificación propone analizar prejuicios y estereotipos de género.')] },
    juez:'Caso 04: No todos somos iguales. Una actividad escolar genera un conflicto debido a ideas generalizadas sobre qué tareas corresponden a chicos y chicas.',
    preguntas:[
      Q('¿Qué concepto aparece principalmente en esta situación?','Estereotipo.','Supremacía constitucional.','Norma jurídica.','Dignidad.','A',true),
      Q('¿Qué debían hacer los estudiantes durante la actividad grupal?','Elegir un tema de investigación.','Distribuir diferentes tareas.','Votar a un representante.','Presentar una tradición cultural.','B'),
      Q('¿Cómo decidieron repartir las tareas algunos compañeros?','Por sorteo.','Según las notas de cada estudiante.','Las chicas a cargo de la decoración y los chicos de la tecnología.','Según la edad de cada integrante.','C'),
      Q('¿Qué justificación dieron para esa distribución?','Que era lo que naturalmente hace cada uno.','Que lo indicaba el reglamento de la escuela.','Que lo pidió la docente.','Que así había quedado por votación.','A'),
      Q('¿Qué dice la estudiante afectada sobre sí misma?','Que no le interesa participar de la actividad.','Que prefiere encargarse de la decoración.','Que nunca usó una computadora.','Que le interesa la tecnología y tiene experiencia con computadoras.','D'),
      Q('¿Qué argumento planteó un compañero?','Que siempre se hizo así y que las chicas son mejores para unas cosas y los chicos para otras.','Que la estudiante no sabía trabajar en equipo.','Que no había suficientes computadoras.','Que la tecnología no formaba parte de la actividad.','A'),
      Q('¿Qué muestra la Prueba 01 (Distribución de tareas)?','Que las tareas se repartieron por orden alfabético.','Que cada estudiante eligió libremente su tarea.','Que las tareas fueron asignadas según el género de los estudiantes.','Que la docente asignó las tareas.','C'),
      Q('Según el material de clase (Prueba 02), ¿qué propone analizar la planificación?','Las normas de uso de un espacio común.','Los prejuicios y estereotipos de género.','El esquema de la Constitución Nacional.','Los límites a la libertad.','B'),
      Q('¿Cuál es el motivo de la denuncia?','Que no le permitieron realizar una tarea por considerar que no corresponde a su género.','Que le pusieron una nota baja en la actividad.','Que la excluyeron por su lugar de origen.','Que le impidieron expresar su opinión en una discusión.','A'),
      Q('¿Cómo reaccionó la estudiante ante la decisión de sus compañeros?','La aceptó sin decir nada.','Abandonó la actividad.','Cuestionó la decisión.','Pidió cambiar de grupo.','C')
    ] },

  { id:5, titulo:'UNA ESCUELA, MUCHAS CULTURAS',
    descripcion:[
      'La escuela organiza una jornada cultural.',
      'Valentina propone presentar una tradición de su familia. Algunos compañeros consideran que esa tradición “no representa a la escuela” y quieren impedir su participación.'],
    testimonios:{ encabezado:'Testimonios del expediente.', parrafos:[
      'Valentina: “Mi familia tiene una cultura diferente y quiero compartirla con mis compañeros.”',
      'Compañero: “Pensamos que todos deberían presentar cosas que sean iguales a las nuestras.”'] },
    denuncia:{ encabezado:'Denuncia presentada.', parrafos:[
      'Denunciante: Valentina.', 'Motivo: “Quieren impedir que presente una tradición de mi cultura.”'] },
    pruebas:{ encabezado:'Pruebas incorporadas al expediente.', parrafos:[
      P('01','Propuesta de la jornada','Valentina presentó una actividad relacionada con una tradición familiar.'),
      P('02','Material de clase','La planificación considera a la sociedad y la cultura como espacios de diversidad y propone pasar de la tolerancia a la valoración de la diversidad.')] },
    juez:'Caso 05: Una escuela, muchas culturas. Una estudiante quiere compartir una tradición cultural de su familia, pero algunos compañeros consideran que no debería hacerlo.',
    preguntas:[
      Q('¿Qué actitud se relaciona con el enfoque de diversidad planteado en el programa?','Excluir las expresiones diferentes.','Valorar y respetar las diferencias culturales.','Obligar a todos a tener las mismas costumbres.','Considerar válida solamente la cultura mayoritaria.','B',true),
      Q('¿Qué organiza la escuela en este caso?','Una feria de ciencias.','Una jornada deportiva.','Una jornada cultural.','Una asamblea de estudiantes.','C'),
      Q('¿Qué propone presentar Valentina?','Una tradición de su familia.','Un trabajo sobre la Constitución.','Una obra de teatro sobre la dignidad.','Un debate sobre las normas del aula.','A'),
      Q('¿Qué dicen algunos compañeros sobre la tradición que propone Valentina?','Que es la mejor propuesta de la jornada.','Que ya fue presentada el año anterior.','Que necesita más tiempo de preparación.','Que no representa a la escuela.','D'),
      Q('¿Qué quieren hacer esos compañeros con la propuesta de Valentina?','Impedir su participación.','Ayudarla a organizarla.','Cambiar la fecha de la jornada.','Presentarla ellos mismos.','A'),
      Q('¿Qué quiere Valentina, según su testimonio?','Que su cultura reemplace a las demás.','Compartir con sus compañeros la cultura de su familia.','Evitar que otros presenten sus tradiciones.','Que la jornada se cancele.','B'),
      Q('¿Qué piensa el compañero que declara en el expediente?','Que cada estudiante debe presentar lo que prefiera.','Que la jornada debería incluir más culturas.','Que todos deberían presentar cosas que sean iguales a las suyas.','Que Valentina debe presentar primero.','C'),
      Q('¿Qué muestra la Prueba 01 (Propuesta de la jornada)?','Que Valentina no presentó ninguna propuesta.','Que Valentina copió la propuesta de otro grupo.','Que la propuesta fue rechazada por la docente.','Que Valentina presentó una actividad relacionada con una tradición familiar.','D'),
      Q('Según el material de clase (Prueba 02), ¿qué propone la planificación respecto de la diversidad?','Pasar de la tolerancia a la valoración de la diversidad.','Evitar que se mencionen las diferencias.','Elegir una única cultura para representar a la escuela.','Reemplazar la tolerancia por la indiferencia.','A'),
      Q('¿Cuál es el motivo de la denuncia de Valentina?','Que la jornada cultural no fue organizada a tiempo.','Que quieren impedir que presente una tradición de su cultura.','Que le quitaron un lugar en el escenario.','Que sus compañeros copiaron su idea.','B')
    ] },

  { id:6, titulo:'LAS REGLAS DE TODOS',
    descripcion:[
      'Los estudiantes utilizan un aula para realizar distintas actividades. Debido a varios conflictos, deben establecer una norma sobre su utilización.',
      'Algunos quieren imponer una regla sin consultar al resto. Otros proponen debatir distintas alternativas.'],
    testimonios:{ encabezado:'Testimonios del expediente.', parrafos:[
      'Estudiante: “Si yo uso más el aula, puedo decidir las reglas.”',
      'Estudiante 2: “La norma debería tener en cuenta a las personas que van a convivir con ella.”'] },
    denuncia:{ encabezado:'Denuncia presentada.', parrafos:[
      'Denunciante: Grupo de estudiantes.', 'Motivo: “Existe un conflicto porque no tenemos una regla común para utilizar el espacio.”'] },
    pruebas:{ encabezado:'Pruebas incorporadas al expediente.', parrafos:[
      P('01','Registro de conflictos','Durante varias semanas hubo discusiones por el uso del espacio.'),
      P('02','Propuestas','Los estudiantes presentaron diferentes alternativas para organizarlo.'),
      P('03','Material de clase','El programa aborda convivencia, instituciones, normas, normas jurídicas y relación entre norma y justicia.')] },
    juez:'Caso 06: Las reglas de todos. Un curso necesita establecer una nueva norma para organizar el uso de un espacio común.',
    preguntas:[
      Q('¿Cuál es una característica importante de una norma de convivencia?','Debe beneficiar exclusivamente a quien la crea.','Debe organizar la convivencia entre quienes integran el espacio.','Debe aplicarse solamente a algunas personas.','Debe cambiar cada vez que alguien no esté de acuerdo.','B',true),
      Q('¿Para qué utilizan los estudiantes el aula?','Solo para rendir exámenes.','Únicamente para almorzar.','Para realizar distintas actividades.','Para guardar materiales de otros cursos.','C'),
      Q('¿Por qué deben establecer una norma sobre el uso del aula?','Debido a varios conflictos.','Porque la escuela cambió de horario.','Porque faltan aulas en el edificio.','Porque lo pidió la autoridad nacional.','A'),
      Q('¿Qué querían hacer algunos estudiantes con la regla?','Dejarla sin efecto.','Votarla entre todos.','Pedirle a la docente que la escriba.','Imponerla sin consultar al resto.','D'),
      Q('¿Qué proponían otros estudiantes?','Debatir distintas alternativas.','Que cada uno use el aula cuando quiera.','Que decida quien llegue primero.','Que no haya ninguna regla.','A'),
      Q('¿Qué criterio plantea el estudiante que dice “si yo uso más el aula, puedo decidir las reglas”?','Que decidan todos por igual.','Que quien usa más el aula tiene derecho a decidir las reglas.','Que decida la autoridad de la escuela.','Que las reglas se definan por sorteo.','B'),
      Q('Según el Estudiante 2, ¿qué debería tener en cuenta la norma?','Las preferencias de quien la propone.','El tiempo que cada uno usa el aula.','A las personas que van a convivir con ella.','Solo las actividades más frecuentes.','C'),
      Q('¿Qué muestra la Prueba 01 (Registro de conflictos)?','Que no hubo conflictos por el uso del espacio.','Que los conflictos se resolvieron en un día.','Que el aula siempre estuvo vacía.','Que durante varias semanas hubo discusiones por el uso del espacio.','D'),
      Q('¿Qué muestra la Prueba 02 (Propuestas)?','Que los estudiantes presentaron diferentes alternativas para organizar el espacio.','Que nadie presentó propuestas.','Que todos propusieron la misma regla.','Que la propuesta de un solo estudiante fue la única válida.','A'),
      Q('Además de convivencia, instituciones y normas, ¿qué relación aborda el programa según la Prueba 03?','La relación entre norma y justicia.','La relación entre moda y cultura.','La relación entre deporte y salud.','La relación entre tecnología y género.','A')
    ] },

  { id:7, titulo:'LA NORMA DE MAYOR JERARQUÍA',
    descripcion:[
      'Una institución establece una regla interna.',
      'Un estudiante considera que esa regla contradice una disposición constitucional y presenta una denuncia para que la situación sea revisada.'],
    testimonios:{ encabezado:'Testimonios del expediente.', parrafos:[
      'Estudiante: “Que una institución haya creado una regla no significa que pueda contradecir normas superiores.”',
      'Autoridad institucional: “La regla fue creada para organizar el funcionamiento de la institución.”'] },
    denuncia:{ encabezado:'Denuncia presentada.', parrafos:[
      'Denunciante: Estudiante.', 'Motivo: “Considero que la regla institucional contradice una norma constitucional.”'] },
    pruebas:{ encabezado:'Pruebas incorporadas al expediente.', parrafos:[
      P('01','Reglamento institucional','Se presenta la norma cuestionada.'),
      P('02','Fragmento constitucional','Se presenta la disposición constitucional relacionada con el conflicto.'),
      P('03','Material de clase','La planificación incluye la supremacía constitucional y la pirámide jurídica.')] },
    juez:'Caso 07: La norma de mayor jerarquía. Una regla institucional entra en conflicto con una norma de mayor jerarquía.',
    preguntas:[
      Q('¿Qué principio permite comprender la relación jerárquica entre la Constitución y las normas inferiores?','Diversidad cultural.','Supremacía constitucional.','Prejuicio.','Autonomía.','B',true),
      Q('¿Qué establece la institución en este caso?','Una ley nacional.','Un artículo de la Constitución.','Una regla interna.','Un tratado internacional.','C'),
      Q('¿Qué considera el estudiante sobre esa regla?','Que contradice una disposición constitucional.','Que es demasiado extensa.','Que debería aplicarse a más instituciones.','Que fue redactada sin errores.','A'),
      Q('¿Qué hace el estudiante para que se revise la situación?','Modifica la regla por su cuenta.','Se retira de la institución.','Le pide a un compañero que la cumpla.','Presenta una denuncia.','D'),
      Q('Según el estudiante, ¿qué no significa que una institución haya creado una regla?','Que la regla deba cumplirse.','Que no pueda contradecir normas superiores.','Que pueda contradecir normas superiores.','Que deba ser modificada cada año.','C'),
      Q('¿Qué argumento da la autoridad institucional?','Que la regla fue creada para organizar el funcionamiento de la institución.','Que la regla no puede ser revisada.','Que la Constitución no se aplica a las instituciones.','Que la regla fue copiada de otra institución.','A'),
      Q('¿Qué se presenta como Prueba 01?','Un fragmento de la Constitución.','El reglamento institucional con la norma cuestionada.','Un testimonio de otro estudiante.','Un material de clase.','B'),
      Q('¿Qué se presenta como Prueba 02?','La disposición constitucional relacionada con el conflicto.','Un registro de las discusiones del curso.','Una propuesta de nueva regla.','Una lista de estudiantes denunciantes.','A'),
      Q('Según el material de clase (Prueba 03), ¿qué incluye la planificación?','La diversidad cultural y los estereotipos.','La libertad y la responsabilidad.','La supremacía constitucional y la pirámide jurídica.','Las tradiciones familiares.','C'),
      Q('¿Qué permite analizar el estudio de la supremacía constitucional y la pirámide jurídica?','Las costumbres de una familia.','La popularidad de una norma.','Las opiniones de la mayoría.','La jerarquía de las normas.','D')
    ] },

  { id:8, titulo:'DENTRO DE LA CONSTITUCIÓN',
    descripcion:[
      'Durante una actividad, el profesor entrega diferentes fragmentos relacionados con la Constitución Nacional. Los estudiantes deben reconocer a qué parte corresponde cada uno.',
      'Uno de ellos sostiene que todos los fragmentos cumplen exactamente la misma función.'],
    testimonios:{ encabezado:'Testimonios del expediente.', parrafos:[
      'Estudiante: “Sé que todos estos textos forman parte de la Constitución, pero no sé cómo diferenciarlos.”',
      'Docente: “Para interpretar correctamente un texto constitucional es importante conocer cómo está organizado.”'] },
    denuncia:{ encabezado:'Denuncia presentada.', parrafos:[
      'Denunciante: Estudiante.', 'Motivo: “No puedo identificar correctamente las diferentes partes de la Constitución.”'] },
    pruebas:{ encabezado:'Pruebas incorporadas al expediente.', parrafos:[
      P('01','Fragmentos constitucionales','Se presentan diferentes partes del texto constitucional.'),
      P('02','Esquema','Se presenta un esquema de organización de la Constitución Nacional.')] },
    juez:'Caso 08: Dentro de la Constitución. Un estudiante debe ordenar e identificar diferentes partes de la Constitución Nacional.',
    preguntas:[
      Q('¿Qué se busca principalmente al estudiar el esquema de la Constitución Nacional?','Reconocer cómo está organizado el texto constitucional.','Clasificar las culturas de una sociedad.','Identificar prejuicios.','Establecer reglas familiares.','A',true),
      Q('¿Qué entrega el profesor durante la actividad?','Un reglamento escolar.','Diferentes fragmentos relacionados con la Constitución Nacional.','Un listado de tradiciones culturales.','Un registro de conflictos del aula.','B'),
      Q('¿Qué deben hacer los estudiantes con los fragmentos?','Memorizarlos todos.','Reescribirlos con sus palabras.','Reconocer a qué parte corresponde cada uno.','Votar cuál es el más importante.','C'),
      Q('¿Qué sostiene uno de los estudiantes sobre los fragmentos?','Que son textos de distintas constituciones.','Que ninguno pertenece a la Constitución.','Que cada uno corresponde a una cultura diferente.','Que todos cumplen exactamente la misma función.','D'),
      Q('Según el testimonio del estudiante, ¿qué sabe y qué no sabe?','Sabe que los textos forman parte de la Constitución, pero no sabe cómo diferenciarlos.','Sabe diferenciarlos, pero no sabe que son parte de la Constitución.','No sabe leerlos ni sabe de dónde provienen.','Sabe cuál es el más importante, pero no cuál es el más antiguo.','A'),
      Q('¿Qué considera importante el docente para interpretar correctamente un texto constitucional?','Conocer de memoria todos los artículos.','Conocer cómo está organizado.','Saber quién lo escribió.','Compararlo con reglas de la escuela.','B'),
      Q('¿Qué se presenta como Prueba 01?','Un esquema de organización.','Un testimonio del docente.','Diferentes partes del texto constitucional.','Un reglamento institucional.','C'),
      Q('¿Qué se presenta como Prueba 02?','Un fragmento sobre diversidad cultural.','Un registro de la actividad.','Una conversación entre estudiantes.','Un esquema de organización de la Constitución Nacional.','D'),
      Q('¿Cuál es el motivo de la denuncia del estudiante?','Que no puede identificar correctamente las diferentes partes de la Constitución.','Que el docente lo excluyó de la actividad.','Que le impidieron participar por su opinión.','Que la regla de la escuela contradice la Constitución.','A'),
      Q('Según la devolución, ¿qué permite el estudio del esquema de la Constitución?','Reconocer la organización interna y ubicar sus diferentes partes.','Elegir qué artículos se aplican.','Reemplazar los fragmentos por otros nuevos.','Decidir qué normas son más populares.','A')
    ] },

  { id:9, titulo:'ARTÍCULO EN CUESTIÓN',
    descripcion:[
      'Durante una actividad, un estudiante recibe una situación relacionada con un derecho.',
      'Para resolverla debe consultar distintos fragmentos de la Constitución Nacional y determinar cuál corresponde al caso.'],
    testimonios:{ encabezado:'Testimonios del expediente.', parrafos:[
      'Estudiante: “Sé que este derecho está reconocido, pero necesito encontrar qué parte de la Constitución lo establece.”',
      'Docente: “Los artículos constitucionales permiten reconocer derechos y normas dentro del texto constitucional.”'] },
    denuncia:{ encabezado:'Denuncia presentada.', parrafos:[
      'Denunciante: Estudiante.', 'Motivo: “Necesito identificar qué artículo constitucional se relaciona con la situación presentada.”'] },
    pruebas:{ encabezado:'Pruebas incorporadas al expediente.', parrafos:[
      P('01','Situación planteada','Se presenta el conflicto que debe analizarse.'),
      P('02','Fragmentos de artículos','Se presentan diferentes artículos para comparar.'),
      P('03','Material de clase','La planificación plantea conocer instrumentos constitucionales que defienden y promueven la realización de los Derechos Humanos.')] },
    juez:'Caso 09: Artículo en cuestión. Una situación concreta debe relacionarse con el artículo constitucional correspondiente.',
    preguntas:[
      Q('¿Para qué resulta útil conocer los artículos de la Constitución Nacional?','Para identificar derechos y normas constitucionales aplicables a distintas situaciones.','Para reemplazar todas las normas sociales.','Para determinar qué cultura es más importante.','Para establecer las costumbres de una familia.','A',true),
      Q('¿Qué recibe el estudiante durante la actividad?','Un reglamento institucional.','Una situación relacionada con un derecho.','Un esquema de la Constitución.','Una lista de tradiciones culturales.','B'),
      Q('¿Qué debe hacer el estudiante para resolver la situación?','Consultar distintos fragmentos de la Constitución y determinar cuál corresponde al caso.','Elegir la opinión de la mayoría.','Pedirle a un compañero que decida.','Escribir una nueva norma.','A'),
      Q('Según el estudiante, ¿qué necesita encontrar?','Quién redactó la Constitución.','Cuántos artículos tiene la Constitución.','Qué parte de la Constitución establece el derecho que sabe que está reconocido.','Qué derechos no están reconocidos.','C'),
      Q('¿Qué dice el docente sobre los artículos constitucionales?','Que son opiniones de la mayoría.','Que solo sirven para la escuela.','Que cambian según cada institución.','Que permiten reconocer derechos y normas dentro del texto constitucional.','D'),
      Q('¿Qué se presenta como Prueba 01?','El conflicto que debe analizarse.','Un testimonio del docente.','Un esquema de organización.','Un reglamento escolar.','A'),
      Q('¿Qué se presenta como Prueba 02?','Un registro de discusiones del curso.','Diferentes artículos para comparar.','Una propuesta de actividad cultural.','Un registro de la distribución de tareas.','B'),
      Q('Según el material de clase (Prueba 03), ¿qué plantea la planificación?','Evitar la consulta de la Constitución.','Comparar culturas de distintas familias.','Conocer instrumentos constitucionales que defienden y promueven la realización de los Derechos Humanos.','Reemplazar los derechos por reglas internas.','C'),
      Q('¿Cuál es el motivo de la denuncia del estudiante?','Que la institución creó una regla injusta.','Que le impidieron participar de la actividad.','Que lo excluyeron por su lugar de origen.','Que necesita identificar qué artículo constitucional se relaciona con la situación presentada.','D'),
      Q('Según la devolución, ¿qué permite reconocer el conocimiento de los instrumentos constitucionales?','Mecanismos vinculados con la defensa y promoción de los Derechos Humanos.','Las costumbres de cada familia.','La cultura más importante de una sociedad.','Las reglas de uso de un aula.','A')
    ] },

  { id:10, titulo:'LIBERTAD BAJO RESPONSABILIDAD',
    descripcion:[
      'Un grupo de estudiantes utiliza un espacio común de la escuela para realizar una actividad. Uno de ellos decide modificar la organización sin consultar al resto porque considera que tiene libertad para hacerlo.',
      'Su decisión afecta las actividades de otros estudiantes y genera un conflicto.'],
    testimonios:{ encabezado:'Testimonios del expediente.', parrafos:[
      'Estudiante denunciado: “Pensé que podía hacerlo porque era mi decisión.”',
      'Compañera: “Podemos tomar decisiones, pero también tenemos que considerar cómo afectan a los demás.”'] },
    denuncia:{ encabezado:'Denuncia presentada.', parrafos:[
      'Denunciantes: Grupo de estudiantes.', 'Motivo: “Una decisión tomada individualmente afectó la actividad que teníamos organizada.”'] },
    pruebas:{ encabezado:'Pruebas incorporadas al expediente.', parrafos:[
      P('01','Registro del espacio','La modificación realizada afectó la actividad que otro grupo tenía programada.'),
      P('02','Testimonio escrito','Otros estudiantes manifestaron que no fueron consultados.'),
      P('03','Material de clase','El programa trabaja la libertad y autonomía y la relación entre libertad y responsabilidad, incluyendo los límites al ejercicio de los derechos.')] },
    juez:'Caso 10: Libertad bajo responsabilidad. Una decisión personal afecta la convivencia de otras personas.',
    preguntas:[
      Q('¿Qué relación entre libertad y responsabilidad aparece principalmente en este caso?','Ser libre significa no tener consecuencias por las decisiones tomadas.','La libertad implica decidir y asumir responsabilidad por las consecuencias de las propias acciones.','La responsabilidad elimina completamente la libertad.','Solo las instituciones pueden tomar decisiones responsables.','B',true),
      Q('¿Qué utiliza un grupo de estudiantes para realizar una actividad?','Un espacio común de la escuela.','Un laboratorio de computación.','Un patio exterior alquilado.','El aula de otro curso con permiso escrito.','A'),
      Q('¿Qué decide hacer uno de ellos?','Cancelar la actividad.','Pedir una votación al curso.','Modificar la organización sin consultar al resto.','Cambiar de grupo.','C'),
      Q('¿Por qué lo hizo, según el caso?','Porque se lo indicó la docente.','Porque había una norma que lo exigía.','Porque el espacio estaba en mal estado.','Porque considera que tiene libertad para hacerlo.','D'),
      Q('¿Qué consecuencia tuvo su decisión?','Afectó las actividades de otros estudiantes y generó un conflicto.','Mejoró la organización del espacio.','No tuvo ningún efecto en nadie.','Permitió que todos terminaran antes.','A'),
      Q('¿Qué argumento da el estudiante denunciado?','Que no sabía que el espacio era compartido.','Que pensó que podía hacerlo porque era su decisión.','Que otro compañero se lo pidió.','Que quería ayudar a los demás.','B'),
      Q('¿Qué sostiene la compañera en su testimonio?','Que nadie debe tomar decisiones.','Que solo la docente puede decidir.','Que podemos tomar decisiones, pero también tenemos que considerar cómo afectan a los demás.','Que las decisiones individuales siempre son válidas.','C'),
      Q('¿Qué muestra la Prueba 01 (Registro del espacio)?','Que el espacio estaba libre ese día.','Que la modificación nunca se realizó.','Que la actividad del grupo denunciante se canceló antes.','Que la modificación afectó la actividad que otro grupo tenía programada.','D'),
      Q('¿Qué indica la Prueba 02 (Testimonio escrito)?','Que otros estudiantes manifestaron que no fueron consultados.','Que todos estuvieron de acuerdo con el cambio.','Que el cambio fue votado por el curso.','Que la docente aprobó la modificación.','A'),
      Q('Además de la relación entre libertad y responsabilidad, ¿qué incluye el programa según la Prueba 03?','Los límites al ejercicio de los derechos.','Los mecanismos de formación de prejuicios.','El esquema de la Constitución Nacional.','La valoración de las tradiciones culturales.','A')
    ] }
  ];
})();


/* Desafío de palabras (final de cada nivel): pista + palabra secreta, tomadas del vocabulario de cada caso. */
DF.palabras = {
  1: [ { pista: 'Valor propio de toda persona, fundamento de los Derechos Humanos.', respuesta: 'DIGNIDAD' }, { pista: 'Acción de dejar a alguien afuera de una actividad o de un grupo.', respuesta: 'EXCLUSION' }, { pista: 'Trato que merece toda persona sin importar su situación económica.', respuesta: 'RESPETO' } ],
  2: [ { pista: 'Facultades que tienen las personas por ser sujetos de derechos.', respuesta: 'DERECHOS' }, { pista: 'Postura que Tomás quería expresar en la discusión.', respuesta: 'OPINION' }, { pista: 'Grupo más numeroso, que no puede silenciar a los demás.', respuesta: 'MAYORIA' } ],
  3: [ { pista: 'Juicio previo sobre alguien antes de conocerlo realmente.', respuesta: 'PREJUICIO' }, { pista: 'Trato desigual hacia una persona por una característica como su lugar de origen.', respuesta: 'DISCRIMINACION' }, { pista: 'Lugar del que proviene una persona, como la provincia de Mateo.', respuesta: 'ORIGEN' } ],
  4: [ { pista: 'Idea generalizada sobre cómo son o qué hacen las personas.', respuesta: 'ESTEREOTIPO' }, { pista: 'Característica por la que se asignaron las tareas en la actividad.', respuesta: 'GENERO' }, { pista: 'Área que le interesaba a la estudiante y en la que tiene experiencia con computadoras.', respuesta: 'TECNOLOGIA' } ],
  5: [ { pista: 'Existencia de muchas culturas distintas en una misma sociedad.', respuesta: 'DIVERSIDAD' }, { pista: 'Costumbre de una familia que se transmite y se comparte en la jornada cultural.', respuesta: 'TRADICION' }, { pista: 'Conjunto de costumbres y formas de vida de una sociedad.', respuesta: 'CULTURA' } ],
  6: [ { pista: 'Regla que organiza la convivencia entre quienes integran un espacio.', respuesta: 'NORMA' }, { pista: 'Vivir con otras personas respetando reglas comunes.', respuesta: 'CONVIVENCIA' }, { pista: 'Discusión de distintas alternativas antes de decidir una regla.', respuesta: 'DEBATE' } ],
  7: [ { pista: 'Norma de mayor jerarquía de un país.', respuesta: 'CONSTITUCION' }, { pista: 'Orden de importancia entre las normas.', respuesta: 'JERARQUIA' }, { pista: 'Figura jurídica que ordena las normas de mayor a menor jerarquía.', respuesta: 'PIRAMIDE' } ],
  8: [ { pista: 'Representación que muestra cómo está organizado un texto.', respuesta: 'ESQUEMA' }, { pista: 'Parte de un texto que el profesor entrega a los estudiantes.', respuesta: 'FRAGMENTO' }, { pista: 'Forma en que están ordenadas las partes de la Constitución.', respuesta: 'ORGANIZACION' } ],
  9: [ { pista: 'Cada una de las disposiciones numeradas de la Constitución.', respuesta: 'ARTICULO' }, { pista: 'Facultad reconocida a una persona, que se busca en el texto constitucional.', respuesta: 'DERECHO' }, { pista: 'Medio constitucional que defiende y promueve los Derechos Humanos.', respuesta: 'INSTRUMENTO' } ],
  10: [ { pista: 'Capacidad de decidir por uno mismo.', respuesta: 'LIBERTAD' }, { pista: 'Deber de asumir las consecuencias de las propias acciones.', respuesta: 'RESPONSABILIDAD' }, { pista: 'Fronteras al ejercicio de los derechos para no afectar a otros.', respuesta: 'LIMITES' } ]
};
DF.levels.forEach(l => { l.palabras = DF.palabras[l.id]; });

/* Devolución de cada caso (texto del PDF). Se muestra al responder la pregunta oficial. */
DF.devoluciones = {
  1: 'La dignidad es un fundamento de los Derechos Humanos y corresponde a todas las personas.',
  2: 'La planificación plantea el reconocimiento de los Derechos Humanos y de la persona como sujeto de derechos.',
  3: 'La situación presenta un juicio previo realizado antes de conocer realmente a la persona. El programa trabaja específicamente la formación de prejuicios y su relación con situaciones discriminatorias.',
  4: 'Los estereotipos pueden establecer ideas generalizadas sobre las personas y sus roles. La planificación incluye específicamente el análisis de estereotipos de género.',
  5: 'El programa propone respetar y valorar las diferencias dentro de una sociedad y cultura diversas.',
  6: 'Las normas forman parte de la convivencia y permiten organizar las relaciones dentro de las instituciones.',
  7: 'La planificación incluye el estudio de la supremacía constitucional y la pirámide jurídica, que permiten analizar la jerarquía de las normas.',
  8: 'El estudio del esquema permite reconocer la organización interna de la Constitución y ubicar sus diferentes partes.',
  9: 'El conocimiento de los instrumentos constitucionales permite reconocer mecanismos vinculados con la defensa y promoción de los Derechos Humanos.',
  10: 'La planificación relaciona libertad y responsabilidad y contempla los límites al ejercicio de los derechos.'
};
DF.levels.forEach(l => { l.devolucion = DF.devoluciones[l.id]; });

/* =========================================================
   Reglas del juego (configurables)
   - seconds:         segundos por pregunta
   - basePoints / timeBonusMax: puntos por acierto (+ bonus por rapidez)
   - passMinSolved:   aciertos mínimos para ganar el caso (de 10)
   - attempts / wordBase / wordBonus / wordPass: desafío final de palabras
   - feedbackOkMs / feedbackBadMs: cuánto se muestra la corrección antes de seguir
   - redirectSeconds: espera en el resultado antes de volver a "Selección de nivel"
   Ganar = passMinSolved aciertos Y wordPass palabras del desafío final.
   Perder NO bloquea: terminar un nivel siempre desbloquea el siguiente.
   ========================================================= */
DF.rules = { seconds:20, perLevel:10, basePoints:100, timeBonusMax:40, passMinSolved:7,
  attempts:6, wordBase:100, wordBonus:20, wordPass:2,
  feedbackOkMs:1400, feedbackBadMs:2200, redirectSeconds:8 };
