import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { curatedGoalStages } from '@/lib/curated-goals';
import { GeneradorMetas } from './ui/GeneradorMetas';
import type { CuratedGoal, SemesterStage } from '@/lib/types';
import type { ReactNode } from 'react';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default function GoalBankPage(): JSX.Element {
  const flag = process.env.NEXT_PUBLIC_GOAL_GEN_V2;
  const isEnabled =
    flag === undefined || flag === '1' || flag?.toLowerCase() === 'true' || flag?.toLowerCase() === 'enabled';
  
  const defaultStage = curatedGoalStages[0]?.etapa || 'exploracion';

  if (!isEnabled) {
    return (
      <section className="space-y-4">
        <h1 className="text-3xl font-headline font-semibold tracking-tight">Generador de metas</h1>
        <p className="text-muted-foreground">
          El generador de metas estará disponible próximamente. Mientras tanto, puedes trabajar con tus metas actuales en
          MiVidaTec → Mi Plan de Vida.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Asistente de Metas
        </h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Tu guía personalizada para definir metas académicas. Completa un diagnóstico rápido o explora nuestro catálogo de metas SMARTER.
        </p>
      </div>

      <Tabs defaultValue={defaultStage} className="space-y-4">
        <TabsList className="flex w-full flex-wrap gap-1 bg-muted/40 p-1 rounded-lg">
          {curatedGoalStages.map((stage) => (
            <TabsTrigger
              key={stage.etapa}
              value={stage.etapa}
              className="flex-1 whitespace-normal px-3 py-2.5 text-center text-sm font-medium transition-all sm:flex-none sm:px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              {stage.titulo}
            </TabsTrigger>
          ))}
        </TabsList>

        {curatedGoalStages.map((stage) => (
          <TabsContent key={stage.etapa} value={stage.etapa} className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-3">
              <div className="xl:col-span-2">
                <Card>
                  <CardHeader>
                    <CardDescription className="text-base leading-7">
                      {renderWithEmphasis(stage.descripcion)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {stage.metas.map((meta) => (
                      <article
                        key={meta.id}
                        className="group rounded-xl border bg-gradient-to-br from-card/80 to-card/40 p-6 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="secondary" className="text-xs font-medium">
                              {meta.dimension}
                            </Badge>
                            <Badge variant="outline" className="capitalize text-xs">
                              {meta.categoria}
                            </Badge>
                          </div>
                          <span className="text-xs font-mono uppercase tracking-wide text-muted-foreground/70">
                            {meta.id}
                          </span>
                        </div>

                        <div className="space-y-3">
                          <h3 className="text-lg font-semibold leading-6 text-foreground">
                            {renderWithEmphasis(meta.metaSmarter)}
                          </h3>
                        </div>

                        <div className="mt-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-muted-foreground">
                              Pasos sugeridos
                            </p>
                            <Button size="sm" variant="outline" className="h-8 text-xs">
                              Seleccionar meta
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {getActionSteps(meta.pasosAccion).map((step, index) => (
                              <div key={`${meta.id}-step-${index}`} className="flex items-start gap-3 p-2 rounded-md bg-muted/30">
                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                                  <span className="text-xs font-medium text-primary">{index + 1}</span>
                                </div>
                                <p className="text-sm leading-5 text-muted-foreground">
                                  {renderWithEmphasis(step)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </article>
                    ))}
                  </CardContent>
                </Card>
              </div>
              
              <div className="xl:col-span-1">
                <Suspense fallback={<div>Cargando generador...</div>}>
                  <GeneradorMetas 
                    stage={stage.etapa === 'longitudinal' ? 'graduacion' : stage.etapa as SemesterStage} 
                    periodKey={`${new Date().getFullYear()}_${new Date().getMonth() < 6 ? 'AD' : 'FJ'}`}
                  />
                </Suspense>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function renderWithEmphasis(text: string): ReactNode {
  // Renderizar texto con énfasis en **texto**
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function getActionSteps(pasosAccion: string): string[] {
  // Dividir los pasos de acción por líneas y limpiar
  return pasosAccion
    .split('\n')
    .map(step => step.trim())
    .filter(step => step.length > 0);
}
