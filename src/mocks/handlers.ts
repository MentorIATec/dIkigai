import { http, HttpResponse } from 'msw';
import type { StageDiagnosticTest } from '@/lib/types';
import type { GoalTemplate, Stage } from '@/lib/types.goal-templates';
import { previewUser } from '@/mocks/fixtures/user';
import { previewDiagnostics, previewDiagnosticsByStage } from '@/mocks/fixtures/diagnostics';
import { previewGoalTemplates } from '@/mocks/fixtures/goal-templates';
import { previewGoalBankEnfoqueTemplates } from '@/mocks/fixtures/goal-bank.enfoque';
import { previewGoalBankEspecializacionTemplates } from '@/mocks/fixtures/goal-bank.especializacion';
import { previewGoalBankGraduacionTemplates } from '@/mocks/fixtures/goal-bank.graduacion';
import { previewGoalBankPrimerSemestreTemplates } from '@/mocks/fixtures/goal-bank.primerSemestre';

const GOAL_BANK_FIXTURES: Record<Stage, { templates: GoalTemplate[]; diagnostic: StageDiagnosticTest | null }> = {
  primerSemestre: {
    templates: previewGoalBankPrimerSemestreTemplates,
    diagnostic: previewDiagnosticsByStage.primerSemestre,
  },
  enfoque: {
    templates: previewGoalBankEnfoqueTemplates,
    diagnostic: previewDiagnosticsByStage.enfoque,
  },
  especializacion: {
    templates: previewGoalBankEspecializacionTemplates,
    diagnostic: previewDiagnosticsByStage.especializacion,
  },
  graduacion: {
    templates: previewGoalBankGraduacionTemplates,
    diagnostic: previewDiagnosticsByStage.graduacion,
  },
};

export const handlers = [
  http('GET', '/api/preview/session', () => HttpResponse.json(previewUser)),
  http('GET', '/api/preview/goal-templates', ({ request }: { request: Request }) => {
    const url = new URL(request.url);
    const stageParam = url.searchParams.get('stage') as Stage | null;
    if (stageParam && stageParam in GOAL_BANK_FIXTURES) {
      return HttpResponse.json(GOAL_BANK_FIXTURES[stageParam].templates);
    }
    return HttpResponse.json(previewGoalTemplates);
  }),
  http('GET', '/api/preview/goal-bank', ({ request }: { request: Request }) => {
    const url = new URL(request.url);
    const stageParam = url.searchParams.get('stage') as Stage | null;
    if (stageParam && stageParam in GOAL_BANK_FIXTURES) {
      return HttpResponse.json(GOAL_BANK_FIXTURES[stageParam]);
    }

    return HttpResponse.json({ stages: GOAL_BANK_FIXTURES });
  }),
  http('GET', '/api/preview/diagnostics', ({ request }: { request: Request }) => {
    const url = new URL(request.url);
    const stageParam = url.searchParams.get('stage') as Stage | null;
    if (stageParam && stageParam in GOAL_BANK_FIXTURES) {
      return HttpResponse.json(GOAL_BANK_FIXTURES[stageParam].diagnostic);
    }
    return HttpResponse.json(previewDiagnostics);
  }),
  http('POST', '/api/preview/telemetry', () => HttpResponse.json({ ok: true })),
];
