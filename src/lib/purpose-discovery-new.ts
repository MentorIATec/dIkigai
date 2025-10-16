// Banco de prompts reflexivos para descubrimiento del propósito de vida
// Siguiendo el patrón del sistema de metas existente, pero enfocado en reflexión profunda

export interface PurposeQuestion {
  id: string;
  title: string;
  description?: string;
  category: PurposeCategory;
  type: 'reflection' | 'values' | 'passions' | 'impact' | 'vision';
  basePrompt: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number; // en minutos
  depth: 'easy' | 'intermediate' | 'challenging'; // Nueva clasificación
  examples?: string[]; // ejemplos específicos para esta pregunta
}

export interface ContextualPrompt {
  context: string; // contexto que activa este prompt
  prompt: string;
  depth: 'surface' | 'deep' | 'profound';
  examples?: string[]; // ejemplos específicos para este contexto
}

export interface PurposeAnswer {
  questionId: string;
  response: string;
  timestamp: Date;
  category: PurposeCategory;
  type: 'reflection' | 'values' | 'passions' | 'impact' | 'vision';
  difficulty: 'easy' | 'medium' | 'hard';
  depth: 'easy' | 'intermediate' | 'challenging'; // Nueva clasificación
  wordCount: number; // Para medir profundidad de reflexión
}

export interface PurposeInsight {
  id: string;
  title: string;
  description: string;
  category: PurposeCategory;
  triggerAnswers: string[]; // IDs de respuestas que activan esta insight
  actionableSteps?: string[];
  relatedGoals?: string[]; // IDs de metas relacionadas
}

export type PurposeCategory = 
  | 'pasion'      // Lo que amas
  | 'mision'      // Lo que el mundo necesita
  | 'vocacion'    // Aquello por lo que te pudieran pagar
  | 'profesion'   // En lo que eres bueno
  | 'carrera';    // Ikigai + Carrera (opcional)

export interface PurposeProfile {
  studentId: string;
  answers: PurposeAnswer[];
  insights: PurposeInsight[];
  currentStage: 'exploration' | 'clarity' | 'action' | 'refinement';
  lastUpdated: Date;
  purposeStatement?: string;
  keyThemes: string[];
  selectedQuestions?: string[]; // IDs de preguntas seleccionadas por el estudiante
}

// BANCO DE PREGUNTAS REFLEXIVAS BASADAS EN IKIGAI - NUEVA ESTRUCTURA
export const PURPOSE_QUESTIONS: PurposeQuestion[] = [
  // PASIÓN - Lo que amas
  {
    id: 'pasion_easy',
    title: 'Lo que te genera curiosidad',
    description: 'Explora las actividades que genuinamente te apasionan',
    category: 'pasion',
    type: 'reflection',
    difficulty: 'easy',
    estimatedTime: 10,
    depth: 'easy',
    basePrompt: '¿Qué actividades o temas te generan curiosidad o te emocionan cuando los estudias o practicas?',
    examples: [
      'Leer sobre tecnología, debatir ideas, crear contenido, organizar eventos, practicar un deporte',
      'Programación, filosofía, historia, ciencias, arte y diseño',
      'Proyectos tecnológicos, arte visual, música, escritura, diseño de experiencias'
    ]
  },
  {
    id: 'pasion_intermediate',
    title: 'Problemas que te motivan',
    description: 'Identifica los desafíos que te energizan',
    category: 'pasion',
    type: 'reflection',
    difficulty: 'medium',
    estimatedTime: 12,
    depth: 'intermediate',
    basePrompt: '¿Qué tipo de problemas o desafíos te motivan a seguir aprendiendo, incluso cuando son difíciles?',
    examples: [
      'Resolver problemas complejos de matemáticas, investigar temas desconocidos, crear soluciones innovadoras',
      'Desafíos técnicos, problemas sociales, retos creativos, investigaciones científicas',
      'Optimización de procesos, mejora de sistemas, innovación en metodologías'
    ]
  },
  {
    id: 'pasion_challenging',
    title: 'Tu energía natural',
    description: 'Descubre cuándo fluyes naturalmente',
    category: 'pasion',
    type: 'reflection',
    difficulty: 'hard',
    estimatedTime: 15,
    depth: 'challenging',
    basePrompt: '¿Cuándo has sentido que tu energía fluía naturalmente hacia algo específico? ¿Qué era y por qué te conectaba tanto?',
    examples: [
      'Momentos de creatividad espontánea, conexión profunda con una actividad, estados de "flow"',
      'Experiencias de aprendizaje intenso, momentos de inspiración, conexión con propósito',
      'Situaciones donde el tiempo pasa sin darte cuenta, estados de concentración profunda'
    ]
  },

  // MISIÓN - Lo que el mundo necesita
  {
    id: 'mision_easy',
    title: 'Problemas cercanos',
    description: 'Identifica necesidades en tu entorno inmediato',
    category: 'mision',
    type: 'reflection',
    difficulty: 'easy',
    estimatedTime: 10,
    depth: 'easy',
    basePrompt: '¿Qué problemas en tu comunidad, familia o entorno cercano te gustaría ayudar a resolver?',
    examples: [
      'Problemas de comunicación familiar, necesidades educativas locales, desafíos comunitarios',
      'Acceso a recursos, mejoras en servicios básicos, fortalecimiento de lazos sociales',
      'Apoyo a personas vulnerables, mejoras en infraestructura, promoción de actividades culturales'
    ]
  },
  {
    id: 'mision_intermediate',
    title: 'Cambios en tu campo',
    description: 'Enfoque en tu área de estudio o interés',
    category: 'mision',
    type: 'reflection',
    difficulty: 'medium',
    estimatedTime: 12,
    depth: 'intermediate',
    basePrompt: '¿Qué cambios positivos te gustaría ver en tu campo de estudio o área de interés profesional?',
    examples: [
      'Mejoras en metodologías de enseñanza, innovación en procesos industriales, avances en investigación',
      'Sostenibilidad en tu campo, mayor accesibilidad, ética profesional mejorada',
      'Tecnologías más inclusivas, procesos más eficientes, mejores prácticas de trabajo'
    ]
  },
  {
    id: 'mision_challenging',
    title: 'Impacto global',
    description: 'Visión amplia de contribución al mundo',
    category: 'mision',
    type: 'reflection',
    difficulty: 'hard',
    estimatedTime: 15,
    depth: 'challenging',
    basePrompt: '¿Cómo te imaginas contribuyendo a un mundo mejor a través de tu carrera y habilidades futuras?',
    examples: [
      'Soluciones innovadoras para problemas globales, liderazgo en transformación social, impacto sistémico',
      'Desarrollo de tecnologías sostenibles, promoción de justicia social, avances científicos significativos',
      'Creación de oportunidades para otros, transformación de industrias, contribución al bienestar humano'
    ]
  },

  // VOCACIÓN - Aquello por lo que te pagarían
  {
    id: 'vocacion_easy',
    title: 'Ambiente laboral ideal',
    description: 'Define las condiciones de trabajo que te motivan',
    category: 'vocacion',
    type: 'reflection',
    difficulty: 'easy',
    estimatedTime: 10,
    depth: 'easy',
    basePrompt: '¿Qué tipo de ambiente laboral te daría motivación y comodidad para trabajar?',
    examples: [
      'Tener tiempo para mi familia y crecimiento personal, que se preocupen por mi bienestar, horarios flexibles',
      'Ambiente de colaboración y apoyo mutuo, reconocimiento del trabajo bien hecho, oportunidades de aprendizaje',
      'Autonomía en la toma de decisiones, balance trabajo-vida, cultura de innovación y creatividad'
    ]
  },
  {
    id: 'vocacion_intermediate',
    title: 'Habilidades profesionales',
    description: 'Desarrollo de competencias valiosas',
    category: 'vocacion',
    type: 'reflection',
    difficulty: 'medium',
    estimatedTime: 12,
    depth: 'intermediate',
    basePrompt: '¿Qué habilidades o competencias te gustaría desarrollar para aportar valor en tu campo profesional?',
    examples: [
      'Liderazgo y gestión de equipos, análisis de datos y toma de decisiones, comunicación efectiva',
      'Innovación y pensamiento creativo, resolución de problemas complejos, adaptabilidad al cambio',
      'Especialización técnica avanzada, habilidades interpersonales, pensamiento estratégico'
    ]
  },
  {
    id: 'vocacion_challenging',
    title: 'Evolución profesional',
    description: 'Visión a largo plazo de tu carrera',
    category: 'vocacion',
    type: 'reflection',
    difficulty: 'hard',
    estimatedTime: 15,
    depth: 'challenging',
    basePrompt: '¿Cómo te imaginas que tu carrera podría evolucionar y qué tipo de impacto profesional quieres tener?',
    examples: [
      'Liderazgo en transformación organizacional, creación de nuevas metodologías, influencia en políticas públicas',
      'Desarrollo de productos o servicios innovadores, mentoría de nuevas generaciones, contribución a avances científicos',
      'Emprendimiento con impacto social, liderazgo en sostenibilidad, transformación de industrias tradicionales'
    ]
  },

  // PROFESIÓN - En lo que eres bueno
  {
    id: 'profesion_easy',
    title: 'Áreas de confianza',
    description: 'Identifica tus fortalezas naturales',
    category: 'profesion',
    type: 'reflection',
    difficulty: 'easy',
    estimatedTime: 10,
    depth: 'easy',
    basePrompt: '¿En qué áreas académicas o actividades tienes más seguridad y confianza?',
    examples: [
      'Matemáticas, redacción, organización de ideas, soporte técnico, dar buenos consejos',
      'Análisis de problemas, trabajo en equipo, presentaciones orales, investigación, creatividad',
      'Pensamiento lógico, comunicación escrita, planificación, resolución de conflictos, aprendizaje rápido'
    ]
  },
  {
    id: 'profesion_intermediate',
    title: 'Habilidades reconocidas',
    description: 'Fortalezas que otros valoran en ti',
    category: 'profesion',
    type: 'reflection',
    difficulty: 'medium',
    estimatedTime: 12,
    depth: 'intermediate',
    basePrompt: '¿Qué habilidades has desarrollado que otras personas valoran o te piden ayuda frecuentemente?',
    examples: [
      'Explicar conceptos complejos de manera simple, organizar proyectos, mediar en discusiones, dar feedback constructivo',
      'Análisis de datos, diseño de presentaciones, coordinación de equipos, resolución de problemas técnicos',
      'Mentoría y enseñanza, planificación estratégica, comunicación efectiva, innovación en procesos'
    ]
  },
  {
    id: 'profesion_challenging',
    title: 'Combinación única',
    description: 'Tu aporte distintivo al mundo profesional',
    category: 'profesion',
    type: 'reflection',
    difficulty: 'hard',
    estimatedTime: 15,
    depth: 'challenging',
    basePrompt: '¿Qué combinación única de habilidades o perspectivas crees que podrías aportar a tu campo profesional?',
    examples: [
      'Fusión de conocimiento técnico con habilidades humanas, perspectiva interdisciplinaria, visión sistémica',
      'Creatividad aplicada a soluciones técnicas, liderazgo empático, innovación basada en valores',
      'Pensamiento crítico con enfoque colaborativo, especialización profunda con visión amplia, ética profesional con pragmatismo'
    ]
  },

  // CARRERA - Ikigai + Carrera (opcional)
  {
    id: 'carrera_easy',
    title: 'Aplicación profesional básica',
    description: 'Conexión inicial entre pasión y carrera',
    category: 'carrera',
    type: 'reflection',
    difficulty: 'easy',
    estimatedTime: 10,
    depth: 'easy',
    basePrompt: '¿Cómo crees que tu pasión principal podría aplicarse en una carrera profesional? ¿En qué tipo de trabajo podrías usar lo que más te gusta hacer?',
    examples: [
      'Si me gusta ayudar personas → podría trabajar en servicios de salud, educación o recursos humanos',
      'Si me gusta crear cosas → podría trabajar en diseño, desarrollo de productos o arte',
      'Si me gusta analizar datos → podría trabajar en investigación, consultoría o análisis de mercados'
    ]
  },
  {
    id: 'carrera_intermediate',
    title: 'Conexión estratégica',
    description: 'Alineación entre Ikigai y ambiente profesional',
    category: 'carrera',
    type: 'reflection',
    difficulty: 'medium',
    estimatedTime: 12,
    depth: 'intermediate',
    basePrompt: 'Considerando tus respuestas anteriores, ¿qué tipo de empresa, organización o industria te permitiría vivir mejor tu Ikigai? ¿Por qué esa opción te parece más alineada?',
    examples: [
      'Empresas innovadoras que fomenten la creatividad y el aprendizaje continuo',
      'Organizaciones sin fines de lucro donde pueda hacer impacto social directo',
      'Startups dinámicas que valoren la autonomía y la toma de decisiones',
      'Empresas grandes con recursos para proyectos ambiciosos y desarrollo profesional'
    ]
  },
  {
    id: 'carrera_challenging',
    title: 'Visión profesional',
    description: 'Proyección a largo plazo de impacto profesional',
    category: 'carrera',
    type: 'reflection',
    difficulty: 'hard',
    estimatedTime: 15,
    depth: 'challenging',
    basePrompt: 'Imagina tu carrera ideal en 5-10 años. ¿Cómo combinarías tu pasión, misión, vocación y profesión para crear un impacto único en tu campo? ¿Qué tipo de liderazgo o innovación te gustaría aportar?',
    examples: [
      'Ser líder de proyectos que combinen mi pasión por la tecnología con mi misión de mejorar la educación',
      'Crear mi propia empresa que solucione problemas sociales usando mis habilidades técnicas',
      'Convertirme en experte reconocide en mi campo mientras mentor a otras personas',
      'Desarrollar soluciones innovadoras que transformen mi industria hacia la sostenibilidad'
    ]
  }
];

// INSIGHTS GENERADOS AUTOMÁTICAMENTE BASADOS EN EL IKIGAI
export const PURPOSE_INSIGHTS: PurposeInsight[] = [
  {
    id: 'insight_pasion_creativa',
    title: 'Tu Pasión por Crear',
    description: 'Tu pasión por la creación y la innovación es evidente. Tu Ikigai probablemente involucre transformar ideas en realidad y crear soluciones que impacten positivamente.',
    category: 'pasion',
    triggerAnswers: ['pasion_easy', 'pasion_intermediate', 'pasion_challenging'],
    actionableSteps: [
      'Busca proyectos donde puedas aplicar tu creatividad',
      'Conecta con comunidades de creadores e innovadores',
      'Considera carreras que valoren la creatividad y la innovación'
    ]
  },
  {
    id: 'insight_mision_servicio',
    title: 'Tu Misión de Servir',
    description: 'Tu deseo de ayudar a otros y resolver problemas sociales es claro. Tu Ikigai está conectado con hacer del mundo un lugar mejor a través del servicio.',
    category: 'mision',
    triggerAnswers: ['mision_easy', 'mision_intermediate', 'mision_challenging'],
    actionableSteps: [
      'Identifica organizaciones que trabajen en tus causas de interés',
      'Busca oportunidades de voluntariado o servicio comunitario',
      'Considera carreras en el sector social o de impacto'
    ]
  },
  {
    id: 'insight_vocacion_liderazgo',
    title: 'Tu Vocación de Liderar',
    description: 'Tus respuestas sugieren una vocación natural hacia el liderazgo y la colaboración. Tu Ikigai puede involucrar guiar equipos hacia objetivos significativos.',
    category: 'vocacion',
    triggerAnswers: ['vocacion_easy', 'vocacion_intermediate'],
    actionableSteps: [
      'Busca oportunidades para liderar proyectos en tu universidad',
      'Desarrolla habilidades de comunicación y trabajo en equipo',
      'Considera roles que involucren gestión o coordinación de equipos'
    ]
  },
  {
    id: 'insight_profesion_analisis',
    title: 'Tu Profesión en el Análisis',
    description: 'Tu capacidad para analizar, organizar y resolver problemas de manera creativa es una fortaleza clave. Tu Ikigai puede estar en roles que requieran pensamiento estratégico.',
    category: 'profesion',
    triggerAnswers: ['profesion_easy', 'profesion_intermediate', 'profesion_challenging'],
    actionableSteps: [
      'Desarrolla habilidades de análisis de datos y pensamiento crítico',
      'Busca proyectos que requieran resolución de problemas complejos',
      'Considera carreras en consultoría, investigación o planificación estratégica'
    ]
  },
  {
    id: 'insight_ikigai_educador',
    title: 'Tu Ikigai como Educador',
    description: 'La combinación de tu pasión por aprender, tu misión de ayudar y tu habilidad para explicar sugiere que tu Ikigai puede estar en la educación o la transmisión de conocimiento.',
    category: 'pasion',
    triggerAnswers: ['pasion_easy', 'mision_easy', 'profesion_easy'],
    actionableSteps: [
      'Explora oportunidades de tutoría o mentoría',
      'Considera carreras en educación, capacitación o desarrollo',
      'Busca formas de compartir tu conocimiento con otros'
    ]
  },
  {
    id: 'insight_ikigai_innovador',
    title: 'Tu Ikigai como Innovador',
    description: 'Tu combinación de creatividad, deseo de impacto y habilidades técnicas sugiere un Ikigai centrado en la innovación y el desarrollo de soluciones nuevas.',
    category: 'vocacion',
    triggerAnswers: ['pasion_intermediate', 'mision_easy', 'vocacion_easy', 'profesion_intermediate'],
    actionableSteps: [
      'Participa en hackathones y competencias de innovación',
      'Busca oportunidades en startups o empresas innovadoras',
      'Desarrolla habilidades en tecnologías emergentes'
    ]
  }
];

// FUNCIONES HELPER PARA EL SISTEMA
export function getQuestionsByCategory(category: PurposeCategory): PurposeQuestion[] {
  return PURPOSE_QUESTIONS.filter(q => q.category === category);
}

export function getQuestionsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): PurposeQuestion[] {
  return PURPOSE_QUESTIONS.filter(q => q.difficulty === difficulty);
}

export function getQuestionsByDepth(depth: 'easy' | 'intermediate' | 'challenging'): PurposeQuestion[] {
  return PURPOSE_QUESTIONS.filter(q => q.depth === depth);
}

export function getRandomQuestions(count: number, excludeIds: string[] = []): PurposeQuestion[] {
  const available = PURPOSE_QUESTIONS.filter(q => !excludeIds.includes(q.id));
  const shuffled = available.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function generateInsights(answers: PurposeAnswer[]): PurposeInsight[] {
  const triggeredInsights: PurposeInsight[] = [];
  
  for (const insight of PURPOSE_INSIGHTS) {
    const hasTriggerAnswers = insight.triggerAnswers.some(triggerId => 
      answers.some(answer => answer.questionId === triggerId)
    );
    
    if (hasTriggerAnswers) {
      triggeredInsights.push(insight);
    }
  }
  
  return triggeredInsights;
}

export function calculateProgress(answers: PurposeAnswer[]): number {
  const totalCategories = new Set(PURPOSE_QUESTIONS.map(q => q.category)).size;
  const answeredCategories = new Set(answers.map(a => a.category)).size;
  return Math.round((answeredCategories / totalCategories) * 100);
}

export function determineStage(answers: PurposeAnswer[], progress: number): PurposeProfile['currentStage'] {
  if (progress < 25) return 'exploration';
  if (progress < 50) return 'clarity';
  if (progress < 75) return 'action';
  return 'refinement';
}

// NUEVA FUNCIÓN: Calcular profundidad de reflexión
export function calculateReflectionDepth(answers: PurposeAnswer[]): number {
  if (answers.length === 0) return 0;
  
  const totalWords = answers.reduce((sum, answer) => sum + answer.wordCount, 0);
  const averageWords = totalWords / answers.length;
  
  // Escala de 0-100 basada en palabras promedio por respuesta
  if (averageWords < 20) return Math.round((averageWords / 20) * 30); // 0-30
  if (averageWords < 50) return 30 + Math.round(((averageWords - 20) / 30) * 40); // 30-70
  return 70 + Math.round(((averageWords - 50) / 50) * 30); // 70-100
}

// NUEVA FUNCIÓN: Obtener progreso por dimensión
export function getProgressByCategory(answers: PurposeAnswer[]): Record<PurposeCategory, number> {
  const progress: Record<PurposeCategory, number> = {
    pasion: 0,
    mision: 0,
    vocacion: 0,
    profesion: 0,
    carrera: 0
  };
  
  for (const category of Object.keys(progress) as PurposeCategory[]) {
    const categoryAnswers = answers.filter(a => a.category === category);
    const categoryQuestions = getQuestionsByCategory(category);
    
    if (categoryQuestions.length > 0) {
      progress[category] = Math.round((categoryAnswers.length / categoryQuestions.length) * 100);
    }
  }
  
  return progress;
}

