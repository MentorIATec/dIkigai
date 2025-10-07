import type { StageDiagnosticTest } from '@/lib/types';
import type { Stage } from '@/lib/types.goal-templates';
import { previewGoalBankEnfoqueDiagnostic } from '@/mocks/fixtures/goal-bank.enfoque';
import { previewGoalBankEspecializacionDiagnostic } from '@/mocks/fixtures/goal-bank.especializacion';
import { previewGoalBankGraduacionDiagnostic } from '@/mocks/fixtures/goal-bank.graduacion';
import { previewGoalBankPrimerSemestreDiagnostic } from '@/mocks/fixtures/goal-bank.primerSemestre';

export const previewDiagnosticsByStage: Record<Stage, StageDiagnosticTest | null> = {
  primerSemestre: previewGoalBankPrimerSemestreDiagnostic,
  enfoque: previewGoalBankEnfoqueDiagnostic,
  especializacion: previewGoalBankEspecializacionDiagnostic,
  graduacion: previewGoalBankGraduacionDiagnostic,
};

export const previewDiagnostics = Object.values(previewDiagnosticsByStage).filter(
  (diagnostic): diagnostic is StageDiagnosticTest => diagnostic !== null,
);
