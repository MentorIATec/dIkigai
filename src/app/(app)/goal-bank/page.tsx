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
import { useToast } from '@/hooks/use-toast';
import type { CuratedGoal, SemesterStage } from '@/lib/types';
import type { ReactNode } from 'react';
import { Suspense, useState } from 'react';

export const dynamic = 'force-dynamic';

export default function GoalBankPage(): JSX.Element {
  const flag = process.env.NEXT_PUBLIC_GOAL_GEN_V2;
  const [isInspirationOpen, setIsInspirationOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [currentStage, setCurrentStage] = useState<SemesterStage>('exploracion');
  const { toast } = useToast();
  const isEnabled =
    flag === undefined || flag === '1' || flag?.toLowerCase() === 'true' || flag?.toLowerCase() === 'enabled';
  
  const defaultStage = curatedGoalStages[0]?.etapa || 'exploracion';

  const handleGoalSelected = (goal: CuratedGoal) => {
    toast({
      title: '¡Meta guardada!',
      description: 'La meta ha sido agregada a tu plan de vida exitosamente.',
      duration: 4000,
    });
  };

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
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-headline tracking-tight">
          Asistente de Metas
        </h1>
        <p className="mt-2 max-w-3xl text-sm sm:text-base text-muted-foreground">
          Tu guía personalizada para definir metas académicas. Explora metas por dimensión del bienestar y alinéalas con tu etapa académica.
        </p>
      </div>

      <Tabs defaultValue={defaultStage} className="space-y-4" onValueChange={(value) => setCurrentStage(value as SemesterStage)}>
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
          <TabsContent key={stage.etapa} value={stage.etapa} className="space-y-6 sm:space-y-8">
            {/* Layout de una sola columna */}
            <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
              
              {/* Banner especial para 1er semestre con IBI y tutorial */}
              {stage.etapa === 'exploracion' && (
                <Card className="bg-gradient-to-br from-green-50/80 to-emerald-100/60 border-green-200/60 animate-fade-in-down">
                  <CardHeader className="pb-4 sm:pb-6 px-4 sm:px-6">
                    <CardTitle className="text-xl sm:text-2xl font-bold text-green-900 mb-2 flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      ¡Bienvenido/a a tu primer semestre!
                    </CardTitle>
                    <CardDescription className="text-base sm:text-lg leading-6 text-green-800">
                      <strong>Para 1er semestre:</strong> Ya tienes tu <strong>Índice de Bienestar Integral (IBI)</strong> completado. 
                      Usa esos resultados para crear metas alineadas a tus necesidades de bienestar.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 px-4 sm:px-6">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button asChild variant="default" className="flex-1 bg-green-600 hover:bg-green-700">
                        <a href="https://samp.itesm.mx/Preparatoria/MiVidaTec" target="_blank" rel="noopener noreferrer">
                          <Target className="mr-2 h-4 w-4" />
                          Ver mi IBI (Índice de Bienestar)
                        </a>
                      </Button>
                      <Button asChild variant="outline" className="flex-1">
                        <a href="https://drive.google.com/file/d/18kojUabG2z00cgmQXGU_6zLGmAL3weE9/view" target="_blank" rel="noopener noreferrer">
                          <FileText className="mr-2 h-4 w-4" />
                          Tutorial: Cómo actualizar metas
                        </a>
                      </Button>
                    </div>
                    <p className="text-xs text-green-700 text-center">
                      💡 Flujo recomendado: Consulta tu IBI → Crea metas alineadas → Actualiza en Mi Plan de Vida
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Hero Section - Descripción de la etapa */}
              <Card className="bg-gradient-to-br from-blue-50/80 to-indigo-100/60 border-blue-200/60 animate-fade-in-down">
                <CardHeader className="text-center pb-4 sm:pb-6 px-4 sm:px-6">
                  <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-900 mb-3 sm:mb-4">
                    {stage.titulo}
                  </CardTitle>
                  <CardDescription className="text-base sm:text-lg leading-6 sm:leading-8 text-blue-800 max-w-3xl mx-auto">
                    {renderWithEmphasis(stage.descripcion)}
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Panel informativo específico por semestre */}
              {stage.etapa === 'enfoque' && (
                <Card className="bg-gradient-to-br from-amber-50/80 to-yellow-100/60 border-amber-200/60">
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="text-lg font-semibold text-amber-900 mb-2 flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Etapa de Enfoque
                    </h3>
                    <p className="text-sm text-amber-800">
                      En esta etapa, profundiza en tus habilidades técnicas y define tu camino profesional. 
                      Enfócate en proyectos que construyan tu portafolio y en hacer networking relevante.
                    </p>
                  </CardContent>
                </Card>
              )}
              
              {stage.etapa === 'especializacion' && (
                <Card className="bg-gradient-to-br from-purple-50/80 to-violet-100/60 border-purple-200/60">
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="text-lg font-semibold text-purple-900 mb-2 flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Etapa de Especialización
                    </h3>
                    <p className="text-sm text-purple-800">
                      Momento de proyectos de alto impacto y preparación para el mercado laboral. 
                      Optimiza tu CV, practica entrevistas y finaliza tu proyecto de titulación.
                    </p>
                  </CardContent>
                </Card>
              )}
              
              {stage.etapa === 'graduacion' && (
                <Card className="bg-gradient-to-br from-rose-50/80 to-pink-100/60 border-rose-200/60">
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="text-lg font-semibold text-rose-900 mb-2 flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Etapa de Graduación
                    </h3>
                    <p className="text-sm text-rose-800">
                      ¡Última recta! Enfócate en completar tu tesis/proyecto final, aplicar a posiciones y 
                      prepararte para la transición al mundo profesional. Gestiona tu tiempo sabiamente.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Action Center - Botones principales */}
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <Card 
                  className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 animate-fade-in-up animation-delay-100"
                  onClick={() => setIsInspirationOpen(true)}
                >
                  <CardContent className="p-6 sm:p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <Sparkles className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-purple-900">Generar Inspiración</h3>
                    <p className="text-sm sm:text-base text-purple-700 mb-4">Recibe metas personalizadas basadas en tus necesidades específicas</p>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Comenzar
                    </Button>
                  </CardContent>
                </Card>

                <Card 
                  className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 animate-fade-in-up animation-delay-200"
                  onClick={() => setIsCatalogOpen(true)}
                >
                  <CardContent className="p-6 sm:p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <Target className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-green-900">Explorar Catálogo</h3>
                    <p className="text-sm sm:text-base text-green-700 mb-4">Descubre todas las metas disponibles para tu etapa académica</p>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <Target className="mr-2 h-4 w-4" />
                      Explorar
                    </Button>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200 sm:col-span-2 lg:col-span-1 animate-fade-in-up animation-delay-300">
                  <CardContent className="p-6 sm:p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                      <FileText className="h-8 w-8 text-orange-600" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-orange-900">Mis Metas Activas</h3>
                    <p className="text-sm sm:text-base text-orange-700 mb-4">Gestiona y da seguimiento a tus metas en progreso</p>
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
                  onSelectGoal={handleGoalSelected}
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
        stageTitle={curatedGoalStages.find(stage => stage.etapa === currentStage)?.titulo || 'Exploración'}
        onGenerateGoal={(dimension) => {
          console.log('Generando meta para dimensión:', dimension);
          // TODO: Implementar lógica de generación
        }}
      />

      <FullscreenCatalogOverlay
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        goals={curatedGoalStages.find(stage => stage.etapa === currentStage)?.metas || []}
        stageTitle={curatedGoalStages.find(stage => stage.etapa === currentStage)?.titulo || 'Exploración'}
        onSelectGoal={(goal) => {
          handleGoalSelected(goal);
          setIsCatalogOpen(false);
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
