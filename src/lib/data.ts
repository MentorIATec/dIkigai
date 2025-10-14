import type { User, Goal, GoalTemplate, Semester } from './types';

export const mockUser: User = {
  id: 'user-1',
  name: 'Ana Pérez',
  email: 'ana.perez@example.com',
  avatarUrl: 'https://picsum.photos/seed/avatar1/40/40',
};

export const semesters: Semester[] = [
  'Semestre 2024-1',
  'Semestre 2024-2',
  'Semestre 2025-1',
  'Semestre 2025-2',
];

export const goalTemplates: GoalTemplate[] = [
  // ============================================================
  // PLANTILLAS INTELECTUALES
  // ============================================================
  {
    id: 'template-int-1',
    title: 'Mejorar Calificación en [Materia]',
    description: 'Establecer un plan de estudio para mejorar la calificación final en una materia específica.',
    category: 'Intelectual',
    smarterSuggestion: {
      specific: 'Obtener una calificación de A en [Materia].',
      measurable: 'Asistir a todas las clases, completar todas las tareas a tiempo, y estudiar 2 horas diarias.',
      achievable: 'Buscar tutorías y formar un grupo de estudio.',
      relevant: 'Esta materia es fundamental para mi carrera.',
    },
  },
  {
    id: 'template-int-2',
    title: 'Aprender Nueva Habilidad Técnica',
    description: 'Adquirir conocimientos en una nueva tecnología o software relevante para mi campo.',
    category: 'Intelectual',
    smarterSuggestion: {
      specific: 'Completar un curso en línea de [Tecnología] y desarrollar un proyecto básico.',
      measurable: 'Dedicar 5 horas semanales al curso y finalizar el proyecto en 2 meses.',
      achievable: 'Usar recursos gratuitos en línea y practicar diariamente.',
      relevant: 'Esta habilidad es demandada en mi campo profesional.',
      timeBound: new Date(new Date().setMonth(new Date().getMonth() + 2)),
    },
  },
  {
    id: 'template-int-3',
    title: 'Desarrollar Hábitos de Estudio Efectivos',
    description: 'Establecer rutinas de estudio consistentes y productivas.',
    category: 'Intelectual',
    smarterSuggestion: {
      specific: 'Implementar una rutina de estudio de 2 horas diarias, 5 días a la semana.',
      measurable: 'Registrar sesiones de estudio y completar todas las tareas asignadas.',
      achievable: 'Usar técnicas como Pomodoro y espacios de estudio específicos.',
      relevant: 'Mejorar mi rendimiento académico y reducir el estrés.',
      timeBound: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    },
  },

  // ============================================================
  // PLANTILLAS OCUPACIONALES
  // ============================================================
  {
    id: 'template-ocp-1',
    title: 'Obtener Experiencia Profesional',
    description: 'Conseguir una pasantía o trabajo de medio tiempo relacionado con mi carrera.',
    category: 'Ocupacional',
    smarterSuggestion: {
      specific: 'Aplicar a 10 vacantes de pasantía en empresas relacionadas con [mi carrera].',
      measurable: 'Enviar 2 aplicaciones por semana y recibir al menos 3 entrevistas.',
      achievable: 'Optimizar mi CV, crear perfil en LinkedIn, y preparar portfolio.',
      relevant: 'Ganar experiencia práctica y construir red profesional.',
      timeBound: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    },
  },
  {
    id: 'template-ocp-2',
    title: 'Desarrollar Proyecto Profesional',
    description: 'Crear un proyecto que demuestre mis habilidades y conocimientos.',
    category: 'Ocupacional',
    smarterSuggestion: {
      specific: 'Desarrollar un [tipo de proyecto] que resuelva un problema real en [industria].',
      measurable: 'Completar el proyecto con documentación completa y presentación.',
      achievable: 'Usar tecnologías que conozco y dedicar 5 horas semanales.',
      relevant: 'Mejorar mi portafolio y demostrar competencias a empleadores.',
      timeBound: new Date(new Date().setMonth(new Date().getMonth() + 4)),
    },
  },

  // ============================================================
  // PLANTILLAS SOCIALES
  // ============================================================
  {
    id: 'template-soc-1',
    title: 'Participar en Actividades Extracurriculares',
    description: 'Involucrarse en clubes u organizaciones estudiantiles para desarrollar habilidades de liderazgo.',
    category: 'Social',
    smarterSuggestion: {
      specific: 'Unirme a [Club Estudiantil] y participar activamente en sus reuniones y eventos.',
      measurable: 'Asistir al 80% de las reuniones y voluntariar en un evento por semestre.',
      achievable: 'Elegir un club que se alinee con mis intereses y horario.',
      relevant: 'Desarrollar habilidades de liderazgo y construir red social.',
      timeBound: new Date(new Date().setMonth(new Date().getMonth() + 6)),
    },
  },
  {
    id: 'template-soc-2',
    title: 'Mejorar Habilidades de Comunicación',
    description: 'Desarrollar habilidades de presentación y comunicación efectiva.',
    category: 'Social',
    smarterSuggestion: {
      specific: 'Dar 3 presentaciones en clase y participar en un debate estudiantil.',
      measurable: 'Recibir retroalimentación positiva de profesores y compañeros.',
      achievable: 'Practicar con amigos y usar técnicas de respiración para nervios.',
      relevant: 'Las habilidades de comunicación son esenciales en mi carrera.',
      timeBound: new Date(new Date().setMonth(new Date().getMonth() + 2)),
    },
  },

  // ============================================================
  // PLANTILLAS FÍSICAS
  // ============================================================
  {
    id: 'template-fis-1',
    title: 'Establecer Rutina de Ejercicio',
    description: 'Crear y mantener una rutina de actividad física regular.',
    category: 'Física',
    smarterSuggestion: {
      specific: 'Ejercitarme 30 minutos, 3 veces por semana durante todo el semestre.',
      measurable: 'Registrar cada sesión de ejercicio y mantener un calendario.',
      achievable: 'Elegir actividades que disfrute y que se ajusten a mi horario.',
      relevant: 'Mantener buena salud física y mental para el rendimiento académico.',
      timeBound: new Date(new Date().setMonth(new Date().getMonth() + 4)),
    },
  },
  {
    id: 'template-fis-2',
    title: 'Mejorar Hábitos de Sueño',
    description: 'Establecer una rutina de sueño saludable y consistente.',
    category: 'Física',
    smarterSuggestion: {
      specific: 'Dormir 7-8 horas por noche y mantener horarios consistentes.',
      measurable: 'Registrar horas de sueño y sentirme descansado al despertar.',
      achievable: 'Crear rutina antes de dormir y evitar pantallas 1 hora antes.',
      relevant: 'El sueño adecuado mejora mi concentración y rendimiento académico.',
      timeBound: new Date(new Date().setMonth(new Date().getMonth() + 2)),
    },
  },

  // ============================================================
  // PLANTILLAS EMOCIONALES
  // ============================================================
  {
    id: 'template-emo-1',
    title: 'Gestionar Estrés Académico',
    description: 'Desarrollar estrategias efectivas para manejar el estrés universitario.',
    category: 'Emocional',
    smarterSuggestion: {
      specific: 'Implementar 3 técnicas de manejo de estrés: meditación, respiración profunda y organización.',
      measurable: 'Practicar técnicas diariamente y notar reducción en niveles de estrés.',
      achievable: 'Usar apps de meditación y dedicar 10 minutos diarios.',
      relevant: 'El manejo del estrés es crucial para mi bienestar y rendimiento.',
      timeBound: new Date(new Date().setMonth(new Date().getMonth() + 2)),
    },
  },
  {
    id: 'template-emo-2',
    title: 'Desarrollar Inteligencia Emocional',
    description: 'Mejorar la autoconciencia y habilidades de relación interpersonal.',
    category: 'Emocional',
    smarterSuggestion: {
      specific: 'Practicar autoconciencia emocional y empatía en mis interacciones diarias.',
      measurable: 'Reflexionar sobre mis emociones diariamente y recibir feedback de otros.',
      achievable: 'Mantener un diario emocional y practicar escucha activa.',
      relevant: 'La inteligencia emocional es clave para el éxito profesional y personal.',
      timeBound: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    },
  },

  // ============================================================
  // PLANTILLAS FINANCIERAS
  // ============================================================
  {
    id: 'template-fin-1',
    title: 'Crear Presupuesto Estudiantil',
    description: 'Establecer y mantener un presupuesto personal durante el semestre.',
    category: 'Financiera',
    smarterSuggestion: {
      specific: 'Crear un presupuesto mensual que incluya ingresos, gastos fijos y variables.',
      measurable: 'Registrar todos los gastos y mantener un balance positivo mensual.',
      achievable: 'Usar apps de presupuesto y revisar gastos semanalmente.',
      relevant: 'Aprender a manejar finanzas personales es esencial para la independencia.',
      timeBound: new Date(new Date().setMonth(new Date().getMonth() + 4)),
    },
  },
  {
    id: 'template-fin-2',
    title: 'Buscar Oportunidades de Ahorro',
    description: 'Identificar y aprovechar oportunidades para ahorrar dinero como estudiante.',
    category: 'Financiera',
    smarterSuggestion: {
      specific: 'Identificar 5 formas de ahorrar dinero y ahorrar $200 este semestre.',
      measurable: 'Implementar estrategias de ahorro y registrar ahorros mensuales.',
      achievable: 'Usar descuentos estudiantiles, cocinar en casa, y compartir gastos.',
      relevant: 'Desarrollar hábitos financieros saludables desde temprano.',
      timeBound: new Date(new Date().setMonth(new Date().getMonth() + 4)),
    },
  },

  // ============================================================
  // PLANTILLAS ESPIRITUALES
  // ============================================================
  {
    id: 'template-esp-1',
    title: 'Practicar Reflexión Personal',
    description: 'Dedicar tiempo regular a la reflexión sobre valores y propósito personal.',
    category: 'Espiritual',
    smarterSuggestion: {
      specific: 'Reflexionar sobre mis valores y propósito 15 minutos cada domingo.',
      measurable: 'Mantener un diario de reflexión con al menos una entrada semanal.',
      achievable: 'Crear un espacio tranquilo y usar preguntas guía para la reflexión.',
      relevant: 'La reflexión personal me ayuda a mantener claridad sobre mis objetivos.',
      timeBound: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    },
  },
  {
    id: 'template-esp-2',
    title: 'Desarrollar Gratitud',
    description: 'Cultivar una práctica regular de gratitud y apreciación.',
    category: 'Espiritual',
    smarterSuggestion: {
      specific: 'Escribir 3 cosas por las que estoy agradecido cada día durante 30 días.',
      measurable: 'Mantener un diario de gratitud con 90 entradas al final del período.',
      achievable: 'Establecer un horario fijo y usar recordatorios en mi teléfono.',
      relevant: 'La gratitud mejora mi bienestar mental y perspectiva positiva.',
      timeBound: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    },
  },
];

export const goals: Goal[] = [
  {
    id: 'goal-1',
    userId: 'user-1',
    title: 'Mejorar Calificación en Cálculo II',
    semester: 'Semestre 2024-1',
    smarter: {
      specific: 'Obtener una calificación final de B+ o superior en Cálculo II.',
      measurable: 'Completar el 100% de las tareas y obtener al menos 85% en los exámenes parciales.',
      achievable: 'Asistir a las horas de consulta del profesor dos veces al mes.',
      relevant: 'Es un pre-requisito clave para materias avanzadas de mi carrera.',
      timeBound: new Date('2024-06-15'),
      evaluated: 'Revisar calificaciones después de cada examen parcial.',
      readjusted: 'Si el primer parcial es bajo, aumentar las sesiones de estudio a 3 por semana.',
    },
    progress: 75,
    status: 'en-progreso',
    createdAt: new Date('2024-02-10'),
  },
  {
    id: 'goal-2',
    userId: 'user-1',
    title: 'Completar curso de Python para Ciencia de Datos',
    semester: 'Semestre 2024-1',
    smarter: {
      specific: 'Finalizar el curso "Python for Data Science" en Coursera.',
      measurable: 'Completar un módulo por semana.',
      achievable: 'Dedicar 4 horas cada fin de semana.',
      relevant: 'Me abrirá oportunidades de prácticas en análisis de datos.',
      timeBound: new Date('2024-05-20'),
      evaluated: 'Al final de cada módulo, realizar el quiz de evaluación.',
      readjusted: 'N/A',
    },
    progress: 100,
    status: 'completada',
    createdAt: new Date('2024-02-15'),
  },
  {
    id: 'goal-3',
    userId: 'user-1',
    title: 'Postular a una pasantía de verano',
    semester: 'Semestre 2024-2',
    smarter: {
      specific: 'Enviar al menos 10 postulaciones a pasantías de verano en mi área.',
      measurable: 'Postular a 2 empresas por semana.',
      achievable: 'Tener mi CV y carta de presentación listos para el inicio del semestre.',
      relevant: 'La experiencia laboral es crucial para mi futuro profesional.',
      timeBound: new Date('2024-10-30'),
      evaluated: 'Hacer seguimiento de las respuestas y ajustar mi CV si es necesario.',
      readjusted: 'N/A',
    },
    progress: 10,
    status: 'sin-empezar',
    createdAt: new Date('2024-08-01'),
  },
   {
    id: 'goal-4',
    userId: 'user-2', // Other user for admin view
    title: 'Aprender Francés Básico',
    semester: 'Semestre 2024-1',
    smarter: {
      specific: 'Alcanzar el nivel A1 de francés.',
      measurable: 'Usar Duolingo 15 minutos al día y asistir a un grupo de conversación semanal.',
      achievable: 'Es un objetivo realista para un semestre.',
      relevant: 'Quiero hacer un intercambio a Francia el próximo año.',
      timeBound: new Date('2024-06-01'),
      evaluated: 'Tomar un examen de práctica A1 al final del semestre.',
      readjusted: 'N/A',
    },
    progress: 40,
    status: 'en-progreso',
    createdAt: new Date('2024-02-20'),
  },
];
