# 🎯 PROTOTIPO GOOGLE SHEETS - SELECCIÓN DE METAS IBI

**Objetivo:** Prototipo funcional para que 30 estudiantes de 1er ingreso definan metas basadas en sus resultados del IBI.

**Fecha:** Diciembre 2024  
**Alcance:** 30 estudiantes de primer ingreso  
**Tiempo estimado:** 2-4 horas de implementación

---

## 📋 ESTRUCTURA DEL FORMULARIO

### **Campos del Formulario:**
1. **Matrícula** (Texto corto, obligatorio)
2. **Nombre completo** (Texto corto, obligatorio)  
3. **Dimensión 1 (Prioritaria)** (Lista desplegable, obligatorio)
4. **Dimensión 2** (Lista desplegable, obligatorio)
5. **Dimensión 3** (Lista desplegable, obligatorio)
6. **Comentarios** (Párrafo, opcional)

### **Opciones de Dimensiones:**
- 🧠 **Intelectual** - Desarrollo académico y habilidades de estudio
- 💼 **Ocupacional** - Claridad vocacional y preparación profesional  
- ❤️ **Emocional** - Bienestar emocional y adaptación universitaria
- 👥 **Social** - Relaciones interpersonales y vida social
- 💪 **Física** - Salud física y bienestar corporal
- 🙏 **Espiritual** - Propósito de vida y valores personales

---

## 🔧 CONFIGURACIÓN GOOGLE SHEETS

### **Paso 1: Crear Formulario**
1. Ir a [forms.google.com](https://forms.google.com)
2. Crear nuevo formulario: "Selección de Metas IBI - Estudiantes 1er Ingreso"
3. Configurar según estructura anterior

### **Paso 2: Configurar Apps Script**
1. En el formulario → ⋮ → Script editor
2. Pegar código del archivo `apps-script.js`
3. Guardar y autorizar permisos

### **Paso 3: Crear Dashboard**
1. Crear nueva hoja: "Dashboard Resultados"
2. Configurar fórmulas para análisis automático

---

## 📊 ESTRUCTURA DE DATOS

### **Hoja de Respuestas (automática):**
| Timestamp | Matrícula | Nombre | Dimensión1 | Dimensión2 | Dimensión3 | Comentarios |
|-----------|-----------|--------|------------|------------|------------|-------------|
| 2024-12-XX | A1234567 | Juan Pérez | Intelectual | Emocional | Social | ... |

### **Hoja Dashboard:**
- Resumen por dimensiones
- Gráficos de distribución
- Lista de estudiantes
- Análisis de patrones

---

## 🚀 PRÓXIMOS PASOS

1. ✅ Crear formulario Google
2. ✅ Configurar Apps Script  
3. ✅ Crear dashboard de resultados
4. ✅ Probar con 2-3 estudiantes
5. ✅ Distribuir a 30 estudiantes
6. ✅ Analizar resultados
7. ✅ Migrar datos al sistema principal

---

## 📁 ARCHIVOS DEL PROTOTIPO

- `apps-script.js` - Código de procesamiento automático
- `dashboard-formulas.txt` - Fórmulas para análisis
- `setup-instructions.md` - Instrucciones detalladas
