import { goalDiagnosticTests } from '@/lib/goal-diagnostic-tests';
import type { StageDiagnosticTest } from '@/lib/types';
import type { GoalTemplate, Stage } from '@/lib/types.goal-templates';
import { previewTemplatesForStage } from '@/mocks/fixtures/goal-templates';

const STAGE: Stage = 'especializacion';
const DIAGNOSTIC_STAGE: StageDiagnosticTest['stage'] = 'enfoque';

export const previewGoalBankEspecializacionTemplates: GoalTemplate[] = previewTemplatesForStage(STAGE);
export const previewGoalBankEspecializacionDiagnostic: StageDiagnosticTest | null =
  goalDiagnosticTests.find((test) => test.stage === DIAGNOSTIC_STAGE) ?? null;
