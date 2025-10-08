export type StudentStage = 'exploracion' | 'enfoque' | 'especializacion' | 'graduacion';

export function normalizeSemester(value: number | string): number {
  if (value === '8+' || value === '8plus') {
    return 8;
  }
  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isFinite(parsed) || Number.isNaN(parsed)) {
    return 1;
  }
  if (parsed <= 1) {
    return 1;
  }
  if (parsed >= 8) {
    return 8;
  }
  return parsed;
}

export function computeStage(semesterNumber: number): StudentStage {
  if (semesterNumber <= 3) {
    return 'exploracion';
  }
  if (semesterNumber <= 6) {
    return 'enfoque';
  }
  if (semesterNumber === 7) {
    return 'especializacion';
  }
  return 'graduacion';
}
