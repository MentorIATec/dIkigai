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
  | 'exploracion'
  | 'enfoque'
  | 'especializacion'
  | 'longitudinal';

export type CuratedGoal = {
  id: string;
  dimension: string;
  categoria: string;
  metaSmarter: string;
  pasosAccion: string;
};

export type CuratedGoalStage = {
  etapa: SemesterStageKey;
  titulo: string;
  descripcion: string;
  metas: CuratedGoal[];
};

export type CuratedGoalBank = Record<
  SemesterStageKey,
  Omit<CuratedGoalStage, 'etapa'>
>;

export type DiagnosticFocusArea = {
  dimension: string;
  categoria: string;
  label: string;
};

export type DiagnosticQuestion = {
  key: string;
  title: string;
  options: string[];
  focusAreas: DiagnosticFocusArea[];
};

export type StageDiagnosticTest = {
  stage: Extract<SemesterStageKey, 'exploracion' | 'enfoque' | 'especializacion'>;
  stageLabel: string;
  title: string;
  description: string;
  questions: DiagnosticQuestion[];
};

export type StageDiagnosticTestBank = Record<
  StageDiagnosticTest['stage'],
  StageDiagnosticTest
>;
