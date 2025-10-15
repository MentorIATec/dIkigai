// Banco de prompts reflexivos para descubrimiento del propósito de vida
// Siguiendo el patrón del sistema de metas existente, pero enfocado en reflexión profunda

export interface PurposeQuestion {
  id: string;
  title: string;
  description?: string;
  category: PurposeCategory;
  type: 'reflection' | 'values' | 'passions' | 'impact' | 'vision';
  prompts: string[];
  followUpQuestions?: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number; // en minutos
}

export interface PurposeAnswer {
  questionId: string;
  response: string;
  timestamp: Date;
  category: PurposeCategory;
  type: PurposeQuestion['type'];
  difficulty: PurposeQuestion['difficulty'];
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
  | 'autoconocimiento'
  | 'valores'
  | 'pasiones'
  | 'talentes'
  | 'impacto'
  | 'vision_futura'
  | 'obstaculos'
  | 'recursos';

export interface PurposeProfile {
  studentId: string;
  answers: PurposeAnswer[];
  insights: PurposeInsight[];
  currentStage: 'exploration' | 'clarity' | 'action' | 'refinement';
  completionProgress: number;
  lastUpdated: Date;
  purposeStatement?: string;
  keyThemes: string[];
}

// BANCO DE PREGUNTAS REFLEXIVAS ORGANIZADAS POR CATEGORÍA
export const PURPOSE_QUESTIONS: PurposeQuestion[] = [
  // AUTOCONOCIMIENTO
  {
    id: 'auto_1',
    title: '¿Quién soy realmente?',
    description: 'Explora tu identidad más profunda',
    category: 'autoconocimiento',
    type: 'reflection',
    difficulty: 'medium',
    estimatedTime: 15,
    prompts: [
      'Si tuvieras que describirte en 5 palabras sin mencionar tu carrera o trabajo, ¿cuáles serían?',
      '¿Qué cualidades admiran más las personas en ti?',
      '¿En qué momentos te sientes más auténtico contigo mismo?',
      '¿Qué actividades te hacen perder completamente la noción del tiempo?'
    ],
    followUpQuestions: [
      '¿Cómo han cambiado estas cualidades a lo largo de tu vida?',
      '¿Qué aspectos de ti mismo te gustaría desarrollar más?'
    ]
  },
  {
    id: 'auto_2',
    title: 'Mi historia personal',
    description: 'Conecta con tus experiencias formativas',
    category: 'autoconocimiento',
    type: 'reflection',
    difficulty: 'hard',
    estimatedTime: 20,
    prompts: [
      '¿Cuáles han sido los 3 momentos más importantes de tu vida hasta ahora?',
      '¿Qué desafíos te han hecho crecer más como persona?',
      '¿Qué consejo le darías a tu yo de hace 5 años?',
      '¿Qué te enorgullece más de tu trayectoria hasta ahora?'
    ]
  },

  // VALORES
  {
    id: 'valores_1',
    title: 'Lo que realmente importa',
    description: 'Identifica tus valores fundamentales',
    category: 'valores',
    type: 'values',
    difficulty: 'easy',
    estimatedTime: 10,
    prompts: [
      '¿Qué principios nunca estarías dispuesto a comprometer?',
      '¿Qué tipo de mundo quieres ayudar a crear?',
      '¿Qué comportamientos en otros te generan más admiración?',
      '¿En qué situaciones te sientes más orgulloso de ti mismo?'
    ],
    followUpQuestions: [
      '¿Cómo se reflejan estos valores en tu vida diaria?',
      '¿Qué harías diferente si vivieras más alineado con estos valores?'
    ]
  },
  {
    id: 'valores_2',
    title: 'Decisiones difíciles',
    description: 'Explora tus prioridades en momentos críticos',
    category: 'valores',
    type: 'values',
    difficulty: 'medium',
    estimatedTime: 15,
    prompts: [
      '¿Cómo tomas decisiones importantes en tu vida?',
      '¿Qué factores pesan más cuando tienes que elegir entre opciones?',
      '¿Alguna vez has tomado una decisión que iba contra la corriente? ¿Por qué?',
      '¿Qué sacrificios estarías dispuesto a hacer por algo que realmente valoras?'
    ]
  },

  // PASIONES
  {
    id: 'pasiones_1',
    title: 'Lo que me energiza',
    description: 'Descubre tus fuentes de motivación intrínseca',
    category: 'pasiones',
    type: 'passions',
    difficulty: 'easy',
    estimatedTime: 12,
    prompts: [
      '¿Qué actividades haces por el simple placer de hacerlas?',
      '¿Sobre qué temas podrías hablar durante horas sin cansarte?',
      '¿Qué tipo de problemas te gusta resolver?',
      '¿En qué proyectos trabajas con más entusiasmo?'
    ],
    followUpQuestions: [
      '¿Cómo podrías incorporar más de estas actividades en tu vida?',
      '¿Qué te impide dedicar más tiempo a estas pasiones?'
    ]
  },
  {
    id: 'pasiones_2',
    title: 'Mi curiosidad infinita',
    description: 'Explora tus intereses más profundos',
    category: 'pasiones',
    type: 'passions',
    difficulty: 'medium',
    estimatedTime: 15,
    prompts: [
      '¿Qué temas te generan más curiosidad últimamente?',
      '¿Qué habilidades te gustaría desarrollar aunque no sean "útiles" para tu carrera?',
      '¿Qué libros, películas o experiencias han cambiado tu perspectiva?',
      '¿Qué preguntas sobre la vida te mantienen despierto por las noches?'
    ]
  },

  // TALENTES
  {
    id: 'talentos_1',
    title: 'Mis fortalezas naturales',
    description: 'Identifica tus habilidades innatas',
    category: 'talentes',
    type: 'reflection',
    difficulty: 'easy',
    estimatedTime: 10,
    prompts: [
      '¿Qué se te da naturalmente bien sin mucho esfuerzo?',
      '¿En qué áreas otros siempre te piden ayuda?',
      '¿Qué tareas realizas con más fluidez y satisfacción?',
      '¿Qué habilidades has desarrollado que te sorprenden a ti mismo?'
    ],
    followUpQuestions: [
      '¿Cómo podrías usar mejor estos talentos?',
      '¿Qué oportunidades podrías crear para desarrollarlos más?'
    ]
  },

  // IMPACTO
  {
    id: 'impacto_1',
    title: 'Mi huella en el mundo',
    description: 'Reflexiona sobre el legado que quieres dejar',
    category: 'impacto',
    type: 'impact',
    difficulty: 'medium',
    estimatedTime: 18,
    prompts: [
      '¿Cómo quieres que te recuerden las personas?',
      '¿Qué problema del mundo te gustaría ayudar a resolver?',
      '¿Qué diferencia positiva has hecho en la vida de alguien?',
      '¿Qué tipo de impacto quieres tener en tu comunidad?'
    ],
    followUpQuestions: [
      '¿Qué acciones concretas podrías tomar para aumentar tu impacto?',
      '¿Quiénes serían tus aliados naturales en esta misión?'
    ]
  },
  {
    id: 'impacto_2',
    title: 'Mi círculo de influencia',
    description: 'Define tu alcance y oportunidades de impacto',
    category: 'impacto',
    type: 'impact',
    difficulty: 'hard',
    estimatedTime: 20,
    prompts: [
      '¿A quiénes quieres servir con tu trabajo y talentos?',
      '¿Qué grupos o comunidades te importan más?',
      '¿Cómo puedes usar tus habilidades únicas para ayudar a otros?',
      '¿Qué cambiarías del mundo si tuvieras el poder de hacerlo?'
    ]
  },

  // VISIÓN FUTURA
  {
    id: 'vision_1',
    title: 'Mi vida ideal',
    description: 'Imagina tu futuro más satisfactorio',
    category: 'vision_futura',
    type: 'vision',
    difficulty: 'medium',
    estimatedTime: 15,
    prompts: [
      '¿Cómo te imaginas tu vida en 10 años?',
      '¿Qué tipo de persona quieres ser en el futuro?',
      '¿Cómo quieres que sea un día típico en tu vida ideal?',
      '¿Qué logros te harían sentir completamente realizado?'
    ],
    followUpQuestions: [
      '¿Qué pasos pequeños podrías dar hacia esta visión?',
      '¿Qué necesitas dejar atrás para alcanzar esta vida ideal?'
    ]
  },
  {
    id: 'vision_2',
    title: 'Mi legado',
    description: 'Piensa en el impacto a largo plazo',
    category: 'vision_futura',
    type: 'vision',
    difficulty: 'hard',
    estimatedTime: 20,
    prompts: [
      '¿Qué quieres que digan de ti en tu funeral?',
      '¿Qué enseñanzas quieres transmitir a las próximas generaciones?',
      '¿Cómo quieres contribuir al futuro de la humanidad?',
      '¿Qué cambios quieres ver en el mundo cuando ya no estés?'
    ]
  },

  // OBSTÁCULOS
  {
    id: 'obstaculos_1',
    title: 'Lo que me detiene',
    description: 'Identifica y supera tus limitaciones',
    category: 'obstaculos',
    type: 'reflection',
    difficulty: 'hard',
    estimatedTime: 18,
    prompts: [
      '¿Qué miedos te impiden perseguir lo que realmente quieres?',
      '¿Qué voces internas o externas te dicen que no puedes hacer algo?',
      '¿Qué excusas usas para no tomar acción?',
      '¿Qué patrones de pensamiento te limitan?'
    ],
    followUpQuestions: [
      '¿Cómo podrías empezar a superar estos obstáculos?',
      '¿Quién podría apoyarte en este proceso?'
    ]
  },

  // RECURSOS
  {
    id: 'recursos_1',
    title: 'Mi red de apoyo',
    description: 'Identifica tus aliados y recursos',
    category: 'recursos',
    type: 'reflection',
    difficulty: 'easy',
    estimatedTime: 12,
    prompts: [
      '¿Quiénes son las personas que más te inspiran?',
      '¿Qué recursos (tiempo, dinero, habilidades) tienes disponibles?',
      '¿Qué comunidades o grupos te apoyan en tu crecimiento?',
      '¿Qué herramientas o conocimientos necesitas desarrollar?'
    ]
  }
];

// INSIGHTS GENERADOS AUTOMÁTICAMENTE BASADOS EN PATRONES DE RESPUESTAS
export const PURPOSE_INSIGHTS: PurposeInsight[] = [
  {
    id: 'insight_autenticidad',
    title: 'Tu Autenticidad es tu Superpoder',
    description: 'Tus respuestas revelan una fuerte conexión con ser auténtico. Tu propósito probablemente involucre expresar tu verdadero yo y ayudar a otros a hacer lo mismo.',
    category: 'autoconocimiento',
    triggerAnswers: ['auto_1', 'valores_1'],
    actionableSteps: [
      'Reflexiona sobre cómo puedes ser más auténtico en tus interacciones diarias',
      'Identifica espacios donde puedas expresar tu verdadero yo sin filtros',
      'Considera cómo tu autenticidad puede inspirar a otros'
    ]
  },
  {
    id: 'insight_servicio',
    title: 'El Servicio como Propósito',
    description: 'Tu deseo de ayudar a otros y crear impacto positivo es una señal clara de que tu propósito está relacionado con el servicio a la comunidad.',
    category: 'impacto',
    triggerAnswers: ['impacto_1', 'impacto_2'],
    actionableSteps: [
      'Explora oportunidades de voluntariado en tu área de interés',
      'Identifica problemas específicos que te motiven a actuar',
      'Conecta con organizaciones que trabajen en tu causa'
    ]
  },
  {
    id: 'insight_creatividad',
    title: 'La Creatividad como Expresión',
    description: 'Tu pasión por actividades creativas y tu curiosidad infinita sugieren que tu propósito puede estar en crear, innovar o expresar ideas nuevas.',
    category: 'pasiones',
    triggerAnswers: ['pasiones_1', 'pasiones_2'],
    actionableSteps: [
      'Dedica tiempo regular a tus actividades creativas favoritas',
      'Comparte tu creatividad con otros a través de proyectos',
      'Busca comunidades de personas creativas en tu área'
    ]
  },
  {
    id: 'insight_aprendizaje',
    title: 'El Aprendizaje como Camino',
    description: 'Tu curiosidad constante y deseo de crecimiento indican que tu propósito puede estar en el aprendizaje continuo y la transmisión de conocimiento.',
    category: 'talentes',
    triggerAnswers: ['talentos_1', 'pasiones_2'],
    actionableSteps: [
      'Identifica áreas específicas donde quieras profundizar tu conocimiento',
      'Considera cómo puedes enseñar o compartir lo que aprendes',
      'Explora roles que involucren investigación o educación'
    ]
  },
  {
    id: 'insight_liderazgo',
    title: 'Liderazgo por Inspiración',
    description: 'Tu visión clara del futuro y tu deseo de impacto sugieren potencial para liderazgo. Tu propósito puede involucrar guiar a otros hacia un futuro mejor.',
    category: 'vision_futura',
    triggerAnswers: ['vision_1', 'impacto_1'],
    actionableSteps: [
      'Busca oportunidades para liderar proyectos pequeños',
      'Desarrolla habilidades de comunicación y motivación',
      'Conecta con mentores que puedan guiarte en tu desarrollo como líder'
    ]
  }
];

// FUNCIONES HELPER PARA EL SISTEMA
export function getQuestionsByCategory(category: PurposeCategory): PurposeQuestion[] {
  return PURPOSE_QUESTIONS.filter(q => q.category === category);
}

export function getQuestionsByDifficulty(difficulty: PurposeQuestion['difficulty']): PurposeQuestion[] {
  return PURPOSE_QUESTIONS.filter(q => q.difficulty === difficulty);
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
