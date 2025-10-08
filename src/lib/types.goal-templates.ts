import type { SemesterStage } from './types';

export type DiagnosticAnswer = {
  key: string;
  score: number;
};

export interface DiagnosticResult {
  id: string;
  uid: string;
  stage: SemesterStage;
  periodKey?: string;
  answers: DiagnosticAnswer[];
  createdAt: string;
  recommendedGoalIds: string[];
}
