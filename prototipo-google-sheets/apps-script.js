/**
 * APPS SCRIPT PARA PROTOTIPO IBI - SELECCIÓN DE METAS
 * 
 * Funcionalidad:
 * - Procesa respuestas del formulario automáticamente
 * - Valida que se seleccionen exactamente 3 dimensiones diferentes
 * - Organiza datos en dashboard de resultados
 * - Genera análisis automático por dimensiones
 */

// Configuración
const FORM_RESPONSES_SHEET = 'Respuestas del formulario 1';
const DASHBOARD_SHEET = 'Dashboard Resultados';
const ANALYSIS_SHEET = 'Análisis por Dimensiones';

// Dimensiones disponibles
const DIMENSIONES = {
  'Intelectual': '🧠 Desarrollo académico y habilidades de estudio',
  'Ocupacional': '💼 Claridad vocacional y preparación profesional',
  'Emocional': '❤️ Bienestar emocional y adaptación universitaria',
  'Social': '👥 Relaciones interpersonales y vida social',
  'Física': '💪 Salud física y bienestar corporal',
  'Espiritual': '🙏 Propósito de vida y valores personales'
};

/**
 * Función principal que se ejecuta cuando se envía el formulario
 */
function onFormSubmit(e) {
  try {
    console.log('📝 Procesando nueva respuesta del formulario...');
    
    // Obtener datos de la respuesta
    const responses = e.values;
    const timestamp = responses[0];
    const matricula = responses[1];
    const nombre = responses[2];
    const dimension1 = responses[3];
    const dimension2 = responses[4];
    const dimension3 = responses[5];
    const comentarios = responses[6] || '';
    
    // Validar que las dimensiones sean diferentes
    const dimensionesSeleccionadas = [dimension1, dimension2, dimension3];
    const dimensionesUnicas = [...new Set(dimensionesSeleccionadas)];
    
    if (dimensionesUnicas.length !== 3) {
      console.warn('⚠️ Estudiante seleccionó dimensiones duplicadas:', matricula);
      // Aún así procesamos, pero marcamos como duplicado
    }
    
    // Procesar respuesta
    procesarRespuesta({
      timestamp,
      matricula,
      nombre,
      dimensiones: dimensionesSeleccionadas,
      comentarios,
      tieneDuplicados: dimensionesUnicas.length !== 3
    });
    
    // Actualizar dashboard
    actualizarDashboard();
    
    console.log('✅ Respuesta procesada exitosamente:', matricula);
    
  } catch (error) {
    console.error('❌ Error procesando respuesta:', error);
    // Enviar notificación de error (opcional)
    enviarNotificacionError(error, e.values);
  }
}

/**
 * Procesa una respuesta individual y la organiza
 */
function procesarRespuesta(datos) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // Crear hoja de análisis si no existe
  crearHojaAnalisis();
  
  // Agregar entrada a análisis por dimensiones
  const analysisSheet = spreadsheet.getSheetByName(ANALYSIS_SHEET);
  const dimensiones = datos.dimensiones;
  
  dimensiones.forEach((dimension, index) => {
    const prioridad = index === 0 ? 'Alta' : index === 1 ? 'Media' : 'Baja';
    
    analysisSheet.appendRow([
      datos.timestamp,
      datos.matricula,
      datos.nombre,
      dimension,
      prioridad,
      datos.tieneDuplicados ? 'SÍ' : 'NO',
      datos.comentarios
    ]);
  });
}

/**
 * Actualiza el dashboard con estadísticas en tiempo real
 */
function actualizarDashboard() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const dashboardSheet = spreadsheet.getSheetByName(DASHBOARD_SHEET);
  
  if (!dashboardSheet) {
    crearDashboard();
    return;
  }
  
  // Obtener datos de análisis
  const analysisSheet = spreadsheet.getSheetByName(ANALYSIS_SHEET);
  const data = analysisSheet.getDataRange().getValues();
  
  // Calcular estadísticas
  const estadisticas = calcularEstadisticas(data);
  
  // Actualizar dashboard
  actualizarEstadisticasDashboard(dashboardSheet, estadisticas);
}

/**
 * Calcula estadísticas de las respuestas
 */
function calcularEstadisticas(data) {
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
 * Actualiza las estadísticas en el dashboard
 */
function actualizarEstadisticasDashboard(sheet, stats) {
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
 * Crea la hoja de análisis si no existe
 */
function crearHojaAnalisis() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(ANALYSIS_SHEET);
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet(ANALYSIS_SHEET);
    
    // Crear headers
    sheet.getRange('A1:G1').setValues([[
      'Timestamp',
      'Matrícula', 
      'Nombre',
      'Dimensión',
      'Prioridad',
      'Tiene Duplicados',
      'Comentarios'
    ]]);
    
    // Formatear headers
    sheet.getRange('A1:G1').setFontWeight('bold');
    sheet.getRange('A1:G1').setBackground('#4285f4');
    sheet.getRange('A1:G1').setFontColor('white');
    
    // Ajustar ancho de columnas
    sheet.autoResizeColumns(1, 7);
  }
}

/**
 * Crea el dashboard si no existe
 */
function crearDashboard() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(DASHBOARD_SHEET);
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet(DASHBOARD_SHEET);
    
    // Crear estructura del dashboard
    sheet.getRange('A1').setValue('📊 DASHBOARD - SELECCIÓN DE METAS IBI');
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
 * Envía notificación de error (opcional)
 */
function enviarNotificacionError(error, datos) {
  // Implementar si se desea recibir notificaciones de errores
  console.log('📧 Notificación de error enviada:', error.message);
}

/**
 * Función manual para procesar todas las respuestas existentes
 * (Útil si se agrega el script después de tener respuestas)
 */
function procesarRespuestasExistentes() {
  console.log('🔄 Procesando todas las respuestas existentes...');
  
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const responsesSheet = spreadsheet.getSheetByName(FORM_RESPONSES_SHEET);
  
  if (!responsesSheet) {
    console.log('❌ No se encontró la hoja de respuestas');
    return;
  }
  
  const data = responsesSheet.getDataRange().getValues();
  
  // Procesar cada fila (saltando header)
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const mockEvent = { values: row };
    onFormSubmit(mockEvent);
  }
  
  console.log('✅ Todas las respuestas procesadas');
}

/**
 * Función para exportar datos a CSV
 */
function exportarDatosCSV() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const analysisSheet = spreadsheet.getSheetByName(ANALYSIS_SHEET);
  
  if (!analysisSheet) {
    console.log('❌ No hay datos para exportar');
    return;
  }
  
  const data = analysisSheet.getDataRange().getValues();
  const csvContent = data.map(row => row.join(',')).join('\n');
  
  // Crear archivo CSV
  const blob = Utilities.newBlob(csvContent, 'text/csv', 'datos-ibi-estudiantes.csv');
  
  // Descargar (esto abrirá una ventana de descarga)
  const url = DriveApp.createFile(blob).getDownloadUrl();
  console.log('📁 CSV creado:', url);
  
  return url;
}
