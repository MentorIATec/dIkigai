# 🔍 DEBUG: Mapeado de Etapas

**Fecha:** 9 de octubre, 2025  
**Problema:** 5to semestre muestra "graduación" en lugar de "especialización"  
**Status:** 🔍 **DEBUGGING EN PROGRESO**

---

## 🎯 **Problema Identificado**

### **Situación Actual:**
- ✅ Usuario: 5to semestre
- ❌ Etiqueta mostrada: "Test Especialización" 
- ❌ Contenido mostrado: "Checklist de Candidaturas a Graduación"
- ✅ Debería mostrar: "Brújula de Especialización"

### **Lógica Correcta:**
```typescript
// Según computeStage():
if (n >= 4 && n <= 6) return 'especializacion';  // 4°-6° semestre
if (n >= 7) return 'graduacion';                 // 7°+ semestre
```

---

## 🔍 **Debugging Steps**

### **1. Abrir Consola del Navegador:**
```bash
# Presiona F12 o Ctrl+Shift+I
# Ve a la pestaña "Console"
```

### **2. Ir a la Página:**
```bash
http://localhost:9002/goal-bank
```

### **3. Revisar Logs de Debug:**
Deberías ver algo como:
```javascript
🔍 DEBUG PROFILE: {
  semesterNumber: 5,
  semesterStage: "graduacion",  // ← AQUÍ ESTÁ EL PROBLEMA
  carreraName: "Tu Carrera"
}

🎯 STAGE DEBUG: {
  semester: 5,
  computedStage: "especializacion",  // ← CORRECTO
  profileStage: "graduacion"         // ← INCORRECTO
}
```

---

## 🎯 **Posibles Causas**

### **Causa 1: Perfil en Base de Datos Incorrecto**
- El perfil tiene `semesterStage: "graduacion"` hardcodeado
- Necesitamos actualizar el perfil en la base de datos

### **Causa 2: API Profile Devuelve Datos Incorrectos**
- `/api/profile` está devolviendo `semesterStage` incorrecto
- Necesitamos corregir la API

### **Causa 3: Cálculo de Stage Incorrecto**
- El cálculo se hace en el backend, no en el frontend
- Necesitamos corregir el backend

---

## 🔧 **Soluciones por Causa**

### **Si el problema es el perfil en BD:**
```bash
# Ir a /profile y actualizar semestre
# O corregir directamente en la base de datos
```

### **Si el problema es la API:**
```typescript
// Corregir en /api/profile/route.ts
// Asegurar que computeStage() se use correctamente
```

### **Si el problema es el cálculo:**
```typescript
// Verificar que el backend use la misma lógica
// O forzar el uso del cálculo del frontend
```

---

## 🧪 **Testing**

### **Verificar que Funciona:**
1. ✅ Abrir consola del navegador
2. ✅ Ir a `/goal-bank`
3. ✅ Revisar logs de debug
4. ✅ Identificar causa del problema
5. ✅ Aplicar solución correspondiente

### **Resultado Esperado:**
```javascript
🔍 DEBUG PROFILE: {
  semesterNumber: 5,
  semesterStage: "especializacion",  // ← CORRECTO
  carreraName: "Tu Carrera"
}

🎯 STAGE DEBUG: {
  semester: 5,
  computedStage: "especializacion",
  profileStage: "especializacion"   // ← COINCIDEN
}
```

---

## 📋 **Siguiente Paso**

Una vez que identifiquemos la causa exacta:
1. ✅ Aplicar la solución correspondiente
2. ✅ Verificar que el mapeo funcione correctamente
3. ✅ Corregir etiquetas de tests
4. ✅ Arreglar botones de inspiración

---

**¡Revisa los logs de debug y cuéntame qué ves! 🚀**
