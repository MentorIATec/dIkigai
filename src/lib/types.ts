export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
};

export type Goal = {
  id: string;
  userId: string;
  title: string;
  semester: string;
  smarter: {
    specific: string;
    measurable: string;
    achievable: string;
    relevant: string;
    timeBound: Date;
    evaluated: string;
    readjusted: string;
  };
  progress: number;
  status: 'en-progreso' | 'completada' | 'reajustada' | 'sin-empezar';
  createdAt: Date;
};

export type GoalTemplate = {
  id: string;
  title: string;
  description: string;
  category: string;
  smarterSuggestion: Partial<Goal['smarter']>;
};

export type Semester = string;

export type SemesterStageKey =
  | 'primerSemestre'
  | 'exploracion'
  | 'enfoque'
  | 'especializacion'
  | 'longitudinal';

export type SemesterStage = 'primerSemestre' | 'exploracion' | 'enfoque' | 'especializacion' | 'graduacion';

export interface StudentProfile {
  semesterNumber: number;
  semesterStage: SemesterStage;
  carreraId?: string;
  carreraName?: string;
  matricula_last4?: string | null;
  matricula_hash?: string | null;
  consent?: {
    profile: boolean;
    version: string;
    acceptedAt: string;
  };
}

export type CuratedGoal = {
  id: string;
  dimension: string;
  categoria: string;
  metaSmarter: string;
  pasosAccion: string;
};

export type CuratedGoalStage = {
  etapa: SemesterStageKey | 'graduacion';
  titulo: string;
  descripcion: string;
  metas: CuratedGoal[];
};

export type CuratedGoalBank = Record<
  SemesterStageKey,
  Omit<CuratedGoalStage, 'etapa'>
>;

export type CuratedGoalBankExtended = Record<
  SemesterStage,
  Omit<CuratedGoalStage, 'etapa'>
>;
