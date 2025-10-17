/**
 * APPS SCRIPT PARA WEB APP - PROTOTIPO IBI CON RECOMENDACIONES
 * 
 * Funcionalidad:
 * - Servir la web app HTML
 * - Procesar selecciones de dimensiones
 * - Generar recomendaciones personalizadas
 * - Guardar resultados en Google Sheets
 * - Integrar con base de datos de metas del proyecto
 */

// Configuración
const FORM_RESPONSES_SHEET = 'Respuestas Web App';
const DASHBOARD_SHEET = 'Dashboard Resultados';
const ANALYSIS_SHEET = 'Análisis por Dimensiones';
const GOALS_SHEET = 'Base de Datos Metas';

// Dimensiones disponibles
const DIMENSIONS = {
  'Intelectual': {
    emoji: '🧠',
    description: 'Desarrollo académico y habilidades de estudio',
    color: '#4285f4'
  },
  'Ocupacional': {
    emoji: '💼',
    description: 'Claridad vocacional y preparación profesional',
    color: '#34a853'
  },
  'Emocional': {
    emoji: '❤️',
    description: 'Bienestar emocional y adaptación universitaria',
    color: '#ea4335'
  },
  'Social': {
    emoji: '👥',
    description: 'Relaciones interpersonales y vida social',
    color: '#fbbc04'
  },
  'Física': {
    emoji: '💪',
    description: 'Salud física y bienestar corporal',
    color: '#ff6d01'
  },
  'Espiritual': {
    emoji: '🙏',
    description: 'Propósito de vida y valores personales',
    color: '#9c27b0'
  },
  'Financiera': {
    emoji: '💰',
    description: 'Gestión de recursos económicos y planificación financiera',
    color: '#00bcd4'
  }
};

// Base de datos de metas específicas para estudiantes de primer semestre
const GOALS_DATABASE = {
  'Intelectual': [
    {
      id: 'PRIM_INT01',
      title: 'Establecer rutina de estudio efectiva',
      description: 'Crear un horario de estudio que incluya técnicas de aprendizaje activo y espacios de concentración para adaptarte al ritmo universitario.',
      steps: 'Identificar horarios de mayor productividad, crear espacios de estudio libres de distracciones, implementar técnica Pomodoro (25 min estudio + 5 min descanso), revisar y ajustar semanalmente.',
      priority: 'high',
      categoria: 'habitos_estudio',
      tips: '💡 Tip: Los primeros 3 meses son clave para establecer hábitos sólidos. Sé consistente aunque sea difícil al inicio.',
      mentorCommitment: 'Te acompañaré con recordatorios semanales y tips personalizados para mantener tu rutina.'
    },
    {
      id: 'PRIM_INT02',
      title: 'Dominar técnicas de lectura universitaria',
      description: 'Desarrollar habilidades de lectura crítica y análisis para textos académicos más complejos que en preparatoria.',
      steps: 'Practicar lectura activa con subrayado estratégico, crear mapas conceptuales, participar en discusiones de clase, aplicar técnicas de síntesis y resumen.',
      priority: 'high',
      categoria: 'habitos_estudio',
      tips: '📚 Tip: La lectura universitaria es diferente. No necesitas memorizar todo, sino entender conceptos clave y conexiones.',
      mentorCommitment: 'Te compartiré recursos de técnicas de lectura y te ayudaré a practicar con textos reales de tu carrera.'
    },
    {
      id: 'PRIM_INT03',
      title: 'Aprender un nuevo idioma o mejorar el inglés',
      description: 'Desarrollar competencias en un segundo idioma para ampliar oportunidades académicas y profesionales.',
      steps: 'Inscribirse a cursos de idiomas del TEC, practicar 30 minutos diarios con apps, ver series en el idioma objetivo, buscar intercambios de conversación.',
      priority: 'medium',
      categoria: 'desarrollo_academico',
      tips: '🌍 Tip: El dominio de idiomas abre puertas a intercambios, becas y mejores oportunidades laborales.',
      mentorCommitment: 'Te conectaré con recursos de idiomas del TEC y te ayudaré a encontrar compañeros de práctica.'
    },
    {
      id: 'PRIM_INT04',
      title: 'Desarrollar pensamiento crítico y análisis',
      description: 'Fortalecer habilidades de análisis, evaluación y síntesis de información para el éxito académico.',
      steps: 'Participar activamente en debates de clase, cuestionar información y fuentes, practicar análisis de casos, desarrollar argumentos fundamentados.',
      priority: 'medium',
      categoria: 'desarrollo_academico',
      tips: '🧠 Tip: El pensamiento crítico se desarrolla con práctica. No tengas miedo de hacer preguntas en clase.',
      mentorCommitment: 'Te guiaré en ejercicios de pensamiento crítico y te ayudaré a desarrollar argumentos sólidos.'
    }
  ],
  'Ocupacional': [
    {
      id: 'PRIM_OCC01',
      title: 'Explorar opciones de carrera y especialización',
      description: 'Investigar diferentes trayectorias profesionales y especializaciones dentro de tu área de estudio para tomar decisiones informadas.',
      steps: 'Entrevistar a 3 profesionales del área, investigar perfiles de egreso en Mi Tec, asistir a charlas de carrera, crear mapa de opciones profesionales, explorar especializaciones disponibles.',
      priority: 'high',
      categoria: 'claridad_vocacional',
      tips: '🎯 Tip: No necesitas decidir todo ahora, pero sí explorar para tomar mejores decisiones en 2° y 3° semestre.',
      mentorCommitment: 'Te conectaré con profesionales de tu área y te ayudaré a organizar entrevistas informativas.'
    },
    {
      id: 'PRIM_OCC02',
      title: 'Buscar mentoría académica y profesional',
      description: 'Encontrar mentores que te guíen en tu desarrollo académico y profesional durante la universidad.',
      steps: 'Identificar profesores inspiradores, buscar programas de mentoría del TEC, conectar con exalumnos, establecer relaciones con profesionales del área.',
      priority: 'high',
      categoria: 'mentoria',
      tips: '🤝 Tip: Un buen mentor puede acelerar tu crecimiento y abrirte puertas. No tengas miedo de pedir ayuda.',
      mentorCommitment: 'Te ayudaré a identificar mentores potenciales y te guiaré en cómo establecer estas relaciones.'
    },
    {
      id: 'PRIM_OCC03',
      title: 'Desarrollar perfil profesional básico',
      description: 'Crear una presencia profesional inicial en redes sociales y plataformas de networking.',
      steps: 'Crear perfil básico en LinkedIn, definir objetivos profesionales, participar en eventos de networking del TEC, desarrollar elevator pitch personal.',
      priority: 'medium',
      categoria: 'desarrollo_profesional',
      tips: '💼 Tip: Es mejor empezar temprano con tu presencia profesional. Los empleadores buscan candidatos con perfil completo.',
      mentorCommitment: 'Te ayudaré a crear un perfil profesional atractivo y te daré feedback sobre tu elevator pitch.'
    },
    {
      id: 'PRIM_OCC04',
      title: 'Identificar habilidades transferibles y gaps',
      description: 'Reconocer tus fortalezas actuales e identificar áreas de desarrollo para el éxito profesional.',
      steps: 'Hacer inventario de habilidades actuales, identificar gaps de conocimiento, buscar oportunidades de desarrollo, practicar habilidades en proyectos académicos.',
      priority: 'medium',
      categoria: 'desarrollo_profesional',
      tips: '🔍 Tip: La autoconciencia sobre tus habilidades es clave para el desarrollo profesional. Sé honesto contigo mismo.',
      mentorCommitment: 'Te ayudaré a hacer un análisis honesto de tus habilidades y crear un plan de desarrollo personalizado.'
    }
  ],
  'Emocional': [
    {
      id: 'PRIM_EMO01',
      title: 'Manejar el estrés y la ansiedad universitaria',
      description: 'Desarrollar estrategias efectivas para gestionar el estrés académico y la ansiedad que puede generar la vida universitaria.',
      steps: 'Identificar fuentes de estrés, practicar técnicas de respiración y relajación, establecer rutinas de autocuidado, buscar apoyo en consejería estudiantil cuando sea necesario.',
      priority: 'high',
      categoria: 'gestion_estres',
      tips: '😌 Tip: El estrés es normal en la universidad. Lo importante es tener herramientas para manejarlo de manera saludable.',
      mentorCommitment: 'Te compartiré técnicas de manejo de estrés y estaré disponible para escucharte cuando lo necesites.'
    },
    {
      id: 'PRIM_EMO02',
      title: 'Adaptarse emocionalmente a la vida universitaria',
      description: 'Procesar los cambios emocionales que conlleva la transición de preparatoria a universidad, especialmente si eres foráneo.',
      steps: 'Reconocer y validar emociones de cambio, mantener contacto regular con familia, crear nuevas rutinas, buscar espacios de pertenencia en el campus.',
      priority: 'high',
      categoria: 'adaptacion_emocional',
      tips: '🏠 Tip: Es normal extrañar casa y sentirse abrumado. La adaptación toma tiempo, sé paciente contigo mismo.',
      mentorCommitment: 'Te acompañaré en el proceso de adaptación y te ayudaré a crear estrategias para sentirte más cómodo en el campus.'
    },
    {
      id: 'PRIM_EMO03',
      title: 'Desarrollar inteligencia emocional y autoconocimiento',
      description: 'Mejorar la capacidad de reconocer, entender y gestionar las propias emociones en el contexto universitario.',
      steps: 'Practicar autoconciencia emocional diaria, desarrollar empatía con compañeros, mejorar comunicación asertiva, gestionar conflictos constructivamente.',
      priority: 'medium',
      categoria: 'desarrollo_emocional',
      tips: '💭 Tip: La inteligencia emocional es tan importante como la académica. Te ayudará en todas las áreas de tu vida.',
      mentorCommitment: 'Te guiaré en ejercicios de autoconocimiento y te ayudaré a desarrollar habilidades emocionales.'
    },
    {
      id: 'PRIM_EMO04',
      title: 'Construir resiliencia y mentalidad de crecimiento',
      description: 'Desarrollar capacidad para recuperarse de desafíos académicos y mantener motivación a largo plazo.',
      steps: 'Aprender de errores y fracasos, mantener perspectiva positiva, buscar apoyo cuando sea necesario, celebrar pequeños logros, practicar gratitud.',
      priority: 'medium',
      categoria: 'resiliencia',
      tips: '🌱 Tip: La resiliencia se construye con práctica. Cada desafío superado te hace más fuerte.',
      mentorCommitment: 'Te ayudaré a desarrollar una mentalidad de crecimiento y te recordaré tus logros cuando te sientas desanimado.'
    }
  ],
  'Social': [
    {
      id: 'PRIM_SOC01',
      title: 'Conocer gente nueva y hacer amigos',
      description: 'Establecer nuevas amistades y relaciones significativas en el campus, especialmente importante si eres foráneo.',
      steps: 'Participar en actividades de integración, unirse a clubes estudiantiles, asistir a eventos sociales del campus, ser proactivo en conocer compañeros de clase.',
      priority: 'high',
      categoria: 'integracion_social',
      tips: '👥 Tip: Todos están en la misma situación. No tengas miedo de iniciar conversaciones y ser tú mismo.',
      mentorCommitment: 'Te ayudaré a identificar actividades sociales que coincidan con tus intereses y te acompañaré en el proceso de integración.'
    },
    {
      id: 'PRIM_SOC02',
      title: 'Unirse a un grupo estudiantil o club',
      description: 'Participar activamente en una organización estudiantil que coincida con tus intereses y valores.',
      steps: 'Explorar clubes y organizaciones disponibles, asistir a reuniones informativas, elegir 1-2 grupos que te interesen, participar activamente en actividades.',
      priority: 'high',
      categoria: 'participacion_estudiantil',
      tips: '🎯 Tip: Los grupos estudiantiles son excelentes para hacer amigos, desarrollar liderazgo y enriquecer tu experiencia universitaria.',
      mentorCommitment: 'Te ayudaré a encontrar grupos que coincidan con tus intereses y te guiaré en cómo participar efectivamente.'
    },
    {
      id: 'PRIM_SOC03',
      title: 'Mantener conexión con familia y amigos de casa',
      description: 'Equilibrar nuevas relaciones universitarias con el mantenimiento de vínculos importantes de casa.',
      steps: 'Establecer horarios regulares para llamar a familia, planificar visitas a casa, mantener contacto con amigos de preparatoria, crear nuevos rituales de conexión.',
      priority: 'medium',
      categoria: 'mantenimiento_relaciones',
      tips: '💙 Tip: Es importante mantener tus raíces mientras construyes nuevas relaciones. El equilibrio es clave.',
      mentorCommitment: 'Te ayudaré a encontrar el equilibrio entre nuevas y viejas relaciones, y te apoyaré en momentos de nostalgia.'
    },
    {
      id: 'PRIM_SOC04',
      title: 'Desarrollar habilidades de comunicación y networking',
      description: 'Mejorar la capacidad de expresarse efectivamente y construir relaciones profesionales.',
      steps: 'Practicar presentaciones orales, participar en debates de clase, mejorar comunicación escrita, desarrollar escucha activa, practicar networking en eventos.',
      priority: 'medium',
      categoria: 'desarrollo_social',
      tips: '🗣️ Tip: Las habilidades de comunicación son fundamentales para el éxito académico y profesional. Practica regularmente.',
      mentorCommitment: 'Te daré oportunidades para practicar comunicación y te ayudaré a desarrollar confianza en situaciones sociales.'
    }
  ],
  'Física': [
    {
      id: 'PRIM_FIS01',
      title: 'Establecer rutina de ejercicio y actividad física',
      description: 'Crear hábitos de actividad física que promuevan la salud, reduzcan el estrés y mejoren el rendimiento académico.',
      steps: 'Encontrar actividad física que disfrutes (gimnasio, deportes, yoga, caminar), establecer horarios fijos 3-4 veces por semana, comenzar gradualmente, monitorear progreso y energía.',
      priority: 'high',
      categoria: 'ejercicio_fisico',
      tips: '💪 Tip: El ejercicio no solo es bueno para tu cuerpo, también mejora tu concentración, reduce estrés y te da más energía para estudiar.',
      mentorCommitment: 'Te ayudaré a encontrar actividades físicas que se adapten a tu horario y te motivaré a mantener la consistencia.'
    },
    {
      id: 'PRIM_FIS02',
      title: 'Optimizar hábitos de sueño y descanso',
      description: 'Mejorar la calidad y cantidad de sueño para optimizar el rendimiento académico y la salud general.',
      steps: 'Establecer horario de sueño consistente (7-8 horas), crear rutina pre-sueño relajante, optimizar ambiente de dormitorio, limitar pantallas 1 hora antes de dormir.',
      priority: 'high',
      categoria: 'descanso_sueño',
      tips: '😴 Tip: El sueño es fundamental para la memoria y el aprendizaje. Un buen descanso mejora significativamente tu rendimiento académico.',
      mentorCommitment: 'Te ayudaré a crear una rutina de sueño saludable y te recordaré la importancia del descanso para tu éxito académico.'
    },
    {
      id: 'PRIM_FIS03',
      title: 'Mantener alimentación balanceada y saludable',
      description: 'Desarrollar hábitos alimenticios saludables que apoyen el rendimiento académico y la salud física.',
      steps: 'Planificar comidas semanalmente, incluir frutas y verduras en cada comida, mantenerse hidratado (8 vasos de agua), evitar excesos de cafeína y comida chatarra.',
      priority: 'medium',
      categoria: 'alimentacion_saludable',
      tips: '🥗 Tip: Una buena alimentación es combustible para tu cerebro. Comer bien te ayuda a concentrarte mejor y tener más energía.',
      mentorCommitment: 'Te compartiré tips de alimentación saludable para estudiantes y te ayudaré a planificar comidas nutritivas.'
    },
    {
      id: 'PRIM_FIS04',
      title: 'Gestionar energía y evitar el agotamiento',
      description: 'Aprender a balancear actividades académicas, sociales y personales para mantener niveles óptimos de energía.',
      steps: 'Identificar patrones de energía personal, programar actividades exigentes en horarios de mayor energía, incluir descansos regulares, aprender a decir no cuando sea necesario.',
      priority: 'medium',
      categoria: 'gestion_energia',
      tips: '⚡ Tip: La gestión de energía es más importante que la gestión de tiempo. Aprende a trabajar con tus ritmos naturales.',
      mentorCommitment: 'Te ayudaré a identificar tus patrones de energía y crear un horario que maximice tu productividad y bienestar.'
    }
  ],
  'Espiritual': [
    {
      id: 'PRIM_ESP01',
      title: 'Desarrollar práctica de meditación y mindfulness',
      description: 'Cultivar una práctica regular de meditación o mindfulness para mejorar el bienestar mental y la concentración.',
      steps: 'Comenzar con 5-10 minutos diarios de meditación, usar apps como Headspace o Calm, practicar respiración consciente, crear espacio tranquilo para la práctica.',
      priority: 'high',
      categoria: 'meditacion_mindfulness',
      tips: '🧘 Tip: La meditación no es solo relajación, es entrenamiento mental que mejora tu concentración y reduce el estrés académico.',
      mentorCommitment: 'Te guiaré en técnicas de meditación para principiantes y te ayudaré a crear una práctica sostenible.'
    },
    {
      id: 'PRIM_ESP02',
      title: 'Reflexionar sobre propósito de vida y valores',
      description: 'Explorar valores personales y definir metas de vida a largo plazo que guíen tus decisiones universitarias.',
      steps: 'Practicar reflexión diaria o semanal, identificar valores fundamentales, definir visión personal, alinear acciones académicas con valores, escribir sobre propósito personal.',
      priority: 'medium',
      categoria: 'proposito_vida',
      tips: '🎯 Tip: Conocer tu propósito te ayuda a tomar mejores decisiones y mantener motivación durante los desafíos universitarios.',
      mentorCommitment: 'Te ayudaré a explorar tus valores y propósito a través de ejercicios de reflexión y conversaciones profundas.'
    },
    {
      id: 'PRIM_ESP03',
      title: 'Cultivar gratitud y perspectiva positiva',
      description: 'Desarrollar una actitud de agradecimiento que mejore el bienestar general y la resiliencia.',
      steps: 'Mantener diario de gratitud, expresar agradecimiento a otros, practicar mindfulness, reflexionar sobre bendiciones diarias, celebrar pequeños logros.',
      priority: 'medium',
      categoria: 'gratitud_perspectiva',
      tips: '🙏 Tip: La gratitud cambia tu perspectiva y te ayuda a ver oportunidades donde otros ven problemas.',
      mentorCommitment: 'Te recordaré practicar gratitud y te ayudaré a desarrollar una perspectiva más positiva ante los desafíos.'
    },
    {
      id: 'PRIM_ESP04',
      title: 'Conectar con la naturaleza y espacios de paz',
      description: 'Encontrar espacios de tranquilidad y conexión con la naturaleza para recargar energía y encontrar equilibrio.',
      steps: 'Identificar espacios verdes en el campus, hacer caminatas regulares, practicar actividades al aire libre, crear rituales de conexión con la naturaleza.',
      priority: 'low',
      categoria: 'conexion_naturaleza',
      tips: '🌿 Tip: La naturaleza tiene un poder restaurador. Incluso 15 minutos al aire libre pueden recargar tu energía mental.',
      mentorCommitment: 'Te ayudaré a identificar espacios de paz en el campus y te motivaré a incluir tiempo en la naturaleza en tu rutina.'
    }
  ],
  'Financiera': [
    {
      id: 'PRIM_FIN01',
      title: 'Crear presupuesto universitario y gestionar gastos',
      description: 'Establecer un plan financiero que cubra gastos académicos, personales y de vida universitaria.',
      steps: 'Identificar ingresos (becas, familia, trabajo), categorizar gastos por prioridad (académicos, vivienda, alimentación, transporte), establecer límites de gasto, revisar y ajustar mensualmente.',
      priority: 'high',
      categoria: 'presupuesto_gastos',
      tips: '💰 Tip: Un presupuesto universitario te da control sobre tu dinero y reduce el estrés financiero. Es tu herramienta de libertad financiera.',
      mentorCommitment: 'Te ayudaré a crear tu primer presupuesto universitario y te enseñaré a mantenerlo actualizado.'
    },
    {
      id: 'PRIM_FIN02',
      title: 'Desarrollar educación financiera básica',
      description: 'Aprender conceptos fundamentales de finanzas personales para tomar decisiones informadas.',
      steps: 'Tomar curso de finanzas personales del TEC, leer libros sobre educación financiera, practicar con simuladores financieros, buscar asesoría en el departamento financiero.',
      priority: 'high',
      categoria: 'educacion_financiera',
      tips: '📚 Tip: La educación financiera es una inversión en tu futuro. Te ayudará a tomar mejores decisiones económicas toda la vida.',
      mentorCommitment: 'Te compartiré recursos de educación financiera y te ayudaré a entender conceptos básicos de finanzas personales.'
    },
    {
      id: 'PRIM_FIN03',
      title: 'Establecer hábitos de ahorro y planificación',
      description: 'Desarrollar disciplina para ahorrar y planificar el futuro financiero desde temprano.',
      steps: 'Establecer meta de ahorro mensual (aunque sea pequeña), automatizar transferencias de ahorro, evitar gastos innecesarios, buscar formas de generar ingresos adicionales (tutorías, trabajos de medio tiempo).',
      priority: 'medium',
      categoria: 'ahorro_planificacion',
      tips: '🏦 Tip: El ahorro es un hábito que se construye. Incluso ahorrar $100 pesos mensuales suma $1,200 al año.',
      mentorCommitment: 'Te ayudaré a establecer metas de ahorro realistas y te motivaré a mantener la disciplina financiera.'
    },
    {
      id: 'PRIM_FIN04',
      title: 'Gestionar becas, créditos y recursos financieros',
      description: 'Optimizar el uso de recursos financieros disponibles y entender opciones de financiamiento.',
      steps: 'Investigar todas las becas disponibles, entender términos de créditos estudiantiles, optimizar uso de recursos del TEC, buscar oportunidades de financiamiento adicional.',
      priority: 'medium',
      categoria: 'recursos_financieros',
      tips: '🎓 Tip: Conocer todos los recursos financieros disponibles puede hacer la diferencia en tu experiencia universitaria.',
      mentorCommitment: 'Te ayudaré a identificar y acceder a todos los recursos financieros disponibles para estudiantes.'
    }
  ]
};

/**
 * Función principal para servir la web app
 */
function doGet() {
  return HtmlService.createTemplateFromFile('webapp')
    .evaluate()
    .setTitle('🎯 Selección de Metas IBI - Estudiantes 1er Ingreso')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Procesar selección de dimensiones y generar recomendaciones
 */
function processDimensionSelection(data) {
  try {
    console.log('📝 Procesando selección de dimensiones:', data);
    
    const { student, dimensions, timestamp } = data;
    
    // Validar datos
    if (!student.matricula || !student.nombre || !dimensions || dimensions.length !== 3) {
      throw new Error('Datos incompletos o inválidos');
    }
    
    // Generar recomendaciones
    const recommendations = generateRecommendations(dimensions);
    
    // Guardar en Google Sheets
    saveToSheets(student, dimensions, recommendations, timestamp);
    
    // Enviar correo con recomendaciones
    const emailResult = sendRecommendationsEmail(student, recommendations);
    
    return {
      success: true,
      recommendations: recommendations,
      emailSent: emailResult.success,
      message: 'Recomendaciones generadas y correo enviado exitosamente'
    };
    
  } catch (error) {
    console.error('❌ Error procesando selección:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generar recomendaciones basadas en las dimensiones seleccionadas
 */
function generateRecommendations(dimensions) {
  const recommendations = [];
  
  dimensions.forEach((dimension, index) => {
    const goals = GOALS_DATABASE[dimension] || [];
    const priorityGoal = goals[0]; // Meta de mayor prioridad
    
    if (priorityGoal) {
      const priority = index === 0 ? 'Prioritaria' : 
                     index === 1 ? 'Complementaria' : 'Longitudinal';
      
      recommendations.push({
        dimension: dimension,
        priority: priority,
        goal: priorityGoal,
        alternatives: goals.slice(1, 4) // 3 alternativas
      });
    }
  });
  
  return recommendations;
}

/**
 * Guardar resultados en Google Sheets
 */
function saveToSheets(student, dimensions, recommendations, timestamp) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // Crear hojas si no existen
  createSheetsIfNeeded();
  
  // Guardar en hoja de respuestas
  const responsesSheet = spreadsheet.getSheetByName(FORM_RESPONSES_SHEET);
  responsesSheet.appendRow([
    timestamp,
    student.matricula,
    student.nombre,
    dimensions[0],
    dimensions[1], 
    dimensions[2],
    JSON.stringify(recommendations)
  ]);
  
  // Guardar análisis detallado
  const analysisSheet = spreadsheet.getSheetByName(ANALYSIS_SHEET);
  dimensions.forEach((dimension, index) => {
    const priority = index === 0 ? 'Alta' : index === 1 ? 'Media' : 'Baja';
    analysisSheet.appendRow([
      timestamp,
      student.matricula,
      student.nombre,
      dimension,
      priority,
      'NO', // No duplicados en web app
      '' // Sin comentarios
    ]);
  });
  
  // Actualizar dashboard
  updateDashboard();
}

/**
 * Crear hojas necesarias si no existen
 */
function createSheetsIfNeeded() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // Crear hoja de respuestas web app
  if (!spreadsheet.getSheetByName(FORM_RESPONSES_SHEET)) {
    const responsesSheet = spreadsheet.insertSheet(FORM_RESPONSES_SHEET);
    responsesSheet.getRange('A1:G1').setValues([[
      'Timestamp',
      'Matrícula',
      'Nombre',
      'Dimensión 1',
      'Dimensión 2',
      'Dimensión 3',
      'Recomendaciones JSON'
    ]]);
    responsesSheet.getRange('A1:G1').setFontWeight('bold');
    responsesSheet.getRange('A1:G1').setBackground('#4285f4');
    responsesSheet.getRange('A1:G1').setFontColor('white');
  }
  
  // Crear hoja de análisis por dimensiones
  if (!spreadsheet.getSheetByName(ANALYSIS_SHEET)) {
    const analysisSheet = spreadsheet.insertSheet(ANALYSIS_SHEET);
    analysisSheet.getRange('A1:G1').setValues([[
      'Timestamp',
      'Matrícula', 
      'Nombre',
      'Dimensión',
      'Prioridad',
      'Tiene Duplicados',
      'Comentarios'
    ]]);
    analysisSheet.getRange('A1:G1').setFontWeight('bold');
    analysisSheet.getRange('A1:G1').setBackground('#4285f4');
    analysisSheet.getRange('A1:G1').setFontColor('white');
    analysisSheet.autoResizeColumns(1, 7);
  }
  
  // Crear hoja de base de datos de metas
  if (!spreadsheet.getSheetByName(GOALS_SHEET)) {
    const goalsSheet = spreadsheet.insertSheet(GOALS_SHEET);
    goalsSheet.getRange('A1:F1').setValues([[
      'ID',
      'Dimensión',
      'Título',
      'Descripción',
      'Pasos de Acción',
      'Prioridad'
    ]]);
    goalsSheet.getRange('A1:F1').setFontWeight('bold');
    goalsSheet.getRange('A1:F1').setBackground('#4285f4');
    goalsSheet.getRange('A1:F1').setFontColor('white');
    
    // Poblar con datos de metas
    populateGoalsDatabase(goalsSheet);
  }
  
  console.log('✅ Todas las hojas han sido creadas/verificadas exitosamente');
}

/**
 * Poblar la base de datos de metas
 */
function populateGoalsDatabase(sheet) {
  let row = 2;
  
  Object.entries(GOALS_DATABASE).forEach(([dimension, goals]) => {
    goals.forEach(goal => {
      sheet.getRange(row, 1, 1, 6).setValues([[
        goal.id,
        dimension,
        goal.title,
        goal.description,
        goal.steps,
        goal.priority
      ]]);
      row++;
    });
  });
}

/**
 * Actualizar dashboard con nuevas estadísticas
 */
function updateDashboard() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let dashboardSheet = spreadsheet.getSheetByName(DASHBOARD_SHEET);
  
  if (!dashboardSheet) {
    createDashboard();
    dashboardSheet = spreadsheet.getSheetByName(DASHBOARD_SHEET);
  }
  
  // Obtener datos de análisis
  const analysisSheet = spreadsheet.getSheetByName(ANALYSIS_SHEET);
  const data = analysisSheet.getDataRange().getValues();
  
  // Calcular estadísticas
  const stats = calculateStats(data);
  
  // Actualizar dashboard
  updateDashboardStats(dashboardSheet, stats);
}

/**
 * Calcular estadísticas de las respuestas
 */
function calculateStats(data) {
  const stats = {
    totalEstudiantes: 0,
    dimensiones: {},
    prioridades: { Alta: 0, Media: 0, Baja: 0 },
    duplicados: 0
  };
  
  // Saltar header
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const matricula = row[1];
    const dimension = row[3];
    const prioridad = row[4];
    const tieneDuplicados = row[5] === 'SÍ';
    
    // Contar estudiantes únicos
    if (i === 1 || data[i-1][1] !== matricula) {
      stats.totalEstudiantes++;
    }
    
    // Contar dimensiones
    stats.dimensiones[dimension] = (stats.dimensiones[dimension] || 0) + 1;
    
    // Contar prioridades
    stats.prioridades[prioridad] = (stats.prioridades[prioridad] || 0) + 1;
    
    // Contar duplicados
    if (tieneDuplicados) {
      stats.duplicados++;
    }
  }
  
  return stats;
}

/**
 * Actualizar estadísticas en el dashboard
 */
function updateDashboardStats(sheet, stats) {
  // Limpiar datos previos (mantener headers)
  const lastRow = sheet.getLastRow();
  if (lastRow > 2) {
    sheet.getRange(3, 1, lastRow - 2, sheet.getLastColumn()).clear();
  }
  
  // Actualizar estadísticas generales
  sheet.getRange('B2').setValue(stats.totalEstudiantes);
  sheet.getRange('B3').setValue(stats.duplicados);
  
  // Actualizar ranking de dimensiones
  const dimensionesOrdenadas = Object.entries(stats.dimensiones)
    .sort(([,a], [,b]) => b - a);
  
  let row = 3;
  dimensionesOrdenadas.forEach(([dimension, count]) => {
    sheet.getRange(row, 1).setValue(dimension);
    sheet.getRange(row, 2).setValue(count);
    sheet.getRange(row, 3).setValue(((count / (stats.totalEstudiantes * 3)) * 100).toFixed(1) + '%');
    row++;
  });
}

/**
 * Crear dashboard si no existe
 */
function createDashboard() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(DASHBOARD_SHEET);
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet(DASHBOARD_SHEET);
    
    // Crear estructura del dashboard
    sheet.getRange('A1').setValue('📊 DASHBOARD - SELECCIÓN DE METAS IBI (WEB APP)');
    sheet.getRange('A1').setFontSize(16).setFontWeight('bold');
    
    // Estadísticas generales
    sheet.getRange('A3').setValue('Total de Estudiantes:');
    sheet.getRange('A4').setValue('Respuestas con Duplicados:');
    
    // Ranking de dimensiones
    sheet.getRange('A6').setValue('🏆 RANKING DE DIMENSIONES');
    sheet.getRange('A6').setFontWeight('bold');
    sheet.getRange('A7:C7').setValues([['Dimensión', 'Total Selecciones', 'Porcentaje']]);
    sheet.getRange('A7:C7').setFontWeight('bold').setBackground('#f0f0f0');
    
    // Formatear
    sheet.autoResizeColumns(1, 3);
  }
}

/**
 * Obtener datos de dimensiones para la web app
 */
function getDimensionsData() {
  return DIMENSIONS;
}

/**
 * Obtener base de datos de metas
 */
function getGoalsDatabase() {
  return GOALS_DATABASE;
}

/**
 * Exportar datos a CSV
 */
function exportDataToCSV() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const analysisSheet = spreadsheet.getSheetByName(ANALYSIS_SHEET);
  
  if (!analysisSheet) {
    return { error: 'No hay datos para exportar' };
  }
  
  const data = analysisSheet.getDataRange().getValues();
  const csvContent = data.map(row => row.join(',')).join('\n');
  
  // Crear archivo CSV
  const blob = Utilities.newBlob(csvContent, 'text/csv', 'datos-ibi-webapp.csv');
  
  // Guardar en Drive
  const file = DriveApp.createFile(blob);
  
  return {
    success: true,
    downloadUrl: file.getDownloadUrl(),
    fileName: 'datos-ibi-webapp.csv'
  };
}

/**
 * Función para limpiar datos de prueba
 */
function cleanTestData() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const responsesSheet = spreadsheet.getSheetByName(FORM_RESPONSES_SHEET);
  
  if (!responsesSheet) return;
  
  const data = responsesSheet.getDataRange().getValues();
  
  for (let i = data.length - 1; i >= 1; i--) {
    if (data[i][1].includes('PRUEBA') || data[i][1].includes('TEST')) {
      responsesSheet.deleteRow(i + 1);
    }
  }
  
  // Actualizar dashboard
  updateDashboard();
}

/**
 * Función de utilidad para verificar que todas las hojas estén creadas
 */
function verifySheetsSetup() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const requiredSheets = [FORM_RESPONSES_SHEET, ANALYSIS_SHEET, GOALS_SHEET, DASHBOARD_SHEET];
  const existingSheets = spreadsheet.getSheets().map(sheet => sheet.getName());
  
  console.log('📋 Verificando configuración de hojas...');
  console.log('Hojas requeridas:', requiredSheets);
  console.log('Hojas existentes:', existingSheets);
  
  const missingSheets = requiredSheets.filter(sheetName => !existingSheets.includes(sheetName));
  
  if (missingSheets.length > 0) {
    console.log('❌ Hojas faltantes:', missingSheets);
    console.log('🔧 Ejecutando createSheetsIfNeeded()...');
    createSheetsIfNeeded();
  } else {
    console.log('✅ Todas las hojas están configuradas correctamente');
  }
  
  return {
    success: missingSheets.length === 0,
    missingSheets: missingSheets,
    existingSheets: existingSheets
  };
}

// ============================================================
// SISTEMA DE CORREOS AUTOMÁTICOS
// ============================================================

/**
 * Enviar correo con recomendaciones personalizadas
 */
function sendRecommendationsEmail(student, recommendations) {
  try {
    const email = `${student.matricula}@tec.mx`;
    const subject = `🎯 Tus Metas Personalizadas IBI - ${student.nombre}`;
    
    // Generar contenido HTML del correo
    const htmlContent = generateEmailHTML(student, recommendations);
    
    // Enviar correo
    GmailApp.sendEmail(
      email,
      subject,
      '', // Texto plano vacío
      {
        htmlBody: htmlContent,
        name: 'Tu mentora Karen - dIkigai'
      }
    );
    
    console.log(`✅ Correo enviado exitosamente a: ${email}`);
    
    // Registrar envío en Google Sheets
    logEmailSent(student.matricula, email, 'recommendations');
    
    return { success: true, message: 'Correo enviado exitosamente' };
    
  } catch (error) {
    console.error('❌ Error enviando correo:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Generar contenido HTML del correo
 */
function generateEmailHTML(student, recommendations) {
  const tutorialLink = 'https://drive.google.com/file/d/18kojUabG2z00cgmQXGU_6zLGmAL3weE9/view';
  
  let recommendationsHTML = '';
  recommendations.forEach((rec, index) => {
    const priorityClass = index === 0 ? 'priority-high' : index === 1 ? 'priority-medium' : 'priority-low';
    const priorityText = index === 0 ? 'Prioritaria' : index === 1 ? 'Complementaria' : 'Longitudinal';
    
    recommendationsHTML += `
      <div class="recommendation-card ${priorityClass}">
        <div class="recommendation-header">
          <span class="priority-badge">${priorityText}</span>
          <span class="dimension-badge">${rec.dimension} ${DIMENSIONS[rec.dimension].emoji}</span>
        </div>
        <h3>${rec.goal.title}</h3>
        <p class="description">${rec.goal.description}</p>
        <div class="steps">
          <h4>📋 Pasos de Acción:</h4>
          <p>${rec.goal.steps}</p>
        </div>
        <div class="tip">
          <strong>${rec.goal.tips}</strong>
        </div>
        <div class="mentor-commitment">
          <h4>🤝 Mi compromiso contigo:</h4>
          <p>${rec.goal.mentorCommitment}</p>
        </div>
      </div>
    `;
  });
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Tus Metas Personalizadas IBI</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .container {
          background: white;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
          color: white;
          padding: 25px;
          border-radius: 10px;
          text-align: center;
          margin-bottom: 30px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .header p {
          margin: 10px 0 0 0;
          opacity: 0.9;
        }
        .greeting {
          font-size: 18px;
          margin-bottom: 20px;
          color: #2c3e50;
        }
        .recommendation-card {
          border: 2px solid #e1e5e9;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          background: white;
        }
        .recommendation-card.priority-high {
          border-color: #ea4335;
          background: linear-gradient(135deg, #fff5f5 0%, #ffffff 100%);
        }
        .recommendation-card.priority-medium {
          border-color: #fbbc04;
          background: linear-gradient(135deg, #fffbf0 0%, #ffffff 100%);
        }
        .recommendation-card.priority-low {
          border-color: #34a853;
          background: linear-gradient(135deg, #f0fff4 0%, #ffffff 100%);
        }
        .recommendation-header {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
          flex-wrap: wrap;
        }
        .priority-badge {
          background: #4285f4;
          color: white;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
        }
        .dimension-badge {
          background: #6c757d;
          color: white;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 12px;
        }
        .recommendation-card h3 {
          color: #2c3e50;
          margin: 0 0 10px 0;
          font-size: 18px;
        }
        .description {
          color: #666;
          margin-bottom: 15px;
        }
        .steps, .tip, .mentor-commitment {
          margin-bottom: 15px;
        }
        .steps h4, .mentor-commitment h4 {
          color: #4285f4;
          margin: 0 0 8px 0;
          font-size: 14px;
        }
        .tip {
          background: #e3f2fd;
          padding: 12px;
          border-radius: 8px;
          border-left: 4px solid #2196f3;
        }
        .mentor-commitment {
          background: #f3e5f5;
          padding: 12px;
          border-radius: 8px;
          border-left: 4px solid #9c27b0;
        }
        .next-steps {
          background: #e8f5e8;
          padding: 20px;
          border-radius: 10px;
          margin: 30px 0;
          border-left: 4px solid #4caf50;
        }
        .next-steps h3 {
          color: #2e7d32;
          margin: 0 0 15px 0;
        }
        .tutorial-link {
          display: inline-block;
          background: #4285f4;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          margin: 10px 0;
        }
        .tutorial-link:hover {
          background: #3367d6;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid #e1e5e9;
          text-align: center;
          color: #666;
        }
        .signature {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 10px;
          margin: 20px 0;
        }
        .signature h4 {
          color: #4285f4;
          margin: 0 0 10px 0;
        }
        .follow-up {
          background: #fff3cd;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #ffc107;
          margin: 20px 0;
        }
        @media (max-width: 600px) {
          body {
            padding: 10px;
          }
          .container {
            padding: 20px;
          }
          .header h1 {
            font-size: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎯 Tus Metas Personalizadas IBI</h1>
          <p>Recomendaciones basadas en tus dimensiones prioritarias</p>
        </div>
        
        <div class="greeting">
          ¡Hola <strong>${student.nombre}</strong>! 👋
        </div>
        
        <p>Me da mucho gusto que hayas completado la selección de tus dimensiones prioritarias del bienestar integral. Basándome en tus respuestas, he preparado <strong>3 metas personalizadas</strong> que te ayudarán a crecer en las áreas que más te interesan.</p>
        
        <p>Cada meta incluye pasos específicos de acción, tips de éxito y mi compromiso de acompañarte en el proceso. ¡Estoy emocionada de ser parte de tu crecimiento universitario! 🌟</p>
        
        ${recommendationsHTML}
        
        <div class="next-steps">
          <h3>🚀 Próximos Pasos</h3>
          <p><strong>1. Personaliza tus metas:</strong> Puedes modificar, agregar o quitar pasos según tus necesidades específicas.</p>
          <p><strong>2. Guárdalas en Mi Tec:</strong> Sube tus metas a MiVidaTec para hacer seguimiento de tu progreso.</p>
          <p><strong>3. ¡Comienza a trabajar en ellas!</strong> Recuerda que el progreso se construye paso a paso.</p>
          
          <a href="${tutorialLink}" class="tutorial-link" target="_blank">
            📖 Ver Tutorial: Cómo guardar metas en Mi Tec
          </a>
        </div>
        
        <div class="follow-up">
          <h4>📧 ¿No recibiste este correo?</h4>
          <p>Si no encuentras este correo en tu bandeja de entrada, verifica:</p>
          <ul>
            <li>Tu carpeta de spam o correo no deseado</li>
            <li>Que tu matrícula esté correcta: <strong>${student.matricula}@tec.mx</strong></li>
            <li>Si necesitas que reenvíe el correo, responde a este mensaje</li>
          </ul>
        </div>
        
        <div class="signature">
          <h4>Con cariño y compromiso,</h4>
          <p><strong>Tu mentora Karen</strong> 💙</p>
          <p>Estoy aquí para acompañarte en tu proceso de crecimiento universitario. No dudes en contactarme si tienes preguntas, necesitas apoyo o quieres compartir tus logros.</p>
          
          <h4>🤝 Mi compromiso contigo:</h4>
          <ul>
            <li>📅 <strong>Seguimiento semanal:</strong> Te enviaré tips y recordatorios para mantenerte motivado</li>
            <li>💬 <strong>Disponibilidad:</strong> Estaré disponible para responder tus dudas y darte apoyo</li>
            <li>🎉 <strong>Celebración de logros:</strong> Reconoceré y celebraré tus avances y logros</li>
            <li>📚 <strong>Recursos personalizados:</strong> Te compartiré recursos específicos para tus metas</li>
            <li>🤗 <strong>Apoyo emocional:</strong> Estaré aquí para escucharte en momentos difíciles</li>
          </ul>
          
          <h4>💪 Tu compromiso:</h4>
          <ul>
            <li>🎯 <strong>Dedicación:</strong> Trabajar consistentemente en tus metas</li>
            <li>📝 <strong>Reflexión:</strong> Evaluar tu progreso y ajustar cuando sea necesario</li>
            <li>🤝 <strong>Comunicación:</strong> Mantenerme informada de tus avances y desafíos</li>
            <li>🌟 <strong>Persistencia:</strong> No rendirte ante los obstáculos</li>
          </ul>
        </div>
        
        <div class="footer">
          <p>Este correo fue generado automáticamente por el sistema dIkigai</p>
          <p>Si tienes preguntas, responde a este correo o contacta a tu mentora Karen</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Registrar envío de correo en Google Sheets
 */
function logEmailSent(matricula, email, type) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let emailLogSheet = spreadsheet.getSheetByName('Log Correos');
    
    if (!emailLogSheet) {
      emailLogSheet = spreadsheet.insertSheet('Log Correos');
      emailLogSheet.getRange('A1:E1').setValues([[
        'Timestamp',
        'Matrícula',
        'Email',
        'Tipo',
        'Estado'
      ]]);
      emailLogSheet.getRange('A1:E1').setFontWeight('bold');
    }
    
    emailLogSheet.appendRow([
      new Date().toISOString(),
      matricula,
      email,
      type,
      'Enviado'
    ]);
    
  } catch (error) {
    console.error('Error registrando envío de correo:', error);
  }
}

/**
 * Reenviar correo de recomendaciones
 */
function resendRecommendationsEmail(matricula) {
  try {
    // Buscar datos del estudiante en Google Sheets
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const responsesSheet = spreadsheet.getSheetByName(FORM_RESPONSES_SHEET);
    
    if (!responsesSheet) {
      throw new Error('No se encontró la hoja de respuestas');
    }
    
    const data = responsesSheet.getDataRange().getValues();
    let studentData = null;
    let recommendations = null;
    
    // Buscar la última respuesta del estudiante
    for (let i = data.length - 1; i >= 1; i--) {
      if (data[i][1] === matricula) {
        studentData = {
          matricula: data[i][1],
          nombre: data[i][2]
        };
        recommendations = JSON.parse(data[i][6] || '[]');
        break;
      }
    }
    
    if (!studentData) {
      throw new Error('No se encontraron datos para la matrícula: ' + matricula);
    }
    
    // Reenviar correo
    const result = sendRecommendationsEmail(studentData, recommendations);
    
    return {
      success: result.success,
      message: result.success ? 'Correo reenviado exitosamente' : 'Error reenviando correo',
      error: result.error
    };
    
  } catch (error) {
    console.error('Error reenviando correo:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
