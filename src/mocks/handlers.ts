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
  http('GET', '/api/auth/session', () =>
    HttpResponse.json({
      session: {
        sub: previewUser.id,
        email: previewUser.email,
        role: previewUser.role ?? 'admin',
        name: previewUser.name,
      },
    }),
  ),
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
  
  // Mocks para API de diagnostics real
  http('POST', '/api/diagnostics/:stage', ({ params, request }) => {
    const { stage } = params;
    console.log(`📝 Mock POST /api/diagnostics/${stage}`);
    return HttpResponse.json({ 
      recommendedGoalIds: ['MOCK_GOAL_1', 'MOCK_GOAL_2'] 
    });
  }),
  
  http('GET', '/api/diagnostics/:stage', ({ params, request }) => {
    const { stage } = params;
    const url = new URL(request.url);
    const latest = url.searchParams.get('latest') === '1';
    const periodKey = url.searchParams.get('periodKey');
    
    console.log(`📋 Mock GET /api/diagnostics/${stage}`, { latest, periodKey });
    
    // Simular diagnóstico completado con respuestas específicas por etapa
    let mockAnswers: any[] = [];
    
    if (stage === 'exploracion') {
      mockAnswers = [
        { questionKey: 'orientacion_carrera', score: 5, dimension: 'Ocupacional' },
        { questionKey: 'habilidades_blandas', score: 4, dimension: 'Social' },
        { questionKey: 'autoconocimiento', score: 5, dimension: 'Intelectual' }
      ];
    } else if (stage === 'enfoque') {
      mockAnswers = [
        { questionKey: 'semestre_tec', score: 5, dimension: 'Ocupacional' },
        { questionKey: 'servicio_social', score: 4, dimension: 'Social' },
        { questionKey: 'practicas', score: 5, dimension: 'Ocupacional' },
        { questionKey: 'idioma', score: 4, dimension: 'Intelectual' }
      ];
    } else if (stage === 'especializacion') {
      mockAnswers = [
        { questionKey: 'situacion_profesional', score: 5, dimension: 'Ocupacional' },
        { questionKey: 'meta_exatec', score: 4, dimension: 'Ocupacional' },
        { questionKey: 'balance_vida', score: 5, dimension: 'Emocional' },
        { questionKey: 'preparacion_profesional', score: 4, dimension: 'Ocupacional' }
      ];
    } else {
      // Fallback para otras etapas
      mockAnswers = [
        { questionKey: 'test_question_1', score: 5, dimension: 'Ocupacional' },
        { questionKey: 'test_question_2', score: 4, dimension: 'Social' },
        { questionKey: 'test_question_3', score: 5, dimension: 'Intelectual' }
      ];
    }
    
    const mockResult = {
      id: `mock_${stage}_${Date.now()}`,
      uid: 'ana.perez@example.com',
      stage,
      periodKey: periodKey || `${stage}-${Date.now()}`,
      answers: mockAnswers,
      createdAt: new Date().toISOString(),
      recommendedGoalIds: ['MOCK_GOAL_1', 'MOCK_GOAL_2']
    };
    
    console.log(`🎯 Mock respuestas para ${stage}:`, mockAnswers);
    
    return HttpResponse.json({ results: [mockResult] });
  }),
];
