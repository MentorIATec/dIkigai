import type { StageDiagnosticTest } from '@/lib/types';
import type { GoalTemplate, Stage } from '@/lib/types.goal-templates';
import { previewTemplatesForStage } from '@/mocks/fixtures/goal-templates';

const STAGE: Stage = 'primerSemestre';

export const previewGoalBankPrimerSemestreTemplates: GoalTemplate[] = previewTemplatesForStage(STAGE);
export const previewGoalBankPrimerSemestreDiagnostic: StageDiagnosticTest | null = null;
