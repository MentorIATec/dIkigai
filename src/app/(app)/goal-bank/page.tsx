import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { curatedGoalStages } from '@/lib/curated-goals';
import { GeneradorMetas } from './ui/GeneradorMetas';
import { FeaturedGoalsPreview } from '@/components/featured-goals-preview';
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
              <div className="xl:col-span-2 space-y-6">
                {/* Descripción de la etapa */}
                <Card>
                  <CardHeader>
                    <CardDescription className="text-base leading-7">
                      {renderWithEmphasis(stage.descripcion)}
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Vista previa de metas destacadas */}
                <FeaturedGoalsPreview
                  goals={stage.metas}
                  stageTitle={stage.titulo}
                  onSelectGoal={(goal) => {
                    // TODO: Implementar selección de meta
                    console.log('Meta seleccionada:', goal);
                  }}
                />
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
