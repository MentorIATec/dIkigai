'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, Eye, Plus, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { curatedGoalBankExtended } from '@/lib/curated-goals';
import type { CuratedGoal, SemesterStage } from '@/lib/types';

interface CompactRecommendationsProps {
  recommendedGoalIds: string[];
  stage: SemesterStage;
  onRetakeTest: () => void;
  onViewCatalog: () => void;
  onViewFullCatalog: () => void;
  error?: string | null;
}

export function CompactRecommendations({ 
  recommendedGoalIds, 
  stage, 
  onRetakeTest, 
  onViewCatalog, 
  onViewFullCatalog,
  error 
}: CompactRecommendationsProps) {
  const [selectedGoal, setSelectedGoal] = useState<CuratedGoal | null>(null);

  const recommendedGoals = recommendedGoalIds
    .map(id => {
      const stageGoals = curatedGoalBankExtended[stage]?.metas || [];
      return stageGoals.find(goal => goal.id === id);
    })
    .filter(Boolean) as CuratedGoal[];

  // Mostrar solo las primeras 3 metas en el resumen
  const summaryGoals = recommendedGoals.slice(0, 3);

  const getStageLabel = (stage: SemesterStage) => {
    switch (stage) {
      case 'exploracion': return 'Exploración';
      case 'enfoque': return 'Enfoque';
      case 'especializacion': return 'Especialización';
      case 'graduacion': return 'Graduación';
      default: return stage;
    }
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            Error en el Diagnóstico
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="flex gap-3">
            <Button onClick={onRetakeTest} variant="outline" className="flex-1">
              <ArrowRight className="mr-2 h-4 w-4" />
              Reintentar Test
            </Button>
            <Button onClick={onViewCatalog} className="flex-1">
              <Eye className="mr-2 h-4 w-4" />
              Ver Catálogo
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recommendedGoals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Sin Recomendaciones
          </CardTitle>
          <CardDescription>
            No se encontraron metas recomendadas para tu perfil actual.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              Intenta realizar el test nuevamente o explora el catálogo completo.
            </p>
            <div className="flex gap-3">
              <Button onClick={onRetakeTest} variant="outline" className="flex-1">
                <ArrowRight className="mr-2 h-4 w-4" />
                Reintentar Test
              </Button>
              <Button onClick={onViewCatalog} className="flex-1">
                <Eye className="mr-2 h-4 w-4" />
                Ver Catálogo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Recomendadas para ti
        </CardTitle>
        <CardDescription>
          {summaryGoals.length} de {recommendedGoals.length} metas priorizadas para tu etapa de {getStageLabel(stage)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {summaryGoals.map((goal) => (
            <div key={goal.id} className="rounded-lg border p-4 bg-muted/30">
              <div className="flex items-start justify-between mb-2">
                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {goal.dimension}
                  </Badge>
                  <Badge variant="outline" className="text-xs capitalize">
                    {goal.categoria}
                  </Badge>
                </div>
                <span className="text-xs font-mono text-muted-foreground">
                  {goal.id}
                </span>
              </div>
              
              <h4 className="font-semibold text-sm mb-2 leading-tight">
                {goal.metaSmarter}
              </h4>
              
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedGoal(goal)}
                    >
                      <Eye className="mr-2 h-3 w-3" />
                      Ver detalles
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <div className="flex gap-2">
                          <Badge variant="secondary">{goal.dimension}</Badge>
                          <Badge variant="outline" className="capitalize">
                            {goal.categoria}
                          </Badge>
                        </div>
                      </DialogTitle>
                      <DialogDescription>
                        Meta recomendada para tu etapa de {getStageLabel(stage)}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Objetivo</h4>
                        <p className="text-sm leading-relaxed">
                          {goal.metaSmarter}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Pasos sugeridos</h4>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {goal.pasosAccion}
                        </p>
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button asChild className="flex-1">
                          <Link href={`/goals/new?template=${goal.id}`}>
                            <Plus className="mr-2 h-4 w-4" />
                            Agregar a mis metas
                          </Link>
                        </Button>
                        <Button asChild variant="outline" className="flex-1">
                          <Link href={`/goals/new?template=${goal.id}`}>
                            <ArrowRight className="mr-2 h-4 w-4" />
                            Usar como plantilla
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button asChild size="sm">
                  <Link href={`/goals/new?template=${goal.id}`}>
                    <Plus className="mr-2 h-3 w-3" />
                    Agregar
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {recommendedGoals.length > 3 && (
          <div className="text-center py-2">
            <Button onClick={onViewFullCatalog} variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              Ver catálogo completo ({recommendedGoals.length - 3} más)
            </Button>
          </div>
        )}
        
        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={onRetakeTest} variant="outline" className="flex-1">
            <ArrowRight className="mr-2 h-4 w-4" />
            Nuevo diagnóstico
          </Button>
          <Button onClick={onViewCatalog} variant="outline" className="flex-1">
            <Eye className="mr-2 h-4 w-4" />
            Explorar más
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
