# 🎯 PROTOTIPO GOOGLE SHEETS - SELECCIÓN DE METAS IBI

## 📋 DESCRIPCIÓN

**Prototipo completo y funcional** para que **30 estudiantes de 1er ingreso** definan metas personalizadas basadas en sus resultados del Índice de Bienestar Integral (IBI). El sistema incluye una **web app interactiva**, **motor de recomendaciones**, **base de datos de 28 metas específicas** y **sistema automático de correos** con instrucciones para Mi Tec.

## 🎯 OBJETIVOS

- ✅ **Recopilar datos** de 30 estudiantes de primer ingreso
- ✅ **Identificar las 3 dimensiones** del bienestar más prioritarias
- ✅ **Generar recomendaciones personalizadas** de metas específicas
- ✅ **Enviar correos automáticos** con metas seleccionadas
- ✅ **Proporcionar instrucciones** para subir metas a Mi Tec
- ✅ **Validar la hipótesis** sobre preferencias de dimensiones
- ✅ **Preparar datos** para migración al sistema principal

## 📁 ESTRUCTURA DE ARCHIVOS

```
prototipo-google-sheets/
├── README.md                           # Este archivo
├── webapp.html                        # Web app completa e interactiva
├── webapp-apps-script.js              # Backend con lógica de negocio
├── setup-webapp-instructions.md       # Instrucciones de despliegue
├── apps-script.js                     # Código básico (versión simple)
├── dashboard-formulas.txt             # Fórmulas para análisis
├── setup-instructions.md              # Instrucciones básicas
├── PROTOTIPO-GOOGLE-SHEETS-IBI.md     # Documentación principal
└── CORRECCIONES-*.md                  # Documentación de mejoras
```

## 🚀 IMPLEMENTACIÓN RÁPIDA

### **Opción 1: Formulario Google (Básico) - 2-4 horas**
1. **Crear formulario Google** (15 min)
2. **Configurar Google Sheets** (10 min)  
3. **Instalar Apps Script** (20 min)
4. **Configurar Dashboard** (15 min)
5. **Probar sistema** (10 min)
6. **Distribuir a estudiantes** (5 min)

### **Opción 2: Web App Avanzada (Recomendado) - 1-2 horas**
1. **Crear Google Sheets** (5 min)
2. **Configurar Apps Script** (15 min)
3. **Desplegar Web App** (10 min)
4. **Configurar Base de Datos** (5 min)
5. **Personalizar y Probar** (10 min)
6. **Distribuir URL** (5 min)

## 📊 FUNCIONALIDADES

### **Versión 1: Formulario Google (Básico)**
- ✅ Validación de dimensiones únicas
- ✅ Interfaz intuitiva con emojis
- ✅ Campos obligatorios y opcionales
- ✅ Descripción clara de cada dimensión
- ✅ Detección de respuestas duplicadas
- ✅ Organización por prioridades
- ✅ Análisis en tiempo real
- ✅ Exportación a CSV

### **Versión 2: Web App Avanzada (Recomendado) - IMPLEMENTADA**
- ✅ **Interfaz moderna y responsiva** con emojis y diseño atractivo
- ✅ **Motor de recomendaciones personalizadas** basado en selección
- ✅ **Base de datos integrada de 28 metas** (4 por dimensión)
- ✅ **Selección interactiva con validación** y prioridades
- ✅ **Modal de alternativas completo** con todas las opciones
- ✅ **Creación de metas personalizadas** con metodología SMARTER
- ✅ **Sistema automático de correos** a matricula@tec.mx
- ✅ **Template HTML profesional** compatible con todos los clientes
- ✅ **Instrucciones integradas** para subir metas a Mi Tec
- ✅ **Compromisos de mentora** enfocados en autonomía estudiantil
- ✅ **Guardado automático en Google Sheets** con análisis
- ✅ **Dashboard en tiempo real** con métricas
- ✅ **Exportación de datos completa** para análisis

## 🎨 DIMENSIONES DEL BIENESTAR

| Dimensión | Emoji | Descripción |
|-----------|-------|-------------|
| **Intelectual** | 🧠 | Desarrollo académico y habilidades de estudio |
| **Ocupacional** | 💼 | Claridad vocacional y preparación profesional |
| **Emocional** | ❤️ | Bienestar emocional y adaptación universitaria |
| **Social** | 👥 | Relaciones interpersonales y vida social |
| **Física** | 💪 | Salud física y bienestar corporal |
| **Espiritual** | 🙏 | Propósito de vida y valores personales |
| **Financiera** | 💰 | Gestión de recursos económicos y planificación financiera |

## 📈 ANÁLISIS GENERADOS

### **Métricas Principales:**
- Total de estudiantes participantes
- Distribución por dimensiones seleccionadas
- Análisis de prioridades (Prioritaria/Complementaria/Longitudinal)
- Metas más populares por dimensión
- Patrones de selección de alternativas
- Uso de metas personalizadas SMARTER

### **Reportes Automáticos:**
- Ranking de dimensiones más populares
- Porcentaje de selección por dimensión
- Análisis de metas más elegidas
- Estadísticas de correos enviados
- Log de reenvíos de correos
- Exportación de datos para análisis posterior

### **Sistema de Correos:**
- Envío automático a matricula@tec.mx
- Template HTML personalizado por estudiante
- Log de correos enviados y reenviados
- Instrucciones integradas para Mi Tec
- Tutorial de MiVidaTec incluido

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
Timestamp | Matrícula | Nombre | Dimensión1 | Dimensión2 | Dimensión3 | Meta1 | Meta2 | Meta3 | Comentarios
```

### **Hoja de Análisis por Dimensiones:**
```
Timestamp | Matrícula | Nombre | Dimensión | Prioridad | Meta Seleccionada | Alternativas | Comentarios
```

### **Hoja de Log Correos:**
```
Timestamp | Matrícula | Nombre | Correo Enviado | Reenvíos | Estado | Observaciones
```

### **Hoja de Base de Datos Metas:**
```
ID | Dimensión | Título | Descripción | Pasos | Prioridad | Categoría | Tips | Compromiso Mentora
```

### **Dashboard:**
```
Estadísticas Generales | Ranking Dimensiones | Metas Populares | Log Correos | Análisis Prioridades
```

## 🚀 PRÓXIMOS PASOS

1. ✅ **Implementar prototipo** - COMPLETADO
2. **Desplegar en Google Apps Script** (30 min)
3. **Probar con 2-3 estudiantes** (30 min)
4. **Distribuir a 30 estudiantes** (1 semana)
5. **Recopilar y analizar datos** (1 semana)
6. **Migrar al sistema principal** (1 día)

## 🎯 ESTADO ACTUAL

### **✅ COMPLETADO:**
- Web app interactiva y funcional
- Base de datos de 28 metas específicas
- Sistema de recomendaciones personalizadas
- Modal de alternativas completo
- Creación de metas personalizadas SMARTER
- Sistema automático de correos
- Template HTML compatible con todos los clientes
- Compromisos de mentora enfocados en autonomía
- Instrucciones para Mi Tec integradas
- Documentación completa

### **🚀 LISTO PARA:**
- Despliegue en Google Apps Script
- Pruebas con estudiantes
- Recolección de datos
- Análisis de resultados

## 📞 SOPORTE

### **Problemas comunes:**
- Ver `setup-webapp-instructions.md` para solución de problemas
- Revisar logs de Apps Script para errores
- Verificar permisos y triggers
- Consultar `CORRECCIONES-*.md` para mejoras implementadas

### **Funciones de mantenimiento:**
- `procesarRespuestasExistentes()` - Procesar datos previos
- `exportarDatosCSV()` - Exportar para análisis
- `limpiarDatosPrueba()` - Limpiar datos de prueba
- `verifySheetsSetup()` - Verificar configuración de hojas
- `resendRecommendationsEmail()` - Reenviar correos

## 📝 NOTAS IMPORTANTES

- ✅ **Validación:** Sistema completo con validación de dimensiones y metas
- 📊 **Escalabilidad:** Diseñado para 30 estudiantes, fácil de expandir
- 🔄 **Migración:** Datos listos para importar al sistema principal
- 📈 **Análisis:** Dashboard se actualiza automáticamente con cada respuesta
- 📧 **Correos:** Template HTML compatible con Outlook y todos los clientes
- 🎯 **Autonomía:** Enfoque en responsabilidad del estudiante para detonar acompañamiento
- 🧠 **SMARTER:** Metodología integrada para metas personalizadas
- 🏫 **TEC:** Metas específicas del TEC (Punto Blanco, Tec Services, etc.)

## 🎨 CARACTERÍSTICAS DESTACADAS

### **Interfaz de Usuario:**
- Diseño moderno con emojis y colores atractivos
- Selección intuitiva con prioridades visuales
- Modal de alternativas con todas las opciones
- Formulario SMARTER para metas personalizadas
- Resumen completo de selecciones

### **Sistema de Correos:**
- Template HTML profesional y personalizado
- Compromisos de mentora enfocados en autonomía
- Instrucciones claras para Mi Tec
- Tutorial de MiVidaTec integrado
- Sistema de reenvío automático

### **Base de Datos:**
- 28 metas específicas para primer semestre
- Metas del banco original del proyecto
- Metas específicas del TEC
- Metodología SMARTER integrada
- Categorización por prioridad y tipo

---

**Desarrollado para:** Prototipo de validación IBI - Estudiantes 1er Ingreso  
**Fecha:** Diciembre 2024  
**Versión:** 2.0 - COMPLETA Y FUNCIONAL  
**Estado:** ✅ LISTO PARA DESPLIEGUE
