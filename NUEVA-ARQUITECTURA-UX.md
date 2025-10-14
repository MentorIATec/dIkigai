# 🎯 Nueva Arquitectura UX LEAN - Sistema de Recomendaciones

**Fecha:** 9 de octubre, 2025  
**Objetivo:** Simplificar UX y corregir configuración de tests por etapa

---

## 🔍 **Problemas Identificados**

### **1. UX Saturada**
- ❌ Panel muestra todas las etapas simultáneamente
- ❌ Estudiante puede ver tabs de etapas no relevantes
- ❌ Información excesiva confunde al usuario

### **2. Configuración Incorrecta de Tests**
- ❌ "Test de Exploración" no existe (según análisis)
- ❌ "Test de Especialización" es realmente "Checklist de Graduación"
- ❌ Mapeo de etapas vs tests está desalineado

### **3. Lógica de Recomendaciones**
- ❌ Solo muestra recomendaciones con puntajes bajos
- ❌ Puntajes altos no generan sugerencias complementarias

---

## 🎯 **Nueva Arquitectura UX LEAN**

### **Principio:** Una sola ventana por semestre del estudiante

### **Mapeo Corregido:**

| Semestre | Etapa | Test/Herramienta | Acciones Disponibles |
|----------|-------|------------------|---------------------|
| **1°** | Primer Semestre | ❌ SIN TEST | ✅ Inspiración + IBI |
| **2°-3°** | Enfoque | ✅ Brújula de Enfoque | ✅ Test + Recomendaciones |
| **4°-6°** | Especialización | ✅ Brújula de Especialización | ✅ Test + Recomendaciones |
| **7°-8°+** | Graduación | ✅ Checklist de Graduación | ✅ Checklist + Metas |

---

## 🏗️ **Implementación Técnica**

### **1. Nueva Lógica de Mapeo**

```typescript
// src/lib/profile/mapping.ts - ACTUALIZADO
export function computeStage(n: number): SemesterStage {
  if (n === 1) return 'primerSemestre';        // NUEVO
  if (n >= 2 && n <= 3) return 'enfoque';      // CAMBIADO: era 'exploracion'
  if (n >= 4 && n <= 6) return 'especializacion';
  if (n >= 7) return 'graduacion';             // CAMBIADO: era n >= 8
  return 'primerSemestre';
}
```

### **2. Tests Disponibles por Etapa**

```typescript
// src/lib/diagnostics.stage-map.ts - ACTUALIZADO
const STAGE_TESTS = {
  primerSemestre: null,                    // SIN TEST
  enfoque: 'BRUJULA_ENFOQUE',             // CAMBIADO: era exploracion
  especializacion: 'BRUJULA_ESPECIALIZACION',
  graduacion: 'CHECKLIST_GRADUACION'      // CAMBIADO: era especializacion
};
```

### **3. Componente UX LEAN**

```typescript
// src/components/semester-specific-view.tsx - NUEVO
export function SemesterSpecificView({ semester }: { semester: number }) {
  const stage = computeStage(semester);
  
  switch (stage) {
    case 'primerSemestre':
      return <FirstSemesterInspiration />;
    case 'enfoque':
      return <EnfoqueTestView />;
    case 'especializacion':
      return <EspecializacionTestView />;
    case 'graduacion':
      return <GraduacionChecklistView />;
  }
}
```

---

## 🎨 **Diseño UX por Etapa**

### **1° Semestre - Solo Inspiración**
```
┌─────────────────────────────────────┐
│ 🎯 Tu Primer Semestre              │
│                                     │
│ 📊 Revisa tu IBI                    │
│ [Ver mi Índice de Bienestar]       │
│                                     │
│ ✨ Genera Inspiración               │
│ [Crear meta personalizada]         │
│                                     │
│ 📚 Tutorial                         │
│ [Cómo actualizar metas]            │
└─────────────────────────────────────┘
```

### **2°-3° Semestre - Brújula de Enfoque**
```
┌─────────────────────────────────────┐
│ 🧭 Brújula de Enfoque              │
│                                     │
│ [Iniciar Test] → [Ver Resultados]  │
│                                     │
│ 📋 Tus Recomendaciones             │
│ • Meta Prioritaria                  │
│ • Meta Complementaria               │
│ • Metas Aplicables Siempre         │
└─────────────────────────────────────┘
```

### **4°-6° Semestre - Brújula de Especialización**
```
┌─────────────────────────────────────┐
│ 🎯 Brújula de Especialización      │
│                                     │
│ [Iniciar Test] → [Ver Resultados]  │
│                                     │
│ 📋 Tus Recomendaciones             │
│ • Meta Prioritaria                  │
│ • Meta Complementaria               │
│ • Metas Aplicables Siempre         │
└─────────────────────────────────────┘
```

### **7°-8°+ Semestre - Checklist de Graduación**
```
┌─────────────────────────────────────┐
│ ✅ Checklist de Graduación         │
│                                     │
│ [Iniciar Checklist] → [Ver Plan]   │
│                                     │
│ 📋 Preparación Profesional         │
│ • Situación laboral                 │
│ • Meta EXATEC                       │
│ • Balance vida-trabajo              │
└─────────────────────────────────────┘
```

---

## 🔧 **Cambios de Configuración**

### **1. Actualizar Tests Brújula**

```typescript
// src/lib/brújula-tests.ts - ACTUALIZADO
export const BRUJULA_TESTS = {
  // ELIMINAR: exploracion (no existe)
  enfoque: {
    title: 'Brújula de Enfoque (2°-3° semestre)',
    description: 'Evalúa tu claridad vocacional y preparación académica',
    questions: [
      { key: 'carrera', text: '¿Qué tan claro tienes tu elección de carrera?' },
      { key: 'academico', text: '¿Cómo va tu desempeño académico?' },
      { key: 'practicas', text: '¿Qué tan preparado/a te sientes para prácticas?' },
      { key: 'servicio_social', text: '¿Qué tan avanzado tienes tu plan de servicio social?' }
    ]
  },
  especializacion: {
    title: 'Brújula de Especialización (4°-6° semestre)',
    description: 'Evalúa tu preparación para el mundo profesional',
    questions: [
      { key: 'semestre_tec', text: '¿Qué tan claro tienes tu plan para el Semestre Tec?' },
      { key: 'servicio_social', text: '¿Qué tan avanzado tienes tu servicio social?' },
      { key: 'practicas', text: '¿Qué tan preparado/a estás para prácticas profesionales?' },
      { key: 'idioma', text: '¿Qué tan preparado/a estás en idiomas para intercambio?' }
    ]
  }
  // ELIMINAR: especializacion (era realmente graduacion)
};
```

### **2. Nuevo Checklist de Graduación**

```typescript
// src/lib/graduation-checklist.ts - NUEVO
export const GRADUATION_CHECKLIST = {
  title: 'Checklist de Candidaturas a Graduación',
  description: 'Valida tu preparación profesional y metas post-graduación',
  questions: [
    { key: 'situacion_profesional', text: '¿Cuál es mi situación profesional actual?' },
    { key: 'meta_exatec', text: '¿Qué tan claro tengo mi meta para mi primer año como EXATEC?' },
    { key: 'balance_vida', text: '¿Cómo manejo el balance de vida en esta transición?' },
    { key: 'preparacion_profesional', text: '¿Qué tan preparado/a estoy para retos profesionales?' }
  ]
};
```

---

## 🎯 **Mejoras en Recomendaciones**

### **Problema:** Solo recomendaciones para puntajes bajos

### **Solución:** Recomendaciones adaptativas

```typescript
// src/lib/recommend.ts - MEJORADO
export function generateSmartRecommendations(input: RecommendationInput) {
  const dimensionScores = calculateDimensionScores(input.answers, input.stage);
  
  // NUEVA LÓGICA: Recomendaciones adaptativas
  if (allScoresHigh(dimensionScores)) {
    return generateComplementaryRecommendations(dimensionScores, input.stage);
  } else if (hasCriticalScores(dimensionScores)) {
    return generatePriorityRecommendations(dimensionScores, input.stage);
  } else {
    return generateBalancedRecommendations(dimensionScores, input.stage);
  }
}

function generateComplementaryRecommendations(scores: DimensionScore[], stage: SemesterStage) {
  // Para puntajes altos: sugerir metas complementarias
  // Ejemplo: Si tiene alto desempeño académico, sugerir networking
  return {
    priorityGoal: findComplementaryGoal(scores, stage),
    complementaryGoal: findGrowthGoal(scores, stage),
    longitudinalGoals: selectAdvancedLongitudinalGoals(stage),
    message: "¡Excelente progreso! Te sugerimos metas para complementar tu desarrollo."
  };
}
```

---

## 📱 **Eliminación de Tabs**

### **Antes (Actual):**
```
[Exploración] [Enfoque] [Especialización] [Longitudinal] [Graduación]
```

### **Después (LEAN):**
```
[Tu Etapa Actual - Sin tabs]
```

### **Implementación:**

```typescript
// src/app/(app)/goal-bank/page.tsx - SIMPLIFICADO
export default function GoalBankPage() {
  const { user } = useAuth();
  const semester = user?.profile?.semesterNumber || 1;
  const stage = computeStage(semester);
  
  return (
    <div className="max-w-4xl mx-auto">
      <SemesterSpecificView semester={semester} stage={stage} />
    </div>
  );
}
```

---

## 🚀 **Plan de Implementación**

### **Fase 1: Corrección de Mapeo**
1. ✅ Actualizar `computeStage()` función
2. ✅ Corregir tests disponibles por etapa
3. ✅ Crear nuevo checklist de graduación

### **Fase 2: UX LEAN**
1. ✅ Eliminar tabs múltiples
2. ✅ Crear vista específica por semestre
3. ✅ Simplificar navegación

### **Fase 3: Recomendaciones Mejoradas**
1. ✅ Implementar recomendaciones para puntajes altos
2. ✅ Crear lógica de metas complementarias
3. ✅ Mejorar mensajes de feedback

### **Fase 4: Testing y Validación**
1. ✅ Probar cada etapa específica
2. ✅ Validar flujos completos
3. ✅ Verificar responsividad

---

## 📊 **Beneficios Esperados**

### **UX:**
- ✅ 70% menos información visible
- ✅ Navegación más intuitiva
- ✅ Enfoque en etapa relevante

### **Funcionalidad:**
- ✅ Tests correctos por etapa
- ✅ Recomendaciones para todos los puntajes
- ✅ Flujo más natural

### **Mantenimiento:**
- ✅ Código más simple
- ✅ Menos confusión en configuración
- ✅ Lógica más clara

---

## 🎯 **Próximos Pasos**

1. **Implementar nueva función `computeStage()`**
2. **Crear componente `SemesterSpecificView`**
3. **Actualizar tests disponibles**
4. **Mejorar lógica de recomendaciones**
5. **Eliminar tabs y simplificar navegación**

---

**¿Por dónde empezamos?** 🚀

Recomiendo empezar por la **Fase 1** (corrección de mapeo) ya que es la base para todo lo demás.
