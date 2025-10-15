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
      key: 'tipo_meta_post_graduacion',
      text: '¿Qué tipo de meta profesional tengo más clara para mi primer año como EXATEC?',
      options: [
        { value: 1, label: 'Consolidarme en un empleo que me apasione.', emoji: '💼' },
        { value: 2, label: 'Aplicar a un posgrado en el extranjero.', emoji: '🎓' },
        { value: 3, label: 'Emprender o hacer crecer mi negocio.', emoji: '🚀' },
        { value: 4, label: 'Adquirir certificaciones profesionales.', emoji: '📜' },
        { value: 5, label: 'Aún estoy explorando mis opciones.', emoji: '🔍' }
      ]
    },
    {
      key: 'preparacion_financiera',
      text: '¿Qué tan preparado/a estoy financieramente para la transición post-graduación?',
      options: [
        { value: 1, label: 'Tengo un plan financiero sólido y ahorros.', emoji: '💰' },
        { value: 2, label: 'Tengo algunos ahorros pero necesito más planificación.', emoji: '💳' },
        { value: 3, label: 'Tengo poco ahorro, necesito crear un presupuesto.', emoji: '📊' },
        { value: 4, label: 'No he pensado en mi situación financiera post-graduación.', emoji: '😅' }
      ]
    },
    {
      key: 'red_profesional',
      text: '¿Cómo evalúas tu red profesional actual?',
      options: [
        { value: 1, label: 'Tengo una red sólida y activa en LinkedIn.', emoji: '🔗' },
        { value: 2, label: 'Tengo contactos pero necesito expandir mi red.', emoji: '👥' },
        { value: 3, label: 'Tengo pocos contactos profesionales relevantes.', emoji: '🤷' },
        { value: 4, label: 'No he desarrollado mi red profesional aún.', emoji: '📱' }
      ]
    },
    {
      key: 'bienestar_integral',
      text: '¿En qué dimensión del bienestar sientes que necesitas más apoyo durante esta transición?',
      options: [
        { value: 1, label: 'Bienestar físico (ejercicio, salud).', emoji: '💪' },
        { value: 2, label: 'Bienestar emocional (estrés, ansiedad).', emoji: '🧘' },
        { value: 3, label: 'Bienestar espiritual (propósito, valores).', emoji: '✨' },
        { value: 4, label: 'Bienestar social (relaciones, comunidad).', emoji: '🤝' },
        { value: 5, label: 'Me siento equilibrado/a en todas las dimensiones.', emoji: '⚖️' }
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
