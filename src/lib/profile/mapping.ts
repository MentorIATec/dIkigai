import type { SemesterStage } from '../types';

/**
 * Normaliza el número de semestre a un rango válido (1-8)
 * @param n Número de semestre o '8+'
 * @returns Número normalizado entre 1 y 8
 */
export function normalizeSemester(n: number | '8+'): number {
  if (n === '8+') return 8;
  if (typeof n === 'number') {
    return Math.max(1, Math.min(8, n));
  }
  return 1;
}

/**
 * Calcula la etapa académica basada en el número de semestre
 * NUEVA LÓGICA SEGÚN ESPECIFICACIONES DEL USUARIO:
 * - 1er semestre → primerSemestre (EXCEPCIÓN: Solo IBI + modal de dimensiones)
 * - 2°-3° semestre → exploracion (Test: Brújula de Enfoque)
 * - 4°-6° semestre → enfoque (Test: Brújula de Especialización)
 * - 7°-8° semestre → especializacion (Test: Checklist de Graduación)
 * 
 * @param n Número de semestre normalizado
 * @returns Etapa académica correspondiente
 */
export function computeStage(n: number): SemesterStage {
  if (n === 1) return 'primerSemestre';        // EXCEPCIÓN: Solo IBI + modal
  if (n >= 2 && n <= 3) return 'exploracion';  // Test: Brújula de Enfoque
  if (n >= 4 && n <= 6) return 'enfoque';      // Test: Brújula de Especialización
  if (n >= 7 && n <= 8) return 'especializacion'; // Test: Checklist de Graduación
  return 'primerSemestre';                     // Default para casos edge
}
