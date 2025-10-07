import { goalDiagnosticTests } from '@/lib/goal-diagnostic-tests';
import type { DiagnosticFocusArea } from '@/lib/types';
import type { GoalTemplate } from '@/lib/types.goal-templates';

type Answer = {
  key: string;
  value: number;
};

type QuestionFocusMap = Record<string, DiagnosticFocusArea[]>;

const questionFocusAreas: QuestionFocusMap = goalDiagnosticTests.reduce<QuestionFocusMap>((acc, test) => {
  test.questions.forEach((question) => {
    acc[question.key] = question.focusAreas;
  });
  return acc;
}, {} as QuestionFocusMap);

export function recommendGoals(
  answers: Answer[],
  opts: { templates: GoalTemplate[]; limit?: number },
): GoalTemplate[] {
  const { templates, limit = 6 } = opts;
  const areaScores = new Map<string, number>();

  answers.forEach(({ key, value }) => {
    if (Number.isNaN(value) || value > 3) {
      return;
    }

    const areas = questionFocusAreas[key];
    if (!areas || areas.length === 0) {
      return;
    }

    const weight = Math.max(0, 4 - Math.max(1, value));

    areas.forEach((area) => {
      const areaKey = `${area.dimension}|${area.categoria}`;
      const current = areaScores.get(areaKey) ?? 0;
      areaScores.set(areaKey, current + weight);
    });
  });

  if (areaScores.size === 0) {
    return [];
  }

  const scored = templates.map((template, index) => {
    const key = `${template.dimension}|${template.categoria}`;
    const score = areaScores.get(key) ?? 0;
    return { template, score, index };
  });

  return scored
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.index - b.index;
    })
    .slice(0, limit)
    .map((entry) => entry.template);
}
