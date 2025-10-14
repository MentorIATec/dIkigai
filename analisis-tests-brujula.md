# 🔍 ANÁLISIS DE LA LÓGICA ACTUAL DE LOS TESTS BRÚJULA

## 📊 ESTADO ACTUAL

### **Archivos Duplicados:**
1. **`brújula-tests.ts`**: Tests simples sin `focusAreas`
2. **`goal-diagnostic-tests.ts`**: Tests con `focusAreas` y mejor estructura

### **Lógica Actual de Recomendaciones (`recommend.ts`):**

```typescript
// Priorización actual:
1. +2 puntos: Meta de la etapa académica
2. +2 puntos: Coincide con áreas de mejora (score ≤ 3)
3. +1 punto: Coincide con categoría de interés
4. +1 punto: Relevante para carrera del estudiante
5. -1 punto: Ya seleccionada anteriormente
```

**Resultado:** Top 8 metas ordenadas por score

---

## ❌ PROBLEMAS IDENTIFICADOS

### **1. Lógica de Recomendación No Alineada con Tu Visión:**
- **Actual**: Muestra 8 metas con scores similares
- **Tu visión**: 1 meta prioritaria (puntaje más bajo) + 1 meta complementaria (segundo más bajo) + metas longitudinales

### **2. No Usa `focusAreas`:**
- El archivo `goal-diagnostic-tests.ts` tiene `focusAreas` definidas por pregunta
- La lógica de `recommend.ts` NO usa estos `focusAreas`
- Solo hace matching genérico con dimensión/categoría

### **3. No Diferencia Entre Tipos de Metas:**
- No distingue entre metas específicas de etapa vs. longitudinales
- No prioriza según urgencia (puntaje bajo = urgente)

### **4. Duplicación de Archivos:**
- `brújula-tests.ts` (usado en componente)
- `goal-diagnostic-tests.ts` (no usado, pero mejor estructura)

---

## ✅ PROPUESTA DE MEJORA

### **NUEVA LÓGICA DE RECOMENDACIÓN:**

#### **Paso 1: Identificar Áreas Prioritarias**
```typescript
// Ordenar respuestas por score (ascendente)
const sortedAnswers = answers.sort((a, b) => a.score - b.score);

// Área prioritaria = puntaje más bajo
const priorityArea = sortedAnswers[0];

// Área complementaria = segundo puntaje más bajo
const complementaryArea = sortedAnswers[1];
```

#### **Paso 2: Seleccionar Meta Prioritaria**
```typescript
// Buscar meta que coincida con:
// 1. Dimensión/categoría del área prioritaria
// 2. Etapa actual del estudiante
// 3. Específica para la etapa (no longitudinal)

const priorityGoal = stageGoals.find(goal => 
  goal.dimension === priorityArea.focusArea.dimension &&
  goal.categoria === priorityArea.focusArea.categoria &&
  !isLongitudinal(goal.id)
);
```

#### **Paso 3: Seleccionar Meta Complementaria**
```typescript
// Similar a prioritaria, pero con área complementaria
const complementaryGoal = stageGoals.find(goal => 
  goal.dimension === complementaryArea.focusArea.dimension &&
  goal.categoria === complementaryArea.focusArea.categoria &&
  !isLongitudinal(goal.id) &&
  goal.id !== priorityGoal.id
);
```

#### **Paso 4: Agregar Metas Longitudinales**
```typescript
// Metas longitudinales aplicables a todas las etapas
const longitudinalGoals = curatedGoalBankExtended.longitudinal.metas
  .filter(goal => !selectedGoalIds.includes(goal.id))
  .slice(0, 3); // Top 3 longitudinales
```

#### **Resultado Final:**
```typescript
return {
  priorityGoal: { ...priorityGoal, reason: 'Área prioritaria según tu diagnóstico' },
  complementaryGoal: { ...complementaryGoal, reason: 'Área complementaria' },
  longitudinalGoals: longitudinalGoals.map(g => ({ ...g, reason: 'Aplicable en cualquier etapa' })),
  otherRecommendations: [...] // Otras 3-5 metas relevantes
};
```

---

## 🎯 ALINEACIÓN CON BANCO AMPLIADO

### **Ventajas del Banco Actual (113 metas):**

1. **Metas Específicas por Etapa:**
   - **Exploración**: 8 nuevas metas específicas (programa, idiomas, prácticas)
   - **Enfoque**: 5 nuevas metas específicas (servicio social, Semestre Tec)
   - **Longitudinal**: 24 metas aplicables a todas las etapas

2. **Mejor Cobertura de Dimensiones:**
   - Ocupacional: 40+ metas
   - Intelectual: 25+ metas
   - Social: 15+ metas
   - Emocional: 15+ metas
   - Física: 10+ metas
   - Espiritual: 8+ metas

3. **Matching Más Preciso:**
   - Con 113 metas, hay mayor probabilidad de encontrar match exacto
   - Metas específicas para cada área de mejora identificada

---

## 📋 PLAN DE IMPLEMENTACIÓN

### **Fase 1: Consolidar Tests** ✅
- [ ] Eliminar `brújula-tests.ts`
- [ ] Usar solo `goal-diagnostic-tests.ts` (tiene `focusAreas`)
- [ ] Actualizar componente `BrujulaTest` para usar `focusAreas`

### **Fase 2: Refactorizar `recommend.ts`** 🔄
- [ ] Implementar nueva lógica de priorización
- [ ] Identificar área prioritaria (score más bajo)
- [ ] Identificar área complementaria (segundo más bajo)
- [ ] Separar metas longitudinales de específicas

### **Fase 3: Mejorar Presentación de Resultados** 🎨
- [ ] Mostrar meta prioritaria con badge "Urgente"
- [ ] Mostrar meta complementaria con badge "Complementaria"
- [ ] Sección separada para metas longitudinales
- [ ] Explicar por qué cada meta fue recomendada

### **Fase 4: Testing y Validación** 🧪
- [ ] Probar con diferentes perfiles de estudiantes
- [ ] Validar que las recomendaciones sean relevantes
- [ ] Ajustar algoritmo según feedback

---

## 🎓 EJEMPLO DE FLUJO MEJORADO

### **Estudiante en Exploración (2°-3° semestre):**

**Respuestas del Test:**
1. Carrera: Score 2 (confundido/a) ← **PRIORITARIA**
2. Académico: Score 3 (promedio aceptable)
3. Prácticas: Score 2 (no tengo claro) ← **COMPLEMENTARIA**
4. Servicio Social: Score 4 (ya tengo opción)

**Recomendaciones Generadas:**

**🎯 Meta Prioritaria (Carrera):**
- **EXP_PROG01**: Entrevistar a 3 profesores/as sobre programas de egreso
- **Razón**: Tu claridad vocacional es el área más urgente según tu diagnóstico

**🔄 Meta Complementaria (Prácticas):**
- **EXP_PROF01**: Conseguir primera entrevista para prácticas profesionales
- **Razón**: Segunda área de mejora identificada en tu diagnóstico

**📚 Metas Longitudinales (Aplicables en cualquier etapa):**
1. **LON_OCP_NEW01**: Revisión de CV con IA en CVDP
2. **LON_EMO_NEW03**: Agendar cita con Consejería Emocional
3. **LON_INT_NEW05**: Explorar cursos en Coursera/EdX

**💡 Otras Recomendaciones:**
- 3-5 metas adicionales relevantes para tu etapa

---

## 🚀 PRÓXIMOS PASOS SUGERIDOS

### **Opción A: Implementación Completa** (recomendada)
1. Consolidar tests
2. Refactorizar lógica de recomendación
3. Actualizar UI de resultados
4. Testing completo

### **Opción B: Implementación Incremental**
1. Solo refactorizar `recommend.ts` primero
2. Probar nueva lógica
3. Luego consolidar tests
4. Finalmente mejorar UI

### **Opción C: Análisis Adicional**
1. Revisar más casos de uso
2. Validar con estudiantes reales
3. Ajustar algoritmo
4. Implementar después

---

## 📊 MÉTRICAS DE ÉXITO

1. **Relevancia**: ¿Las metas recomendadas son útiles para el estudiante?
2. **Diversidad**: ¿Cubren diferentes dimensiones del bienestar?
3. **Accionabilidad**: ¿El estudiante puede empezar inmediatamente?
4. **Progresión**: ¿Las metas siguen una lógica de desarrollo?

---

## 💭 PREGUNTAS PARA VALIDAR

1. ¿Quieres que la meta prioritaria sea SIEMPRE del área con score más bajo?
2. ¿Cuántas metas longitudinales mostrar? (actualmente propongo 3)
3. ¿Mostrar todas las recomendaciones a la vez o progresivamente?
4. ¿Permitir al estudiante "rechazar" una recomendación y ver alternativas?

