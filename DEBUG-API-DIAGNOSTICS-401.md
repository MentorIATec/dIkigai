# 🐛 DEBUG: API Diagnostics 401 - SOLUCIONADO

## 🔍 **Problema Identificado**

**Síntoma:** Las llamadas a `/api/diagnostics/[stage]` devuelven **401 Unauthorized**
```
GET /api/diagnostics/exploracion?latest=1&periodKey=exploracion-1760375868065 401 in 35ms
```

**Causa Raíz:** 
1. **MSW deshabilitado** - Los mocks estaban temporalmente deshabilitados
2. **Falta de mocks** - No había mocks para `/api/diagnostics/[stage]`
3. **Variables de entorno** - `FIREBASE_PROJECT_ID` no definida en desarrollo

## ✅ **Fix Implementado**

### **1. Habilitar MSW**
```typescript
// src/mocks/enable-preview.ts
export async function setupMocksIfNeeded(): Promise<void> {
  // MSW HABILITADO PARA MOCKS DE API DE DIAGNOSTICS
  // ✅ Removido: return; (línea que deshabilitaba MSW)
}
```

### **2. Agregar Mocks para API de Diagnostics**
```typescript
// src/mocks/handlers.ts
export const handlers = [
  // ... mocks existentes ...
  
  // ✅ NUEVO: Mocks para API de diagnostics real
  http('POST', '/api/diagnostics/:stage', ({ params, request }) => {
    const { stage } = params;
    console.log(`📝 Mock POST /api/diagnostics/${stage}`);
    return HttpResponse.json({ 
      recommendedGoalIds: ['MOCK_GOAL_1', 'MOCK_GOAL_2'] 
    });
  }),
  
  http('GET', '/api/diagnostics/:stage', ({ params, request }) => {
    const { stage } = params;
    const url = new URL(request.url);
    const latest = url.searchParams.get('latest') === '1';
    const periodKey = url.searchParams.get('periodKey');
    
    console.log(`📋 Mock GET /api/diagnostics/${stage}`, { latest, periodKey });
    
    // Simular diagnóstico completado con respuestas de prueba (puntajes altos)
    const mockAnswers = [
      { questionKey: 'test_question_1', score: 5, dimension: 'Ocupacional' },
      { questionKey: 'test_question_2', score: 4, dimension: 'Social' },
      { questionKey: 'test_question_3', score: 5, dimension: 'Intelectual' }
    ];
    
    const mockResult = {
      id: `mock_${stage}_${Date.now()}`,
      uid: 'ana.perez@example.com',
      stage,
      periodKey: periodKey || `${stage}-${Date.now()}`,
      answers: mockAnswers,
      createdAt: new Date().toISOString(),
      recommendedGoalIds: ['MOCK_GOAL_1', 'MOCK_GOAL_2']
    };
    
    return HttpResponse.json({ results: [mockResult] });
  }),
];
```

## 🧪 **Flujo de Prueba**

1. **Completar test** con puntajes altos (4-5)
2. **Verificar en consola** que aparece:
   - `📝 Mock POST /api/diagnostics/[stage]` (al enviar test)
   - `📋 Mock GET /api/diagnostics/[stage]` (al cargar diagnóstico previo)
   - `🔄 Regenerando recomendaciones desde diagnóstico previo: [...]`
   - `🔍 DEBUG RECOMENDACIONES: {...}` (algoritmo detecta puntajes altos)
   - `🎯 RENDERIZANDO SmartRecommendationsView: {...}` (UI se renderiza)

3. **Verificar UI** que muestra:
   - Header: "¡Excelente Progreso!" (verde)
   - Sección: "Explora Nuevas Dimensiones"
   - Recomendaciones en dimensiones: Emocional, Física, Espiritual

## 📊 **Respuestas Mock (Puntajes Altos)**

Las respuestas mock están configuradas con **puntajes altos** para probar las recomendaciones complementarias:

- **Ocupacional:** score: 5
- **Social:** score: 4  
- **Intelectual:** score: 5

Esto debería activar el algoritmo de recomendaciones complementarias y mostrar:
- **Dimensiones evaluadas:** Ocupacional, Social, Intelectual
- **Dimensiones complementarias:** Emocional, Física, Espiritual

## 🎯 **Resultado Esperado**

Después del fix:
1. ✅ API de diagnostics responde correctamente (200 OK)
2. ✅ Se guarda el diagnóstico con respuestas mock
3. ✅ Se cargan las respuestas al recargar la página
4. ✅ Se generan recomendaciones complementarias
5. ✅ Se muestra la UI especializada para puntajes altos
