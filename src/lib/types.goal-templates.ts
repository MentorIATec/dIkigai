import type { SemesterStage } from './types';

export type DiagnosticAnswer = {
  key: string;
  score: number;
};

export interface DiagnosticResult {
  id: string;
  uid: string;
  stage: SemesterStage;
  periodKey?: string;
  answers: DiagnosticAnswer[];
  createdAt: string;
  recommendedGoalIds: string[];
}

// Exportar PERIODOS para compatibilidad
export const PERIODOS = [
  'AD-2025',
  'FJ-2025',
  'AD-2026',
  'FJ-2026',
  'AD-2027',
  'FJ-2027',
] as const;
