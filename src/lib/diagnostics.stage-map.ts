import { goalDiagnosticTests } from '@/lib/goal-diagnostic-tests';
import type { SemesterStageKey, StageDiagnosticTest } from '@/lib/types';
import { PERIODOS, type PeriodoId, type Stage } from '@/lib/types.goal-templates';

export const PERIODO_STAGE_MAP = PERIODOS.reduce<Record<PeriodoId, Stage>>((acc, periodo) => {
  acc[periodo.id] = periodo.stage;
  return acc;
}, {} as Record<PeriodoId, Stage>);

const STAGE_TO_DIAGNOSTIC_STAGE: Record<Stage, StageDiagnosticTest['stage'] | null> = {
  primerSemestre: null,
  enfoque: 'exploracion',
  especializacion: 'enfoque',
  graduacion: 'especializacion',
};

const STAGE_TO_CURATED_STAGE: Record<Stage, SemesterStageKey | null> = {
  primerSemestre: null,
  enfoque: 'exploracion',
  especializacion: 'enfoque',
  graduacion: 'especializacion',
};

export function periodoToStage(id: PeriodoId): Stage {
  return PERIODO_STAGE_MAP[id];
}

export function getStageDiagnostic(stage: Stage): StageDiagnosticTest | null {
  const diagnosticStage = STAGE_TO_DIAGNOSTIC_STAGE[stage];
  if (!diagnosticStage) {
    return null;
  }
  return goalDiagnosticTests.find((test) => test.stage === diagnosticStage) ?? null;
}

export function getStageCuratedKey(stage: Stage): SemesterStageKey | null {
  return STAGE_TO_CURATED_STAGE[stage] ?? null;
}
