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
  preferredCategories?: string[];
}): CuratedGoal | null {
  const { dimension, categoria, stage, excludeLongitudinal = false, excludeIds = [], preferredCategories = [] } = params;

  // Obtener metas de la etapa actual
  const stageGoals = curatedGoalBankExtended[stage]?.metas || [];

  console.log('🔍 DEBUG findBestMatch - INICIO:', {
    stage,
    dimension,
    categoria,
    excludeLongitudinal,
    excludeIds,
    totalStageGoals: stageGoals.length
  });

  // Filtrar metas
  const candidates = stageGoals.filter(goal => {
    // Excluir IDs ya seleccionados
    if (excludeIds.includes(goal.id)) {
      console.log('🚫 Excluido por ID ya seleccionado:', goal.id);
      return false;
    }

    // Excluir longitudinales si se especifica
    if (excludeLongitudinal && goal.id.startsWith('LON_')) {
      console.log('🚫 Excluido por ser longitudinal:', goal.id);
      return false;
    }

    // Coincidir dimensión
    if (goal.dimension !== dimension) {
      console.log('🚫 Excluido por dimensión:', goal.id, 'dimension:', goal.dimension, 'buscada:', dimension);
      return false;
    }

    // Coincidir categoría si se especifica
    if (categoria && goal.categoria !== categoria) {
      console.log('🚫 Excluido por categoría:', goal.id, 'categoria:', goal.categoria, 'buscada:', categoria);
      return false;
    }

    console.log('✅ Meta válida:', goal.id);
    return true;
  });

  console.log('🔍 DEBUG findBestMatch - RESULTADO:', {
    candidatesFound: candidates.length,
    candidates: candidates.map(c => ({ id: c.id, dimension: c.dimension, categoria: c.categoria }))
  });

  if (candidates.length === 0) {
    return null;
  }

  // Si hay categorías preferidas y no se especificó una categoría exacta, priorizar por preferencias
  if (!categoria && preferredCategories.length > 0) {
    console.log('🔍 DEBUG findBestMatch - Priorizando por categorías preferidas:', preferredCategories);
    
    // Buscar metas que coincidan con categorías preferidas
    for (const preferredCategory of preferredCategories) {
      const preferredCandidate = candidates.find(c => c.categoria === preferredCategory);
      if (preferredCandidate) {
        console.log('✅ Meta seleccionada por categoría preferida:', preferredCandidate.id, preferredCategory);
        return preferredCandidate;
      }
    }
  }

  // Retornar la primera coincidencia (las metas ya están curadas)
  console.log('✅ Meta seleccionada (primera coincidencia):', candidates[0].id);
  return candidates[0];
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

  console.log('🔍 DEBUG findComplementaryGoal - INICIO:', {
    stage,
    priorityDimension,
    excludeIds,
    dimensionScores: dimensionScores.map(ds => ({ dimension: ds.dimension, score: ds.weightedScore, questions: ds.questions.length }))
  });

  // Estrategia 1: Buscar en segunda dimensión prioritaria (para diversidad)
  const secondDimension = dimensionScores.find(d => d.dimension !== priorityDimension);
  console.log('🔍 DEBUG Estrategia 1 - Segunda dimensión:', {
    secondDimension: secondDimension ? { dimension: secondDimension.dimension, score: secondDimension.weightedScore } : null
  });
  
  if (secondDimension) {
    const question = getHighestWeightQuestion(secondDimension);
    console.log('🔍 DEBUG Estrategia 1 - Pregunta seleccionada:', {
      question: question ? { key: question.key, score: question.score, weight: question.weight } : null
    });
    
    if (question) {
      const goal = findBestMatch({
        dimension: secondDimension.dimension,
        categoria: question.key,
        stage,
        excludeLongitudinal: true,
        excludeIds
      });

      console.log('🔍 DEBUG Estrategia 1 - Meta encontrada:', {
        goal: goal ? { id: goal.id, dimension: goal.dimension, categoria: goal.categoria } : null
      });

      if (goal) {
        console.log('✅ ESTRATEGIA 1 EXITOSA:', { goalId: goal.id, dimension: goal.dimension });
        return { goal, question };
      }
    }
  }

  // Estrategia 2: Segunda pregunta de la dimensión prioritaria (si score < 3)
  const priorityDim = dimensionScores.find(d => d.dimension === priorityDimension);
  console.log('🔍 DEBUG Estrategia 2 - Dimensión prioritaria:', {
    priorityDim: priorityDim ? { dimension: priorityDim.dimension, questionsCount: priorityDim.questions.length } : null
  });
  
  if (priorityDim && priorityDim.questions.length > 1) {
    const sortedQuestions = [...priorityDim.questions].sort((a, b) => b.weight - a.weight);
    const secondQuestion = sortedQuestions[1];

    console.log('🔍 DEBUG Estrategia 2 - Segunda pregunta:', {
      secondQuestion: secondQuestion ? { key: secondQuestion.key, score: secondQuestion.score, weight: secondQuestion.weight } : null
    });

    if (secondQuestion && secondQuestion.score <= 3) {
      const goal = findBestMatch({
        dimension: priorityDim.dimension,
        categoria: secondQuestion.key,
        stage,
        excludeLongitudinal: true,
        excludeIds
      });

      console.log('🔍 DEBUG Estrategia 2 - Meta encontrada:', {
        goal: goal ? { id: goal.id, dimension: goal.dimension, categoria: goal.categoria } : null
      });

      if (goal) {
        console.log('✅ ESTRATEGIA 2 EXITOSA:', { goalId: goal.id, dimension: goal.dimension });
        return { goal, question: secondQuestion };
      }
    }
  }

  // Estrategia 3: Buscar en dimensiones complementarias (mejora Opción B)
  console.log('🔍 DEBUG Estrategia 3 - Buscando en dimensiones complementarias');
  
  const complementaryDimensions = getComplementaryDimensionsForPriority(priorityDimension, stage);
  console.log('🔍 DEBUG Estrategia 3 - Dimensiones complementarias:', {
    priorityDimension,
    complementaryDimensions
  });

  for (const dimension of complementaryDimensions) {
    console.log(`🔍 DEBUG Estrategia 3 - Buscando en dimensión: ${dimension}`);
    
    // Buscar la mejor meta en esta dimensión complementaria
    const goal = findBestMatch({
      dimension,
      stage,
      excludeLongitudinal: true,
      excludeIds,
      // Priorizar categorías más relevantes para la etapa
      preferredCategories: getPreferredCategoriesForStage(stage)
    });

    console.log('🔍 DEBUG Estrategia 3 - Meta encontrada:', {
      dimension,
      goal: goal ? { id: goal.id, dimension: goal.dimension, categoria: goal.categoria } : null
    });

    if (goal) {
      console.log('✅ ESTRATEGIA 3 EXITOSA:', { 
        goalId: goal.id, 
        dimension: goal.dimension,
        reason: `Meta complementaria de dimensión ${dimension}`
      });
      return { goal, question: { key: goal.categoria, score: 2, weight: 1 } }; // Pseudo-question
    }
  }

  // Estrategia 4: Fallback - Meta aleatoria de dimensiones complementarias
  console.log('🔍 DEBUG Estrategia 4 - Fallback: Meta aleatoria complementaria');
  
  const fallbackGoal = findRandomComplementaryGoal(stage, excludeIds);
  if (fallbackGoal) {
    console.log('✅ ESTRATEGIA 4 EXITOSA:', { 
      goalId: fallbackGoal.id, 
      dimension: fallbackGoal.dimension,
      reason: 'Meta aleatoria complementaria'
    });
    return { goal: fallbackGoal, question: { key: fallbackGoal.categoria, score: 2, weight: 1 } };
  }

  console.log('❌ TODAS LAS ESTRATEGIAS FALLARON - No se encontró meta complementaria');
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

  console.log('🔍 DEBUG META COMPLEMENTARIA:', {
    stage,
    priorityDimension: priorityDimension.dimension,
    dimensionScores: dimensionScores.map(ds => ({ dimension: ds.dimension, score: ds.weightedScore })),
    complementaryData: complementaryData ? {
      goalId: complementaryData.goal.id,
      dimension: complementaryData.goal.dimension,
      questionKey: complementaryData.question.key
    } : null
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

  // 8. OTRAS RECOMENDACIONES INTELIGENTES (mejora Opción B)
  const otherRecommendations: RecommendedGoal[] = [];
  
  // Si no hay meta complementaria, generar recomendaciones adicionales inteligentes
  if (!complementaryGoal && priorityGoal) {
    console.log('🔍 DEBUG - Generando recomendaciones adicionales inteligentes');
    
    const allExcludedIds = [
      ...selectedGoalIds,
      ...(priorityGoal ? [priorityGoal.id] : []),
      ...(complementaryGoal ? [complementaryGoal.id] : []),
      ...longitudinalGoals.map(g => g.id)
    ];

    // Buscar metas adicionales en dimensiones complementarias
    const complementaryDimensions = getComplementaryDimensionsForPriority(priorityDimension.dimension, stage);
    
    for (const dimension of complementaryDimensions.slice(0, 2)) { // Máximo 2 dimensiones adicionales
      const additionalGoal = findBestMatch({
        dimension,
        stage,
        excludeLongitudinal: true,
        excludeIds: allExcludedIds,
        preferredCategories: getPreferredCategoriesForStage(stage)
      });

      if (additionalGoal) {
        const recommendedGoal: RecommendedGoal = {
          id: additionalGoal.id,
          goal: additionalGoal,
          score: 2, // Score neutral
          reason: `Desarrollo en ${dimension}`,
          badge: 'Recomendada'
        };

        otherRecommendations.push(recommendedGoal);
        allExcludedIds.push(additionalGoal.id); // Evitar duplicados

        console.log('✅ Recomendación adicional generada:', {
          id: additionalGoal.id,
          dimension: additionalGoal.dimension,
          categoria: additionalGoal.categoria
        });

        // Limitar a máximo 2 recomendaciones adicionales
        if (otherRecommendations.length >= 2) break;
      }
    }
  }

  console.log('🎯 DEBUG - Recomendaciones finales generadas:', {
    priorityGoal: priorityGoal ? priorityGoal.id : 'N/A',
    complementaryGoal: complementaryGoal ? complementaryGoal.id : 'N/A',
    longitudinalGoals: longitudinalGoals.length,
    otherRecommendations: otherRecommendations.length
  });

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

  console.log('🔍 DEBUG getAlternativeGoals - INICIO:', {
    rejectedGoal: { id: rejectedGoal.id, dimension: rejectedGoal.dimension, categoria: rejectedGoal.categoria },
    stage,
    excludeIds,
    totalStageGoals: stageGoals.length
  });

  // Estrategia 1: Buscar metas de la misma dimensión y categoría (más específicas)
  let alternatives = stageGoals.filter(goal => {
    if (excludeIds.includes(goal.id)) return false;
    if (goal.id === rejectedGoal.id) return false;
    if (goal.dimension !== rejectedGoal.dimension) return false;
    if (goal.categoria !== rejectedGoal.categoria) return false;
    return true;
  });

  console.log('🔍 DEBUG getAlternativeGoals - Estrategia 1 (misma dimensión y categoría):', {
    found: alternatives.length,
    alternatives: alternatives.map(g => ({ id: g.id, dimension: g.dimension, categoria: g.categoria }))
  });

  // Estrategia 2: Si no hay suficientes, buscar metas de la misma dimensión (diferentes categorías)
  if (alternatives.length < limit) {
    const sameDimensionAlternatives = stageGoals.filter(goal => {
      if (excludeIds.includes(goal.id)) return false;
      if (goal.id === rejectedGoal.id) return false;
      if (goal.dimension !== rejectedGoal.dimension) return false;
      if (alternatives.some(alt => alt.id === goal.id)) return false; // No duplicar
      return true;
    });

    console.log('🔍 DEBUG getAlternativeGoals - Estrategia 2 (misma dimensión):', {
      found: sameDimensionAlternatives.length,
      alternatives: sameDimensionAlternatives.map(g => ({ id: g.id, dimension: g.dimension, categoria: g.categoria }))
    });

    alternatives = [...alternatives, ...sameDimensionAlternatives];
  }

  // Estrategia 3: Si aún no hay suficientes, buscar en dimensiones complementarias
  if (alternatives.length < limit) {
    const complementaryDimensions = getComplementaryDimensionsForPriority(rejectedGoal.dimension, stage);
    const complementaryAlternatives: CuratedGoal[] = [];

    for (const dimension of complementaryDimensions) {
      const dimensionAlternatives = stageGoals.filter(goal => {
        if (excludeIds.includes(goal.id)) return false;
        if (goal.id === rejectedGoal.id) return false;
        if (goal.dimension !== dimension) return false;
        if (alternatives.some(alt => alt.id === goal.id)) return false; // No duplicar
        if (complementaryAlternatives.some(alt => alt.id === goal.id)) return false; // No duplicar
        return true;
      });

      complementaryAlternatives.push(...dimensionAlternatives);
      
      if (complementaryAlternatives.length >= limit) break;
    }

    console.log('🔍 DEBUG getAlternativeGoals - Estrategia 3 (dimensiones complementarias):', {
      found: complementaryAlternatives.length,
      alternatives: complementaryAlternatives.map(g => ({ id: g.id, dimension: g.dimension, categoria: g.categoria }))
    });

    alternatives = [...alternatives, ...complementaryAlternatives];
  }

  // Estrategia 4: Fallback - Cualquier meta disponible (no longitudinal)
  if (alternatives.length < limit) {
    const fallbackAlternatives = stageGoals.filter(goal => {
      if (excludeIds.includes(goal.id)) return false;
      if (goal.id === rejectedGoal.id) return false;
      if (goal.dimension === 'Longitudinal') return false; // Excluir longitudinales
      if (alternatives.some(alt => alt.id === goal.id)) return false; // No duplicar
      return true;
    });

    console.log('🔍 DEBUG getAlternativeGoals - Estrategia 4 (fallback):', {
      found: fallbackAlternatives.length,
      alternatives: fallbackAlternatives.map(g => ({ id: g.id, dimension: g.dimension, categoria: g.categoria }))
    });

    alternatives = [...alternatives, ...fallbackAlternatives];
  }

  const result = alternatives.slice(0, limit);
  console.log('✅ getAlternativeGoals - RESULTADO FINAL:', {
    requested: limit,
    found: result.length,
    alternatives: result.map(g => ({ id: g.id, dimension: g.dimension, categoria: g.categoria }))
  });

  return result;
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

/**
 * Obtiene dimensiones complementarias basadas en la dimensión prioritaria
 */
function getComplementaryDimensionsForPriority(priorityDimension: string, stage: SemesterStage): string[] {
  const allDimensions = ['Ocupacional', 'Intelectual', 'Social', 'Física', 'Emocional', 'Financiera', 'Espiritual'];
  
  // Para cada dimensión prioritaria, definimos las más complementarias
  const complementaryMap: { [key: string]: string[] } = {
    'Ocupacional': ['Social', 'Emocional', 'Intelectual'], // Networking, manejo de estrés, desarrollo profesional
    'Intelectual': ['Social', 'Física', 'Emocional'], // Colaboración, bienestar físico, motivación
    'Social': ['Emocional', 'Física', 'Espiritual'], // Inteligencia emocional, salud, propósito
    'Física': ['Emocional', 'Social', 'Espiritual'], // Bienestar mental, actividades grupales, mindfulness
    'Emocional': ['Social', 'Física', 'Espiritual'], // Apoyo social, ejercicio, reflexión
    'Financiera': ['Ocupacional', 'Intelectual', 'Social'], // Desarrollo profesional, educación, networking
    'Espiritual': ['Emocional', 'Social', 'Física'] // Bienestar emocional, comunidad, cuidado personal
  };

  return complementaryMap[priorityDimension] || ['Social', 'Emocional', 'Física'];
}

/**
 * Obtiene categorías preferidas para cada etapa
 */
function getPreferredCategoriesForStage(stage: SemesterStage): string[] {
  const stagePreferences: { [key in SemesterStage]: string[] } = {
    primerSemestre: ['academico', 'social', 'fisico', 'emocional'],
    exploracion: ['carrera', 'academico', 'social', 'idioma'],
    enfoque: ['semestre_tec', 'servicio_social', 'carrera', 'idioma'],
    especializacion: ['carrera', 'academico', 'social', 'financiero'],
    graduacion: ['carrera', 'financiero', 'social', 'emocional'],
    longitudinal: ['social', 'emocional', 'espiritual', 'fisico']
  };

  return stagePreferences[stage] || [];
}

/**
 * Encuentra una meta aleatoria complementaria como fallback
 */
function findRandomComplementaryGoal(stage: SemesterStage, excludeIds: string[]): CuratedGoal | null {
  const stageData = curatedGoalBankExtended[stage];
  if (!stageData) return null;

  // Filtrar metas disponibles (no longitudinales, no excluidas)
  const availableGoals = stageData.metas.filter(goal => 
    goal.dimension !== 'Longitudinal' && 
    !excludeIds.includes(goal.id)
  );

  if (availableGoals.length === 0) return null;

  // Seleccionar aleatoriamente
  const randomIndex = Math.floor(Math.random() * availableGoals.length);
  return availableGoals[randomIndex];
}
