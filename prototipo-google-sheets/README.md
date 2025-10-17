# 🎯 PROTOTIPO GOOGLE SHEETS - SELECCIÓN DE METAS IBI

## 📋 DESCRIPCIÓN

Prototipo funcional para que **30 estudiantes de 1er ingreso** definan metas basadas en sus resultados del Índice de Bienestar Integral (IBI). Este sistema permite recopilar, procesar y analizar las preferencias de los estudiantes de manera rápida y eficiente.

## 🎯 OBJETIVOS

- ✅ Recopilar datos de 30 estudiantes de primer ingreso
- ✅ Identificar las 3 dimensiones del bienestar más prioritarias
- ✅ Generar análisis automático de patrones y tendencias
- ✅ Validar la hipótesis sobre preferencias de dimensiones
- ✅ Preparar datos para migración al sistema principal

## 📁 ESTRUCTURA DE ARCHIVOS

```
prototipo-google-sheets/
├── README.md                    # Este archivo
├── apps-script.js              # Código de procesamiento automático
├── dashboard-formulas.txt      # Fórmulas para análisis
├── setup-instructions.md       # Instrucciones detalladas
└── PROTOTIPO-GOOGLE-SHEETS-IBI.md  # Documentación principal
```

## 🚀 IMPLEMENTACIÓN RÁPIDA

### **Tiempo total estimado: 2-4 horas**

1. **Crear formulario Google** (15 min)
2. **Configurar Google Sheets** (10 min)  
3. **Instalar Apps Script** (20 min)
4. **Configurar Dashboard** (15 min)
5. **Probar sistema** (10 min)
6. **Distribuir a estudiantes** (5 min)

## 📊 FUNCIONALIDADES

### **Formulario Inteligente:**
- ✅ Validación de dimensiones únicas
- ✅ Interfaz intuitiva con emojis
- ✅ Campos obligatorios y opcionales
- ✅ Descripción clara de cada dimensión

### **Procesamiento Automático:**
- ✅ Detección de respuestas duplicadas
- ✅ Organización por prioridades
- ✅ Análisis en tiempo real
- ✅ Exportación a CSV

### **Dashboard Interactivo:**
- ✅ Estadísticas generales
- ✅ Ranking de dimensiones
- ✅ Análisis por prioridades
- ✅ Gráficos automáticos
- ✅ Lista de estudiantes

## 🎨 DIMENSIONES DEL BIENESTAR

| Dimensión | Emoji | Descripción |
|-----------|-------|-------------|
| **Intelectual** | 🧠 | Desarrollo académico y habilidades de estudio |
| **Ocupacional** | 💼 | Claridad vocacional y preparación profesional |
| **Emocional** | ❤️ | Bienestar emocional y adaptación universitaria |
| **Social** | 👥 | Relaciones interpersonales y vida social |
| **Física** | 💪 | Salud física y bienestar corporal |
| **Espiritual** | 🙏 | Propósito de vida y valores personales |

## 📈 ANÁLISIS GENERADOS

### **Métricas Principales:**
- Total de estudiantes participantes
- Distribución por dimensiones
- Análisis de prioridades (Alta/Media/Baja)
- Detección de patrones duplicados
- Tendencias temporales

### **Reportes Automáticos:**
- Ranking de dimensiones más populares
- Porcentaje de selección por dimensión
- Análisis de estudiantes con patrones únicos
- Exportación de datos para análisis posterior

## 🔧 CONFIGURACIÓN TÉCNICA

### **Requisitos:**
- Cuenta de Google (Gmail)
- Acceso a Google Forms
- Acceso a Google Sheets
- Navegador web moderno

### **Permisos necesarios:**
- Lectura/escritura en Google Sheets
- Ejecución de Apps Script
- Acceso a Google Drive (para exportación)

## 📊 ESTRUCTURA DE DATOS

### **Hoja de Respuestas:**
```
Timestamp | Matrícula | Nombre | Dimensión1 | Dimensión2 | Dimensión3 | Comentarios
```

### **Hoja de Análisis:**
```
Timestamp | Matrícula | Nombre | Dimensión | Prioridad | Tiene Duplicados | Comentarios
```

### **Dashboard:**
```
Estadísticas Generales | Ranking Dimensiones | Análisis Prioridades | Lista Estudiantes
```

## 🚀 PRÓXIMOS PASOS

1. **Implementar prototipo** (2-4 horas)
2. **Probar con 2-3 estudiantes** (30 min)
3. **Distribuir a 30 estudiantes** (1 semana)
4. **Recopilar y analizar datos** (1 semana)
5. **Migrar al sistema principal** (1 día)

## 📞 SOPORTE

### **Problemas comunes:**
- Ver `setup-instructions.md` para solución de problemas
- Revisar logs de Apps Script para errores
- Verificar permisos y triggers

### **Funciones de mantenimiento:**
- `procesarRespuestasExistentes()` - Procesar datos previos
- `exportarDatosCSV()` - Exportar para análisis
- `limpiarDatosPrueba()` - Limpiar datos de prueba

## 📝 NOTAS IMPORTANTES

- ⚠️ **Validación:** El sistema detecta dimensiones duplicadas pero las procesa
- 📊 **Escalabilidad:** Diseñado para 30 estudiantes, fácil de expandir
- 🔄 **Migración:** Datos listos para importar al sistema principal
- 📈 **Análisis:** Dashboard se actualiza automáticamente con cada respuesta

---

**Desarrollado para:** Prototipo de validación IBI - Estudiantes 1er Ingreso  
**Fecha:** Diciembre 2024  
**Versión:** 1.0
