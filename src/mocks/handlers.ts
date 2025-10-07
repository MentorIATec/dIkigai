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
import { computeStage, normalizeSemester, type StudentStage } from '@/lib/profile/mapping';

const previewStudentProfile: {
  uid: string;
  email: string;
  carreraId: string | null;
  carreraName: string | null;
  semesterNumber: number;
  semesterStage: StudentStage;
  matricula_last4: string | null;
} = {
  uid: previewUser.id,
  email: previewUser.email,
  carreraId: 'IMT',
  carreraName: 'Ingeniería Mecatrónica',
  semesterNumber: 6,
  semesterStage: 'enfoque',
  matricula_last4: '5124',
};

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
        emailVerified: previewUser.emailVerified ?? true,
        photoURL: previewUser.photoURL ?? null,
      },
    }),
  ),
  http('GET', '/api/me', () =>
    HttpResponse.json({
      user: {
        uid: previewUser.id,
        email: previewUser.email,
        role: previewUser.role ?? 'admin',
        emailVerified: previewUser.emailVerified ?? true,
        displayName: previewUser.name,
        photoURL: previewUser.photoURL ?? null,
        profile: previewStudentProfile,
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
  http('GET', '/api/profile', () => HttpResponse.json({ profile: previewStudentProfile })),
  http('PUT', '/api/profile', async ({ request }: { request: Request }) => {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (body) {
      if (typeof body.semesterNumber === 'string' || typeof body.semesterNumber === 'number') {
        const normalized = normalizeSemester(body.semesterNumber as string | number);
        previewStudentProfile.semesterNumber = normalized;
        previewStudentProfile.semesterStage = computeStage(normalized);
      }
      if (typeof body.carreraId === 'string') {
        previewStudentProfile.carreraId = body.carreraId;
      }
      if (typeof body.carreraName === 'string') {
        previewStudentProfile.carreraName = body.carreraName;
      }
      if (typeof body.matricula === 'string') {
        previewStudentProfile.matricula_last4 = body.matricula.slice(-4);
      }
    }
    return HttpResponse.json({ ok: true, profile: previewStudentProfile });
  }),
  http('GET', '/api/admin/students', () =>
    HttpResponse.json({
      items: [
        previewStudentProfile,
        {
          uid: 'student-002',
          email: 'luis.ramirez@example.com',
          carreraId: 'LAF',
          carreraName: 'Licenciatura en Administración Financiera',
          semesterNumber: 8,
          semesterStage: 'graduacion',
          matricula_last4: '0042',
        },
      ],
    }),
  ),
  http('GET', '/api/admin/students/:uid/matricula', ({ params }: { params: Record<string, string> }) =>
    HttpResponse.json({ matricula: params.uid === previewStudentProfile.uid ? 'A012345124' : 'A019990042' }),
  ),
];
