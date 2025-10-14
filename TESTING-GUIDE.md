# 🧪 Guía de Testing - Sistema de Recomendaciones Inteligentes

**Fecha:** 9 de octubre, 2025  
**Sistema:** Tests Brújula + Recomendaciones Inteligentes  
**URL Base:** `http://localhost:9002`

---

## 🚀 Inicio Rápido

### **1. Asegúrate que el servidor esté corriendo:**
```bash
npm run dev
```

**Salida esperada:**
```
✓ Ready in 2.5s
○ Local: http://localhost:9002
```

### **2. Abre el navegador:**
```
http://localhost:9002/goal-bank
```

### **3. Abre DevTools:**
- **Mac:** `Cmd + Option + I`
- **Windows/Linux:** `F12`
- Ve a la pestaña "Console"

---

## ✅ Test 1: Verificar que la página carga

### **Pasos:**
1. Navega a `http://localhost:9002/goal-bank`
2. La página debe cargar en menos de 3 segundos
3. Verifica que veas el título "Asistente de Metas"

### **Qué verificar:**
- ✅ No hay errores rojos en consola
- ✅ Tabs de etapas son visibles (Exploración, Enfoque, etc.)
- ✅ NO se muestran contadores como "113 metas"

### **Consola esperada:**
```javascript
// Solo warnings normales de Next.js en desarrollo
// NO debe haber errores rojos
```

---

## ✅ Test 2: Completar Test Brújula de Exploración

### **Pasos:**
1. Selecciona tab "Exploración (2°-3° semestre)"
2. Scroll hacia abajo hasta "Brújula de Exploración"
3. Clic en "Iniciar Brújula de Exploración"
4. Responde las 4 preguntas (puedes usar valores bajos como 1 o 2)
5. Clic en "Finalizar" en la última pregunta

### **Preguntas del test:**
1. **Carrera** - ¿Qué tan claro tienes tu elección de carrera?
2. **Académico** - ¿Cómo va tu desempeño académico?
3. **Prácticas** - ¿Qué tan preparado/a te sientes para prácticas profesionales?
4. **Servicio Social** - ¿Qué tan avanzado tienes tu plan de servicio social?

### **Qué verificar:**
- ✅ Barra de progreso avanza con cada pregunta
- ✅ Puedes volver atrás con "Anterior"
- ✅ Al finalizar, ves "Tus Recomendaciones Personalizadas"
- ✅ Consola muestra: `"Meta guardada exitosamente:"`

---

## ✅ Test 3: Verificar Badges de Recomendaciones

### **Pasos:**
1. Después de completar el test, observa las recomendaciones
2. Identifica los diferentes badges

### **Badges esperados:**

#### **🔴 Badge "Urgente"** (fondo rojo)
- Aparece cuando el score de una pregunta es ≤ threshold
- Por ejemplo, si respondiste "1" o "2" en "Carrera"

#### **🔵 Badge "Prioritaria"** (fondo azul)
- Meta principal basada en la dimensión con menor score
- Primera recomendación en la lista

#### **🟣 Badge "Complementaria"** (fondo morado)
- Segunda meta recomendada
- Puede ser de otra dimensión para diversidad

#### **🟢 Badge "Aplicable siempre"** (fondo verde)
- Metas longitudinales (útiles en cualquier etapa)
- Se muestran después de las prioritarias

### **Qué verificar:**
- ✅ Cada badge tiene el color correcto
- ✅ El icono del badge es visible
- ✅ El texto del badge es legible

---

## ✅ Test 4: Guardar una Meta

### **Pasos:**
1. En la sección "Tu Meta Prioritaria"
2. Clic en "Seleccionar esta meta" (botón verde)
3. **Observa la esquina superior derecha del navegador**

### **Toast esperado:**
```
┌───────────────────────────────────────┐
│ ✅ ¡Meta guardada exitosamente! 🎯  │
│ La meta ha sido agregada a tu plan  │
│ de vida.                            │
└───────────────────────────────────────┘
```

### **Qué verificar:**
- ✅ Toast aparece en 1-2 segundos
- ✅ Toast se muestra arriba a la derecha
- ✅ Toast desaparece después de 3 segundos
- ✅ Consola muestra: `"Meta guardada exitosamente: [ID]"`

### **Consola esperada:**
```javascript
Meta guardada exitosamente: EXP_OC_CAR_001
```

---

## ✅ Test 5: Intentar Guardar Meta Duplicada

### **Pasos:**
1. Después de guardar una meta (Test 4)
2. **Vuelve a hacer clic** en "Seleccionar esta meta" para la misma meta
3. Observa el toast

### **Toast esperado:**
```
┌───────────────────────────────────────┐
│ ℹ️ Meta ya seleccionada             │
│ Esta meta ya está en tu plan de     │
│ vida.                               │
└───────────────────────────────────────┘
```

### **Qué verificar:**
- ✅ Toast informativo (no verde ni rojo)
- ✅ No se hace llamada duplicada al API
- ✅ Consola no muestra error

---

## ✅ Test 6: Ver Alternativas

### **Pasos:**
1. En cualquier recomendación (Prioritaria o Complementaria)
2. Clic en "Ver alternativas"
3. Modal se abre mostrando hasta 3 metas alternativas

### **Qué verificar:**
- ✅ Modal se abre suavemente
- ✅ Muestra entre 1-3 alternativas
- ✅ Cada alternativa tiene:
  - Badge "Alternativa 1", "Alternativa 2", etc.
  - Badge de dimensión
  - Título de la meta
  - Pasos de acción
  - Botón "Seleccionar esta alternativa"

### **Probar seleccionar alternativa:**
1. Clic en "Seleccionar esta alternativa"
2. Modal se cierra
3. Toast de éxito aparece

---

## ✅ Test 7: Crear Meta Propia

### **Pasos:**
1. En cualquier recomendación
2. Clic en "Crear meta propia"
3. Debes ser redirigido a `/goals/new`

### **URL esperada:**
```
http://localhost:9002/goals/new?dimension=Ocupacional&categoria=carrera&source=brujula
```

### **Qué verificar:**
- ✅ Redirección exitosa
- ✅ URL contiene parámetros: `dimension`, `categoria`, `source`
- ✅ Página de crear meta carga correctamente
- ✅ Se muestra contexto del diagnóstico

---

## ✅ Test 8: Verificar IP Protection

### **Qué buscar (NO DEBE APARECER):**

❌ **NO debe aparecer:**
- "113 metas disponibles"
- "20 metas"
- "24 metas longitudinales"
- Cualquier número específico de metas

✅ **Debe aparecer:**
- "Ver más metas disponibles" (sin número)
- "Metas Destacadas"
- "Catálogo de Metas"

### **Lugares a verificar:**
1. **Tab de cada etapa** - NO debe mostrar contador
2. **Sección "Metas Destacadas"** - NO debe mostrar "X metas disponibles"
3. **Modal de catálogo completo** - NO debe mostrar estadística de metas totales

---

## ✅ Test 9: Test de Enfoque

### **Pasos:**
1. Cambia al tab "Enfoque (4°-6° semestre)"
2. Scroll a "Brújula de Enfoque"
3. Clic en "Iniciar Brújula de Enfoque"
4. Completa el test (4 preguntas)

### **Preguntas del test:**
1. **Semestre Tec** - ¿Qué tan claro tienes tu plan para el Semestre Tec?
2. **Servicio Social** - ¿Qué tan avanzado tienes tu servicio social?
3. **Prácticas** - Preparación para prácticas profesionales
4. **Idioma** - Certificación de idioma para intercambio

### **Qué verificar:**
- ✅ Preguntas diferentes a Exploración
- ✅ Recomendaciones relevantes para semestre 4-6
- ✅ Metas específicas de la etapa (Semestre Tec, etc.)

---

## ✅ Test 10: Test de Especialización

### **Pasos:**
1. Cambia al tab "Especialización (7°+ semestre)"
2. Completa el test de especialización

### **Preguntas del test:**
1. **Situación Profesional** - ¿Tienes empleo/prácticas aseguradas?
2. **Meta EXATEC** - ¿Qué tan claro tienes tu plan post-graduación?
3. **Balance de Vida** - ¿Cómo manejas el balance vida/trabajo?
4. **Preparación Profesional** - Entrevistas, negociaciones, etc.

### **Qué verificar:**
- ✅ Recomendaciones orientadas a transición profesional
- ✅ Metas de networking, primer empleo, etc.
- ✅ Badge "Urgente" si aún no tiene empleo asegurado

---

## ⚠️ Test 11: Simular Error de Red

### **Pasos:**
1. Completa un test brújula
2. Abre DevTools → Pestaña "Network"
3. Selecciona "Offline" (simula desconexión)
4. Intenta guardar una meta

### **Toast esperado:**
```
┌───────────────────────────────────────┐
│ ❌ Error al guardar meta            │
│ No se pudo guardar la meta. Por     │
│ favor, intenta nuevamente.          │
└───────────────────────────────────────┘
```

### **Qué verificar:**
- ✅ Toast de error (rojo) aparece
- ✅ Mensaje claro y accionable
- ✅ La app no se rompe (sigue funcionando)
- ✅ Consola muestra el error

### **Consola esperada:**
```javascript
Error al guardar meta: Failed to fetch
```

---

## 📱 Test 12: Responsividad

### **Dispositivos a probar:**

#### **Móvil (375px):**
1. DevTools → Toggle device toolbar (Cmd/Ctrl + Shift + M)
2. Selecciona "iPhone SE" o "iPhone 12 Pro"
3. Recorre toda la página

**Qué verificar:**
- ✅ Cards se apilan verticalmente
- ✅ Botones son táctiles (mínimo 44px)
- ✅ Toast es visible en móvil
- ✅ Modal de alternativas se adapta

#### **Tablet (768px):**
1. Selecciona "iPad" en device toolbar
2. Modo portrait y landscape

**Qué verificar:**
- ✅ Layout de 2 columnas cuando es posible
- ✅ Tabs horizontales sin scroll
- ✅ Cards legibles

#### **Desktop (1280px+):**
1. Maximiza el navegador
2. Verifica espaciado

**Qué verificar:**
- ✅ Contenido centrado con max-width
- ✅ Layout aprovecha espacio horizontal
- ✅ Toasts en esquina superior derecha

---

## 🐛 Bugs Comunes y Cómo Reportarlos

### **Si encuentras un bug:**

#### **1. Captura de información:**
```
🐛 BUG REPORT
- URL: http://localhost:9002/goal-bank
- Etapa: Exploración / Enfoque / Especialización
- Acción: [Lo que estabas haciendo]
- Error: [Mensaje de error]
- Consola: [Copiar logs de consola]
```

#### **2. Screenshot:**
- Captura del toast o error
- Captura de la consola con stack trace

#### **3. Pasos para reproducir:**
```
1. Navegar a /goal-bank
2. Seleccionar tab "Exploración"
3. Completar test con scores bajos
4. Hacer clic en "Seleccionar esta meta"
5. ERROR: Toast no aparece
```

---

## ✅ Checklist Final

Marca cada item después de probarlo:

### **Tests Básicos:**
- [ ] Página carga sin errores
- [ ] Consola sin errores rojos
- [ ] Contadores de metas ocultos

### **Tests Brújula:**
- [ ] Test de Exploración completo
- [ ] Test de Enfoque completo
- [ ] Test de Especialización completo

### **Funcionalidad de Metas:**
- [ ] Guardar meta → Toast de éxito
- [ ] Guardar duplicada → Toast informativo
- [ ] Ver alternativas → Modal funciona
- [ ] Seleccionar alternativa → Toast de éxito
- [ ] Crear meta propia → Redirección correcta

### **Badges:**
- [ ] Badge "Urgente" (rojo) funciona
- [ ] Badge "Prioritaria" (azul) funciona
- [ ] Badge "Complementaria" (morado) funciona
- [ ] Badge "Aplicable siempre" (verde) funciona

### **Error Handling:**
- [ ] Error de red → Toast de error
- [ ] Meta duplicada → No hace llamada al API
- [ ] Errores en consola son claros

### **Responsividad:**
- [ ] Móvil (375px) funciona
- [ ] Tablet (768px) funciona
- [ ] Desktop (1280px+) funciona

### **IP Protection:**
- [ ] NO se muestran contadores específicos
- [ ] NO se expone cantidad de metas
- [ ] Textos son genéricos

---

## 🎉 Si Todos los Tests Pasan

**¡Felicidades! El sistema está funcionando correctamente.**

### **Próximos pasos:**
1. ✅ Marcar como completado
2. ✅ Probar en diferentes navegadores (Chrome, Firefox, Safari)
3. ✅ Considerar deploy a staging
4. ✅ Continuar con Fase 2 (ver `PROXIMO-CHAT-PROMPT.md`)

---

## 📞 Soporte

Si encuentras algún problema:
1. Revisa esta guía de testing
2. Verifica la consola para mensajes de error
3. Consulta `AJUSTES-IMPLEMENTADOS.md` para detalles técnicos
4. Reporta el bug con toda la información recopilada

---

**¡Feliz testing! 🚀**


