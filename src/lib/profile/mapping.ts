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
 * @param n Número de semestre normalizado
 * @returns Etapa académica correspondiente
 */
export function computeStage(n: number): SemesterStage {
  if (n >= 1 && n <= 3) return 'exploracion';
  if (n >= 4 && n <= 6) return 'enfoque';
  if (n === 7) return 'especializacion';
  if (n >= 8) return 'graduacion';
  return 'exploracion';
}
