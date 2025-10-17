# 🚀 INSTRUCCIONES DE CONFIGURACIÓN - WEB APP AVANZADA

## 🎯 **WEB APP CON RECOMENDACIONES PERSONALIZADAS**

Esta versión avanzada incluye una interfaz web completa que no solo recopila las dimensiones seleccionadas, sino que **genera recomendaciones personalizadas de metas** basadas en la base de datos del proyecto principal.

---

## 📋 PASO A PASO COMPLETO

### **PASO 1: Crear Google Sheets** ⏱️ 5 minutos

1. **Crear nueva hoja de cálculo:**
   - Ir a [sheets.google.com](https://sheets.google.com)
   - Crear nueva hoja: "Prototipo IBI - Web App Avanzada"
   - Renombrar hoja 1: "Dashboard Resultados"

2. **Configurar estructura inicial:**
   ```
   A1: 📊 DASHBOARD - SELECCIÓN DE METAS IBI (WEB APP)
   A3: Total de Estudiantes:
   A4: Respuestas con Duplicados:
   A6: 🏆 RANKING DE DIMENSIONES
   A7: Dimensión | Total Selecciones | Porcentaje
   ```

---

### **PASO 2: Configurar Apps Script** ⏱️ 15 minutos

1. **Abrir editor de scripts:**
   - En Google Sheets, ir a Extensiones → Apps Script
   - Cambiar nombre del proyecto a "Prototipo IBI - Web App"

2. **Configurar archivos:**
   - **Archivo 1:** `Code.gs` - Pegar contenido de `webapp-apps-script.js`
   - **Archivo 2:** `webapp.html` - Crear nuevo archivo HTML
   - **Archivo 3:** Pegar contenido de `webapp.html` en el archivo HTML

3. **Guardar y autorizar:**
   - Guardar todos los archivos (Ctrl+S)
   - Ejecutar función `doGet()` una vez para autorizar permisos

---

### **PASO 3: Desplegar Web App** ⏱️ 10 minutos

1. **Configurar despliegue:**
   - En Apps Script, hacer clic en "Desplegar" → "Nueva implementación"
   - Tipo: "Aplicación web"
   - Configurar:
     ```
     Descripción: Prototipo IBI - Web App
     Ejecutar como: Yo
     Quién tiene acceso: Cualquiera
     ```

2. **Obtener URL:**
   - Copiar la URL de la aplicación web
   - Esta será la URL que compartirás con los estudiantes

3. **Probar la aplicación:**
   - Abrir la URL en una nueva pestaña
   - Completar el flujo completo
   - Verificar que se guarden los datos en Google Sheets

---

### **PASO 4: Configurar Base de Datos de Metas** ⏱️ 5 minutos

1. **Ejecutar función de inicialización:**
   - En Apps Script, ejecutar `createSheetsIfNeeded()`
   - Esto creará automáticamente:
     - Hoja "Respuestas Web App"
     - Hoja "Análisis por Dimensiones"
     - Hoja "Base de Datos Metas"

2. **Verificar datos:**
   - Revisar que la hoja "Base de Datos Metas" tenga las 21 metas
   - Confirmar que estén organizadas por dimensiones

---

### **PASO 5: Personalizar la Web App** ⏱️ 10 minutos

1. **Modificar colores y branding:**
   - Editar `webapp.html` para cambiar colores
   - Actualizar título y descripción según necesidades

2. **Ajustar base de datos de metas:**
   - Modificar `GOALS_DATABASE` en `webapp-apps-script.js`
   - Agregar o modificar metas según el proyecto

3. **Configurar notificaciones:**
   - Implementar sistema de notificaciones por email (opcional)
   - Configurar alertas para nuevos registros

---

## 🎨 **CARACTERÍSTICAS DE LA WEB APP**

### **Interfaz de Usuario:**
- ✅ **Diseño responsivo** - Funciona en móviles y desktop
- ✅ **Progreso visual** - Barra de progreso y pasos claros
- ✅ **Selección intuitiva** - Tarjetas interactivas con emojis
- ✅ **Validación en tiempo real** - Previene errores de selección

### **Motor de Recomendaciones:**
- ✅ **Recomendaciones personalizadas** - Basadas en dimensiones seleccionadas
- ✅ **Priorización inteligente** - Prioritaria, Complementaria, Longitudinal
- ✅ **Alternativas disponibles** - 3 opciones por dimensión
- ✅ **Base de datos integrada** - 21 metas del proyecto principal

### **Procesamiento de Datos:**
- ✅ **Guardado automático** - En Google Sheets
- ✅ **Análisis en tiempo real** - Dashboard actualizado
- ✅ **Exportación de datos** - CSV para análisis posterior
- ✅ **Validación de datos** - Previene duplicados y errores

---

## 📊 **FLUJO DE LA WEB APP**

### **Paso 1: Información del Estudiante**
```
📝 Datos Básicos
├── Matrícula (obligatorio)
├── Nombre completo (obligatorio)
└── Validación de campos
```

### **Paso 2: Selección de Dimensiones**
```
🎯 Selección Interactiva
├── 7 dimensiones disponibles
├── Selección de 3 prioridades
├── Validación de selección única
└── Indicadores visuales de prioridad
```

### **Paso 3: Recomendaciones Personalizadas**
```
📊 Motor de Recomendaciones
├── Meta prioritaria (dimensión 1)
├── Meta complementaria (dimensión 2)
├── Meta longitudinal (dimensión 3)
├── 3 alternativas por dimensión
└── Acciones: Seleccionar | Ver Alternativas
```

---

## 🔧 **FUNCIONES PRINCIPALES DE APPS SCRIPT**

### **Funciones de la Web App:**
```javascript
doGet()                           // Servir la interfaz web
processDimensionSelection()       // Procesar selecciones
generateRecommendations()        // Generar recomendaciones
saveToSheets()                   // Guardar en Google Sheets
```

### **Funciones de Análisis:**
```javascript
updateDashboard()                // Actualizar estadísticas
calculateStats()                 // Calcular métricas
exportDataToCSV()               // Exportar datos
cleanTestData()                 // Limpiar datos de prueba
```

### **Funciones de Configuración:**
```javascript
createSheetsIfNeeded()          // Crear hojas automáticamente
populateGoalsDatabase()         // Poblar base de datos
getDimensionsData()             // Obtener datos de dimensiones
getGoalsDatabase()              // Obtener base de datos de metas
```

---

## 📈 **VENTAJAS DE LA WEB APP vs FORMULARIO**

| Característica | Formulario Google | Web App Avanzada |
|----------------|-------------------|------------------|
| **Interfaz** | Básica | Profesional y moderna |
| **Recomendaciones** | ❌ No | ✅ Sí, personalizadas |
| **Validación** | Limitada | Completa en tiempo real |
| **Experiencia** | Estática | Interactiva y guiada |
| **Datos** | Solo respuestas | Respuestas + recomendaciones |
| **Análisis** | Manual | Automático |
| **Escalabilidad** | Básica | Alta |

---

## 🚀 **DISTRIBUCIÓN A ESTUDIANTES**

### **Mensaje para Estudiantes:**
```
🎯 ¡Participa en la Selección de Metas IBI!

Hola [Nombre],

Te invitamos a participar en una experiencia interactiva para identificar 
tus 3 dimensiones prioritarias del bienestar y recibir recomendaciones 
personalizadas de metas.

✨ Características:
- Interfaz moderna y fácil de usar
- Recomendaciones personalizadas
- Tiempo estimado: 5-7 minutos
- Resultados inmediatos

🔗 Accede aquí: [URL de la web app]

¡Tu participación nos ayudará a mejorar el sistema de recomendaciones!

Equipo dIkigai
```

### **Configuración de Acceso:**
- ✅ **URL pública** - Cualquiera puede acceder
- ✅ **Sin autenticación** - Acceso directo
- ✅ **Responsive** - Funciona en cualquier dispositivo
- ✅ **Rápido** - Carga en segundos

---

## 📊 **MONITOREO Y ANÁLISIS**

### **Métricas Automáticas:**
- Total de estudiantes participantes
- Distribución por dimensiones
- Tiempo promedio de completación
- Metas más seleccionadas
- Patrones de selección

### **Reportes Disponibles:**
- Dashboard en tiempo real
- Exportación a CSV
- Análisis de tendencias
- Comparativas por período

---

## 🔧 **MANTENIMIENTO**

### **Tareas Diarias:**
- Revisar nuevas respuestas
- Verificar funcionamiento de la web app
- Monitorear errores en Apps Script

### **Tareas Semanales:**
- Exportar datos de respaldo
- Actualizar base de datos de metas
- Revisar estadísticas del dashboard

### **Tareas Mensuales:**
- Limpiar datos de prueba
- Optimizar rendimiento
- Actualizar documentación

---

## 🚨 **SOLUCIÓN DE PROBLEMAS**

### **Error: "No se puede acceder a la web app"**
- Verificar configuración de despliegue
- Confirmar permisos de acceso
- Revisar que la URL sea correcta

### **Error: "No se guardan los datos"**
- Verificar permisos de Apps Script
- Revisar configuración de Google Sheets
- Ejecutar `createSheetsIfNeeded()` manualmente

### **Error: "Recomendaciones no se generan"**
- Verificar base de datos de metas
- Revisar función `generateRecommendations()`
- Confirmar que las dimensiones sean válidas

---

## ✅ **CHECKLIST FINAL**

- [ ] Google Sheets creado y configurado
- [ ] Apps Script configurado con ambos archivos
- [ ] Web app desplegada y accesible
- [ ] Base de datos de metas poblada
- [ ] Pruebas completadas exitosamente
- [ ] URL de acceso lista para distribuir
- [ ] Sistema de monitoreo establecido
- [ ] Documentación actualizada

---

## 🎯 **PRÓXIMOS PASOS**

1. **Implementar web app** (30 minutos)
2. **Probar con 2-3 estudiantes** (15 minutos)
3. **Distribuir a 30 estudiantes** (1 semana)
4. **Recopilar y analizar datos** (1 semana)
5. **Migrar al sistema principal** (1 día)

---

**¡La web app está lista para ofrecer una experiencia superior a los estudiantes!** 🚀
