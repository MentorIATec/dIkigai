import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { curatedGoalStages } from '@/lib/curated-goals';
import type { CuratedGoal } from '@/lib/types';
import type { ReactNode } from 'react';

const emphasisPattern = /(\*\*[^*]+\*\*)/g;

function renderWithEmphasis(text: string): ReactNode[] {
  return text.split(emphasisPattern).filter(Boolean).map((segment, index) => {
    if (segment.startsWith('**') && segment.endsWith('**')) {
      return (
        <span key={index} className="font-semibold text-foreground">
          {segment.slice(2, -2)}
        </span>
      );
    }

    return (
      <span key={index}>
        {segment}
      </span>
    );
  });
}

function getActionSteps(pasosAccion: CuratedGoal['pasosAccion']): string[] {
  return pasosAccion
    .split(';')
    .map((step) => step.trim())
    .filter((step) => step.length > 0);
}

export default function GoalBankPage() {
  const defaultStage = curatedGoalStages[0]?.etapa ?? 'exploracion';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Banco de Metas Curadas
        </h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Descubre metas SMARTER clasificadas por etapa académica para inspirarte y adoptar
          objetivos alineados a tu momento universitario.
        </p>
      </div>

      <Tabs defaultValue={defaultStage} className="space-y-4">
        <TabsList className="flex w-full flex-wrap gap-2 bg-muted/60 p-1">
          {curatedGoalStages.map((stage) => (
            <TabsTrigger
              key={stage.etapa}
              value={stage.etapa}
              className="flex-1 whitespace-normal px-4 py-2 text-center text-sm font-medium sm:flex-none sm:px-6"
            >
              {stage.titulo}
            </TabsTrigger>
          ))}
        </TabsList>

        {curatedGoalStages.map((stage) => (
          <TabsContent key={stage.etapa} value={stage.etapa} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">
                  {stage.titulo}
                </CardTitle>
                <CardDescription className="text-base leading-7">
                  {renderWithEmphasis(stage.descripcion)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {stage.metas.map((meta) => (
                  <article
                    key={meta.id}
                    className="rounded-lg border bg-card/60 p-5 shadow-sm transition hover:border-primary/50 hover:shadow-md"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{meta.dimension}</Badge>
                        <Badge variant="outline" className="capitalize">
                          {meta.categoria}
                        </Badge>
                      </div>
                      <span className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
                        {meta.id}
                      </span>
                    </div>

                    <p className="mt-3 text-base leading-7">
                      {renderWithEmphasis(meta.metaSmarter)}
                    </p>

                    <div className="mt-4">
                      <p className="text-sm font-semibold text-muted-foreground">
                        Pasos sugeridos
                      </p>
                      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-6 text-muted-foreground">
                        {getActionSteps(meta.pasosAccion).map((step, index) => (
                          <li key={`${meta.id}-step-${index}`}>
                            {renderWithEmphasis(step)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
