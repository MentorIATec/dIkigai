'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Target, Sparkles, ArrowRight, Eye } from 'lucide-react';
import { FullCatalogModal } from './full-catalog-modal';
import type { CuratedGoal } from '@/lib/types';

interface FeaturedGoalsPreviewProps {
  goals: CuratedGoal[];
  stageTitle: string;
  onSelectGoal: (goal: CuratedGoal) => void;
}

function renderWithEmphasis(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function getActionSteps(pasosAccion: string): string[] {
  return pasosAccion
    .split('\n')
    .map(step => step.trim())
    .filter(step => step.length > 0);
}

export function FeaturedGoalsPreview({ goals, stageTitle, onSelectGoal }: FeaturedGoalsPreviewProps) {
  const [isFullCatalogOpen, setIsFullCatalogOpen] = useState(false);
  const [savingGoalId, setSavingGoalId] = useState<string | null>(null);
  const { toast } = useToast();

  // Mostrar solo las primeras 3 metas como destacadas
  const featuredGoals = goals.slice(0, 3);
  const remainingCount = goals.length - 3;

  const handleSelectGoal = async (goal: CuratedGoal) => {
    setSavingGoalId(goal.id);
    
    try {
      const response = await fetch('/api/goals/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ goal }),
      });

      if (!response.ok) {
        throw new Error('Error guardando meta');
      }

      // Llamar al callback del parent
      onSelectGoal(goal);
      
      toast({
        title: '¡Meta guardada!',
        description: 'La meta ha sido agregada a tu plan de vida exitosamente.',
        duration: 4000,
      });
    } catch (error) {
      console.error('Error guardando meta:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar la meta. Por favor, intenta nuevamente.',
        variant: 'destructive',
        duration: 4000,
      });
    } finally {
      setSavingGoalId(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Target className="h-5 w-5 text-primary" />
                Metas Destacadas
              </CardTitle>
              <CardDescription className="text-base mt-1">
                Las metas más relevantes para tu etapa de {stageTitle}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Metas destacadas */}
          {featuredGoals.map((meta, index) => (
            <div
              key={meta.id}
              className="group rounded-lg border bg-gradient-to-r from-card/60 to-card/40 p-4 hover:shadow-md transition-all duration-200 hover:border-primary/30"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="text-xs font-medium">
                      {meta.dimension}
                    </Badge>
                    <Badge variant="outline" className="capitalize text-xs">
                      {meta.categoria}
                    </Badge>
                    <span className="text-xs font-mono uppercase tracking-wide text-muted-foreground/70">
                      {meta.id}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold leading-5 text-foreground">
                    {renderWithEmphasis(meta.metaSmarter)}
                  </h3>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Pasos sugeridos:</p>
                    <div className="space-y-1">
                      {getActionSteps(meta.pasosAccion).slice(0, 2).map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-start gap-2 p-2 rounded-md bg-muted/20">
                          <div className="flex-shrink-0 w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                            <span className="text-xs font-medium text-primary">{stepIndex + 1}</span>
                          </div>
                          <p className="text-sm leading-4 text-muted-foreground">
                            {renderWithEmphasis(step)}
                          </p>
                        </div>
                      ))}
                      {getActionSteps(meta.pasosAccion).length > 2 && (
                        <p className="text-xs text-muted-foreground ml-6">
                          +{getActionSteps(meta.pasosAccion).length - 2} pasos más...
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Button 
                  size="sm"
                  onClick={() => handleSelectGoal(meta)}
                  disabled={savingGoalId === meta.id}
                  className="flex-shrink-0"
                >
                  <Sparkles className={`mr-2 h-4 w-4 ${savingGoalId === meta.id ? 'animate-spin' : ''}`} />
                  {savingGoalId === meta.id ? 'Guardando...' : 'Seleccionar'}
                </Button>
              </div>
            </div>
          ))}

          {/* Botón para ver más metas */}
          {remainingCount > 0 && (
            <div className="pt-4 border-t">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setIsFullCatalogOpen(true)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Ver más metas disponibles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal del catálogo completo */}
      <FullCatalogModal
        isOpen={isFullCatalogOpen}
        onClose={() => setIsFullCatalogOpen(false)}
        goals={goals}
        stageTitle={stageTitle}
        onSelectGoal={onSelectGoal}
      />
    </>
  );
}
