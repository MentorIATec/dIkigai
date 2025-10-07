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
