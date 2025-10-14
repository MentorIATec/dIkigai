/**
 * Sistema sostenible de períodos académicos del Tec
 * Se auto-actualiza cada año sin necesidad de mantenimiento manual
 */

export interface AcademicPeriod {
  value: string;
  label: string;
  year: number;
  periodType: string;
  startMonth: number;
  endMonth: number;
  isCurrent?: boolean;
  isFuture?: boolean;
}

export interface AcademicPeriodConfig {
  periodTypes: Array<{
    id: string;
    label: string;
    startMonth: number;
    endMonth: number;
    description?: string;
  }>;
  yearsAhead: number;
  yearsBack: number;
}

// Configuración centralizada de períodos académicos
const ACADEMIC_PERIOD_CONFIG: AcademicPeriodConfig = {
  periodTypes: [
    {
      id: 'agosto-diciembre',
      label: 'Agosto-Diciembre',
      startMonth: 8,
      endMonth: 12,
      description: 'Semestre de otoño'
    },
    {
      id: 'febrero-junio',
      label: 'Febrero-Junio',
      startMonth: 2,
      endMonth: 6,
      description: 'Semestre de primavera'
    },
    {
      id: 'periodo-intensivo-invierno',
      label: 'Periodo Intensivo de Invierno',
      startMonth: 12,
      endMonth: 1,
      description: 'Periodo intensivo entre semestres'
    },
    {
      id: 'periodo-intensivo-verano',
      label: 'Periodo Intensivo de Verano',
      startMonth: 6,
      endMonth: 8,
      description: 'Periodo intensivo de verano'
    }
  ],
  yearsAhead: 3, // Mostrar 3 años hacia adelante
  yearsBack: 1   // Mostrar 1 año hacia atrás (por si acaso)
};

/**
 * Genera la lista completa de períodos académicos
 * Se auto-actualiza cada año
 */
export const generateAcademicPeriods = (): AcademicPeriod[] => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // getMonth() es 0-indexado
  
  // Generar años desde yearsBack hasta yearsAhead
  const years = Array.from(
    { length: ACADEMIC_PERIOD_CONFIG.yearsAhead + ACADEMIC_PERIOD_CONFIG.yearsBack + 1 },
    (_, i) => currentYear - ACADEMIC_PERIOD_CONFIG.yearsBack + i
  );
  
  const periods: AcademicPeriod[] = [];
  
  years.forEach(year => {
    ACADEMIC_PERIOD_CONFIG.periodTypes.forEach(periodType => {
      const period: AcademicPeriod = {
        value: `${year}-${periodType.id}`,
        label: `${periodType.label} ${year}`,
        year,
        periodType: periodType.id,
        startMonth: periodType.startMonth,
        endMonth: periodType.endMonth,
        isCurrent: isCurrentPeriod(year, periodType.startMonth, periodType.endMonth, currentYear, currentMonth),
        isFuture: isFuturePeriod(year, periodType.startMonth, currentYear, currentMonth)
      };
      
      periods.push(period);
    });
  });
  
  // Ordenar por año y luego por mes de inicio
  return periods.sort((a, b) => {
    if (a.year !== b.year) {
      return a.year - b.year;
    }
    return a.startMonth - b.startMonth;
  });
};

/**
 * Determina si un período es el período actual
 */
const isCurrentPeriod = (
  periodYear: number, 
  periodStartMonth: number, 
  periodEndMonth: number, 
  currentYear: number, 
  currentMonth: number
): boolean => {
  if (periodYear !== currentYear) return false;
  
  // Manejar períodos que cruzan años (como periodo intensivo de invierno)
  if (periodStartMonth > periodEndMonth) {
    return currentMonth >= periodStartMonth || currentMonth <= periodEndMonth;
  }
  
  return currentMonth >= periodStartMonth && currentMonth <= periodEndMonth;
};

/**
 * Determina si un período es futuro
 */
const isFuturePeriod = (
  periodYear: number, 
  periodStartMonth: number, 
  currentYear: number, 
  currentMonth: number
): boolean => {
  if (periodYear > currentYear) return true;
  if (periodYear < currentYear) return false;
  
  return periodStartMonth > currentMonth;
};

/**
 * Obtiene el período académico actual
 */
export const getCurrentAcademicPeriod = (): AcademicPeriod | null => {
  const periods = generateAcademicPeriods();
  return periods.find(period => period.isCurrent) || null;
};

/**
 * Obtiene períodos futuros (para selección en formularios)
 */
export const getFutureAcademicPeriods = (): AcademicPeriod[] => {
  const periods = generateAcademicPeriods();
  return periods.filter(period => period.isFuture || period.isCurrent);
};

/**
 * Obtiene todos los períodos académicos disponibles
 */
export const getAllAcademicPeriods = (): AcademicPeriod[] => {
  return generateAcademicPeriods();
};

/**
 * Busca un período por su valor
 */
export const findAcademicPeriodByValue = (value: string): AcademicPeriod | null => {
  const periods = generateAcademicPeriods();
  return periods.find(period => period.value === value) || null;
};

/**
 * Formatea un período para mostrar en la UI
 */
export const formatAcademicPeriod = (period: AcademicPeriod): string => {
  return period.label;
};

/**
 * Obtiene la descripción de un tipo de período
 */
export const getPeriodTypeDescription = (periodType: string): string | undefined => {
  const config = ACADEMIC_PERIOD_CONFIG.periodTypes.find(p => p.id === periodType);
  return config?.description;
};

// Exportar la configuración para casos especiales
export { ACADEMIC_PERIOD_CONFIG };
