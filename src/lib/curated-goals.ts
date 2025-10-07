import type { CuratedGoalBank, CuratedGoalStage } from './types';

const metasCuradasData: CuratedGoalStage[] = [
  {
    etapa: 'exploracion',
    titulo: 'Exploración (1° a 3° Semestre)',
    descripcion:
      'Metas enfocadas en la adaptación, el desarrollo de hábitos académicos, la exploración vocacional inicial y el establecimiento de una base de bienestar para **el/la estudiante**.',
    metas: [
      {
        id: 'EXP_OCP01',
        dimension: 'Ocupacional',
        categoria: 'carrera',
        metaSmarter:
          'Entrevistar a **2 profesores/as** de mi área sobre **las posibilidades que existen en la industria** antes de fin de mes.',
        pasosAccion:
          'Identificar **profesores/as** esta semana; Enviar correos solicitando 15 minutos; Preparar 3 preguntas sobre **qué les gustó más de estudiar su carrera**; Escribir una conclusión post-entrevista.'
      },
      {
        id: 'EXP_OCP02',
        dimension: 'Ocupacional',
        categoria: 'carrera',
        metaSmarter:
          'Asistir a 3 pláticas o talleres de distintas áreas de enfoque para mi carrera durante este semestre.',
        pasosAccion:
          'Investigar el calendario de eventos de diferentes sociedades estudiantiles esta semana; Bloquear 3 fechas en mi calendario; Escribir una reflexión de 5 líneas después de cada evento.'
      },
      {
        id: 'EXP_OCP03_ORIG',
        dimension: 'Ocupacional',
        categoria: 'carrera',
        metaSmarter:
          'Definir 2 posibles áreas de **especialización o concentración** para mi carrera en 5 semanas.',
        pasosAccion:
          'Agendar cita con mi Director/a de Carrera esta semana; Investigar planes de estudio de posgrado; Platicar con 2 **estudiantes** de semestres más avanzados sobre sus intereses.'
      },
      {
        id: 'EXP_INT01',
        dimension: 'Intelectual',
        categoria: 'academico',
        metaSmarter:
          'Aplicar la técnica Pomodoro (25 min trabajo / 5 min descanso) durante 3 sesiones de estudio seguidas por 2 semanas.',
        pasosAccion:
          'Descargar una app Pomodoro (Focus Keeper, Forest); Bloquear 1.5 horas en mi calendario 3 veces por semana; Registrar mi nivel de concentración después de cada sesión.'
      },
      {
        id: 'EXP_INT02',
        dimension: 'Intelectual',
        categoria: 'academico',
        metaSmarter:
          'Definir un sistema de gestión del tiempo (ej. Trello, Notion) y usarlo por 2 semanas.',
        pasosAccion:
          'Investigar 3 métodos de gestión del tiempo (Pomodoro, GTD); Seleccionar una herramienta; Crear 3 tareas prioritarias y seguirlas por 2 semanas.'
      },
      {
        id: 'EXP_INT03',
        dimension: 'Intelectual',
        categoria: 'academico',
        metaSmarter:
          'Asistir a 2 sesiones de tutoría con profesore/as o estudiantes (MAEs) por semestre en la materia más desafiante.',
        pasosAccion:
          'Identificar las materias con mayor reto; Buscar horario de tutores esta semana; Bloquear tiempo para 2 sesiones antes del parcial.'
      },
      {
        id: 'EXP_INT04_ORIG',
        dimension: 'Intelectual',
        categoria: 'academico',
        metaSmarter:
          'Completar un curso en Coursera o edX sobre una **habilidad técnica** clave para mi carrera.',
        pasosAccion:
          'Inscribirme al curso esta semana; Dedicar 3 horas semanales al curso; Aplicar un concepto aprendido en una materia actual.'
      },
      {
        id: 'EXP_SOC01',
        dimension: 'Social',
        categoria: 'social',
        metaSmarter:
          'Unirme a un grupo estudiantil de mi interés y asistir a 3 reuniones en el mes.',
        pasosAccion:
          'Buscar grupos en mi campus esta semana; Contactar a **la persona líder** del grupo; Participar activamente en 3 eventos/reuniones.'
      },
      {
        id: 'EXP_SOC02',
        dimension: 'Social',
        categoria: 'social',
        metaSmarter:
          'Asistir al menos a 1 evento LiFE de cada tipo (cultural, deportivo, de liderazgo) este semestre.',
        pasosAccion:
          'Revisar el calendario de eventos LiFE esta semana; Registrar 3 eventos en mi calendario; Asistir a ellos y conocer a 1 persona nueva en cada uno.'
      },
      {
        id: 'EXP_FIS01_LON',
        dimension: 'Física',
        categoria: 'fisica',
        metaSmarter:
          'Realizar 30 minutos de actividad física aeróbica 3 veces por semana por 4 semanas.',
        pasosAccion:
          'Identificar 3 actividades que disfruto (correr, bailar); Bloquear el tiempo en mi calendario; Usar una app (ej. Strava) para registrar 12 sesiones.'
      },
      {
        id: 'EXP_FIS02_LON',
        dimension: 'Física',
        categoria: 'fisica',
        metaSmarter: 'Asegurar 7-9 horas de sueño ininterrumpido 5 noches por semana.',
        pasosAccion:
          'Establecer hora límite para dejar dispositivos (30 minutos antes de dormir); Usar un app de seguimiento de sueño por 7 días; Registrar cumplimiento.'
      },
      {
        id: 'EXP_FIS03_NEW',
        dimension: 'Física',
        categoria: 'fisica',
        metaSmarter:
          'Mantener una botella de agua visible en el escritorio y beber 2 litros diarios, 5 días a la semana, por un mes.',
        pasosAccion:
          'Comprar una botella de 1 litro o más; Crear un rastreador en mi celular; Recompensarme con una caminata de 15 minutos si cumplo 5 días seguidos.'
      },
      {
        id: 'EXP_EMO01_LON',
        dimension: 'Emocional',
        categoria: 'emocional',
        metaSmarter:
          'Practicar la respiración cuadrada (4-4-4-4) por 5 minutos diarios durante 10 días.',
        pasosAccion:
          'Descargar una app de mindfulness; Programar un recordatorio diario; Registrar en un diario cómo me siento antes y después de la práctica.'
      },
      {
        id: 'EXP_EMO02_LON',
        dimension: 'Emocional',
        categoria: 'emocional',
        metaSmarter:
          'Escribir un diario de gratitud registrando 3 cosas positivas cada noche durante 21 días.',
        pasosAccion:
          'Comprar/descargar un diario hoy; Establecer una alarma a las 10 pm para escribir; Leer las entradas al final de las 3 semanas y reflexionar sobre mi estado de ánimo.'
      },
      {
        id: 'EXP_EMO03_NEW',
        dimension: 'Emocional',
        categoria: 'emocional',
        metaSmarter:
          "Aprender y aplicar 3 técnicas de 'grounding' diferentes 2 veces por semana durante 4 semanas, registrando su efectividad.",
        pasosAccion:
          'Investigar 3 técnicas (5-4-3-2-1, respiración, tacto) esta semana; Practicar una técnica durante una situación de estrés leve; Evaluar cuál me funciona mejor y usarla en momentos de ansiedad.'
      },
      {
        id: 'EXP_FIN01_LON',
        dimension: 'Financiera',
        categoria: 'financiera',
        metaSmarter:
          'Crear un presupuesto mensual y registrar todos mis gastos por 5 semanas.',
        pasosAccion:
          'Descargar una app de finanzas personales (ej. Fintonic, Mobills); Conectar mi cuenta o registrar mis gastos manualmente por una semana; Analizar mis gastos y crear categorías de presupuesto.'
      },
      {
        id: 'EXP_FIN02_LON',
        dimension: 'Financiera',
        categoria: 'financiera',
        metaSmarter: "Reducir en un 20% mis 'gastos hormiga' (cafés, snacks, etc.).",
        pasosAccion:
          'Registrar todos los gastos hormiga por una semana; Establecer un límite semanal para esta categoría; Preparar mi café o snacks en casa 3 veces por semana.'
      },
      {
        id: 'EXP_FIN03_NEW',
        dimension: 'Financiera',
        categoria: 'financiera',
        metaSmarter:
          'Rastrear mis suscripciones de entretenimiento y cancelar o downgradear 1 servicio innecesario en el primer mes del semestre.',
        pasosAccion:
          'Hacer una lista de todas mis suscripciones esta semana; Identificar la menos utilizada; Cancelar o buscar una opción más económica antes de la siguiente fecha de cobro.'
      },
      {
        id: 'EXP_ESP01_LON',
        dimension: 'Espiritual',
        categoria: 'espiritual',
        metaSmarter: 'Leer 3 libros de desarrollo personal/propósito este semestre.',
        pasosAccion:
          'Seleccionar primer libro esta semana; Establecer meta de 20 páginas diarias; Crear grupo de discusión con **amistades**; Escribir reflexiones después de cada libro.'
      },
      {
        id: 'EXP_ESP02_NEW',
        dimension: 'Espiritual',
        categoria: 'espiritual',
        metaSmarter:
          'Dedicar 10 minutos diarios a un hobby creativo (dibujar, escribir, tocar un instrumento) por 3 semanas.',
        pasosAccion:
          'Elegir el hobby y el material; Bloquear el tiempo en el calendario; Compartir el resultado con **una persona amiga** para recibir feedback.'
      }
    ]
  },
  {
    etapa: 'enfoque',
    titulo: 'Enfoque (4° a 6° Semestre)',
    descripcion:
      'Metas enfocadas en la profundización de habilidades técnicas, la definición de un camino vocacional claro, el networking y la gestión de la complejidad académica para **el/la estudiante**.',
    metas: [
      {
        id: 'ENF_OCP01',
        dimension: 'Ocupacional',
        categoria: 'carrera',
        metaSmarter:
          'Completar un curso de 10 horas en línea sobre una **habilidad técnica (hard skill)** clave para mi enfoque en 3 semanas.',
        pasosAccion:
          'Elegir el curso y empezar el primer módulo hoy; Dedicar 5 horas semanales de estudio; Aplicar el concepto principal aprendido en un proyecto personal.'
      },
      {
        id: 'ENF_OCP02',
        dimension: 'Ocupacional',
        categoria: 'carrera',
        metaSmarter:
          'Completar un proyecto personal utilizando 2 **habilidades técnicas (hard skills)** específicas de mi enfoque de carrera antes de que termine el parcial.',
        pasosAccion:
          'Definir el alcance del proyecto esta semana; Identificar las 2 habilidades a usar (ej. Python, UI/UX); Asignar 5 horas de trabajo semanales; Subir el resultado a mi portafolio/GitHub.'
      },
      {
        id: 'ENF_OCP03',
        dimension: 'Ocupacional',
        categoria: 'carrera',
        metaSmarter:
          'Crear y publicar mi perfil profesional en LinkedIn con al menos 3 proyectos/experiencias destacadas en 2 semanas.',
        pasosAccion:
          'Tomar una foto de perfil profesional esta semana; Escribir un resumen atractivo; Documentar 3 proyectos de mis materias y subirlos.'
      },
      {
        id: 'ENF_OCP04_NEW',
        dimension: 'Ocupacional',
        categoria: 'carrera',
        metaSmarter:
          'Asistir a un webinar o masterclass de **una persona líder** de la industria y conectar con 2 asistentes en el siguiente mes.',
        pasosAccion:
          'Identificar un evento relevante esta semana; Registrarme y asistir a la sesión completa; Enviar un mensaje personalizado a 2 asistentes o al **ponente/a** por LinkedIn; Reflexionar sobre el aprendizaje clave.'
      },
      {
        id: 'ENF_OCP05_ORIG',
        dimension: 'Ocupacional',
        categoria: 'carrera',
        metaSmarter:
          'Definir 2 posibles áreas de **especialización o concentración** para mi carrera en 5 semanas.',
        pasosAccion:
          'Agendar cita con mi Director/a de Carrera esta semana; Investigar planes de estudio de posgrado; Platicar con 2 **estudiantes** de semestres más avanzados sobre sus intereses.'
      },
      {
        id: 'ENF_OCP06_ORIG',
        dimension: 'Ocupacional',
        categoria: 'carrera',
        metaSmarter: 'Crear un portafolio digital básico con 3 proyectos clave en 3 semanas.',
        pasosAccion:
          'Elegir una plataforma (Behance, GitHub) hoy; Documentar el primer proyecto esta semana; Solicitar feedback a **un/a profesor/a o mentor/a**.'
      },
      {
        id: 'ENF_INT01',
        dimension: 'Intelectual',
        categoria: 'academico',
        metaSmarter:
          'Leer un artículo de investigación o **caso de estudio** relacionado con mi área de enfoque cada semana por un mes y escribir un resumen de 5 líneas.',
        pasosAccion:
          'Identificar 4 fuentes (journals, bases de datos) hoy; Bloquear 1 hora cada viernes para leer; Escribir el resumen en Notion/un diario al terminar cada lectura.'
      },
      {
        id: 'ENF_INT02',
        dimension: 'Intelectual',
        categoria: 'academico',
        metaSmarter:
          'Crear un mapa mental o resumen de los temas clave de mi área de enfoque para un proyecto de clase en 3 semanas.',
        pasosAccion:
          'Seleccionar 3 artículos clave de mi disciplina; Leer los artículos y tomar notas esta semana; Sintetizar la información en un mapa mental o documento de 2 páginas.'
      },
      {
        id: 'ENF_INT03_NEW',
        dimension: 'Intelectual',
        categoria: 'academico',
        metaSmarter:
          'Completar un examen de certificación de nivel básico de un software clave (ej. Google Analytics, HubSpot, Figma) antes de finalizar el semestre.',
        pasosAccion:
          'Identificar el software clave y la certificación esta semana; Dedicar 2 horas semanales a estudiar el temario; Agendar la fecha del examen; Recibir la certificación.'
      },
      {
        id: 'ENF_SOC01',
        dimension: 'Social',
        categoria: 'social',
        metaSmarter:
          'Organizar o participar en una actividad social (ej. torneo, salida a comer) fuera del campus para 6 **compañeros/as** de mi grupo de enfoque en 3 semanas.',
        pasosAccion:
          'Proponer la idea en el grupo esta semana; Definir fecha y actividad; Enviar invitación y confirmar asistencia.'
      },
      {
        id: 'ENF_SOC02',
        dimension: 'Social',
        categoria: 'social',
        metaSmarter:
          'Participar como **voluntario/a o líder** en 1 proyecto de Servicio Social o de impacto social durante este periodo académico.',
        pasosAccion:
          'Buscar oportunidades en Mi Tec o con LiFE esta semana; Inscribirme al proyecto; Dedicar 3 horas semanales al servicio; Documentar la experiencia para mi CV.'
      },
      {
        id: 'ENF_FIS01_LON',
        dimension: 'Física',
        categoria: 'fisica',
        metaSmarter:
          'Realizar 30 minutos de actividad física aeróbica 3 veces por semana por 4 semanas.',
        pasosAccion:
          'Identificar 3 actividades que disfruto (correr, bailar); Bloquear el tiempo en mi calendario; Usar una app (ej. Strava) para registrar 12 sesiones.'
      },
      {
        id: 'ENF_FIS02_LON',
        dimension: 'Física',
        categoria: 'fisica',
        metaSmarter: 'Asegurar 7-9 horas de sueño ininterrumpido 5 noches por semana.',
        pasosAccion:
          'Establecer hora límite para dejar dispositivos (30 minutos antes de dormir); Usar un app de seguimiento de sueño por 7 días; Registrar cumplimiento.'
      },
      {
        id: 'ENF_EMO01_LON',
        dimension: 'Emocional',
        categoria: 'emocional',
        metaSmarter:
          'Escribir un diario de gratitud registrando 3 cosas positivas cada noche durante 21 días.',
        pasosAccion:
          'Comprar/descargar un diario hoy; Establecer una alarma a las 10 pm para escribir; Leer las entradas al final de las 3 semanas y reflexionar sobre mi estado de ánimo.'
      },
      {
        id: 'ENF_EMO02_NEW',
        dimension: 'Emocional',
        categoria: 'emocional',
        metaSmarter:
          'Implementar un "bloqueo de desconexión" de dispositivos de 30 minutos diarios, 5 días a la semana, para reducir la fatiga digital por un mes.',
        pasosAccion:
          'Establecer una hora fija (ej. 7:00 pm) para el bloqueo; Definir una actividad alternativa (leer, caminar, estirar); Registrar mi nivel de energía al inicio y final del mes.'
      },
      {
        id: 'ENF_FIN01_LON',
        dimension: 'Financiera',
        categoria: 'financiera',
        metaSmarter:
          'Crear un presupuesto mensual y registrar todos mis gastos por 5 semanas.',
        pasosAccion:
          'Descargar una app de finanzas personales (ej. Fintonic, Mobills); Conectar mi cuenta o registrar mis gastos manualmente por una semana; Analizar mis gastos y crear categorías de presupuesto.'
      },
      {
        id: 'ENF_FIN02_LON',
        dimension: 'Financiera',
        categoria: 'financiera',
        metaSmarter: "Reducir en un 20% mis 'gastos hormiga' (cafés, snacks, etc.).",
        pasosAccion:
          'Registrar todos los gastos hormiga por una semana; Establecer un límite semanal para esta categoría; Preparar mi café o snacks en casa 3 veces por semana.'
      },
      {
        id: 'ENF_FIN03_ORIG',
        dimension: 'Financiera',
        categoria: 'financiera',
        metaSmarter: 'Ahorrar el 15% de mis ingresos (mesada, beca, trabajo) este periodo.',
        pasosAccion:
          'Abrir una cuenta de ahorro o apartado específico; Programar una transferencia automática el día que recibo dinero; Ponerle un nombre a mi meta de ahorro para motivarme.'
      },
      {
        id: 'ENF_ESP01_LON',
        dimension: 'Espiritual',
        categoria: 'espiritual',
        metaSmarter: 'Leer 3 libros de desarrollo personal/propósito este semestre.',
        pasosAccion:
          'Seleccionar primer libro esta semana; Establecer meta de 20 páginas diarias; Crear grupo de discusión con **amistades**; Escribir reflexiones después de cada libro.'
      },
      {
        id: 'ENF_ESP02_ORIG',
        dimension: 'Espiritual',
        categoria: 'espiritual',
        metaSmarter: 'Asistir semanalmente a Punto Blanco para mindfulness y reflexión.',
        pasosAccion:
          'Ubicar Punto Blanco en campus; Revisar horario de actividades; Apartar 1 hora semanal fija; Llevar diario de reflexiones.'
      }
    ]
  },
  {
    etapa: 'especializacion',
    titulo: 'Especialización (7° Semestre en adelante)',
    descripcion:
      'Metas orientadas a la culminación de estudios, el reclutamiento, la preparación para posgrado y la aplicación de conocimientos en proyectos de alto impacto para **el/la estudiante**.',
    metas: [
      {
        id: 'ESP_OCP01_ORIG',
        dimension: 'Ocupacional',
        categoria: 'ocupacional',
        metaSmarter:
          'Optimizar mi perfil profesional usando recursos del CVDP en 3 semanas.',
        pasosAccion:
          'Agendar revisión de CV con AI esta semana; Asistir a taller de LinkedIn; Programar 3 simulacros de entrevista con feedback.'
      },
      {
        id: 'ESP_OCP02_ORIG',
        dimension: 'Ocupacional',
        categoria: 'ocupacional',
        metaSmarter:
          'Aplicar a 15 **vacantes** de prácticas o trabajo de tiempo completo en 4 semanas.',
        pasosAccion:
          'Optimizar perfil LinkedIn; Personalizar CV por industria; Aplicar 4 posiciones semanales; Dar seguimiento cada 5 días.'
      },
      {
        id: 'ESP_OCP03_ORIG',
        dimension: 'Ocupacional',
        categoria: 'ocupacional',
        metaSmarter: 'Diseñar 1 proyecto de alto impacto para mi CV.',
        pasosAccion:
          'Identificar problema de industria; Crear propuesta de solución; Buscar **la persona mentora** para feedback; Presentar proyecto final.'
      },
      {
        id: 'ESP_OCP04_NEW',
        dimension: 'Ocupacional',
        categoria: 'ocupacional',
        metaSmarter:
          'Establecer una fecha de finalización y entregar el 95% del proyecto de titulación o Semestre Tec en el plazo de 8 semanas.',
        pasosAccion:
          'Revisar el cronograma oficial y establecer fechas límite internas; Reunirme con **mi asesor/a** semanalmente; Dedicar 10 horas semanales al proyecto; Entregar un borrador completo del 95%.'
      },
      {
        id: 'ESP_OCP05_ORIG',
        dimension: 'Ocupacional',
        categoria: 'ocupacional',
        metaSmarter:
          'Diseñar propuesta de Semestre Tec alineada a mi especialización y validarla en 3 semanas.',
        pasosAccion:
          'Investigar 3 opciones de concentración; Entrevistar a 2 **exalumnos/as**; Crear un plan de estudios preliminar; Validar con **el/la coordinador/a**.'
      },
      {
        id: 'ESP_OCP06_ORIG',
        dimension: 'Ocupacional',
        categoria: 'ocupacional',
        metaSmarter:
          'Preparar para reclutamiento de empresas top-tier en 8 semanas.',
        pasosAccion:
          'Practicar 10 problemas coding/cases; Agendar 5 mock interviews; Investigar cultura empresarial; Conectar con **empleados/as** LinkedIn.'
      },
      {
        id: 'ESP_INT01_ORIG',
        dimension: 'Intelectual',
        categoria: 'intelectual',
        metaSmarter:
          'Obtener **puntaje alto** en el examen TOEFL o IELTS para intercambio o posgrado en 6 semanas.',
        pasosAccion:
          'Registrar fecha de examen; Tomar diagnóstico gratuito; Estudiar 2 horas diarias; Practicar con simulacros semanales.'
      },
      {
        id: 'ESP_INT02_ORIG',
        dimension: 'Intelectual',
        categoria: 'intelectual',
        metaSmarter: 'Alcanzar nivel B2 en francés/alemán para intercambio europeo.',
        pasosAccion:
          'Inscribirse a curso intensivo; Practicar 1 hora diaria con apps; Sesiones conversación 2x semana; Ver contenido en idioma target.'
      },
      {
        id: 'ESP_INT03_ORIG',
        dimension: 'Intelectual',
        categoria: 'intelectual',
        metaSmarter: 'Preparar certificación de inglés técnico/negocios en 5 semanas.',
        pasosAccion:
          'Inscribirse a TOEIC o Cambridge Business; Completar libro preparación; Unirse a grupo de estudio; Practicar speaking diario.'
      },
      {
        id: 'ESP_SOC01_ORIG',
        dimension: 'Social',
        categoria: 'social',
        metaSmarter:
          'Ser **mentor/a voluntario/a** para estudiantes de primeros semestres.',
        pasosAccion:
          'Contactar a **mi mentor/a actual**; Preguntar sobre oportunidades de mentoría (programa Peer, por ejemplo); Definir horas semanales para apoyo; Crear plan de acompañamiento.'
      },
      {
        id: 'ESP_SOC02_NEW',
        dimension: 'Social',
        categoria: 'social',
        metaSmarter:
          'Organizar 1 sesión de "Preguntas y Respuestas" para estudiantes de etapas inferiores sobre la transición a la vida profesional antes de graduarme.',
        pasosAccion:
          'Contactar a tu mentor/a o Director/a de Programa para apoyo logístico; Crear una presentación con 5 temas clave; Promocionar el evento con al menos 2 semanas de anticipación; Realizar y documentar la sesión.'
      },
      {
        id: 'ESP_FIS01_LON',
        dimension: 'Física',
        categoria: 'fisica',
        metaSmarter:
          'Realizar 30 minutos de actividad física aeróbica 3 veces por semana por 4 semanas.',
        pasosAccion:
          'Identificar 3 actividades que disfruto (correr, bailar); Bloquear el tiempo en mi calendario; Usar una app (ej. Strava) para registrar 12 sesiones.'
      },
      {
        id: 'ESP_FIS02_LON',
        dimension: 'Física',
        categoria: 'fisica',
        metaSmarter: 'Asegurar 7-9 horas de sueño ininterrumpido 5 noches por semana.',
        pasosAccion:
          'Establecer hora límite para dejar dispositivos (30 minutos antes de dormir); Usar un app de seguimiento de sueño por 7 días; Registrar cumplimiento.'
      },
      {
        id: 'ESP_FIS03_NEW',
        dimension: 'Física',
        categoria: 'fisica',
        metaSmarter:
          'Implementar una rutina de 15 minutos de estiramiento y mindfulness 3 veces por semana para gestionar el estrés de la recta final.',
        pasosAccion:
          'Bloquear 15 minutos en el calendario (ej. después de la cena); Buscar una rutina de estiramiento guiada; Registrar mi nivel de estrés (escala 1-10) antes y después de cada sesión; Recompensarme con un baño caliente.'
      },
      {
        id: 'ESP_EMO01_LON',
        dimension: 'Emocional',
        categoria: 'emocional',
        metaSmarter:
          'Escribir un diario de gratitud registrando 3 cosas positivas cada noche durante 21 días.',
        pasosAccion:
          'Comprar/descargar un diario hoy; Establecer una alarma a las 10 pm para escribir; Leer las entradas al final de las 3 semanas y reflexionar sobre mi estado de ánimo.'
      },
      {
        id: 'ESP_EMO02_LON',
        dimension: 'Emocional',
        categoria: 'emocional',
        metaSmarter: 'Realizar 3 actos de bondad al azar por semana.',
        pasosAccion:
          "Identificar 3 oportunidades (ej. ayudar a **un/a compañero/a**, dejar nota positiva); Realizar el primer acto esta semana; Reflexionar por 1 minuto sobre cómo me sentí al hacerlo."
      },
      {
        id: 'ESP_FIN01_LON',
        dimension: 'Financiera',
        categoria: 'financiera',
        metaSmarter:
          'Crear un presupuesto mensual y registrar todos mis gastos por 5 semanas.',
        pasosAccion:
          'Descargar una app de finanzas personales (ej. Fintonic, Mobills); Conectar mi cuenta o registrar mis gastos manualmente por una semana; Analizar mis gastos y crear categorías de presupuesto.'
      },
      {
        id: 'ESP_FIN02_LON',
        dimension: 'Financiera',
        categoria: 'financiera',
        metaSmarter: "Reducir en un 20% mis 'gastos hormiga' (cafés, snacks, etc.).",
        pasosAccion:
          'Registrar todos los gastos hormiga por una semana; Establecer un límite semanal para esta categoría; Preparar mi café o snacks en casa 3 veces por semana.'
      },
      {
        id: 'ESP_FIN03_ORIG',
        dimension: 'Financiera',
        categoria: 'financiera',
        metaSmarter:
          'Investigar sobre 2 opciones de inversión para **personas principiantes** (ej. Cetes, fondos) y abrir una cuenta de inversión en 8 semanas.',
        pasosAccion:
          'Ver un video o leer un artículo sobre "cómo empezar a invertir en México"; Comparar Cetesdirecto y un fondo de inversión de bajo riesgo; Abrir una cuenta en una de las plataformas.'
      },
      {
        id: 'ESP_FIN04_ORIG',
        dimension: 'Financiera',
        categoria: 'financiera',
        metaSmarter:
          'Completar un taller o curso online gratuito sobre finanzas personales.',
        pasosAccion:
          'Buscar cursos en plataformas como la CONDUSEF o Coursera; Inscribirme y completar el primer módulo esta semana; Aplicar un consejo aprendido inmediatamente.'
      },
      {
        id: 'ESP_ESP01_ORIG',
        dimension: 'Espiritual',
        categoria: 'espiritual',
        metaSmarter:
          'Documentar mi trayectoria para el Premio LiFE, completando el ensayo de aplicación en 6 semanas.',
        pasosAccion:
          'Revisar requisitos de Premio LiFE esta semana; Crear carpeta digital con evidencias; Documentar actividades de **voluntariado/a**; Recopilar cartas de recomendación; Redactar ensayo de aplicación.'
      },
      {
        id: 'ESP_ESP02_ORIG',
        dimension: 'Espiritual',
        categoria: 'espiritual',
        metaSmarter: 'Completar 100 horas de Servicio Social Comunitario este semestre.',
        pasosAccion:
          'Calcular horas faltantes en Mi Tec; Buscar proyectos disponibles 2do/3er periodo; Inscribirse antes del cierre de convocatoria; Comprometerse con horario fijo semanal.'
      }
    ]
  },
  {
    etapa: 'longitudinal',
    titulo: 'Longitudinal (Todas las Etapas)',
    descripcion:
      'Metas que son relevantes y aplicables a cualquier semestre, sirviendo como hábitos base de bienestar.',
    metas: [
      {
        id: 'LON_FIS01',
        dimension: 'Física',
        categoria: 'fisica',
        metaSmarter: 'Asegurar 7-9 horas de sueño ininterrumpido 5 noches por semana.',
        pasosAccion:
          'Establecer hora límite para dejar dispositivos (30 minutos antes de dormir); Usar un app de seguimiento de sueño por 7 días; Registrar cumplimiento.'
      },
      {
        id: 'LON_EMO01',
        dimension: 'Emocional',
        categoria: 'emocional',
        metaSmarter: 'Realizar 3 actos de bondad al azar por semana.',
        pasosAccion:
          "Identificar 3 oportunidades (ej. ayudar a **un/a compañero/a**, dejar nota positiva); Realizar el primer acto esta semana; Reflexionar por 1 minuto sobre cómo me sentí al hacerlo."
      },
      {
        id: 'LON_FIN01',
        dimension: 'Financiera',
        categoria: 'financiera',
        metaSmarter:
          'Completar un taller o curso online gratuito sobre finanzas personales.',
        pasosAccion:
          'Buscar cursos en plataformas como la CONDUSEF o Coursera; Inscribirme y completar el primer módulo esta semana; Aplicar un consejo aprendido inmediatamente.'
      },
      {
        id: 'LON_FIN02',
        dimension: 'Financiera',
        categoria: 'financiera',
        metaSmarter: "Reducir en un 20% mis 'gastos hormiga' (cafés, snacks, etc.).",
        pasosAccion:
          'Registrar todos los gastos hormiga por una semana; Establecer un límite semanal para esta categoría; Preparar mi café o snacks en casa 3 veces por semana.'
      },
      {
        id: 'LON_OCP01',
        dimension: 'Ocupacional',
        categoria: 'carrera',
        metaSmarter:
          'Asistir a 2 eventos de networking (virtuales o presenciales) en 5 semanas.',
        pasosAccion:
          'Buscar eventos en los grupos de mi carrera hoy; Conectar en LinkedIn con 3 personas por evento.'
      },
      {
        id: 'LON_OCP02',
        dimension: 'Ocupacional',
        categoria: 'carrera',
        metaSmarter:
          'Investigar 3 empresas **líderes** en mi sector y sus procesos de reclutamiento.',
        pasosAccion:
          'Seleccionar las empresas hoy; Analizar sus vacantes para becarios en LinkedIn; Adaptar mi CV para una de esas empresas.'
      },
      {
        id: 'LON_INT01',
        dimension: 'Intelectual',
        categoria: 'academico',
        metaSmarter: 'Asistir a 2 sesiones de tutoría o centro de éxito académico por semestre.',
        pasosAccion:
          'Identificar las materias con mayor reto; Buscar horario de tutores esta semana; Bloquear tiempo para 2 sesiones antes del parcial.'
      }
    ]
  }
];

export const curatedGoalStages = metasCuradasData;

export function buildCuratedGoalBank(
  stages: CuratedGoalStage[] = metasCuradasData
): CuratedGoalBank {
  return stages.reduce<CuratedGoalBank>((acc, stage) => {
    const { etapa, ...rest } = stage;
    acc[etapa] = rest;
    return acc;
  }, {} as CuratedGoalBank);
}

export const curatedGoalBank = buildCuratedGoalBank();
