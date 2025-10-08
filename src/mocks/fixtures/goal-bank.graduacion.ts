import { goalDiagnosticTests } from '@/lib/goal-diagnostic-tests';
import type { StageDiagnosticTest } from '@/lib/types';
import type { GoalTemplate, Stage } from '@/lib/types.goal-templates';
import { previewTemplatesForStage } from '@/mocks/fixtures/goal-templates';

const STAGE: Stage = 'graduacion';
const DIAGNOSTIC_STAGE: StageDiagnosticTest['stage'] = 'especializacion';

export const previewGoalBankGraduacionTemplates: GoalTemplate[] = previewTemplatesForStage(STAGE);
export const previewGoalBankGraduacionDiagnostic: StageDiagnosticTest | null =
  goalDiagnosticTests.find((test) => test.stage === DIAGNOSTIC_STAGE) ?? null;
