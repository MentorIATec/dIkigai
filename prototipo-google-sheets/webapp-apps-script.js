/**
 * APPS SCRIPT PARA WEB APP - PROTOTIPO IBI CON RECOMENDACIONES
 * 
 * Funcionalidad:
 * - Servir la web app HTML
 * - Procesar selecciones de dimensiones
 * - Generar recomendaciones personalizadas
 * - Guardar resultados en Google Sheets
 * - Integrar con base de datos de metas del proyecto
 */

// Configuración
const FORM_RESPONSES_SHEET = 'Respuestas Web App';
const DASHBOARD_SHEET = 'Dashboard Resultados';
const ANALYSIS_SHEET = 'Análisis por Dimensiones';
const GOALS_SHEET = 'Base de Datos Metas';

// Dimensiones disponibles
const DIMENSIONS = {
  'Intelectual': {
    emoji: '🧠',
    description: 'Desarrollo académico y habilidades de estudio',
    color: '#4285f4'
  },
  'Ocupacional': {
    emoji: '💼',
    description: 'Claridad vocacional y preparación profesional',
    color: '#34a853'
  },
  'Emocional': {
    emoji: '❤️',
    description: 'Bienestar emocional y adaptación universitaria',
    color: '#ea4335'
  },
  'Social': {
    emoji: '👥',
    description: 'Relaciones interpersonales y vida social',
    color: '#fbbc04'
  },
  'Física': {
    emoji: '💪',
    description: 'Salud física y bienestar corporal',
    color: '#ff6d01'
  },
  'Espiritual': {
    emoji: '🙏',
    description: 'Propósito de vida y valores personales',
    color: '#9c27b0'
  },
  'Financiera': {
    emoji: '💰',
    description: 'Gestión de recursos económicos y planificación financiera',
    color: '#00bcd4'
  }
};

// Base de datos de metas (extraída del proyecto principal)
const GOALS_DATABASE = {
  'Intelectual': [
    {
      id: 'PRIM_INT01',
      title: 'Establecer rutina de estudio efectiva',
      description: 'Crear un horario de estudio que incluya técnicas de aprendizaje activo y espacios de concentración.',
      steps: 'Identificar horarios de mayor productividad, crear espacios de estudio libres de distracciones, implementar técnica Pomodoro, revisar y ajustar semanalmente.',
      priority: 'high',
      categoria: 'habitos_estudio'
    },
    {
      id: 'PRIM_INT02',
      title: 'Desarrollar habilidades de lectura crítica',
      description: 'Mejorar la comprensión y análisis de textos académicos para optimizar el aprendizaje.',
      steps: 'Practicar técnicas de lectura activa, tomar notas estructuradas, participar en discusiones académicas, aplicar técnicas de síntesis.',
      priority: 'medium',
      categoria: 'habitos_estudio'
    },
    {
      id: 'PRIM_INT03',
      title: 'Optimizar técnicas de memorización',
      description: 'Aprender y aplicar métodos efectivos de memorización para mejorar el rendimiento académico.',
      steps: 'Estudiar técnicas de memorización, practicar con tarjetas de estudio, usar mapas mentales, aplicar repetición espaciada.',
      priority: 'medium',
      categoria: 'habitos_estudio'
    }
  ],
  'Ocupacional': [
    {
      id: 'PRIM_OCC01',
      title: 'Explorar opciones de carrera',
      description: 'Investigar diferentes trayectorias profesionales relacionadas con tu área de estudio.',
      steps: 'Entrevistar a 3 profesionales del área, investigar perfiles de egreso, asistir a charlas de carrera, crear mapa de opciones profesionales.',
      priority: 'high',
      categoria: 'carrera'
    },
    {
      id: 'PRIM_OCC02',
      title: 'Desarrollar perfil profesional',
      description: 'Crear presencia profesional en redes sociales y plataformas de networking.',
      steps: 'Optimizar perfil de LinkedIn, crear portafolio digital, participar en eventos de networking, desarrollar elevator pitch.',
      priority: 'medium',
      categoria: 'carrera'
    },
    {
      id: 'PRIM_OCC03',
      title: 'Identificar habilidades transferibles',
      description: 'Reconocer y desarrollar habilidades que se pueden aplicar en diferentes contextos profesionales.',
      steps: 'Hacer inventario de habilidades actuales, identificar áreas de mejora, buscar oportunidades de desarrollo, practicar habilidades en proyectos.',
      priority: 'medium',
      categoria: 'carrera'
    }
  ],
  'Emocional': [
    {
      id: 'PRIM_EMO01',
      title: 'Establecer rutina de bienestar emocional',
      description: 'Crear hábitos diarios que promuevan el equilibrio emocional y la gestión del estrés.',
      steps: 'Practicar mindfulness 10 minutos diarios, mantener diario de emociones, establecer límites saludables, buscar apoyo cuando sea necesario.',
      priority: 'high',
      categoria: 'adaptacion'
    },
    {
      id: 'PRIM_EMO02',
      title: 'Desarrollar inteligencia emocional',
      description: 'Mejorar la capacidad de reconocer, entender y gestionar las propias emociones.',
      steps: 'Practicar autoconciencia emocional, desarrollar empatía, mejorar comunicación asertiva, gestionar conflictos constructivamente.',
      priority: 'medium',
      categoria: 'adaptacion'
    },
    {
      id: 'PRIM_EMO03',
      title: 'Construir resiliencia académica',
      description: 'Desarrollar capacidad para recuperarse de desafíos académicos y mantener motivación.',
      steps: 'Aprender de errores y fracasos, mantener perspectiva positiva, buscar apoyo cuando sea necesario, celebrar pequeños logros.',
      priority: 'medium',
      categoria: 'adaptacion'
    }
  ],
  'Social': [
    {
      id: 'PRIM_SOC01',
      title: 'Construir red de apoyo social',
      description: 'Establecer relaciones significativas con compañeros, profesores y mentores.',
      steps: 'Participar en actividades grupales, unirse a clubes estudiantiles, mantener contacto regular con familia, buscar mentores académicos.',
      priority: 'high',
      categoria: 'vida_social'
    },
    {
      id: 'PRIM_SOC02',
      title: 'Desarrollar habilidades de comunicación',
      description: 'Mejorar la capacidad de expresarse efectivamente en diferentes contextos.',
      steps: 'Practicar presentaciones orales, participar en debates, mejorar comunicación escrita, desarrollar escucha activa.',
      priority: 'medium',
      categoria: 'vida_social'
    },
    {
      id: 'PRIM_SOC03',
      title: 'Participar en actividades extracurriculares',
      description: 'Involucrarse en actividades que enriquezcan la experiencia universitaria.',
      steps: 'Explorar clubes y organizaciones estudiantiles, participar en eventos del campus, ofrecerse como voluntario, crear nuevas amistades.',
      priority: 'medium',
      categoria: 'vida_social'
    }
  ],
  'Física': [
    {
      id: 'PRIM_FIS01',
      title: 'Establecer rutina de ejercicio regular',
      description: 'Crear hábitos de actividad física que promuevan la salud y el bienestar.',
      steps: 'Encontrar actividad física que disfrutes, establecer horarios fijos, comenzar gradualmente, monitorear progreso.',
      priority: 'high',
      categoria: 'salud_fisica'
    },
    {
      id: 'PRIM_FIS02',
      title: 'Optimizar hábitos de sueño',
      description: 'Mejorar la calidad y cantidad de sueño para optimizar el rendimiento académico.',
      steps: 'Establecer horario de sueño consistente, crear rutina pre-sueño, optimizar ambiente de dormitorio, limitar pantallas antes de dormir.',
      priority: 'medium',
      categoria: 'salud_fisica'
    },
    {
      id: 'PRIM_FIS03',
      title: 'Mantener alimentación balanceada',
      description: 'Desarrollar hábitos alimenticios saludables que apoyen el rendimiento académico.',
      steps: 'Planificar comidas semanalmente, incluir frutas y verduras, mantenerse hidratado, evitar excesos de cafeína.',
      priority: 'medium',
      categoria: 'salud_fisica'
    }
  ],
  'Espiritual': [
    {
      id: 'PRIM_ESP01',
      title: 'Reflexionar sobre propósito de vida',
      description: 'Explorar valores personales y definir metas de vida a largo plazo.',
      steps: 'Practicar reflexión diaria, identificar valores fundamentales, definir visión personal, alinear acciones con valores.',
      priority: 'high',
      categoria: 'proposito_vida'
    },
    {
      id: 'PRIM_ESP02',
      title: 'Desarrollar práctica de gratitud',
      description: 'Cultivar una actitud de agradecimiento que mejore el bienestar general.',
      steps: 'Mantener diario de gratitud, expresar agradecimiento a otros, practicar mindfulness, reflexionar sobre bendiciones diarias.',
      priority: 'medium',
      categoria: 'proposito_vida'
    },
    {
      id: 'PRIM_ESP03',
      title: 'Explorar filosofía personal',
      description: 'Desarrollar una comprensión personal de la vida y el propósito.',
      steps: 'Leer filosofía y literatura inspiradora, reflexionar sobre experiencias significativas, discutir ideas con otros, escribir sobre valores personales.',
      priority: 'medium',
      categoria: 'proposito_vida'
    }
  ],
  'Financiera': [
    {
      id: 'PRIM_FIN01',
      title: 'Crear presupuesto universitario',
      description: 'Establecer un plan financiero que cubra gastos académicos y personales.',
      steps: 'Identificar ingresos y gastos, categorizar gastos por prioridad, establecer límites de gasto, revisar y ajustar mensualmente.',
      priority: 'high',
      categoria: 'gestion_financiera'
    },
    {
      id: 'PRIM_FIN02',
      title: 'Desarrollar educación financiera',
      description: 'Aprender conceptos básicos de finanzas personales y planificación financiera.',
      steps: 'Tomar curso de finanzas personales, leer libros sobre educación financiera, practicar con simuladores, buscar asesoría financiera.',
      priority: 'medium',
      categoria: 'gestion_financiera'
    },
    {
      id: 'PRIM_FIN03',
      title: 'Establecer hábitos de ahorro',
      description: 'Desarrollar disciplina para ahorrar y planificar el futuro financiero.',
      steps: 'Establecer meta de ahorro mensual, automatizar transferencias de ahorro, evitar gastos innecesarios, buscar formas de generar ingresos adicionales.',
      priority: 'medium',
      categoria: 'gestion_financiera'
    }
  ]
};

/**
 * Función principal para servir la web app
 */
function doGet() {
  return HtmlService.createTemplateFromFile('webapp')
    .evaluate()
    .setTitle('🎯 Selección de Metas IBI - Estudiantes 1er Ingreso')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Procesar selección de dimensiones y generar recomendaciones
 */
function processDimensionSelection(data) {
  try {
    console.log('📝 Procesando selección de dimensiones:', data);
    
    const { student, dimensions, timestamp } = data;
    
    // Validar datos
    if (!student.matricula || !student.nombre || !dimensions || dimensions.length !== 3) {
      throw new Error('Datos incompletos o inválidos');
    }
    
    // Generar recomendaciones
    const recommendations = generateRecommendations(dimensions);
    
    // Guardar en Google Sheets
    saveToSheets(student, dimensions, recommendations, timestamp);
    
    return {
      success: true,
      recommendations: recommendations,
      message: 'Recomendaciones generadas exitosamente'
    };
    
  } catch (error) {
    console.error('❌ Error procesando selección:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generar recomendaciones basadas en las dimensiones seleccionadas
 */
function generateRecommendations(dimensions) {
  const recommendations = [];
  
  dimensions.forEach((dimension, index) => {
    const goals = GOALS_DATABASE[dimension] || [];
    const priorityGoal = goals[0]; // Meta de mayor prioridad
    
    if (priorityGoal) {
      const priority = index === 0 ? 'Prioritaria' : 
                     index === 1 ? 'Complementaria' : 'Longitudinal';
      
      recommendations.push({
        dimension: dimension,
        priority: priority,
        goal: priorityGoal,
        alternatives: goals.slice(1, 4) // 3 alternativas
      });
    }
  });
  
  return recommendations;
}

/**
 * Guardar resultados en Google Sheets
 */
function saveToSheets(student, dimensions, recommendations, timestamp) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // Crear hojas si no existen
  createSheetsIfNeeded();
  
  // Guardar en hoja de respuestas
  const responsesSheet = spreadsheet.getSheetByName(FORM_RESPONSES_SHEET);
  responsesSheet.appendRow([
    timestamp,
    student.matricula,
    student.nombre,
    dimensions[0],
    dimensions[1], 
    dimensions[2],
    JSON.stringify(recommendations)
  ]);
  
  // Guardar análisis detallado
  const analysisSheet = spreadsheet.getSheetByName(ANALYSIS_SHEET);
  dimensions.forEach((dimension, index) => {
    const priority = index === 0 ? 'Alta' : index === 1 ? 'Media' : 'Baja';
    analysisSheet.appendRow([
      timestamp,
      student.matricula,
      student.nombre,
      dimension,
      priority,
      'NO', // No duplicados en web app
      '' // Sin comentarios
    ]);
  });
  
  // Actualizar dashboard
  updateDashboard();
}

/**
 * Crear hojas necesarias si no existen
 */
function createSheetsIfNeeded() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // Crear hoja de respuestas web app
  if (!spreadsheet.getSheetByName(FORM_RESPONSES_SHEET)) {
    const responsesSheet = spreadsheet.insertSheet(FORM_RESPONSES_SHEET);
    responsesSheet.getRange('A1:G1').setValues([[
      'Timestamp',
      'Matrícula',
      'Nombre',
      'Dimensión 1',
      'Dimensión 2',
      'Dimensión 3',
      'Recomendaciones JSON'
    ]]);
    responsesSheet.getRange('A1:G1').setFontWeight('bold');
  }
  
  // Crear hoja de base de datos de metas
  if (!spreadsheet.getSheetByName(GOALS_SHEET)) {
    const goalsSheet = spreadsheet.insertSheet(GOALS_SHEET);
    goalsSheet.getRange('A1:F1').setValues([[
      'ID',
      'Dimensión',
      'Título',
      'Descripción',
      'Pasos de Acción',
      'Prioridad'
    ]]);
    goalsSheet.getRange('A1:F1').setFontWeight('bold');
    
    // Poblar con datos de metas
    populateGoalsDatabase(goalsSheet);
  }
}

/**
 * Poblar la base de datos de metas
 */
function populateGoalsDatabase(sheet) {
  let row = 2;
  
  Object.entries(GOALS_DATABASE).forEach(([dimension, goals]) => {
    goals.forEach(goal => {
      sheet.getRange(row, 1, 1, 6).setValues([[
        goal.id,
        dimension,
        goal.title,
        goal.description,
        goal.steps,
        goal.priority
      ]]);
      row++;
    });
  });
}

/**
 * Actualizar dashboard con nuevas estadísticas
 */
function updateDashboard() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let dashboardSheet = spreadsheet.getSheetByName(DASHBOARD_SHEET);
  
  if (!dashboardSheet) {
    createDashboard();
    dashboardSheet = spreadsheet.getSheetByName(DASHBOARD_SHEET);
  }
  
  // Obtener datos de análisis
  const analysisSheet = spreadsheet.getSheetByName(ANALYSIS_SHEET);
  const data = analysisSheet.getDataRange().getValues();
  
  // Calcular estadísticas
  const stats = calculateStats(data);
  
  // Actualizar dashboard
  updateDashboardStats(dashboardSheet, stats);
}

/**
 * Calcular estadísticas de las respuestas
 */
function calculateStats(data) {
  const stats = {
    totalEstudiantes: 0,
    dimensiones: {},
    prioridades: { Alta: 0, Media: 0, Baja: 0 },
    duplicados: 0
  };
  
  // Saltar header
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const matricula = row[1];
    const dimension = row[3];
    const prioridad = row[4];
    const tieneDuplicados = row[5] === 'SÍ';
    
    // Contar estudiantes únicos
    if (i === 1 || data[i-1][1] !== matricula) {
      stats.totalEstudiantes++;
    }
    
    // Contar dimensiones
    stats.dimensiones[dimension] = (stats.dimensiones[dimension] || 0) + 1;
    
    // Contar prioridades
    stats.prioridades[prioridad] = (stats.prioridades[prioridad] || 0) + 1;
    
    // Contar duplicados
    if (tieneDuplicados) {
      stats.duplicados++;
    }
  }
  
  return stats;
}

/**
 * Actualizar estadísticas en el dashboard
 */
function updateDashboardStats(sheet, stats) {
  // Limpiar datos previos (mantener headers)
  const lastRow = sheet.getLastRow();
  if (lastRow > 2) {
    sheet.getRange(3, 1, lastRow - 2, sheet.getLastColumn()).clear();
  }
  
  // Actualizar estadísticas generales
  sheet.getRange('B2').setValue(stats.totalEstudiantes);
  sheet.getRange('B3').setValue(stats.duplicados);
  
  // Actualizar ranking de dimensiones
  const dimensionesOrdenadas = Object.entries(stats.dimensiones)
    .sort(([,a], [,b]) => b - a);
  
  let row = 3;
  dimensionesOrdenadas.forEach(([dimension, count]) => {
    sheet.getRange(row, 1).setValue(dimension);
    sheet.getRange(row, 2).setValue(count);
    sheet.getRange(row, 3).setValue(((count / (stats.totalEstudiantes * 3)) * 100).toFixed(1) + '%');
    row++;
  });
}

/**
 * Crear dashboard si no existe
 */
function createDashboard() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(DASHBOARD_SHEET);
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet(DASHBOARD_SHEET);
    
    // Crear estructura del dashboard
    sheet.getRange('A1').setValue('📊 DASHBOARD - SELECCIÓN DE METAS IBI (WEB APP)');
    sheet.getRange('A1').setFontSize(16).setFontWeight('bold');
    
    // Estadísticas generales
    sheet.getRange('A3').setValue('Total de Estudiantes:');
    sheet.getRange('A4').setValue('Respuestas con Duplicados:');
    
    // Ranking de dimensiones
    sheet.getRange('A6').setValue('🏆 RANKING DE DIMENSIONES');
    sheet.getRange('A6').setFontWeight('bold');
    sheet.getRange('A7:C7').setValues([['Dimensión', 'Total Selecciones', 'Porcentaje']]);
    sheet.getRange('A7:C7').setFontWeight('bold').setBackground('#f0f0f0');
    
    // Formatear
    sheet.autoResizeColumns(1, 3);
  }
}

/**
 * Obtener datos de dimensiones para la web app
 */
function getDimensionsData() {
  return DIMENSIONS;
}

/**
 * Obtener base de datos de metas
 */
function getGoalsDatabase() {
  return GOALS_DATABASE;
}

/**
 * Exportar datos a CSV
 */
function exportDataToCSV() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const analysisSheet = spreadsheet.getSheetByName(ANALYSIS_SHEET);
  
  if (!analysisSheet) {
    return { error: 'No hay datos para exportar' };
  }
  
  const data = analysisSheet.getDataRange().getValues();
  const csvContent = data.map(row => row.join(',')).join('\n');
  
  // Crear archivo CSV
  const blob = Utilities.newBlob(csvContent, 'text/csv', 'datos-ibi-webapp.csv');
  
  // Guardar en Drive
  const file = DriveApp.createFile(blob);
  
  return {
    success: true,
    downloadUrl: file.getDownloadUrl(),
    fileName: 'datos-ibi-webapp.csv'
  };
}

/**
 * Función para limpiar datos de prueba
 */
function cleanTestData() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const responsesSheet = spreadsheet.getSheetByName(FORM_RESPONSES_SHEET);
  
  if (!responsesSheet) return;
  
  const data = responsesSheet.getDataRange().getValues();
  
  for (let i = data.length - 1; i >= 1; i--) {
    if (data[i][1].includes('PRUEBA') || data[i][1].includes('TEST')) {
      responsesSheet.deleteRow(i + 1);
    }
  }
  
  // Actualizar dashboard
  updateDashboard();
}
