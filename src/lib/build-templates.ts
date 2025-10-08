import type { CuratedGoalBank, SemesterStageKey } from '@/lib/types';
import type { GoalTemplate, WellbeingDimension } from '@/lib/types.goal-templates';

export function buildFlatTemplates(bank: CuratedGoalBank): GoalTemplate[] {
  return Object.entries(bank).flatMap(([stageId, stage]) =>
    stage.metas.map((meta) => ({
      ...meta,
      stageId: stageId as SemesterStageKey,
    })),
  );
}

export function indexByDimension(templates: GoalTemplate[]): Record<WellbeingDimension, GoalTemplate[]> {
  return templates.reduce<Record<WellbeingDimension, GoalTemplate[]>>((acc, template) => {
    const dimension = template.dimension as WellbeingDimension;
    if (!acc[dimension]) {
      acc[dimension] = [];
    }
    acc[dimension].push(template);
    return acc;
  }, {} as Record<WellbeingDimension, GoalTemplate[]>);
}
