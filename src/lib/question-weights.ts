import type { SemesterStage } from './types';

/**
 * Metadata de preguntas: pesos, dimensiones, thresholds de urgencia
 * 
 * - weight: Importancia relativa dentro de la misma dimensión (0-1)
 * - urgencyThreshold: Si score <= threshold, se marca como "Urgente"
 * - dimension: Dimensión del bienestar a la que pertenece
 * - label: Etiqueta descriptiva para mostrar al estudiante
 */

export interface QuestionMetadata {
  key: string;
  dimension: string;
  weight: number;
  urgencyThreshold: number;
  label: string;
}

export interface StageQuestionConfig {
  [questionKey: string]: Omit<QuestionMetadata, 'key'>;
}

/**
 * Configuración de pesos y metadata por etapa académica
 */
export const QUESTION_WEIGHTS: Record<SemesterStage, StageQuestionConfig> = {
  // ============================================================
  // ETAPA: PRIMER SEMESTRE (1° semestre) - EXCEPCIÓN
  // ============================================================
  primerSemestre: {
    // EXCEPCIÓN: Solo IBI + modal de dimensiones
    // No tiene test brújula, usa dimensiones con puntaje más bajo en IBI
    adaptacion: {
      dimension: 'Emocional',
      weight: 0.8,
      urgencyThreshold: 2,
      label: 'adaptación a la vida universitaria'
    },
    habitos_estudio: {
      dimension: 'Intelectual',
      weight: 0.7,
      urgencyThreshold: 2,
      label: 'hábitos de estudio'
    },
    vida_social: {
      dimension: 'Social',
      weight: 0.6,
      urgencyThreshold: 2,
      label: 'integración social'
    }
  },
  
  // ============================================================
  // ETAPA: EXPLORACIÓN (2°-3° semestre) - Test: Brújula de Enfoque
  // ============================================================
  exploracion: {
    carrera: {
      dimension: 'Ocupacional',
      weight: 0.7,
      urgencyThreshold: 3,
      label: 'claridad vocacional'
    },
    academico: {
      dimension: 'Intelectual',
      weight: 0.6,
      urgencyThreshold: 2,
      label: 'desempeño académico'
    },
    practicas: {
      dimension: 'Ocupacional',
      weight: 0.3,
      urgencyThreshold: 2,
      label: 'preparación para prácticas profesionales'
    },
    servicio_social: {
      dimension: 'Social',
      weight: 0.5,
      urgencyThreshold: 2,
      label: 'plan de servicio social'
    }
  },

  // ============================================================
  // ETAPA: ENFOQUE (4°-6° semestre) - Test: Brújula de Especialización
  // ============================================================
  enfoque: {
    semestre_tec: {
      dimension: 'Ocupacional',
      weight: 0.8,
      urgencyThreshold: 3,
      label: 'planeación de Semestre Tec'
    },
    servicio_social: {
      dimension: 'Ocupacional',
      weight: 0.7,
      urgencyThreshold: 3,
      label: 'avance de servicio social'
    },
    practicas: {
      dimension: 'Ocupacional',
      weight: 0.5,
      urgencyThreshold: 2,
      label: 'preparación para prácticas profesionales'
    },
    idioma: {
      dimension: 'Intelectual',
      weight: 0.4,
      urgencyThreshold: 2,
      label: 'certificación de idioma para intercambio'
    },
    mentoria: {
      dimension: 'Social',
      weight: 0.3,
      urgencyThreshold: 3,
      label: 'desarrollo de liderazgo y mentoría'
    }
  },

  // ============================================================
  // ETAPA: ESPECIALIZACIÓN (7°-8° semestre) - Test: Checklist de Graduación
  // ============================================================
  especializacion: {
    situacion_profesional: {
      dimension: 'Ocupacional',
      weight: 0.9,
      urgencyThreshold: 2,
      label: 'situación profesional actual'
    },
    posgrado: {
      dimension: 'Ocupacional',
      weight: 0.4,
      urgencyThreshold: 3,
      label: 'exploración de posgrados y becas'
    },
    presupuesto_egresado: {
      dimension: 'Ocupacional',
      weight: 0.3,
      urgencyThreshold: 3,
      label: 'planeación financiera post-graduación'
    },
    certificacion_profesional: {
      dimension: 'Intelectual',
      weight: 0.4,
      urgencyThreshold: 3,
      label: 'certificaciones profesionales'
    },
    desarrollo_continuo: {
      dimension: 'Intelectual',
      weight: 0.3,
      urgencyThreshold: 3,
      label: 'actualización profesional continua'
    },
    servicio_social: {
      dimension: 'Ocupacional',
      weight: 0.3,
      urgencyThreshold: 3,
      label: 'completar horas de servicio social'
    },
    bienestar_fisico: {
      dimension: 'Física',
      weight: 0.3,
      urgencyThreshold: 3,
      label: 'mantenimiento de bienestar físico'
    },
    eventos_tec: {
      dimension: 'Social',
      weight: 0.2,
      urgencyThreshold: 3,
      label: 'participación en eventos institucionales'
    },
    transicion_profesional: {
      dimension: 'Emocional',
      weight: 0.4,
      urgencyThreshold: 2,
      label: 'manejo emocional de la transición'
    },
    tipo_meta_post_graduacion: {
      dimension: 'Ocupacional',
      weight: 0.8,
      urgencyThreshold: 3,
      label: 'definición de tipo de meta profesional post-graduación'
    },
    preparacion_financiera: {
      dimension: 'Financiera',
      weight: 0.7,
      urgencyThreshold: 3,
      label: 'preparación financiera para la transición'
    },
    red_profesional: {
      dimension: 'Social',
      weight: 0.6,
      urgencyThreshold: 3,
      label: 'desarrollo y mantenimiento de red profesional'
    },
    bienestar_integral: {
      dimension: 'Emocional',
      weight: 0.5,
      urgencyThreshold: 2,
      label: 'bienestar integral durante la transición'
    }
  },

  // ============================================================
  // ETAPA: GRADUACIÓN (7° semestre en adelante) - CHECKLIST DE GRADUACIÓN
  // ============================================================
  graduacion: {
    situacion_profesional: {
      dimension: 'Ocupacional',
      weight: 0.9, // MÁXIMA PRIORIDAD: Transición al mundo profesional
      urgencyThreshold: 2, // Urgente si aún está buscando
      label: 'situación profesional actual'
    },
    meta_exatec: {
      dimension: 'Ocupacional',
      weight: 0.7, // IMPORTANTE: Planear el primer año post-graduación
      urgencyThreshold: 3,
      label: 'meta para tu primer año como EXATEC'
    },
    balance_vida: {
      dimension: 'Emocional',
      weight: 0.6, // IMPORTANTE: Bienestar en la transición
      urgencyThreshold: 2,
      label: 'balance de vida en esta transición'
    },
    preparacion_profesional: {
      dimension: 'Ocupacional',
      weight: 0.5, // COMPLEMENTARIA: Preparación para entrevistas y negociaciones
      urgencyThreshold: 3,
      label: 'preparación para retos profesionales'
    },
    proyecto_cv: {
      dimension: 'Ocupacional',
      weight: 0.4, // COMPLEMENTARIA: Proyectos de alto impacto para CV
      urgencyThreshold: 3,
      label: 'desarrollo de proyectos de alto impacto'
    },
    certificacion_profesional: {
      dimension: 'Intelectual',
      weight: 0.3, // COMPLEMENTARIA: Certificaciones profesionales
      urgencyThreshold: 3,
      label: 'certificaciones profesionales'
    },
    premio_life: {
      dimension: 'Espiritual',
      weight: 0.3, // COMPLEMENTARIA: Documentar trayectoria para premios
      urgencyThreshold: 3,
      label: 'documentar trayectoria para reconocimientos'
    },
    networking_profesional: {
      dimension: 'Social',
      weight: 0.4, // COMPLEMENTARIA: Networking profesional
      urgencyThreshold: 3,
      label: 'desarrollo de red profesional'
    }
  },

};

/**
 * Obtiene la metadata de una pregunta específica
 */
export function getQuestionMetadata(
  stage: SemesterStage,
  questionKey: string
): QuestionMetadata | undefined {
  const config = QUESTION_WEIGHTS[stage]?.[questionKey];
  if (!config) return undefined;

  return {
    key: questionKey,
    ...config
  };
}

/**
 * Obtiene todas las preguntas de una etapa con su metadata
 */
export function getStageQuestions(stage: SemesterStage): QuestionMetadata[] {
  const stageConfig = QUESTION_WEIGHTS[stage];
  if (!stageConfig) return [];

  return Object.keys(stageConfig).map(key => ({
    key,
    ...stageConfig[key]
  }));
}

/**
 * Verifica si una pregunta es urgente según su score
 */
export function isQuestionUrgent(
  stage: SemesterStage,
  questionKey: string,
  score: number
): boolean {
  const metadata = getQuestionMetadata(stage, questionKey);
  if (!metadata) return false;

  return score <= metadata.urgencyThreshold;
}

/**
 * Obtiene las dimensiones evaluadas en una etapa específica
 */
export function getEvaluatedDimensions(stage: SemesterStage): string[] {
  const stageConfig = QUESTION_WEIGHTS[stage];
  const dimensions = new Set<string>();
  
  for (const questionKey in stageConfig) {
    const question = stageConfig[questionKey as keyof typeof stageConfig];
    if (question && 'dimension' in question) {
      dimensions.add(question.dimension);
    }
  }
  
  return Array.from(dimensions);
}

/**
 * Obtiene las dimensiones del bienestar que NO se evalúan en una etapa específica
 */
export function getComplementaryDimensions(stage: SemesterStage): string[] {
  const allDimensions = ['Ocupacional', 'Intelectual', 'Social', 'Emocional', 'Física', 'Espiritual'];
  const evaluatedDimensions = getEvaluatedDimensions(stage);
  
  return allDimensions.filter(dim => !evaluatedDimensions.includes(dim));
}

/**
 * Verifica si todos los puntajes de dimensiones son altos (no urgentes)
 */
export function areAllScoresHigh(
  dimensionScores: Array<{ dimension: string; weightedScore: number }>,
  stage: SemesterStage
): boolean {
  const stageConfig = QUESTION_WEIGHTS[stage];
  
  for (const dimScore of dimensionScores) {
    // Buscar el threshold más alto para esta dimensión en la etapa
    let maxThreshold = 0;
    for (const questionKey in stageConfig) {
      const question = stageConfig[questionKey as keyof typeof stageConfig];
      if (question && 'dimension' in question && question.dimension === dimScore.dimension) {
        maxThreshold = Math.max(maxThreshold, question.urgencyThreshold);
      }
    }
    
    // Si cualquier dimensión tiene score bajo, no son todos altos
    if (dimScore.weightedScore <= maxThreshold) {
      return false;
    }
  }
  
  return true;
}

