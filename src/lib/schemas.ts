import { z } from 'zod';

export const curatedGoalSchema = z.object({
  id: z.string(),
  dimension: z.string(),
  categoria: z.string(),
  metaSmarter: z.string(),
  pasosAccion: z.string(),
});

export const curatedGoalStageSchema = z.object({
  etapa: z.enum(['exploracion', 'enfoque', 'especializacion', 'longitudinal', 'graduacion']),
  titulo: z.string(),
  descripcion: z.string(),
  metas: z.array(curatedGoalSchema),
});

export const curatedGoalStagesSchema = z.array(curatedGoalStageSchema);

export const diagnosticFocusAreaSchema = z.object({
  dimension: z.string(),
  categoria: z.string(),
  label: z.string(),
});

export const diagnosticQuestionSchema = z.object({
  key: z.string(),
  title: z.string(),
  options: z.array(z.string()).min(1),
  focusAreas: z.array(diagnosticFocusAreaSchema),
});

export const stageDiagnosticSchema = z.object({
  stage: z.enum(['exploracion', 'enfoque', 'especializacion', 'graduacion']),
  stageLabel: z.string(),
  title: z.string(),
  description: z.string(),
  questions: z.array(diagnosticQuestionSchema),
});

export const stageDiagnosticBankSchema = z.array(stageDiagnosticSchema);
