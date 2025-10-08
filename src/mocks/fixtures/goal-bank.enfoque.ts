import { goalDiagnosticTests } from '@/lib/goal-diagnostic-tests';
import type { StageDiagnosticTest } from '@/lib/types';
import type { GoalTemplate, Stage } from '@/lib/types.goal-templates';
import { previewTemplatesForStage } from '@/mocks/fixtures/goal-templates';

const STAGE: Stage = 'enfoque';
const DIAGNOSTIC_STAGE: StageDiagnosticTest['stage'] = 'exploracion';

export const previewGoalBankEnfoqueTemplates: GoalTemplate[] = previewTemplatesForStage(STAGE);
export const previewGoalBankEnfoqueDiagnostic: StageDiagnosticTest | null =
  goalDiagnosticTests.find((test) => test.stage === DIAGNOSTIC_STAGE) ?? null;
