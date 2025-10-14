'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Compass, AlertCircle, Sparkles, Target } from 'lucide-react';
import { RecommendationCard } from './recommendation-card';
import { getAlternativeGoals, type SmartRecommendations } from '@/lib/recommend';
import { useToast } from '@/hooks/use-toast';
import type { SemesterStage } from '@/lib/types';
import type { CuratedGoal } from '@/lib/types.goal-templates';

interface SmartRecommendationsViewProps {
  recommendations: SmartRecommendations;
  stage: SemesterStage;
  onSelectGoal?: (goalId: string) => Promise<void>;
  onNewDiagnostic?: () => void;
}

export function SmartRecommendationsView({
  recommendations,
  stage,
  onSelectGoal,
  onNewDiagnostic
}: SmartRecommendationsViewProps) {
  const { toast } = useToast();
  const [priorityAlternatives, setPriorityAlternatives] = useState<CuratedGoal[]>([]);
  const [complementaryAlternatives, setComplementaryAlternatives] = useState<CuratedGoal[]>([]);
  const [selectedGoalIds, setSelectedGoalIds] = useState<string[]>([]);

  const { priorityGoal, complementaryGoal, longitudinalGoals, otherRecommendations } = recommendations;

  // Detectar si son recomendaciones complementarias (puntajes altos)
  const isComplementaryMode = priorityGoal && 
    priorityGoal.badge === 'Complementaria' && 
    !priorityGoal.isUrgent;

  // Cargar alternativas cuando se monta el componente
  useEffect(() => {
    if (priorityGoal) {
      const alternatives = getAlternativeGoals({
        rejectedGoal: priorityGoal.goal,
        stage,
        excludeIds: selectedGoalIds,
        limit: 3
      });
      setPriorityAlternatives(alternatives);
    }

    if (complementaryGoal) {
      const alternatives = getAlternativeGoals({
        rejectedGoal: complementaryGoal.goal,
        stage,
        excludeIds: [...selectedGoalIds, priorityGoal?.id || ''],
        limit: 3
      });
      setComplementaryAlternatives(alternatives);
    }
  }, [priorityGoal, complementaryGoal, stage, selectedGoalIds]);

  const handleSelectGoal = async (goalId: string) => {
    console.log('🎯 DEBUG SmartRecommendationsView - handleSelectGoal:', {
      goalId,
      onSelectGoal: !!onSelectGoal,
      hasOnSelectGoal: typeof onSelectGoal === 'function'
    });

    if (!onSelectGoal) {
      console.error('❌ onSelectGoal no está definido');
      return;
    }

    try {
      console.log('🔄 Llamando a onSelectGoal con:', goalId);
      await onSelectGoal(goalId);
      setSelectedGoalIds(prev => [...prev, goalId]);
      
      toast({
        title: '¡Meta guardada exitosamente!',
        description: 'La meta ha sido agregada a tu plan de vida.',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error al seleccionar meta:', error);
      
      toast({
        title: 'Error al guardar meta',
        description: 'No se pudo guardar la meta. Por favor, intenta nuevamente.',
        variant: 'destructive',
        duration: 4000,
      });
    }
  };

  // Si no hay recomendaciones
  if (!priorityGoal && !complementaryGoal && longitudinalGoals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            No hay recomendaciones disponibles
          </CardTitle>
          <CardDescription>
            No pudimos generar recomendaciones basadas en tus respuestas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Intenta realizar el diagnóstico nuevamente o explora el catálogo completo de metas.
            </AlertDescription>
          </Alert>
          {onNewDiagnostic && (
            <Button onClick={onNewDiagnostic} className="w-full mt-4">
              <Compass className="mr-2 h-4 w-4" />
              Realizar nuevo diagnóstico
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <Card className={`${isComplementaryMode ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950' : 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950'}`}>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <CheckCircle className={`h-5 w-5 ${isComplementaryMode ? 'text-green-600' : 'text-green-600'}`} />
            {isComplementaryMode ? '¡Excelente Progreso!' : 'Tus Recomendaciones Personalizadas'}
          </CardTitle>
          <CardDescription>
            {isComplementaryMode 
              ? 'Tienes excelentes puntajes en las dimensiones evaluadas. Te sugerimos explorar otras áreas del bienestar para un desarrollo integral completo.'
              : 'Basadas en tu diagnóstico, estas son las metas que te sugerimos para avanzar en tu desarrollo integral.'
            }
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Meta Prioritaria */}
      {priorityGoal && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Target className={`h-5 w-5 ${isComplementaryMode ? 'text-green-600' : 'text-red-600'}`} />
            <h3 className="text-lg font-semibold font-headline">
              {isComplementaryMode ? 'Explora Nuevas Dimensiones' : 'Tu Meta Prioritaria'}
            </h3>
          </div>
          <RecommendationCard
            recommendation={priorityGoal}
            alternatives={priorityAlternatives}
            onSelect={handleSelectGoal}
            showAlternativesButton={true}
            showCreateOwnButton={true}
          />
        </div>
      )}

      {/* Meta Complementaria */}
      {complementaryGoal && (
        <>
          <Separator className="my-6" />
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className={`h-5 w-5 ${isComplementaryMode ? 'text-emerald-600' : 'text-purple-600'}`} />
              <h3 className="text-lg font-semibold font-headline">
                {isComplementaryMode ? 'Desarrollo Integral' : 'Meta Complementaria'}
              </h3>
            </div>
            <RecommendationCard
              recommendation={complementaryGoal}
              alternatives={complementaryAlternatives}
              onSelect={handleSelectGoal}
              showAlternativesButton={true}
              showCreateOwnButton={true}
            />
          </div>
        </>
      )}

      {/* Metas Longitudinales */}
      {longitudinalGoals.length > 0 && (
        <>
          <Separator className="my-6" />
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className={`h-5 w-5 ${isComplementaryMode ? 'text-emerald-600' : 'text-green-600'}`} />
              <h3 className="text-lg font-semibold font-headline">
                {isComplementaryMode ? 'Más Áreas para Explorar' : 'Metas Aplicables en Cualquier Etapa'}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {isComplementaryMode 
                ? 'Continúa tu desarrollo explorando estas dimensiones adicionales del bienestar.'
                : 'Estas metas son útiles independientemente de tu semestre y complementan tu desarrollo integral.'
              }
            </p>
            <div className="grid gap-4">
              {longitudinalGoals.map((recommendation, index) => (
                <Card key={recommendation.id} className="hover:border-primary transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            {index + 1}.
                          </span>
                          <span className="text-sm font-semibold">
                            {recommendation.goal.dimension}
                          </span>
                        </div>
                        <CardTitle className="text-base font-headline">
                          {recommendation.goal.metaSmarter}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      📋 {recommendation.goal.pasosAccion}
                    </p>
                    {(() => {
                      console.log('🔍 DEBUG Renderizando botón:', {
                        hasOnSelectGoal: !!onSelectGoal,
                        recommendationId: recommendation.id,
                        recommendationTitle: recommendation.goal.metaSmarter.substring(0, 30) + '...'
                      });
                      
                      return onSelectGoal ? (
                        <Button 
                          onClick={() => {
                            console.log('🖱️ DEBUG Botón clickeado:', {
                              recommendationId: recommendation.id,
                              recommendationTitle: recommendation.goal.metaSmarter.substring(0, 50) + '...'
                            });
                            handleSelectGoal(recommendation.id);
                          }}
                          size="sm"
                          variant="outline"
                          className="w-full"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Seleccionar esta meta
                        </Button>
                      ) : (
                        <div className="text-xs text-muted-foreground">
                          ❌ onSelectGoal no disponible
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Otras Recomendaciones Inteligentes */}
      {otherRecommendations.length > 0 && (
        <>
          <Separator className="my-6" />
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold font-headline">
                Recomendaciones Adicionales
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Estas metas complementan tu desarrollo en otras dimensiones del bienestar.
            </p>
            <div className="grid gap-4">
              {otherRecommendations.map((recommendation, index) => (
                <Card key={recommendation.id} className="hover:border-primary transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            {index + 1}.
                          </span>
                          <span className="text-sm font-semibold">
                            {recommendation.goal.dimension}
                          </span>
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                            {recommendation.badge}
                          </span>
                        </div>
                        <CardTitle className="text-base font-headline">
                          {recommendation.goal.metaSmarter}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      📋 {recommendation.goal.pasosAccion}
                    </p>
                    {(() => {
                      console.log('🔍 DEBUG Renderizando botón (otras recomendaciones):', {
                        hasOnSelectGoal: !!onSelectGoal,
                        recommendationId: recommendation.id,
                        recommendationTitle: recommendation.goal.metaSmarter.substring(0, 30) + '...'
                      });
                      
                      return onSelectGoal ? (
                        <Button 
                          onClick={() => {
                            console.log('🖱️ DEBUG Botón clickeado (otras recomendaciones):', {
                              recommendationId: recommendation.id,
                              recommendationTitle: recommendation.goal.metaSmarter.substring(0, 50) + '...'
                            });
                            handleSelectGoal(recommendation.id);
                          }}
                          size="sm"
                          variant="outline"
                          className="w-full"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Seleccionar esta meta
                        </Button>
                      ) : (
                        <div className="text-xs text-muted-foreground">
                          ❌ onSelectGoal no disponible
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Botón para nuevo diagnóstico */}
      {onNewDiagnostic && (
        <>
          <Separator className="my-6" />
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  ¿Quieres actualizar tus recomendaciones?
                </p>
                <Button onClick={onNewDiagnostic} variant="outline" className="w-full">
                  <Compass className="mr-2 h-4 w-4" />
                  Realizar nuevo diagnóstico
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

