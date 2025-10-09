'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { curatedGoalStages } from '@/lib/curated-goals';
import { GeneradorMetas } from './ui/GeneradorMetas';
import { FeaturedGoalsPreview } from '@/components/featured-goals-preview';
import { FullscreenInspirationOverlay } from '@/components/fullscreen-inspiration-overlay';
import { FullscreenCatalogOverlay } from '@/components/fullscreen-catalog-overlay';
import { Sparkles, Target, FileText } from 'lucide-react';
import type { CuratedGoal, SemesterStage } from '@/lib/types';
import type { ReactNode } from 'react';
import { Suspense, useState } from 'react';

export const dynamic = 'force-dynamic';

export default function GoalBankPage(): JSX.Element {
  const flag = process.env.NEXT_PUBLIC_GOAL_GEN_V2;
  const [isInspirationOpen, setIsInspirationOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
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
          <TabsContent key={stage.etapa} value={stage.etapa} className="space-y-8">
            {/* Layout de una sola columna */}
            <div className="max-w-4xl mx-auto space-y-8">
              
              {/* Hero Section - Descripción de la etapa */}
              <Card className="bg-gradient-to-br from-blue-50/80 to-indigo-100/60 border-blue-200/60">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-3xl font-bold text-blue-900 mb-4">
                    {stage.titulo}
                  </CardTitle>
                  <CardDescription className="text-lg leading-8 text-blue-800 max-w-3xl mx-auto">
                    {renderWithEmphasis(stage.descripcion)}
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Action Center - Botones principales */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card 
                  className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200"
                  onClick={() => setIsInspirationOpen(true)}
                >
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <Sparkles className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-purple-900">Generar Inspiración</h3>
                    <p className="text-purple-700 mb-4">Recibe metas personalizadas basadas en tus necesidades específicas</p>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Comenzar
                    </Button>
                  </CardContent>
                </Card>

                <Card 
                  className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
                  onClick={() => setIsCatalogOpen(true)}
                >
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <Target className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-green-900">Explorar Catálogo</h3>
                    <p className="text-green-700 mb-4">Descubre todas las metas disponibles para tu etapa académica</p>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <Target className="mr-2 h-4 w-4" />
                      Explorar
                    </Button>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200 md:col-span-2 lg:col-span-1">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                      <FileText className="h-8 w-8 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-orange-900">Mis Metas Activas</h3>
                    <p className="text-orange-700 mb-4">Gestiona y da seguimiento a tus metas en progreso</p>
                    <Button className="w-full bg-orange-600 hover:bg-orange-700">
                      <FileText className="mr-2 h-4 w-4" />
                      Ver Metas
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Vista previa de metas destacadas - Solo si hay metas */}
              {stage.metas.length > 0 && (
                <FeaturedGoalsPreview
                  goals={stage.metas}
                  stageTitle={stage.titulo}
                  onSelectGoal={(goal) => {
                    // TODO: Implementar selección de meta
                    console.log('Meta seleccionada:', goal);
                  }}
                />
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Overlays de pantalla completa */}
      <FullscreenInspirationOverlay
        isOpen={isInspirationOpen}
        onClose={() => setIsInspirationOpen(false)}
        stageTitle={curatedGoalStages.find(stage => stage.etapa === defaultStage)?.titulo || 'Exploración'}
        onGenerateGoal={(dimension) => {
          console.log('Generando meta para dimensión:', dimension);
          // TODO: Implementar lógica de generación
        }}
      />

      <FullscreenCatalogOverlay
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        goals={curatedGoalStages.find(stage => stage.etapa === defaultStage)?.metas || []}
        stageTitle={curatedGoalStages.find(stage => stage.etapa === defaultStage)?.titulo || 'Exploración'}
        onSelectGoal={(goal) => {
          console.log('Meta seleccionada:', goal);
          setIsCatalogOpen(false);
          // TODO: Implementar selección de meta
        }}
      />
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
