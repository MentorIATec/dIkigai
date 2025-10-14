import type { CuratedGoalBank, CuratedGoalBankExtended, CuratedGoalStage } from './types';
import { curatedGoalStagesSchema } from './schemas';

const metasCuradasData: CuratedGoalStage[] = curatedGoalStagesSchema.parse([
  {
    etapa: 'primerSemestre',
    titulo: 'Primer Semestre',
    descripcion:
      'Metas enfocadas en la adaptación a la vida universitaria, desarrollo de hábitos de estudio básicos, integración social y establecimiento de rutinas de bienestar para estudiantes de primer ingreso.',
    metas: [
      // ============================================================
      // METAS DE ADAPTACIÓN UNIVERSITARIA
      // ============================================================
      {
        id: 'PRIM_ADP01',
        dimension: 'Emocional',
        categoria: 'adaptacion',
        metaSmarter:
          'Establecer una rutina de adaptación universitaria que incluya horarios de clase, estudio y descanso durante las primeras 4 semanas.',
        pasosAccion:
          'Crear horario semanal con clases, tiempo de estudio y descanso; Usar app de calendario o agenda física; Revisar y ajustar rutina cada domingo; Mantener consistencia por 4 semanas consecutivas.'
      },
      {
        id: 'PRIM_ADP02',
        dimension: 'Social',
        categoria: 'adaptacion',
        metaSmarter:
          'Conocer al menos 3 compañeros/as de mi grupo y 2 profesores/as en las primeras 3 semanas del semestre.',
        pasosAccion:
          'Presentarme a compañeros/as en las primeras clases; Intercambiar contactos con 3 compañeros/as; Saludar y presentarme a mis profesores/as; Crear grupo de WhatsApp con compañeros/as del grupo.'
      },
      {
        id: 'PRIM_ADP03',
        dimension: 'Intelectual',
        categoria: 'adaptacion',
        metaSmarter:
          'Explorar y familiarizarme con los recursos académicos del campus incluyendo cursos asíncronos de Mejoramiento Académico en 2 semanas.',
        pasosAccion:
          'Hacer recorrido por biblioteca y conocer servicios; Visitar laboratorios relevantes para mi carrera; Investigar cursos asíncronos de Mejoramiento Académico; Identificar 3 espacios de estudio favoritos; Crear lista de recursos disponibles en mi teléfono.'
      },
      
      // ============================================================
      // METAS DE HÁBITOS DE ESTUDIO BÁSICOS
      // ============================================================
      {
        id: 'PRIM_EST01',
        dimension: 'Intelectual',
        categoria: 'academico',
        metaSmarter:
          'Establecer rutina de estudio de 2 horas diarias, 5 días a la semana, por 4 semanas consecutivas.',
        pasosAccion:
          'Definir horario fijo de estudio (ej. 7-9 PM); Elegir espacio de estudio sin distracciones; Usar app de productividad para registrar sesiones; Recompensarme al completar 4 semanas.'
      },
      {
        id: 'PRIM_EST02',
        dimension: 'Intelectual',
        categoria: 'academico',
        metaSmarter:
          'Aprender y aplicar la técnica de toma de apuntes Cornell durante 3 semanas en todas mis materias.',
        pasosAccion:
          'Investigar técnica Cornell esta semana; Practicar dividiendo hojas en 3 secciones; Usar la técnica en al menos 2 clases diarias; Revisar y resumir apuntes cada fin de semana.'
      },
      {
        id: 'PRIM_EST03',
        dimension: 'Intelectual',
        categoria: 'academico',
        metaSmarter:
          'Asistir a 2 sesiones de tutoría con mi profesor/a o estudiantes MAE (Mentores Académicos de Excelencia) en mi materia más desafiante durante el primer mes.',
        pasosAccion:
          'Identificar mi materia más difícil esta semana; Buscar horarios de tutores MAE disponibles en https://maes.mx; Agendar 2 sesiones de tutoría; Preparar dudas específicas para cada sesión; Aplicar técnicas aprendidas en mis estudios.'
      },
      {
        id: 'PRIM_EST04',
        dimension: 'Intelectual',
        categoria: 'academico',
        metaSmarter:
          'Crear un sistema de organización de materiales académicos (carpetas, archivos digitales, calendario) y mantenerlo actualizado por 6 semanas.',
        pasosAccion:
          'Organizar carpetas físicas por materia; Crear estructura de archivos digitales; Sincronizar calendario académico con personal; Revisar y actualizar organización cada domingo.'
      },
      
      // ============================================================
      // METAS DE INTEGRACIÓN SOCIAL
      // ============================================================
      {
        id: 'PRIM_SOC01',
        dimension: 'Social',
        categoria: 'social',
        metaSmarter:
          'Unirme a 1 grupo estudiantil o actividad extracurricular que me interese durante las primeras 6 semanas.',
        pasosAccion:
          'Investigar grupos estudiantiles disponibles; Asistir a 2 eventos de introducción; Elegir 1 grupo que me interese; Participar activamente en 3 actividades del grupo.'
      },
      {
        id: 'PRIM_SOC02',
        dimension: 'Social',
        categoria: 'social',
        metaSmarter:
          'Asistir a 3 eventos de integración del campus (ferias, charlas, actividades) durante el primer mes.',
        pasosAccion:
          'Revisar calendario de eventos del campus; Seleccionar 3 eventos de mi interés; Agendar fechas en mi calendario; Conocer al menos 1 persona nueva en cada evento.'
      },
      {
        id: 'PRIM_SOC03',
        dimension: 'Social',
        categoria: 'social',
        metaSmarter:
          'Mantener comunicación regular con mi familia/amigos de antes de la universidad mediante llamadas o videollamadas 2 veces por semana por 6 semanas.',
        pasosAccion:
          'Programar 2 llamadas semanales fijas; Compartir experiencias universitarias; Pedir consejos sobre adaptación; Documentar momentos especiales para compartir.'
      },
      
      // ============================================================
      // METAS DE BIENESTAR BÁSICO
      // ============================================================
      {
        id: 'PRIM_BIE01',
        dimension: 'Física',
        categoria: 'fisica',
        metaSmarter:
          'Establecer rutina de sueño de 7-8 horas diarias durante 5 días a la semana por 4 semanas.',
        pasosAccion:
          'Definir horario fijo de dormir y despertar; Crear rutina relajante antes de dormir; Evitar pantallas 30 minutos antes de dormir; Usar app de sueño para registrar patrones.'
      },
      {
        id: 'PRIM_BIE02',
        dimension: 'Física',
        categoria: 'fisica',
        metaSmarter:
          'Incluir actividad física de 30 minutos, 3 veces por semana durante 4 semanas consecutivas.',
        pasosAccion:
          'Elegir 2-3 actividades que disfrute (caminar, bailar, deportes); Bloquear tiempo en calendario; Encontrar compañero/a de ejercicio; Registrar sesiones en app de fitness.'
      },
      {
        id: 'PRIM_BIE03',
        dimension: 'Emocional',
        categoria: 'emocional',
        metaSmarter:
          'Practicar 5 minutos de respiración profunda o meditación diaria durante 21 días consecutivos.',
        pasosAccion:
          'Descargar app de meditación o mindfulness; Establecer horario fijo (ej. antes de dormir); Crear espacio tranquilo para práctica; Registrar sensaciones después de cada sesión.'
      },
      {
        id: 'PRIM_BIE04',
        dimension: 'Emocional',
        categoria: 'emocional',
        metaSmarter:
          'Escribir un diario de gratitud registrando 3 cosas positivas cada día durante 2 semanas.',
        pasosAccion:
          'Comprar o crear diario de gratitud; Establecer hora fija para escribir; Reflexionar sobre momentos positivos del día; Leer entradas al final de las 2 semanas.'
      },
      
      // ============================================================
      // METAS DE ORIENTACIÓN VOCACIONAL BÁSICA
      // ============================================================
      {
        id: 'PRIM_OCP01',
        dimension: 'Ocupacional',
        categoria: 'carrera',
        metaSmarter:
          'Investigar y entender las principales áreas de oportunidad de mi carrera durante las primeras 4 semanas.',
        pasosAccion:
          'Investigar 3 áreas principales de mi carrera; Hablar con 2 estudiantes de semestres avanzados; Revisar perfil de egreso de mi programa; Crear lista de áreas que me interesan.'
      },
      {
        id: 'PRIM_OCP02',
        dimension: 'Ocupacional',
        categoria: 'carrera',
        metaSmarter:
          'Asistir a 2 charlas o eventos relacionados con mi carrera durante el primer mes.',
        pasosAccion:
          'Buscar eventos de carrera en el campus; Agendar 2 charlas relevantes; Tomar notas durante las presentaciones; Conectar con al menos 1 profesional en cada evento.'
      },
      
      // ============================================================
      // METAS FINANCIERAS BÁSICAS
      // ============================================================
      {
        id: 'PRIM_FIN01',
        dimension: 'Financiera',
        categoria: 'financiera',
        metaSmarter:
          'Crear un presupuesto mensual básico y registrar mis gastos durante 4 semanas.',
        pasosAccion:
          'Identificar mis ingresos mensuales (mesada, beca); Listar gastos fijos y variables; Crear presupuesto en app o hoja de cálculo; Registrar todos los gastos diariamente.'
      },
      {
        id: 'PRIM_FIN02',
        dimension: 'Financiera',
        categoria: 'financiera',
        metaSmarter:
          'Aprender sobre los servicios financieros básicos del campus (cafetería, fotocopias, transporte) en 2 semanas.',
        pasosAccion:
          'Investigar servicios disponibles en el campus; Probar sistema de pagos de cafetería; Conocer opciones de transporte estudiantil; Crear lista de servicios y costos.'
      },
      
      // ============================================================
      // METAS ESPIRITUALES BÁSICAS
      // ============================================================
      {
        id: 'PRIM_ESP01',
        dimension: 'Espiritual',
        categoria: 'espiritual',
        metaSmarter:
          'Reflexionar sobre mis valores y propósito de estudiar mi carrera durante 10 minutos semanales por 4 semanas.',
        pasosAccion:
          'Establecer horario fijo semanal para reflexión (ej. domingos por la noche); Crear espacio tranquilo para reflexionar; Escribir en diario mis motivaciones para estudiar mi carrera; Revisar y ajustar mis reflexiones cada semana.'
      },
      {
        id: 'PRIM_ESP02',
        dimension: 'Espiritual',
        categoria: 'espiritual',
        metaSmarter:
          'Acudir al espacio de reflexión Punto Blanco del campus y participar en al menos 2 actividades durante el primer mes.',
        pasosAccion:
          'Ubicar Punto Blanco en mi campus; Revisar horario de actividades disponibles; Seleccionar 2 actividades que me interesen (meditación, reflexión, etc.); Asistir y participar activamente; Reflexionar sobre la experiencia después de cada actividad.'
      }
    ]
  },
  {
    etapa: 'exploracion',
    titulo: 'Exploración (2° a 3° Semestre)',
    descripcion:
      'Metas enfocadas en la adaptación, el desarrollo de hábitos académicos, la exploración vocacional inicial y el establecimiento de una base de bienestar para el/la estudiante.',
    metas: [
      {
        id: 'EXP_OCP01',
        dimension: 'Ocupacional',
        categoria: 'carrera',
        metaSmarter:
          'Entrevistar a 2 profesores/as de mi área sobre las posibilidades que existen en la industria antes de fin de mes.',
        pasosAccion:
          'Identificar profesores/as esta semana; Enviar correos solicitando 15 minutos; Preparar 3 preguntas sobre qué les gustó más de estudiar su carrera; Escribir una conclusión post-entrevista.'
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
          'Definir 2 posibles áreas de especialización o concentración para mi carrera en 5 semanas.',
        pasosAccion:
          'Agendar cita con mi Director/a de Carrera esta semana; Investigar planes de estudio de posgrado; Platicar con 2 estudiantes de semestres más avanzados sobre sus intereses.'
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
          'Completar un curso en Coursera o edX sobre una habilidad técnica clave para mi carrera.',
        pasosAccion:
          'Inscribirme al curso esta semana; Dedicar 3 horas semanales al curso; Aplicar un concepto aprendido en una materia actual.'
      },
      {
        id: 'EXP_INT_NEW_SPECIAL',
        dimension: 'Intelectual',
        categoria: 'academico',
        metaSmarter:
          'Inscribirme en taller de Administración del tiempo de Mejoramiento Académico para mejorar mi rendimiento académico en 4 semanas.',
        pasosAccion:
          'Solicitar informes en Consejería Emocional (Centrales Sur, 4to piso); Inscribirme al taller; Implementar técnicas aprendidas; Registrar efectividad semanalmente; Adaptar método a mi rutina.'
      },
      // NUEVAS METAS ESPECÍFICAS - DECISIÓN DE PROGRAMA ACADÉMICO
      {
        id: 'EXP_PROG01',
        dimension: 'Ocupacional',
        categoria: 'carrera',
        metaSmarter: 'Entrevistar a 3 profesores/as de diferentes áreas de mi carrera para entender las opciones de programa de egreso en las próximas 4 semanas.',
        pasosAccion:
          'Identificar 3 profesores/as de áreas distintas; Preparar 5 preguntas sobre programas de egreso; Agendar citas de 15 minutos; Tomar notas sobre cada conversación; Comparar opciones y hacer decisión preliminar.'
      },
      {
        id: 'EXP_PROG02',
        dimension: 'Ocupacional',
        categoria: 'carrera',
        metaSmarter: 'Conversar con 2 estudiantes de 6° semestre o más sobre su experiencia en diferentes programas de egreso y su recomendación en 3 semanas.',
        pasosAccion:
          'Identificar estudiantes avanzados en mi carrera; Preparar preguntas sobre su experiencia; Agendar conversaciones informales; Escuchar sobre pros y contras; Documentar insights para mi decisión.'
      },
      {
        id: 'EXP_PROG03',
        dimension: 'Ocupacional',
        categoria: 'carrera',
        metaSmarter: 'Agendar una cita con mi Director/a de Programa/Entrada para discutir opciones de egreso y recibir orientación personalizada en 2 semanas.',
        pasosAccion:
          'Contactar al Director/a de Programa; Preparar preguntas específicas sobre mi perfil; Llevar notas de entrevistas previas; Recibir recomendación personalizada; Definir próximos pasos.'
      },
      // NUEVAS METAS ESPECÍFICAS - PREPARACIÓN INTERNACIONAL
      {
        id: 'EXP_INTL01',
        dimension: 'Intelectual',
        categoria: 'academico',
        metaSmarter: 'Iniciar el estudio de un tercer idioma (francés, alemán, chino, japonés) y alcanzar nivel A2 en 6 meses.',
        pasosAccion:
          'Elegir idioma basado en mis intereses; Inscribirme a curso en el Tec o plataforma online; Dedicar 3 horas semanales; Practicar con apps de idiomas; Evaluar progreso mensualmente.'
      },
      {
        id: 'EXP_INTL02',
        dimension: 'Intelectual',
        categoria: 'academico',
        metaSmarter: 'Obtener certificación de inglés (TOEFL, IELTS) con puntaje mínimo para intercambio internacional en 8 semanas.',
        pasosAccion:
          'Investigar requisitos de puntaje para intercambio; Elegir examen (TOEFL/IELTS); Inscribirme a curso de preparación; Practicar con simulacros semanales; Tomar examen oficial.'
      },
      {
        id: 'EXP_INTL03',
        dimension: 'Intelectual',
        categoria: 'academico',
        metaSmarter: 'Asistir a 3 sesiones informativas de Programas Internacionales para conocer opciones de intercambio en el próximo año.',
        pasosAccion:
          'Revisar calendario de sesiones en @picampusmty; Inscribirme a 3 sesiones de universidades diferentes; Tomar notas sobre requisitos; Evaluar opciones según mi programa; Crear lista de preferencias.'
      },
      // NUEVAS METAS ESPECÍFICAS - PRIMERAS EXPERIENCIAS PROFESIONALES
      {
        id: 'EXP_PROF01',
        dimension: 'Ocupacional',
        categoria: 'carrera',
        metaSmarter: 'Conseguir mi primera entrevista para prácticas profesionales antes del final del semestre.',
        pasosAccion:
          'Optimizar mi CV con ayuda del CVDP; Investigar empresas que ofrecen prácticas; Aplicar a 5 posiciones; Preparar para entrevistas con el CVDP; Realizar al menos 1 entrevista exitosa.'
      },
      {
        id: 'EXP_PROF02',
        dimension: 'Ocupacional',
        categoria: 'carrera',
        metaSmarter: 'Explorar 3 tipos diferentes de prácticas profesionales (corporativas, startups, ONGs) y evaluar cuál se alinea mejor con mis intereses en 4 semanas.',
        pasosAccion:
          'Investigar cada tipo de organización; Asistir a charlas de empresas de cada sector; Conectar con profesionales en LinkedIn; Evaluar pros y contras; Definir preferencia basada en aprendizaje.'
      },
      {
        id: 'EXP_SOC01',
        dimension: 'Social',
        categoria: 'social',
        metaSmarter:
          'Unirme a un grupo estudiantil de mi interés y asistir a 3 reuniones en el mes.',
        pasosAccion:
          'Buscar grupos en mi campus esta semana; Contactar a la persona líder del grupo; Participar activamente en 3 eventos/reuniones.'
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
          'Seleccionar primer libro esta semana; Establecer meta de 20 páginas diarias; Crear grupo de discusión con amistades; Escribir reflexiones después de cada libro.'
      },
      {
        id: 'EXP_ESP02_NEW',
        dimension: 'Espiritual',
        categoria: 'espiritual',
        metaSmarter:
          'Dedicar 10 minutos diarios a un hobby creativo (dibujar, escribir, tocar un instrumento) por 3 semanas.',
        pasosAccion:
          'Elegir el hobby y el material; Bloquear el tiempo en el calendario; Compartir el resultado con una persona amiga para recibir feedback.'
      },
      
      // ============================================================
      // METAS ADICIONALES ESPECÍFICAS PARA EXPLORACIÓN (2°-3°)
      // ============================================================
      {
        id: 'EXP_OCP04_NEW',
        dimension: 'Ocupacional',
        categoria: 'carrera',
        metaSmarter:
          'Investigar 3 empresas donde me gustaría trabajar como practicante y crear una lista de contactos clave en LinkedIn en 3 semanas.',
        pasosAccion:
          'Identificar 3 empresas de mi interés; Buscar empleados actuales en LinkedIn; Enviar 5 solicitudes de conexión con mensaje personalizado; Crear carpeta de seguimiento con fechas de contacto.'
      },
      {
        id: 'EXP_OCP05_NEW',
        dimension: 'Ocupacional',
        categoria: 'carrera',
        metaSmarter:
          'Asistir a 2 eventos de networking estudiantil o profesional y hacer 3 conexiones nuevas en cada uno durante este semestre.',
        pasosAccion:
          'Buscar eventos en LinkedIn y redes estudiantiles; Preparar elevator pitch de 30 segundos; Llevar tarjetas de contacto o QR de LinkedIn; Seguir a las personas en redes sociales después del evento.'
      },
      {
        id: 'EXP_INT05_NEW',
        dimension: 'Intelectual',
        categoria: 'academico',
        metaSmarter:
          'Crear un portafolio digital básico con 3 proyectos académicos destacados y publicarlo en una plataforma gratuita en 4 semanas.',
        pasosAccion:
          'Seleccionar 3 mejores proyectos del semestre; Elegir plataforma (GitHub, Behance, Wix); Crear descripción de cada proyecto; Agregar enlace al portafolio en mi CV y LinkedIn.'
      },
      {
        id: 'EXP_INT06_NEW',
        dimension: 'Intelectual',
        categoria: 'academico',
        metaSmarter:
          'Completar un curso en línea gratuito relacionado con mi carrera y aplicar lo aprendido en un proyecto personal en 6 semanas.',
        pasosAccion:
          'Investigar cursos gratuitos en Coursera, edX o Khan Academy; Seleccionar uno de 4-6 semanas; Dedicar 2 horas semanales; Crear proyecto final aplicando conocimientos.'
      },
      {
        id: 'EXP_SOC03_NEW',
        dimension: 'Social',
        categoria: 'social',
        metaSmarter:
          'Organizar o co-organizar un evento estudiantil (charla, workshop, networking) con al menos 15 asistentes durante este semestre.',
        pasosAccion:
          'Identificar tema de interés para la comunidad estudiantil; Buscar co-organizadores; Solicitar espacio en campus; Promocionar en redes sociales y grupos estudiantiles; Evaluar feedback post-evento.'
      },
      {
        id: 'EXP_EMO04_NEW',
        dimension: 'Emocional',
        categoria: 'emocional',
        metaSmarter:
          'Establecer una rutina de autocuidado semanal que incluya al menos 2 actividades diferentes (ejercicio, lectura, socializar) por 5 semanas consecutivas.',
        pasosAccion:
          'Identificar 3 actividades de autocuidado que disfruto; Crear horario semanal fijo; Usar recordatorios en el teléfono; Registrar cumplimiento y cómo me siento después de cada actividad.'
      },
      {
        id: 'EXP_FIN04_NEW',
        dimension: 'Financiera',
        categoria: 'financiera',
        metaSmarter:
          'Investigar y comparar al menos 3 opciones de becas, créditos educativos o apoyos financieros disponibles para estudiantes en 3 semanas.',
        pasosAccion:
          'Revisar página de becas del Tec; Investigar opciones externas (gobierno, empresas); Comparar requisitos y beneficios; Crear calendario de fechas límite; Aplicar a al menos 1 opción viable.'
      }
    ]
  },
  {
    etapa: 'enfoque',
    titulo: 'Enfoque (4° a 6° Semestre)',
    descripcion:
      'Metas enfocadas en la profundización de habilidades técnicas, la definición de un camino vocacional claro, el networking y la gestión de la complejidad académica para el/la estudiante.',
    metas: [
      {
        id: 'ENF_OCP01',
        dimension: 'Ocupacional',
        categoria: 'carrera',
        metaSmarter:
          'Completar un curso de 10 horas en línea sobre una habilidad técnica (hard skill) clave para mi enfoque en 3 semanas.',
        pasosAccion:
          'Elegir el curso y empezar el primer módulo hoy; Dedicar 5 horas semanales de estudio; Aplicar el concepto principal aprendido en un proyecto personal.'
      },
      {
        id: 'ENF_OCP02',
        dimension: 'Ocupacional',
        categoria: 'carrera',
        metaSmarter:
          'Completar un proyecto personal utilizando 2 habilidades técnicas (hard skills) específicas de mi enfoque de carrera antes de que termine el parcial.',
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
          'Asistir a un webinar o masterclass de una persona líder de la industria y conectar con 2 asistentes en el siguiente mes.',
        pasosAccion:
          'Identificar un evento relevante esta semana; Registrarme y asistir a la sesión completa; Enviar un mensaje personalizado a 2 asistentes o al ponente/a por LinkedIn; Reflexionar sobre el aprendizaje clave.'
      },
      {
        id: 'ENF_OCP05_ORIG',
        dimension: 'Ocupacional',
        categoria: 'carrera',
        metaSmarter:
          'Definir 2 posibles áreas de especialización o concentración para mi carrera en 5 semanas.',
        pasosAccion:
          'Agendar cita con mi Director/a de Carrera esta semana; Investigar planes de estudio de posgrado; Platicar con 2 estudiantes de semestres más avanzados sobre sus intereses.'
      },
      {
        id: 'ENF_OCP06_ORIG',
        dimension: 'Ocupacional',
        categoria: 'carrera',
        metaSmarter: 'Crear un portafolio digital básico con 3 proyectos clave en 3 semanas.',
        pasosAccion:
          'Elegir una plataforma (Behance, GitHub) hoy; Documentar el primer proyecto esta semana; Solicitar feedback a un/a profesor/a o mentor/a.'
      },
      {
        id: 'ENF_INT01',
        dimension: 'Intelectual',
        categoria: 'academico',
        metaSmarter:
          'Leer un artículo de investigación o caso de estudio relacionado con mi área de enfoque cada semana por un mes y escribir un resumen de 5 líneas.',
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
        id: 'ENF_INT_NEW_SPECIAL',
        dimension: 'Intelectual',
        categoria: 'academico',
        metaSmarter:
          'Inscribirme en taller de Administración del tiempo de Mejoramiento Académico para mejorar mi rendimiento académico en 4 semanas.',
        pasosAccion:
          'Solicitar informes en Consejería Emocional (Centrales Sur, 4to piso); Inscribirme al taller; Implementar técnicas aprendidas; Registrar efectividad semanalmente; Adaptar método a mi rutina.'
      },
      // NUEVAS METAS ESPECÍFICAS - SERVICIO SOCIAL
      {
        id: 'ENF_SERV01',
        dimension: 'Social',
        categoria: 'social',
        metaSmarter: 'Completar todas las horas de servicio social requeridas antes del Semestre Tec en 12 semanas.',
        pasosAccion:
          'Revisar horas acumuladas en Mi Tec; Identificar horas faltantes; Seleccionar proyecto de servicio social; Dedicar tiempo semanal consistente; Documentar experiencia para CV.'
      },
      {
        id: 'ENF_SERV02',
        dimension: 'Social',
        categoria: 'social',
        metaSmarter: 'Participar en un proyecto de servicio social que se alinee con mi área de interés profesional durante 8 semanas.',
        pasosAccion:
          'Investigar proyectos disponibles; Seleccionar uno relacionado a mi carrera; Inscribirme y comprometerme; Aplicar conocimientos académicos; Documentar impacto y aprendizajes.'
      },
      // NUEVAS METAS ESPECÍFICAS - SEMESTRE TEC
      {
        id: 'ENF_TEC01',
        dimension: 'Ocupacional',
        categoria: 'carrera',
        metaSmarter: 'Explorar todas las opciones disponibles de Semestre Tec con mi Director/a de Programa y tener muy clara mi decisión en 6 semanas.',
        pasosAccion:
          'Agendar cita con Director/a de Programa; Revisar catálogo completo de opciones; Evaluar 4 categorías: investigación, internship, intercambio, concentración; Hacer lista de pros y contras; Definir top 3 opciones.'
      },
      {
        id: 'ENF_TEC02',
        dimension: 'Ocupacional',
        categoria: 'carrera',
        metaSmarter: 'Definir 3-5 opciones específicas de Semestre Tec que me interesen y preparar aplicaciones en 8 semanas.',
        pasosAccion:
          'Seleccionar 3-5 opciones específicas; Investigar requisitos de cada una; Preparar documentos necesarios; Contactar coordinadores/as; Iniciar proceso de aplicación.'
      },
      {
        id: 'ENF_TEC03',
        dimension: 'Ocupacional',
        categoria: 'carrera',
        metaSmarter: 'Conectar con 2 estudiantes que hayan realizado Semestre Tec en opciones que me interesan para conocer su experiencia en 4 semanas.',
        pasosAccion:
          'Buscar exalumnos/as en LinkedIn; Contactar a través de grupos estudiantiles; Preparar preguntas sobre su experiencia; Escuchar sobre retos y beneficios; Documentar insights para mi decisión.'
      },
      {
        id: 'ENF_SOC01',
        dimension: 'Social',
        categoria: 'social',
        metaSmarter:
          'Organizar o participar en una actividad social (ej. torneo, salida a comer) fuera del campus para 6 compañeros/as de mi grupo de enfoque en 3 semanas.',
        pasosAccion:
          'Proponer la idea en el grupo esta semana; Definir fecha y actividad; Enviar invitación y confirmar asistencia.'
      },
      {
        id: 'ENF_SOC02',
        dimension: 'Social',
        categoria: 'social',
        metaSmarter:
          'Participar como voluntario/a o líder en 1 proyecto de Servicio Social o de impacto social durante este periodo académico.',
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
          'Seleccionar primer libro esta semana; Establecer meta de 20 páginas diarias; Crear grupo de discusión con amistades; Escribir reflexiones después de cada libro.'
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
      'Metas orientadas a la culminación de estudios, el reclutamiento, la preparación para posgrado y la aplicación de conocimientos en proyectos de alto impacto para el/la estudiante.',
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
          'Aplicar a 15 vacantes de prácticas o trabajo de tiempo completo en 4 semanas.',
        pasosAccion:
          'Optimizar perfil LinkedIn; Personalizar CV por industria; Aplicar 4 posiciones semanales; Dar seguimiento cada 5 días.'
      },
      {
        id: 'ESP_OCP03_ORIG',
        dimension: 'Ocupacional',
        categoria: 'ocupacional',
        metaSmarter: 'Diseñar 1 proyecto de alto impacto para mi CV.',
        pasosAccion:
          'Identificar problema de industria; Crear propuesta de solución; Buscar la persona mentora para feedback; Presentar proyecto final.'
      },
      {
        id: 'ESP_OCP04_NEW',
        dimension: 'Ocupacional',
        categoria: 'ocupacional',
        metaSmarter:
          'Establecer una fecha de finalización y entregar el 95% del proyecto de titulación o Semestre Tec en el plazo de 8 semanas.',
        pasosAccion:
          'Revisar el cronograma oficial y establecer fechas límite internas; Reunirme con mi asesor/a semanalmente; Dedicar 10 horas semanales al proyecto; Entregar un borrador completo del 95%.'
      },
      {
        id: 'ESP_OCP05_ORIG',
        dimension: 'Ocupacional',
        categoria: 'ocupacional',
        metaSmarter:
          'Diseñar propuesta de Semestre Tec alineada a mi especialización y validarla en 3 semanas.',
        pasosAccion:
          'Investigar 3 opciones de concentración; Entrevistar a 2 exalumnos/as; Crear un plan de estudios preliminar; Validar con el/la coordinador/a.'
      },
      {
        id: 'ESP_OCP06_ORIG',
        dimension: 'Ocupacional',
        categoria: 'ocupacional',
        metaSmarter:
          'Preparar para reclutamiento de empresas top-tier en 8 semanas.',
        pasosAccion:
          'Practicar 10 problemas coding/cases; Agendar 5 mock interviews; Investigar cultura empresarial; Conectar con empleados/as LinkedIn.'
      },
      {
        id: 'ESP_INT01_ORIG',
        dimension: 'Intelectual',
        categoria: 'intelectual',
        metaSmarter:
          'Obtener puntaje alto en el examen TOEFL o IELTS para intercambio o posgrado en 6 semanas.',
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
          'Ser mentor/a voluntario/a para estudiantes de primeros semestres.',
        pasosAccion:
          'Contactar a mi mentor/a actual; Preguntar sobre oportunidades de mentoría (programa Peer, por ejemplo); Definir horas semanales para apoyo; Crear plan de acompañamiento.'
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
          "Identificar 3 oportunidades (ej. ayudar a un/a compañero/a, dejar nota positiva); Realizar el primer acto esta semana; Reflexionar por 1 minuto sobre cómo me sentí al hacerlo."
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
          'Investigar sobre 2 opciones de inversión para personas principiantes (ej. Cetes, fondos) y abrir una cuenta de inversión en 8 semanas.',
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
          'Revisar requisitos de Premio LiFE esta semana; Crear carpeta digital con evidencias; Documentar actividades de voluntariado/a; Recopilar cartas de recomendación; Redactar ensayo de aplicación.'
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
          "Identificar 3 oportunidades (ej. ayudar a un/a compañero/a, dejar nota positiva); Realizar el primer acto esta semana; Reflexionar por 1 minuto sobre cómo me sentí al hacerlo."
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
          'Investigar 3 empresas líderes en mi sector y sus procesos de reclutamiento.',
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
      },
      // NUEVAS METAS CURADAS - RECURSOS REALES DEL TEC
      {
        id: 'LON_OCP_NEW01',
        dimension: 'Ocupacional',
        categoria: 'carrera',
        metaSmarter: 'Acudir a una revisión con herramientas de IA de mi CV con el CVDP en las próximas 2 semanas.',
        pasosAccion:
          'Buscar las sesiones de "CV Estratégico 101" en Zoom del CVDP; Agendar mi cita virtual; Preparar mi CV actual; Aplicar las recomendaciones de IA recibidas.'
      },
      {
        id: 'LON_OCP_NEW02',
        dimension: 'Ocupacional',
        categoria: 'carrera',
        metaSmarter: 'Participar en 2 charlas o mentorías del Instituto de Emprendimiento del Tec durante este semestre.',
        pasosAccion:
          'Revisar la agenda en @emprendimiento.tec; Inscribirme a 2 eventos relevantes; Asistir y tomar notas; Conectar con al menos 1 persona en cada evento.'
      },
      {
        id: 'LON_OCP_NEW03',
        dimension: 'Ocupacional',
        categoria: 'carrera',
        metaSmarter: 'Hacer un plan para cumplir mi requisito de servicio social conociendo las opciones disponibles en 3 semanas.',
        pasosAccion:
          'Acercarme con un especialista del área @sscmty; Revisar las opciones disponibles; Elegir 2 opciones que me interesen; Crear un cronograma de aplicación.'
      },
      {
        id: 'LON_OCP_NEW04',
        dimension: 'Ocupacional',
        categoria: 'carrera',
        metaSmarter: 'Acudir a una asesoría virtual para ensayar entrevistas profesionales con el CVDP antes del próximo EmpleaTec.',
        pasosAccion:
          'Revisar las fechas de EmpleaTec; Agendar asesoría con 2 semanas de anticipación; Preparar 5 preguntas comunes de entrevista; Practicar con el asesor/a; Aplicar feedback en EmpleaTec.'
      },
      {
        id: 'LON_OCP_NEW05',
        dimension: 'Ocupacional',
        categoria: 'carrera',
        metaSmarter: 'Participar en una sesión informativa de On Campus Intern y aplicar a 3 posiciones antes del final del semestre.',
        pasosAccion:
          'Asistir a la sesión informativa; Revisar posiciones disponibles; Personalizar mi CV para cada aplicación; Enviar aplicaciones con seguimiento.'
      },
      {
        id: 'LON_OCP_NEW06',
        dimension: 'Ocupacional',
        categoria: 'carrera',
        metaSmarter: 'Participar en 3 prácticas de pitch del Instituto de Emprendimiento y desarrollar mi idea de negocio en 8 semanas.',
        pasosAccion:
          'Inscribirme a las sesiones de pitch practice; Desarrollar mi propuesta de valor; Practicar presentación 3 veces; Recibir feedback y mejorar; Presentar en convocatoria final.'
      },
      {
        id: 'LON_INT_NEW01',
        dimension: 'Intelectual',
        categoria: 'academico',
        metaSmarter: 'Agendar asesorías recurrentes con un/a estudiante MAE para subir mi promedio en 2 materias específicas durante 6 semanas.',
        pasosAccion:
          'Contactar MAEs disponibles en https://maes.mx; Seleccionar 2 materias con mayor dificultad; Establecer horario fijo semanal; Preparar dudas específicas para cada sesión; Evaluar progreso mensual.'
      },
      {
        id: 'LON_INT_NEW02',
        dimension: 'Intelectual',
        categoria: 'academico',
        metaSmarter: 'Completar 2 cursos de Coursera o EdX relevantes para mi carrera durante este semestre.',
        pasosAccion:
          'Revisar oferta en https://mooc.tec.mx/es/cursos-y-programas; Seleccionar cursos alineados a mi carrera; Dedicar 3 horas semanales; Completar certificaciones; Aplicar conocimientos en proyectos de clase.'
      },
      {
        id: 'LON_INT_NEW03',
        dimension: 'Intelectual',
        categoria: 'academico',
        metaSmarter: 'Acudir a sesiones informativas con Programas Internacionales y evaluar opciones de intercambio para el próximo año.',
        pasosAccion:
          'Asistir a sesión informativa de @picampusmty; Revisar en Mi Tec > Mi experiencia internacional; Evaluar opciones de intercambio en periodos intensivos; Crear plan de preparación académica y de idiomas.'
      },
      {
        id: 'LON_INT_NEW04',
        dimension: 'Intelectual',
        categoria: 'academico',
        metaSmarter: 'Realizar un Plan de Éxito Académico con mi Director/a de Programa en las próximas 3 semanas.',
        pasosAccion:
          'Agendar cita con mi Director/a de Programa; Preparar preguntas sobre mi trayectoria académica; Definir objetivos claros para el próximo año; Establecer métricas de seguimiento; Revisar progreso mensualmente.'
      },
      {
        id: 'LON_EMO_NEW01',
        dimension: 'Emocional',
        categoria: 'emocional',
        metaSmarter: 'Agendar una cita con Consejero Emocional en Centrales Sur, 4to piso, y asistir a 2 sesiones de seguimiento en 6 semanas.',
        pasosAccion:
          'Llamar para agendar cita inicial; Preparar temas de conversación; Asistir a primera sesión; Implementar recomendaciones; Agendar 2 sesiones de seguimiento.'
      },
      {
        id: 'LON_EMO_NEW02',
        dimension: 'Emocional',
        categoria: 'emocional',
        metaSmarter: 'Realizar el taller "Descubre Tu Fortaleza" y aplicar técnicas aprendidas durante 3 semanas.',
        pasosAccion:
          'Inscribirme al taller; Asistir a todas las sesiones; Identificar mis fortalezas principales; Practicar técnicas diariamente; Documentar mejoras en mi bienestar.'
      },
      {
        id: 'LON_EMO_NEW03',
        dimension: 'Emocional',
        categoria: 'emocional',
        metaSmarter: 'Participar en 2 talleres de Consejería Emocional que aborden mis necesidades específicas durante este semestre.',
        pasosAccion:
          'Revisar oferta de talleres en @consejeriatec_mty; Seleccionar 2 talleres relevantes; Inscribirme y asistir; Implementar estrategias aprendidas; Evaluar impacto en mi bienestar.'
      },
      {
        id: 'LON_EMO_NEW04',
        dimension: 'Emocional',
        categoria: 'emocional',
        metaSmarter: 'Unirme a un grupo de apoyo de Consejería Emocional y participar activamente por 8 semanas.',
        pasosAccion:
          'Revisar grupos disponibles (Amor propio, Cuidando mi corazón, etc.); Seleccionar el más relevante; Asistir a sesión de introducción; Participar activamente; Aplicar aprendizajes en mi vida diaria.'
      },
      {
        id: 'LON_EMO_NEW05',
        dimension: 'Emocional',
        categoria: 'emocional',
        metaSmarter: 'Realizar el taller de "Primeros Auxilios Psicológicos" y obtener certificación para apoyar a otros en crisis.',
        pasosAccion:
          'Inscribirme al taller; Completar todas las sesiones; Practicar técnicas con compañeros/as; Aprobar evaluación; Aplicar conocimientos en situaciones reales del campus.'
      },
      {
        id: 'LON_ESP_NEW01',
        dimension: 'Espiritual',
        categoria: 'espiritual',
        metaSmarter: 'Asistir a 3 eventos de Punto Blanco diferentes (meditación guiada, con música, cuencos) durante este semestre.',
        pasosAccion:
          'Revisar agenda de Punto Blanco; Seleccionar 3 tipos de eventos diferentes; Inscribirme y asistir; Practicar técnicas aprendidas en casa; Reflexionar sobre el impacto en mi bienestar.'
      },
      {
        id: 'LON_ESP_NEW02',
        dimension: 'Espiritual',
        categoria: 'espiritual',
        metaSmarter: 'Establecer una rutina semanal de mindfulness basada en técnicas aprendidas en Punto Blanco durante 8 semanas.',
        pasosAccion:
          'Asistir a diferentes eventos de Punto Blanco; Identificar técnica favorita; Establecer horario fijo semanal; Practicar consistentemente; Documentar cambios en mi perspectiva.'
      },
      {
        id: 'LON_SOC_NEW01',
        dimension: 'Social',
        categoria: 'social',
        metaSmarter: 'Asistir a 3 eventos de mi comunidad estudiantil y conectar con 2 personas nuevas en cada uno.',
        pasosAccion:
          'Revisar eventos de grupos estudiantiles en Instagram; Seleccionar 3 eventos de mi interés; Asistir y participar activamente; Intercambiar contactos con 2 personas; Mantener comunicación post-evento.'
      },
      {
        id: 'LON_SOC_NEW02',
        dimension: 'Social',
        categoria: 'social',
        metaSmarter: 'Unirme a 2 grupos estudiantiles diferentes y participar en al menos 1 actividad de cada uno durante el semestre.',
        pasosAccion:
          'Explorar grupos disponibles a través de sus Instagram; Seleccionar 2 grupos alineados a mis intereses; Asistir a reuniones de introducción; Participar en al menos 1 actividad; Contribuir con ideas y propuestas.'
      },
      {
        id: 'LON_SOC_NEW03',
        dimension: 'Social',
        categoria: 'social',
        metaSmarter: 'Organizar 1 evento o actividad para mi grupo estudiantil principal en las próximas 6 semanas.',
        pasosAccion:
          'Proponer idea al grupo estudiantil; Planificar logística y recursos; Coordinar con otros miembros; Ejecutar el evento; Evaluar resultados y feedback.'
      },
      {
        id: 'LON_FIS_NEW01',
        dimension: 'Física',
        categoria: 'fisica',
        metaSmarter: 'Agendar una consulta nutricional para cuidar mis hábitos alimenticios y crear un plan de menús dentro de mi presupuesto en 2 semanas.',
        pasosAccion:
          'Contactar servicios de nutrición del campus; Agendar consulta inicial; Evaluar mis hábitos actuales; Recibir plan de alimentación personalizado; Implementar cambios graduales; Seguimiento mensual.'
      },
      {
        id: 'LON_FIS_NEW02',
        dimension: 'Física',
        categoria: 'fisica',
        metaSmarter: 'Mejorar mi higiene de sueño siguiendo recomendaciones nutricionales y mantenerla por 4 semanas consecutivas.',
        pasosAccion:
          'Consultar sobre hábitos de sueño en consulta nutricional; Implementar rutina de sueño recomendada; Registrar calidad de sueño diariamente; Ajustar rutina según resultados; Mantener consistencia por 4 semanas.'
      },
      {
        id: 'LON_FIS_NEW03',
        dimension: 'Física',
        categoria: 'fisica',
        metaSmarter: 'Crear y mantener un plan de menús semanal saludable dentro de mi presupuesto durante 8 semanas.',
        pasosAccion:
          'Recibir asesoría nutricional sobre planificación de menús; Crear lista de compras semanal; Preparar comidas los domingos; Ajustar plan según presupuesto; Evaluar satisfacción y salud mensualmente.'
      }
    ]
  },
  {
    etapa: 'graduacion',
    titulo: 'Graduación (8° Semestre en adelante)',
    descripcion:
      'Metas orientadas a la culminación exitosa de estudios, transición al mercado laboral, y preparación para el futuro profesional.',
    metas: [
      {
        id: 'GRA_OCP01',
        dimension: 'Ocupacional',
        categoria: 'carrera',
        metaSmarter:
          'Completar exitosamente la defensa de tesis o proyecto final en el plazo establecido.',
        pasosAccion:
          'Revisar cronograma oficial; Establecer fechas límite internas; Reunirse semanalmente con asesor/a; Entregar borrador completo 2 semanas antes de la defensa.'
      },
      {
        id: 'GRA_OCP02',
        dimension: 'Ocupacional',
        categoria: 'carrera',
        metaSmarter:
          'Aplicar exitosamente a 10 posiciones laborales relevantes en 6 semanas.',
        pasosAccion:
          'Optimizar CV y perfil LinkedIn; Personalizar cartas de presentación; Aplicar a 2 posiciones por semana; Dar seguimiento cada 5 días.'
      },
      {
        id: 'GRA_OCP03',
        dimension: 'Ocupacional',
        categoria: 'carrera',
        metaSmarter:
          'Establecer red profesional de 20 contactos relevantes en la industria antes de graduarse.',
        pasosAccion:
          'Identificar profesionales clave; Conectar en LinkedIn; Asistir a 3 eventos de networking; Mantener comunicación regular.'
      },
      {
        id: 'GRA_INT01',
        dimension: 'Intelectual',
        categoria: 'academico',
        metaSmarter:
          'Completar certificación profesional relevante para la industria en 8 semanas.',
        pasosAccion:
          'Identificar certificación clave; Inscribirse al programa; Dedicar 5 horas semanales; Completar examen final.'
      },
      {
        id: 'GRA_FIN01',
        dimension: 'Financiera',
        categoria: 'financiera',
        metaSmarter:
          'Crear plan financiero post-graduación con presupuesto de 6 meses en 4 semanas.',
        pasosAccion:
          'Calcular gastos mensuales; Establecer fondo de emergencia; Investigar opciones de inversión; Crear plan de ahorro.'
      },
      {
        id: 'GRA_EMO01',
        dimension: 'Emocional',
        categoria: 'emocional',
        metaSmarter:
          'Desarrollar estrategias de manejo de estrés para la transición profesional en 6 semanas.',
        pasosAccion:
          'Identificar fuentes de estrés; Aprender técnicas de relajación; Practicar mindfulness diario; Crear rutina de autocuidado.'
      }
    ]
  }
]);

export const curatedGoalStages = metasCuradasData;

export function buildCuratedGoalBank(
  stages: CuratedGoalStage[] = metasCuradasData
): CuratedGoalBank {
  return stages.reduce<CuratedGoalBank>((acc, stage) => {
    const { etapa, ...rest } = stage;
    if (etapa !== 'graduacion') {
      acc[etapa as keyof CuratedGoalBank] = rest;
    }
    return acc;
  }, {} as CuratedGoalBank);
}

export function buildCuratedGoalBankExtended(
  stages: CuratedGoalStage[] = metasCuradasData
): CuratedGoalBankExtended {
  return stages.reduce<CuratedGoalBankExtended>((acc, stage) => {
    const { etapa, ...rest } = stage;
    if (etapa === 'longitudinal') {
      // Mapear longitudinal a graduacion para el sistema extendido
      acc['graduacion'] = rest;
    } else {
      acc[etapa as keyof CuratedGoalBankExtended] = rest;
    }
    return acc;
  }, {} as CuratedGoalBankExtended);
}

export const curatedGoalBank = buildCuratedGoalBank();
export const curatedGoalBankExtended = buildCuratedGoalBankExtended();
