import type { SemesterStage, StudentProfile } from './types';
import type { DiagnosticAnswer, CuratedGoal } from './types.goal-templates';
import { curatedGoalBankExtended } from './curated-goals';
import { getQuestionMetadata, isQuestionUrgent, getEvaluatedDimensions, getComplementaryDimensions, areAllScoresHigh } from './question-weights';

export interface RecommendationInput {
  stage: SemesterStage;
  answers: DiagnosticAnswer[];
  profile?: StudentProfile;
  selectedGoalIds?: string[];
}

export interface RecommendedGoal {
  id: string;
  goal: CuratedGoal;
  score: number;
  reason: string;
  badge: 'Urgente' | 'Prioritaria' | 'Complementaria' | 'Aplicable siempre';
  isUrgent?: boolean;
}

export interface SmartRecommendations {
  priorityGoal: RecommendedGoal | null;
  complementaryGoal: RecommendedGoal | null;
  longitudinalGoals: RecommendedGoal[];
  otherRecommendations: RecommendedGoal[];
}

interface DimensionScore {
  dimension: string;
  weightedScore: number;
  questions: Array<{
    key: string;
    score: number;
    weight: number;
    label: string;
  }>;
}

/**
 * Calcula scores ponderados por dimensión
 */
function calculateDimensionScores(
  answers: DiagnosticAnswer[],
  stage: SemesterStage
): DimensionScore[] {
  const dimensionMap = new Map<string, DimensionScore>();

  // Agrupar respuestas por dimensión
  for (const answer of answers) {
    const metadata = getQuestionMetadata(stage, answer.key);
    if (!metadata) continue;

    if (!dimensionMap.has(metadata.dimension)) {
      dimensionMap.set(metadata.dimension, {
        dimension: metadata.dimension,
        weightedScore: 0,
        questions: []
      });
    }

    const dimScore = dimensionMap.get(metadata.dimension)!;
    dimScore.questions.push({
      key: answer.key,
      score: answer.score,
      weight: metadata.weight,
      label: metadata.label
    });
  }

  // Calcular score ponderado para cada dimensión
  for (const dimScore of dimensionMap.values()) {
    let totalWeightedScore = 0;
    let totalWeight = 0;

    for (const q of dimScore.questions) {
      totalWeightedScore += q.score * q.weight;
      totalWeight += q.weight;
    }

    // Normalizar por el peso total
    dimScore.weightedScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
  }

  // Ordenar por score ponderado (ascendente = más urgente)
  return Array.from(dimensionMap.values()).sort(
    (a, b) => a.weightedScore - b.weightedScore
  );
}

/**
 * Encuentra la pregunta con mayor peso dentro de una dimensión
 */
function getHighestWeightQuestion(
  dimensionScore: DimensionScore
): DimensionScore['questions'][0] | null {
  if (dimensionScore.questions.length === 0) return null;

  return dimensionScore.questions.reduce((highest, current) =>
    current.weight > highest.weight ? current : highest
  );
}

/**
 * Busca la mejor meta que coincida con los criterios
 */
function findBestMatch(params: {
  dimension: string;
  categoria?: string;
  stage: SemesterStage;
  excludeLongitudinal?: boolean;
  excludeIds?: string[];
}): CuratedGoal | null {
  const { dimension, categoria, stage, excludeLongitudinal = false, excludeIds = [] } = params;

  // Obtener metas de la etapa actual
  const stageGoals = curatedGoalBankExtended[stage]?.metas || [];

  // Filtrar metas
  const candidates = stageGoals.filter(goal => {
    // Excluir IDs ya seleccionados
    if (excludeIds.includes(goal.id)) return false;

    // Excluir longitudinales si se especifica
    if (excludeLongitudinal && goal.id.startsWith('LON_')) return false;

    // Coincidir dimensión
    if (goal.dimension !== dimension) return false;

    // Coincidir categoría si se especifica
    if (categoria && goal.categoria !== categoria) return false;

    return true;
  });

  // Retornar la primera coincidencia (las metas ya están curadas)
  return candidates[0] || null;
}

/**
 * Encuentra meta complementaria
 */
function findComplementaryGoal(params: {
  dimensionScores: DimensionScore[];
  stage: SemesterStage;
  excludeIds: string[];
  priorityDimension: string;
}): { goal: CuratedGoal; question: DimensionScore['questions'][0] } | null {
  const { dimensionScores, stage, excludeIds, priorityDimension } = params;

  // Estrategia 1: Buscar en segunda dimensión prioritaria (para diversidad)
  const secondDimension = dimensionScores.find(d => d.dimension !== priorityDimension);
  if (secondDimension) {
    const question = getHighestWeightQuestion(secondDimension);
    if (question) {
      const goal = findBestMatch({
        dimension: secondDimension.dimension,
        categoria: question.key,
        stage,
        excludeLongitudinal: true,
        excludeIds
      });

      if (goal) {
        return { goal, question };
      }
    }
  }

  // Estrategia 2: Segunda pregunta de la dimensión prioritaria (si score < 3)
  const priorityDim = dimensionScores.find(d => d.dimension === priorityDimension);
  if (priorityDim && priorityDim.questions.length > 1) {
    const sortedQuestions = [...priorityDim.questions].sort((a, b) => b.weight - a.weight);
    const secondQuestion = sortedQuestions[1];

    if (secondQuestion && secondQuestion.score < 3) {
      const goal = findBestMatch({
        dimension: priorityDim.dimension,
        categoria: secondQuestion.key,
        stage,
        excludeLongitudinal: true,
        excludeIds
      });

      if (goal) {
        return { goal, question: secondQuestion };
      }
    }
  }

  return null;
}

/**
 * Selecciona metas longitudinales
 */
function selectLongitudinalGoals(params: {
  excludeDimensions: string[];
  excludeIds: string[];
  count: number;
}): CuratedGoal[] {
  const { excludeDimensions, excludeIds, count } = params;

  const longitudinalGoals = curatedGoalBankExtended.longitudinal?.metas || [];

  // Filtrar y priorizar dimensiones no cubiertas
  const filtered = longitudinalGoals.filter(goal => {
    if (excludeIds.includes(goal.id)) return false;
    return true;
  });

  // Priorizar metas de dimensiones no cubiertas
  const uncoveredDimensionGoals = filtered.filter(
    goal => !excludeDimensions.includes(goal.dimension)
  );

  const coveredDimensionGoals = filtered.filter(
    goal => excludeDimensions.includes(goal.dimension)
  );

  // Combinar: primero no cubiertas, luego cubiertas
  const prioritized = [...uncoveredDimensionGoals, ...coveredDimensionGoals];

  return prioritized.slice(0, count);
}

/**
 * Genera recomendaciones complementarias para puntajes altos
 */
function generateComplementaryRecommendations(params: {
  stage: SemesterStage;
  dimensionScores: DimensionScore[];
  excludeIds: string[];
}): { goal: CuratedGoal; dimension: string }[] {
  const { stage, dimensionScores, excludeIds } = params;
  
  // Obtener dimensiones complementarias (no evaluadas en esta etapa)
  const complementaryDimensions = getComplementaryDimensions(stage);
  
  // Priorizar dimensiones: Emocional, Física, Espiritual
  const dimensionPriority = ['Emocional', 'Física', 'Espiritual'];
  const prioritizedDimensions = dimensionPriority.filter(dim => 
    complementaryDimensions.includes(dim)
  ).concat(
    complementaryDimensions.filter(dim => !dimensionPriority.includes(dim))
  );
  
  // 🎲 ALEATORIZAR EL ORDEN DE LAS DIMENSIONES
  const shuffledDimensions = [...prioritizedDimensions].sort(() => Math.random() - 0.5);
  
  const recommendations: { goal: CuratedGoal; dimension: string }[] = [];
  
  // Buscar metas en dimensiones complementarias (máximo 3 recomendaciones)
  for (const dimension of shuffledDimensions.slice(0, 3)) {
    const goal = findBestMatch({
      dimension,
      stage,
      excludeLongitudinal: true,
      excludeIds: [...excludeIds, ...recommendations.map(r => r.goal.id)]
    });
    
    if (goal) {
      recommendations.push({ goal, dimension });
    }
  }
  
  console.log('🎲 RECOMENDACIONES ALEATORIZADAS:', {
    stage,
    originalOrder: prioritizedDimensions,
    shuffledOrder: shuffledDimensions,
    selectedDimensions: recommendations.map(r => r.dimension),
    selectedGoals: recommendations.map(r => r.goal.id)
  });
  
  return recommendations;
}

/**
 * Genera recomendaciones inteligentes basadas en el diagnóstico
 */
export function generateSmartRecommendations(
  input: RecommendationInput
): SmartRecommendations {
  const { stage, answers, selectedGoalIds = [] } = input;

  // 1. CALCULAR SCORES PONDERADOS POR DIMENSIÓN
  const dimensionScores = calculateDimensionScores(answers, stage);

  if (dimensionScores.length === 0) {
    return {
      priorityGoal: null,
      complementaryGoal: null,
      longitudinalGoals: [],
      otherRecommendations: []
    };
  }

  // 1.5. VERIFICAR SI TODOS LOS PUNTAJES SON ALTOS (NUEVO)
  const allScoresHigh = areAllScoresHigh(dimensionScores, stage);
  
  console.log('🔍 DEBUG RECOMENDACIONES:', {
    stage,
    dimensionScores: dimensionScores.map(ds => ({ dimension: ds.dimension, score: ds.weightedScore })),
    allScoresHigh,
    evaluatedDimensions: getEvaluatedDimensions(stage),
    complementaryDimensions: getComplementaryDimensions(stage)
  });
  
  if (allScoresHigh) {
    // Generar recomendaciones complementarias para puntajes altos
    const complementaryRecommendations = generateComplementaryRecommendations({
      stage,
      dimensionScores,
      excludeIds: selectedGoalIds
    });

    // Convertir a RecommendedGoal format
    const complementaryGoals: RecommendedGoal[] = complementaryRecommendations.map(rec => ({
      id: rec.goal.id,
      goal: rec.goal,
      score: 5, // Puntaje alto
      reason: `Explora tu dimensión ${rec.dimension} para un desarrollo integral`,
      badge: 'Complementaria',
      isUrgent: false
    }));

    return {
      priorityGoal: complementaryGoals[0] || null,
      complementaryGoal: complementaryGoals[1] || null,
      longitudinalGoals: complementaryGoals.slice(2),
      otherRecommendations: []
    };
  }

  // 2. IDENTIFICAR DIMENSIÓN PRIORITARIA (score más bajo)
  const priorityDimension = dimensionScores[0];

  // 3. DENTRO DE ESA DIMENSIÓN, ELEGIR PREGUNTA CON MAYOR PESO
  const priorityQuestion = getHighestWeightQuestion(priorityDimension);

  if (!priorityQuestion) {
    return {
      priorityGoal: null,
      complementaryGoal: null,
      longitudinalGoals: [],
      otherRecommendations: []
    };
  }

  // 4. VERIFICAR SI ES URGENTE
  const isUrgent = isQuestionUrgent(stage, priorityQuestion.key, priorityQuestion.score);

  // 5. SELECCIONAR META PRIORITARIA
  const priorityGoalData = findBestMatch({
    dimension: priorityDimension.dimension,
    categoria: priorityQuestion.key,
    stage,
    excludeLongitudinal: true,
    excludeIds: selectedGoalIds
  });

  const priorityGoal: RecommendedGoal | null = priorityGoalData
    ? {
        id: priorityGoalData.id,
        goal: priorityGoalData,
        score: priorityQuestion.score,
        reason: `Tu ${priorityQuestion.label} necesita atención`,
        badge: isUrgent ? 'Urgente' : 'Prioritaria',
        isUrgent
      }
    : null;

  // 6. SELECCIONAR META COMPLEMENTARIA
  const complementaryData = findComplementaryGoal({
    dimensionScores,
    stage,
    excludeIds: priorityGoal ? [...selectedGoalIds, priorityGoal.id] : selectedGoalIds,
    priorityDimension: priorityDimension.dimension
  });

  const complementaryGoal: RecommendedGoal | null = complementaryData
    ? {
        id: complementaryData.goal.id,
        goal: complementaryData.goal,
        score: complementaryData.question.score,
        reason: `Fortalece tu ${complementaryData.question.label}`,
        badge: 'Complementaria'
      }
    : null;

  // 7. SELECCIONAR METAS LONGITUDINALES
  const coveredDimensions = [
    priorityDimension.dimension,
    ...(complementaryGoal ? [complementaryGoal.goal.dimension] : [])
  ];

  const excludedIds = [
    ...selectedGoalIds,
    ...(priorityGoal ? [priorityGoal.id] : []),
    ...(complementaryGoal ? [complementaryGoal.id] : [])
  ];

  const longitudinalGoalsData = selectLongitudinalGoals({
    excludeDimensions: coveredDimensions,
    excludeIds: excludedIds,
    count: 3
  });

  const longitudinalGoals: RecommendedGoal[] = longitudinalGoalsData.map(goal => ({
    id: goal.id,
    goal,
    score: 0,
    reason: 'Útil en cualquier etapa',
    badge: 'Aplicable siempre'
  }));

  // 8. OTRAS RECOMENDACIONES (opcional, para futuras mejoras)
  const otherRecommendations: RecommendedGoal[] = [];

  return {
    priorityGoal,
    complementaryGoal,
    longitudinalGoals,
    otherRecommendations
  };
}

/**
 * Obtiene alternativas para una meta rechazada
 */
export function getAlternativeGoals(params: {
  rejectedGoal: CuratedGoal;
  stage: SemesterStage;
  excludeIds: string[];
  limit?: number;
}): CuratedGoal[] {
  const { rejectedGoal, stage, excludeIds, limit = 3 } = params;

  const stageGoals = curatedGoalBankExtended[stage]?.metas || [];

  // Buscar metas de la misma dimensión y categoría
  const alternatives = stageGoals.filter(goal => {
    if (excludeIds.includes(goal.id)) return false;
    if (goal.id === rejectedGoal.id) return false;
    if (goal.dimension !== rejectedGoal.dimension) return false;
    if (goal.categoria !== rejectedGoal.categoria) return false;
    return true;
  });

  return alternatives.slice(0, limit);
}

/**
 * FUNCIÓN LEGACY: Mantener por compatibilidad
 * @deprecated Usar generateSmartRecommendations en su lugar
 */
export function generateRecommendations(input: RecommendationInput): RecommendedGoal[] {
  const smartRecs = generateSmartRecommendations(input);

  return [
    ...(smartRecs.priorityGoal ? [smartRecs.priorityGoal] : []),
    ...(smartRecs.complementaryGoal ? [smartRecs.complementaryGoal] : []),
    ...smartRecs.longitudinalGoals,
    ...smartRecs.otherRecommendations
  ];
}
