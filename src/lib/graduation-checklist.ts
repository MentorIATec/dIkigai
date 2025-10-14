import type { SemesterStage } from './types';

/**
 * Checklist de Candidaturas a Graduación
 * 
 * Este checklist ayuda al estudiante a validar su preparación profesional,
 * metas de primer año como EXATEC y balance de vida.
 * 
 * Reemplaza al anterior "test de especialización" que era realmente
 * un checklist de graduación mal etiquetado.
 */

export interface GraduationQuestion {
  key: string;
  text: string;
  options: {
    value: number;
    label: string;
    emoji: string;
  }[];
}

export interface GraduationChecklist {
  title: string;
  description: string;
  stage: SemesterStage;
  questions: GraduationQuestion[];
}

export const GRADUATION_CHECKLIST: GraduationChecklist = {
  title: 'Checklist de Candidaturas a Graduación',
  description: 'Este checklist ayuda al estudiante a validar su preparación profesional, metas de primer año como EXATEC y balance de vida.',
  stage: 'graduacion',
  questions: [
    {
      key: 'situacion_profesional',
      text: '¿Cuál es mi situación profesional actual?',
      options: [
        { value: 1, label: 'Ya tengo un empleo de tiempo completo.', emoji: '💼' },
        { value: 2, label: 'Estoy en prácticas profesionales (medio tiempo).', emoji: '🧑‍💻' },
        { value: 3, label: 'Estoy emprendiendo mi propio proyecto.', emoji: '🚀' },
        { value: 4, label: 'Sigo buscando y explorando oportunidades.', emoji: '🔍' }
      ]
    },
    {
      key: 'meta_exatec',
      text: '¿Qué tan claro tengo mi meta para mi primer año como EXATEC?',
      options: [
        { value: 1, label: 'Tengo un plan muy específico y detallado.', emoji: '🎯' },
        { value: 2, label: 'Tengo una idea general pero necesito más detalles.', emoji: '💡' },
        { value: 3, label: 'Tengo algunas ideas pero no están muy claras.', emoji: '🤔' },
        { value: 4, label: 'No tengo claro qué quiero hacer después de graduarme.', emoji: '❓' }
      ]
    },
    {
      key: 'balance_vida',
      text: '¿Cómo manejo el balance de vida en esta transición?',
      options: [
        { value: 1, label: 'Manejo muy bien el balance vida-trabajo-estudio.', emoji: '⚖️' },
        { value: 2, label: 'Tengo un balance aceptable pero puedo mejorar.', emoji: '👍' },
        { value: 3, label: 'Se me dificulta mantener un balance adecuado.', emoji: '😰' },
        { value: 4, label: 'No logro balancear mis responsabilidades.', emoji: '😵' }
      ]
    },
    {
      key: 'preparacion_profesional',
      text: '¿Qué tan preparado/a estoy para retos profesionales?',
      options: [
        { value: 1, label: 'Me siento muy preparado/a para cualquier reto.', emoji: '💪' },
        { value: 2, label: 'Me siento preparado/a para la mayoría de retos.', emoji: '👍' },
        { value: 3, label: 'Me siento preparado/a para algunos retos básicos.', emoji: '🤷' },
        { value: 4, label: 'No me siento preparado/a para retos profesionales.', emoji: '😅' }
      ]
    }
  ]
};

/**
 * Obtiene el checklist de graduación
 */
export function getGraduationChecklist(): GraduationChecklist {
  return GRADUATION_CHECKLIST;
}

/**
 * Calcula el score promedio del checklist
 */
export function calculateGraduationScore(answers: Array<{ key: string; score: number }>): number {
  if (answers.length === 0) return 0;
  
  const totalScore = answers.reduce((sum, answer) => sum + answer.score, 0);
  return totalScore / answers.length;
}

/**
 * Determina el nivel de preparación basado en el score
 */
export function getPreparationLevel(score: number): {
  level: 'excelente' | 'bueno' | 'regular' | 'necesita_mejora';
  message: string;
  color: string;
} {
  if (score <= 1.5) {
    return {
      level: 'excelente',
      message: '¡Excelente! Estás muy bien preparado/a para la transición profesional.',
      color: 'green'
    };
  } else if (score <= 2.5) {
    return {
      level: 'bueno',
      message: 'Buen nivel de preparación. Algunas áreas pueden fortalecerse.',
      color: 'blue'
    };
  } else if (score <= 3.5) {
    return {
      level: 'regular',
      message: 'Preparación básica. Te sugerimos enfocarte en áreas clave.',
      color: 'yellow'
    };
  } else {
    return {
      level: 'necesita_mejora',
      message: 'Necesitas fortalecer tu preparación profesional. ¡Podemos ayudarte!',
      color: 'red'
    };
  }
}
