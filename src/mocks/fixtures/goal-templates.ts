import { buildFlatTemplates } from '@/lib/build-templates';
import { curatedGoalBank } from '@/lib/curated-goals';
import { getStageCuratedKey } from '@/lib/diagnostics.stage-map';
import type { GoalTemplate, Stage } from '@/lib/types.goal-templates';

const ALL_TEMPLATES: GoalTemplate[] = buildFlatTemplates(curatedGoalBank);

export const previewGoalTemplates = ALL_TEMPLATES;

export function previewTemplatesForStage(stage: Stage): GoalTemplate[] {
  const curatedKey = getStageCuratedKey(stage);
  if (!curatedKey) {
    return ALL_TEMPLATES.filter((template) => template.stageId === 'exploracion' || template.stageId === 'longitudinal');
  }

  return ALL_TEMPLATES.filter(
    (template) => template.stageId === curatedKey || template.stageId === 'longitudinal',
  );
}
