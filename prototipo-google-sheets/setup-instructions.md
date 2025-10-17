# 🚀 INSTRUCCIONES DE CONFIGURACIÓN - PROTOTIPO GOOGLE SHEETS

## 📋 PASO A PASO COMPLETO

### **PASO 1: Crear Formulario Google** ⏱️ 15 minutos

1. **Ir a Google Forms:**
   - Abrir [forms.google.com](https://forms.google.com)
   - Hacer clic en "Crear formulario en blanco"

2. **Configurar título y descripción:**
   ```
   Título: Selección de Metas IBI - Estudiantes 1er Ingreso
   
   Descripción: 
   Este formulario te ayudará a identificar las 3 dimensiones del bienestar 
   que consideras más prioritarias según tu evaluación del Índice de Bienestar Integral (IBI).
   
   Instrucciones:
   - Selecciona exactamente 3 dimensiones diferentes
   - La primera será tu prioridad más alta
   - Las otras dos en orden de importancia
   ```

3. **Agregar preguntas:**

   **Pregunta 1: Matrícula**
   - Tipo: Respuesta corta
   - Título: "Matrícula"
   - Descripción: "Ingresa tu matrícula completa (ej: A1234567)"
   - Marcar como obligatorio ✅

   **Pregunta 2: Nombre**
   - Tipo: Respuesta corta  
   - Título: "Nombre completo"
   - Descripción: "Ingresa tu nombre completo"
   - Marcar como obligatorio ✅

   **Pregunta 3: Dimensión 1 (Prioritaria)**
   - Tipo: Lista desplegable
   - Título: "Dimensión 1 - Tu prioridad más alta"
   - Descripción: "Selecciona la dimensión que consideras más importante para tu desarrollo"
   - Opciones:
     ```
     🧠 Intelectual - Desarrollo académico y habilidades de estudio
     💼 Ocupacional - Claridad vocacional y preparación profesional
     ❤️ Emocional - Bienestar emocional y adaptación universitaria
     👥 Social - Relaciones interpersonales y vida social
     💪 Física - Salud física y bienestar corporal
     🙏 Espiritual - Propósito de vida y valores personales
     ```
   - Marcar como obligatorio ✅

   **Pregunta 4: Dimensión 2**
   - Tipo: Lista desplegable
   - Título: "Dimensión 2 - Tu segunda prioridad"
   - Descripción: "Selecciona tu segunda dimensión más importante"
   - Mismas opciones que la pregunta 3
   - Marcar como obligatorio ✅

   **Pregunta 5: Dimensión 3**
   - Tipo: Lista desplegable
   - Título: "Dimensión 3 - Tu tercera prioridad"
   - Descripción: "Selecciona tu tercera dimensión más importante"
   - Mismas opciones que la pregunta 3
   - Marcar como obligatorio ✅

   **Pregunta 6: Comentarios (Opcional)**
   - Tipo: Párrafo
   - Título: "Comentarios adicionales"
   - Descripción: "¿Hay algo más que te gustaría compartir sobre tu selección?"
   - Marcar como opcional

4. **Configurar formulario:**
   - Ir a Configuración (⚙️)
   - Activar "Recopilar direcciones de correo electrónico"
   - Activar "Limitar a 1 respuesta"
   - Desactivar "Mostrar barra de progreso"

5. **Personalizar apariencia:**
   - Elegir tema apropiado
   - Agregar imagen de header si se desea

---

### **PASO 2: Configurar Google Sheets** ⏱️ 10 minutos

1. **Crear hoja de cálculo:**
   - En el formulario, ir a la pestaña "Respuestas"
   - Hacer clic en el ícono de Google Sheets
   - Crear nueva hoja de cálculo
   - Nombrar: "Prototipo IBI - Selección de Metas"

2. **Renombrar hojas:**
   - Hoja 1: "Respuestas del formulario 1"
   - Crear hoja 2: "Dashboard Resultados"
   - Crear hoja 3: "Análisis por Dimensiones"

---

### **PASO 3: Configurar Apps Script** ⏱️ 20 minutos

1. **Abrir editor de scripts:**
   - En Google Sheets, ir a Extensiones → Apps Script
   - Se abrirá una nueva pestaña

2. **Configurar el proyecto:**
   - Cambiar nombre del proyecto a "Prototipo IBI - Procesamiento"
   - Eliminar el código por defecto

3. **Pegar el código:**
   - Copiar todo el contenido de `apps-script.js`
   - Pegar en el editor
   - Guardar (Ctrl+S)

4. **Configurar trigger:**
   - Hacer clic en "Triggers" (⏰) en el panel izquierdo
   - Hacer clic en "Add Trigger"
   - Configurar:
     ```
     Función: onFormSubmit
     Tipo de evento: Desde el formulario
     Tipo de evento: Al enviar el formulario
     ```
   - Hacer clic en "Save"

5. **Autorizar permisos:**
   - Ejecutar la función `onFormSubmit` una vez
   - Autorizar todos los permisos solicitados

---

### **PASO 4: Configurar Dashboard** ⏱️ 15 minutos

1. **Configurar hoja "Dashboard Resultados":**
   - Ir a la hoja "Dashboard Resultados"
   - Copiar y pegar las fórmulas de `dashboard-formulas.txt`
   - Ajustar referencias de celdas según sea necesario

2. **Crear gráficos:**
   - Seleccionar datos para gráfico de dimensiones
   - Insertar → Gráfico
   - Configurar tipo y estilo
   - Repetir para gráfico de prioridades

3. **Aplicar formato:**
   - Aplicar colores según especificaciones
   - Ajustar ancho de columnas
   - Aplicar formato condicional

---

### **PASO 5: Probar el Sistema** ⏱️ 10 minutos

1. **Prueba básica:**
   - Enviar una respuesta de prueba al formulario
   - Verificar que aparezca en la hoja de respuestas
   - Verificar que se procese en "Análisis por Dimensiones"
   - Verificar que se actualice el dashboard

2. **Prueba de validación:**
   - Enviar respuesta con dimensiones duplicadas
   - Verificar que se marque correctamente
   - Verificar que el dashboard muestre el conteo

3. **Prueba de exportación:**
   - Ejecutar función `exportarDatosCSV()` en Apps Script
   - Verificar que se genere el archivo CSV

---

### **PASO 6: Distribuir a Estudiantes** ⏱️ 5 minutos

1. **Obtener enlace:**
   - En el formulario, hacer clic en "Enviar"
   - Copiar el enlace generado
   - Configurar permisos (cualquiera con el enlace puede responder)

2. **Crear mensaje para estudiantes:**
   ```
   Hola [Nombre],
   
   Te invitamos a participar en una breve encuesta sobre tus metas 
   basadas en tu evaluación del Índice de Bienestar Integral (IBI).
   
   El formulario toma aproximadamente 3-5 minutos completar.
   
   Enlace: [URL del formulario]
   
   Gracias por tu participación.
   ```

---

## 🔧 FUNCIONES ADICIONALES DE APPS SCRIPT

### **Procesar respuestas existentes:**
```javascript
// Si agregaste el script después de tener respuestas
procesarRespuestasExistentes();
```

### **Exportar datos:**
```javascript
// Generar archivo CSV con todos los datos
exportarDatosCSV();
```

### **Limpiar datos de prueba:**
```javascript
// Eliminar respuestas de prueba
function limpiarDatosPrueba() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  for (let i = data.length - 1; i >= 1; i--) {
    if (data[i][1].includes('PRUEBA') || data[i][1].includes('TEST')) {
      sheet.deleteRow(i + 1);
    }
  }
}
```

---

## 📊 MONITOREO Y MANTENIMIENTO

### **Verificaciones diarias:**
- Revisar nuevas respuestas
- Verificar que no haya errores en Apps Script
- Confirmar que el dashboard se actualice correctamente

### **Limpieza de datos:**
- Eliminar respuestas de prueba antes del análisis final
- Verificar que no haya duplicados por error
- Validar formato de matrículas

### **Backup de datos:**
- Exportar datos a CSV semanalmente
- Hacer copia de la hoja de cálculo
- Documentar cualquier problema encontrado

---

## 🚨 SOLUCIÓN DE PROBLEMAS

### **Error: "No se puede ejecutar la función"**
- Verificar que los permisos estén autorizados
- Revisar que el trigger esté configurado correctamente
- Ejecutar manualmente la función una vez

### **Datos no se procesan automáticamente**
- Verificar que el nombre de la hoja coincida exactamente
- Revisar que el trigger esté activo
- Ejecutar `procesarRespuestasExistentes()` manualmente

### **Dashboard no se actualiza**
- Verificar fórmulas en el dashboard
- Confirmar que los nombres de hojas sean correctos
- Revisar que no haya errores en las fórmulas

---

## ✅ CHECKLIST FINAL

- [ ] Formulario creado y configurado
- [ ] Google Sheets configurado con 3 hojas
- [ ] Apps Script instalado y autorizado
- [ ] Trigger configurado correctamente
- [ ] Dashboard configurado con fórmulas
- [ ] Gráficos creados
- [ ] Pruebas realizadas exitosamente
- [ ] Enlace del formulario listo para distribuir
- [ ] Mensaje para estudiantes preparado
- [ ] Sistema de monitoreo establecido
