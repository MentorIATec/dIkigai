# 🧪 INSTRUCCIONES PARA PROBAR LOS BOTONES DE TESTS

**Fecha:** 9 de octubre, 2025  
**Objetivo:** Verificar que los botones de tests funcionen correctamente

---

## 🎯 **Pasos para Probar**

### **1. Abrir la Aplicación**
```bash
# Asegúrate de que el servidor esté corriendo:
npm run dev

# Abrir en navegador:
http://localhost:9002/goal-bank
```

### **2. Verificar Vista UX LEAN**
Deberías ver:
- ✅ **Vista específica** según tu semestre
- ✅ **Botón de test** correspondiente a tu etapa
- ✅ **Consola del navegador** (F12) con logs de debug

---

## 🔍 **Debugging en Consola**

### **Abrir Consola del Navegador:**
1. Presiona `F12` o `Ctrl+Shift+I`
2. Ve a la pestaña "Console"
3. Refresca la página

### **Logs que Deberías Ver:**
```javascript
// Al cargar la página:
Rendering UX LEAN view: { userSemester: X, profile: true, showTest: false }

// Al hacer clic en un botón de test:
URL params: { testParam: "enfoque", profile: true }
Setting showTest to true
Rendering test view: { showTest: true, profile: "enfoque" }
```

---

## 🎮 **Pruebas por Semestre**

### **Si estás en 1er Semestre:**
- ✅ Deberías ver: "Tu Primer Semestre"
- ✅ Botón: "Generar inspiración"
- ✅ NO debería haber botón de test

### **Si estás en 2°-3° Semestre:**
- ✅ Deberías ver: "Etapa de Enfoque"
- ✅ Botón: "Iniciar Brújula de Enfoque"
- ✅ Al hacer clic → Debería ir a test de enfoque

### **Si estás en 4°-6° Semestre:**
- ✅ Deberías ver: "Etapa de Especialización"
- ✅ Botón: "Iniciar Brújula de Especialización"
- ✅ Al hacer clic → Debería ir a test de especialización

### **Si estás en 7°+ Semestre:**
- ✅ Deberías ver: "Etapa de Graduación"
- ✅ Botón: "Iniciar Checklist de Graduación"
- ✅ Al hacer clic → Debería ir a checklist de graduación

---

## 🔗 **URLs de Prueba Manual**

Si los botones no funcionan, puedes probar directamente:

### **Test de Enfoque:**
```
http://localhost:9002/goal-bank?test=enfoque
```

### **Test de Especialización:**
```
http://localhost:9002/goal-bank?test=especializacion
```

### **Test de Graduación:**
```
http://localhost:9002/goal-bank?test=graduacion
```

---

## 🐛 **Problemas Comunes y Soluciones**

### **Problema 1: No veo botones de test**
**Solución:**
1. Verifica tu semestre en `/profile`
2. Asegúrate de tener un perfil completo
3. Revisa la consola para errores

### **Problema 2: Los botones no responden**
**Solución:**
1. Revisa la consola del navegador (F12)
2. Verifica que no haya errores de JavaScript
3. Prueba las URLs manuales arriba

### **Problema 3: Veo vista UX LEAN pero no tests**
**Solución:**
1. Verifica que tu semestre sea > 1
2. Revisa los logs en consola
3. Prueba cambiar tu semestre en `/profile`

---

## 📊 **Qué Esperar en Cada Vista**

### **Vista UX LEAN (por defecto):**
```
┌─────────────────────────────────────┐
│ Asistente de Metas                  │
│ Tu guía personalizada...            │
├─────────────────────────────────────┤
│ [Etapa específica]                  │
│ [Botón de test correspondiente]     │
└─────────────────────────────────────┘
```

### **Vista de Test (al hacer clic):**
```
┌─────────────────────────────────────┐
│ Asistente de Metas        [← Volver]│
│ Test personalizado...               │
├─────────────────────────────────────┤
│ [GeneradorMetas - Test funcional]   │
└─────────────────────────────────────┘
```

---

## 🔧 **Si Nada Funciona**

### **Verificación Completa:**
1. ✅ Servidor corriendo en puerto 9002
2. ✅ Sin errores en consola del navegador
3. ✅ Perfil completo en `/profile`
4. ✅ Semestre configurado correctamente

### **Comando de Reset:**
```bash
# Si hay problemas, reinicia todo:
rm -rf .next && npm run dev
```

---

## 📞 **Reportar Problemas**

Si encuentras problemas, incluye:
1. **Tu semestre actual** (de `/profile`)
2. **Qué vista ves** (UX LEAN o test)
3. **Logs de la consola** (F12 → Console)
4. **Screenshot** de la página
5. **URL actual** en el navegador

---

## ✅ **Checklist de Verificación**

- [ ] Servidor corriendo en puerto 9002
- [ ] Página carga sin errores
- [ ] Veo vista UX LEAN según mi semestre
- [ ] Veo botón de test correspondiente (si semestre > 1)
- [ ] Al hacer clic en botón, veo test funcional
- [ ] Botón "← Volver" funciona
- [ ] Consola sin errores de JavaScript

---

**¡Con estos pasos deberías poder probar todos los botones de tests! 🚀**
