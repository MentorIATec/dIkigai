import type { SemesterStage, StudentProfile } from './types';
import type { DiagnosticAnswer } from './types.goal-templates';
import { curatedGoalBankExtended } from './curated-goals';

export interface RecommendationInput {
  stage: SemesterStage;
  answers: DiagnosticAnswer[];
  profile?: StudentProfile;
  selectedGoalIds?: string[];
}

export interface RecommendedGoal {
  id: string;
  score: number;
  reason: string;
}

/**
 * Genera recomendaciones de metas basadas en el diagnóstico y perfil del estudiante
 */
export function generateRecommendations(input: RecommendationInput): RecommendedGoal[] {
  const { stage, answers, profile, selectedGoalIds = [] } = input;
  
  // Obtener metas de la etapa actual
  const stageGoals = curatedGoalBankExtended[stage]?.metas || [];
  
  // Calcular scores para cada meta
  const scoredGoals = stageGoals.map(goal => {
    let score = 0;
    const reasons: string[] = [];
    
    // Priorizar metas de la etapa actual
    score += 2;
    reasons.push('Meta de tu etapa académica');
    
    // Bonus por coincidencia con áreas de enfoque (score ≤ 3)
    const focusAreas = answers
      .filter(answer => answer.score <= 3)
      .map(answer => answer.key.toLowerCase());
    
    if (focusAreas.some(area => 
      goal.dimension.toLowerCase().includes(area) ||
      goal.categoria.toLowerCase().includes(area)
    )) {
      score += 2;
      reasons.push('Coincide con áreas de mejora identificadas');
    }
    
    // Bonus por coincidencia de categoría
    const answerCategories = answers.map(answer => answer.key.toLowerCase());
    if (answerCategories.some(category => 
      goal.categoria.toLowerCase().includes(category)
    )) {
      score += 1;
      reasons.push('Coincide con categoría de interés');
    }
    
    // Bonus por coincidencia con carrera (si aplica)
    if (profile?.carreraName) {
      const carreraLower = profile.carreraName.toLowerCase();
      if (goal.metaSmarter.toLowerCase().includes(carreraLower) ||
          goal.pasosAccion.toLowerCase().includes(carreraLower)) {
        score += 1;
        reasons.push('Relevante para tu carrera');
      }
    }
    
    // Penalizar metas ya seleccionadas
    if (selectedGoalIds.includes(goal.id)) {
      score -= 1;
      reasons.push('Ya seleccionada anteriormente');
    }
    
    return {
      id: goal.id,
      score,
      reason: reasons.join(', ')
    };
  });
  
  // Ordenar por score descendente y tomar top N
  return scoredGoals
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .filter(goal => goal.score > 0);
}
