# 🎯 PROPUESTA DE REFACTORIZACIÓN - TESTS BRÚJULA

## 🔍 PROBLEMA IDENTIFICADO

### **Conflicto de Categorías → Misma Dimensión:**
- **"Carrera"** → Dimensión Ocupacional
- **"Prácticas"** → Dimensión Ocupacional
- **"Servicio Social"** → Dimensión Social
- **"Académico"** → Dimensión Intelectual
- **"Idioma"** → Dimensión Intelectual

**Resultado:** Si ambas tienen score bajo, ¿cuál priorizar?

---

## ✅ SOLUCIÓN PROPUESTA: SISTEMA DE PRIORIZACIÓN INTELIGENTE

### **NUEVA LÓGICA DE RECOMENDACIÓN:**

#### **Paso 1: Análisis de Respuestas**
```typescript
// Agrupar respuestas por dimensión
const answersByDimension = {
  Ocupacional: [
    { key: 'carrera', score: 2, weight: 0.6 },      // Mayor peso (decisión fundamental)
    { key: 'practicas', score: 2, weight: 0.4 }     // Menor peso (complementaria)
  ],
  Intelectual: [
    { key: 'academico', score: 3, weight: 0.6 },
    { key: 'idioma', score: 4, weight: 0.4 }
  ],
  Social: [
    { key: 'servicio_social', score: 4, weight: 1.0 }
  ]
};

// Calcular score ponderado por dimensión
const dimensionScores = {
  Ocupacional: (2 * 0.6) + (2 * 0.4) = 2.0,  // ← PRIORITARIA
  Intelectual: (3 * 0.6) + (4 * 0.4) = 3.4,
  Social: 4.0
};
```

#### **Paso 2: Selección de Meta Prioritaria**
```typescript
// Dentro de la dimensión prioritaria (Ocupacional),
// elegir la pregunta con MAYOR PESO (más fundamental)

priorityQuestion = 'carrera' (peso 0.6)
// Porque "elegir carrera" es más fundamental que "buscar prácticas"

priorityGoal = Buscar meta de:
  - Dimensión: Ocupacional
  - Categoría: carrera
  - Etapa: exploracion
  - Específica (no longitudinal)
```

#### **Paso 3: Selección de Meta Complementaria**
```typescript
// Opción A: Segunda pregunta de la misma dimensión prioritaria
complementaryQuestion = 'practicas' (peso 0.4)

// Opción B: Primera pregunta de la segunda dimensión prioritaria
complementaryQuestion = 'academico' (Intelectual, score 3.4)

// DECISIÓN: Usar Opción A si score < 3, sino Opción B
// Esto asegura diversidad de dimensiones
```

#### **Paso 4: Metas Longitudinales**
```typescript
// Seleccionar 3 metas longitudinales que:
// 1. NO coincidan con dimensiones ya cubiertas
// 2. Sean relevantes para la etapa
// 3. Tengan alta aplicabilidad general

longitudinalGoals = [
  { dimension: 'Emocional', ... },  // Nueva dimensión
  { dimension: 'Física', ... },     // Nueva dimensión
  { dimension: 'Espiritual', ... }  // Nueva dimensión
];
```

---

## 🎯 SISTEMA DE PESOS POR PREGUNTA

### **Test de Exploración (2°-3° semestre):**
```typescript
{
  carrera: {
    dimension: 'Ocupacional',
    weight: 0.7,  // MÁS FUNDAMENTAL en esta etapa
    urgencyThreshold: 3  // Si score ≤ 3, es urgente
  },
  academico: {
    dimension: 'Intelectual',
    weight: 0.6,  // Importante para continuar
    urgencyThreshold: 2
  },
  practicas: {
    dimension: 'Ocupacional',
    weight: 0.3,  // Complementaria a carrera
    urgencyThreshold: 2
  },
  servicio_social: {
    dimension: 'Social',
    weight: 0.5,  // Importante pero no urgente aún
    urgencyThreshold: 2
  }
}
```

### **Test de Enfoque (4°-6° semestre):**
```typescript
{
  semestre_tec: {
    dimension: 'Ocupacional',
    weight: 0.8,  // CRÍTICO en esta etapa
    urgencyThreshold: 3
  },
  servicio_social: {
    dimension: 'Social',
    weight: 0.7,  // Urgente completar antes de Semestre Tec
    urgencyThreshold: 3
  },
  practicas: {
    dimension: 'Ocupacional',
    weight: 0.5,  // Complementaria a Semestre Tec
    urgencyThreshold: 2
  },
  idioma: {
    dimension: 'Intelectual',
    weight: 0.4,  // Solo si considera intercambio
    urgencyThreshold: 2
  }
}
```

### **Checklist de Graduación (7°+ semestre):**
```typescript
{
  situacion_profesional: {
    dimension: 'Ocupacional',
    weight: 0.9,  // MÁXIMA PRIORIDAD
    urgencyThreshold: 2
  },
  meta_exatec: {
    dimension: 'Ocupacional',
    weight: 0.7,
    urgencyThreshold: 3
  },
  balance_vida: {
    dimension: 'Emocional',
    weight: 0.6,
    urgencyThreshold: 2
  },
  preparacion_profesional: {
    dimension: 'Ocupacional',
    weight: 0.5,
    urgencyThreshold: 3
  }
}
```

---

## 🧮 ALGORITMO DE PRIORIZACIÓN MEJORADO

```typescript
function generateSmartRecommendations(answers, stage) {
  // 1. CALCULAR SCORES PONDERADOS POR DIMENSIÓN
  const dimensionScores = calculateDimensionScores(answers, stage);
  
  // 2. IDENTIFICAR DIMENSIÓN PRIORITARIA
  const priorityDimension = getLowestScoredDimension(dimensionScores);
  
  // 3. DENTRO DE ESA DIMENSIÓN, ELEGIR PREGUNTA CON MAYOR PESO
  const priorityQuestion = getHighestWeightQuestion(
    answers.filter(a => a.dimension === priorityDimension)
  );
  
  // 4. VERIFICAR SI ES URGENTE (score ≤ urgencyThreshold)
  const isUrgent = priorityQuestion.score <= priorityQuestion.urgencyThreshold;
  
  // 5. SELECCIONAR META PRIORITARIA
  const priorityGoal = findBestMatch({
    dimension: priorityQuestion.dimension,
    categoria: priorityQuestion.key,
    stage: stage,
    excludeLongitudinal: true,
    isUrgent: isUrgent
  });
  
  // 6. SELECCIONAR META COMPLEMENTARIA
  // Buscar en segunda dimensión prioritaria O segunda pregunta de misma dimensión
  const complementaryGoal = findComplementaryGoal({
    excludeDimensions: [priorityDimension],
    stage: stage,
    answers: answers
  });
  
  // 7. SELECCIONAR METAS LONGITUDINALES
  // Priorizar dimensiones NO cubiertas aún
  const longitudinalGoals = selectLongitudinalGoals({
    excludeDimensions: [
      priorityGoal.dimension,
      complementaryGoal.dimension
    ],
    count: 3
  });
  
  // 8. OTRAS RECOMENDACIONES (opcional)
  const otherRecommendations = selectOtherRecommendations({
    stage: stage,
    answers: answers,
    excludeIds: [priorityGoal.id, complementaryGoal.id, ...longitudinalGoals.map(g => g.id)]
  });
  
  return {
    priorityGoal: {
      ...priorityGoal,
      badge: isUrgent ? 'Urgente' : 'Prioritaria',
      reason: `Tu ${priorityQuestion.label} necesita atención`
    },
    complementaryGoal: {
      ...complementaryGoal,
      badge: 'Complementaria',
      reason: 'Fortalece otra área importante'
    },
    longitudinalGoals: longitudinalGoals.map(g => ({
      ...g,
      badge: 'Aplicable siempre',
      reason: 'Útil en cualquier etapa'
    })),
    otherRecommendations: otherRecommendations
  };
}
```

---

## 🎨 MEJORAS EN LA UI DE RESULTADOS

### **Diseño Propuesto:**

```
┌─────────────────────────────────────────────────────────────┐
│ 🎯 TU META PRIORITARIA                    [Badge: Urgente]  │
├─────────────────────────────────────────────────────────────┤
│ EXP_PROG01: Entrevistar a 3 profesores/as sobre programas  │
│                                                              │
│ 💡 Por qué: Tu claridad vocacional necesita atención        │
│                                                              │
│ [Seleccionar esta meta]  [Ver alternativas] [Crear propia] │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 🔄 META COMPLEMENTARIA              [Badge: Complementaria] │
├─────────────────────────────────────────────────────────────┤
│ EXP_INT_NEW_SPECIAL: Taller de Administración del tiempo   │
│                                                              │
│ 💡 Por qué: Fortalece tu desempeño académico                │
│                                                              │
│ [Seleccionar esta meta]  [Ver alternativas] [Crear propia] │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 📚 METAS LONGITUDINALES          [Badge: Aplicable siempre] │
├─────────────────────────────────────────────────────────────┤
│ 1. LON_EMO_NEW03: Cita con Consejería Emocional            │
│    💡 Útil en cualquier etapa                               │
│    [Seleccionar]                                            │
│                                                              │
│ 2. LON_FIS_NEW01: Rutina de ejercicio 3x semana            │
│    💡 Útil en cualquier etapa                               │
│    [Seleccionar]                                            │
│                                                              │
│ 3. LON_ESP_NEW02: Meditación semanal en Punto Blanco       │
│    💡 Útil en cualquier etapa                               │
│    [Seleccionar]                                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ [Realizar nuevo diagnóstico]  [Ver todas las metas]        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 FLUJO DE "VER ALTERNATIVAS"

### **Cuando el estudiante rechaza una recomendación:**

```typescript
function getAlternativeGoals(rejectedGoal, answers, stage) {
  return findBestMatches({
    dimension: rejectedGoal.dimension,
    categoria: rejectedGoal.categoria,
    stage: stage,
    excludeIds: [rejectedGoal.id],
    limit: 3  // Mostrar 3 alternativas
  });
}
```

**UI de Alternativas:**
```
┌─────────────────────────────────────────────────────────────┐
│ 🔄 ALTERNATIVAS PARA TU META PRIORITARIA                    │
├─────────────────────────────────────────────────────────────┤
│ 1. EXP_PROG02: Conversar con 2 estudiantes avanzados       │
│    [Seleccionar esta]                                       │
│                                                              │
│ 2. EXP_PROG03: Cita con Director/a de Programa             │
│    [Seleccionar esta]                                       │
│                                                              │
│ 3. EXP_OCP01: Explorar opciones de carrera en CVDP         │
│    [Seleccionar esta]                                       │
│                                                              │
│ [Volver a recomendación original]  [Crear meta propia]     │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 INTEGRACIÓN CON "CREAR META PROPIA"

### **Botón "Crear meta propia":**
- Redirige a `/goals/new`
- Pre-llena dimensión y categoría sugeridas
- Mantiene contexto del diagnóstico

```typescript
<Button 
  onClick={() => router.push(`/goals/new?dimension=${priorityGoal.dimension}&categoria=${priorityGoal.categoria}&source=brujula`)}
>
  Crear meta propia
</Button>
```

---

## 🎯 EJEMPLO COMPLETO: ESTUDIANTE EN EXPLORACIÓN

### **Respuestas del Test:**
```typescript
{
  carrera: { score: 2, dimension: 'Ocupacional', weight: 0.7 },
  academico: { score: 3, dimension: 'Intelectual', weight: 0.6 },
  practicas: { score: 2, dimension: 'Ocupacional', weight: 0.3 },
  servicio_social: { score: 4, dimension: 'Social', weight: 0.5 }
}
```

### **Cálculo de Scores Ponderados:**
```typescript
Ocupacional: (2 * 0.7) + (2 * 0.3) = 2.0  ← PRIORITARIA
Intelectual: (3 * 0.6) = 1.8              ← COMPLEMENTARIA
Social: (4 * 0.5) = 2.0
```

### **Selección de Metas:**

**🎯 Meta Prioritaria:**
- **Dimensión**: Ocupacional (score más bajo: 2.0)
- **Pregunta**: "carrera" (mayor peso: 0.7)
- **Meta**: **EXP_PROG01** - Entrevistar a 3 profesores/as
- **Badge**: "Urgente" (score 2 ≤ threshold 3)
- **Razón**: "Tu claridad vocacional necesita atención"

**🔄 Meta Complementaria:**
- **Dimensión**: Intelectual (segundo score más bajo: 1.8)
- **Pregunta**: "academico"
- **Meta**: **EXP_INT_NEW_SPECIAL** - Taller de Administración del tiempo
- **Badge**: "Complementaria"
- **Razón**: "Fortalece tu desempeño académico"

**📚 Metas Longitudinales** (dimensiones NO cubiertas):
1. **LON_EMO_NEW03** - Cita con Consejería Emocional (Emocional)
2. **LON_FIS_NEW01** - Rutina de ejercicio (Física)
3. **LON_ESP_NEW02** - Meditación en Punto Blanco (Espiritual)

---

## 📊 VENTAJAS DE ESTA SOLUCIÓN

### ✅ **Resuelve el conflicto de categorías:**
- Sistema de pesos diferencia importancia dentro de misma dimensión
- "Carrera" (0.7) > "Prácticas" (0.3) en Ocupacional

### ✅ **Mantiene las preguntas actuales:**
- No requiere modificar preguntas existentes
- Solo agrega metadata (pesos, thresholds)

### ✅ **Diversidad de dimensiones:**
- Asegura que las recomendaciones cubran diferentes áreas
- Longitudinales complementan dimensiones no cubiertas

### ✅ **Flexibilidad para el estudiante:**
- Puede rechazar y ver alternativas
- Puede crear meta propia con formato SMARTER
- Puede realizar nuevo diagnóstico

### ✅ **Aprovecha banco ampliado:**
- 113 metas permiten encontrar matches precisos
- Alternativas disponibles para cada recomendación

---

## 🚀 PLAN DE IMPLEMENTACIÓN

### **Fase 1: Definir Metadata de Preguntas** ⏱️ 30 min
- [ ] Crear archivo `question-weights.ts`
- [ ] Definir pesos y thresholds por etapa
- [ ] Mapear preguntas a dimensiones

### **Fase 2: Refactorizar `recommend.ts`** ⏱️ 2 horas
- [ ] Implementar `calculateDimensionScores()`
- [ ] Implementar `getHighestWeightQuestion()`
- [ ] Implementar `findBestMatch()`
- [ ] Implementar `findComplementaryGoal()`
- [ ] Implementar `selectLongitudinalGoals()`

### **Fase 3: Actualizar UI de Resultados** ⏱️ 1.5 horas
- [ ] Crear componente `RecommendationCard`
- [ ] Implementar badges (Urgente, Complementaria, Aplicable siempre)
- [ ] Agregar botones "Ver alternativas" y "Crear propia"
- [ ] Implementar modal de alternativas

### **Fase 4: Integración con `/goals/new`** ⏱️ 30 min
- [ ] Pasar parámetros de contexto en URL
- [ ] Pre-llenar formulario con dimensión/categoría

### **Fase 5: Testing** ⏱️ 1 hora
- [ ] Probar con diferentes perfiles
- [ ] Validar que alternativas funcionen
- [ ] Verificar navegación a crear meta propia

**TIEMPO TOTAL ESTIMADO: ~5.5 horas**

---

## 💭 PREGUNTAS FINALES

1. **¿Te parece bien el sistema de pesos propuesto?**
2. **¿Los thresholds de urgencia son apropiados?**
3. **¿Cuántas alternativas mostrar cuando rechazan una meta?** (propongo 3)
4. **¿Implementamos todo ahora o por fases?**

---

## 🎯 MI RECOMENDACIÓN

**Implementar todo el sistema completo** porque:
1. Resuelve elegantemente el conflicto de categorías
2. Mantiene tus preguntas actuales (no hay que modificarlas)
3. Aprovecha el banco ampliado de 113 metas
4. Da flexibilidad al estudiante (alternativas + crear propia)
5. Es escalable para futuras mejoras

**¿Procedemos con la implementación completa?**

