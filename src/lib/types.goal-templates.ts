import type { CuratedGoal, CuratedGoalBank, CuratedGoalStage } from '@/lib/types';

export type Stage = 'primerSemestre' | 'enfoque' | 'especializacion' | 'graduacion';

export type WellbeingDimension =
  | 'Física'
  | 'Emocional'
  | 'Financiera'
  | 'Social'
  | 'Ocupacional'
  | 'Espiritual'
  | 'Intelectual';

export type PeriodoId =
  | 'FJ-2025'
  | 'AD-2025'
  | 'FJ-2026'
  | 'AD-2026'
  | 'FJ-2027'
  | 'AD-2027'
  | 'FJ-2028'
  | 'AD-2028';

export type Periodo = {
  id: PeriodoId;
  label: string;
  year: number;
  term: 'AD' | 'FJ';
  stage: Stage;
};

export const PERIODOS: Periodo[] = [
  {
    id: 'AD-2025',
    label: 'Agosto–Diciembre 2025',
    year: 2025,
    term: 'AD',
    stage: 'enfoque',
  },
  {
    id: 'FJ-2026',
    label: 'Febrero–Junio 2026',
    year: 2026,
    term: 'FJ',
    stage: 'enfoque',
  },
  {
    id: 'AD-2026',
    label: 'Agosto–Diciembre 2026',
    year: 2026,
    term: 'AD',
    stage: 'especializacion',
  },
  {
    id: 'FJ-2027',
    label: 'Febrero–Junio 2027',
    year: 2027,
    term: 'FJ',
    stage: 'especializacion',
  },
  {
    id: 'AD-2027',
    label: 'Agosto–Diciembre 2027',
    year: 2027,
    term: 'AD',
    stage: 'graduacion',
  },
  {
    id: 'FJ-2028',
    label: 'Febrero–Junio 2028',
    year: 2028,
    term: 'FJ',
    stage: 'graduacion',
  },
  {
    id: 'AD-2028',
    label: 'Agosto–Diciembre 2028',
    year: 2028,
    term: 'AD',
    stage: 'graduacion',
  },
  {
    id: 'FJ-2025',
    label: 'Febrero–Junio 2025',
    year: 2025,
    term: 'FJ',
    stage: 'primerSemestre',
  },
];

export function isPeriodoId(value: string | null | undefined): value is PeriodoId {
  if (!value) {
    return false;
  }
  return PERIODOS.some((periodo) => periodo.id === value);
}

export function isStage(value: string | null | undefined): value is Stage {
  return value === 'primerSemestre' || value === 'enfoque' || value === 'especializacion' || value === 'graduacion';
}

export type GoalTemplate = CuratedGoal & {
  stageId: keyof CuratedGoalBank | CuratedGoalStage['etapa'];
};
