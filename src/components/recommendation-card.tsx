'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, Sparkles, RefreshCw, PlusCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { RecommendedGoal } from '@/lib/recommend';
import type { CuratedGoal } from '@/lib/types.goal-templates';

interface RecommendationCardProps {
  recommendation: RecommendedGoal;
  alternatives?: CuratedGoal[];
  onSelect?: (goalId: string) => void;
  onRequestAlternatives?: () => void;
  showAlternativesButton?: boolean;
  showCreateOwnButton?: boolean;
}

export function RecommendationCard({
  recommendation,
  alternatives = [],
  onSelect,
  onRequestAlternatives,
  showAlternativesButton = true,
  showCreateOwnButton = true
}: RecommendationCardProps) {
  const router = useRouter();
  const [showAlternativesModal, setShowAlternativesModal] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  const { goal, badge, reason, isUrgent } = recommendation;

  const badgeVariants: Record<typeof badge, string> = {
    'Urgente': 'bg-red-600 hover:bg-red-700 text-white',
    'Prioritaria': 'bg-blue-600 hover:bg-blue-700 text-white',
    'Complementaria': 'bg-purple-600 hover:bg-purple-700 text-white',
    'Aplicable siempre': 'bg-green-600 hover:bg-green-700 text-white'
  };

  const iconByBadge: Record<typeof badge, React.ReactNode> = {
    'Urgente': <AlertCircle className="h-4 w-4" />,
    'Prioritaria': <Sparkles className="h-4 w-4" />,
    'Complementaria': <RefreshCw className="h-4 w-4" />,
    'Aplicable siempre': <CheckCircle className="h-4 w-4" />
  };

  const handleSelect = async () => {
    console.log('🎯 DEBUG RecommendationCard - handleSelect:', {
      goalId: goal.id,
      goalTitle: goal.metaSmarter.substring(0, 50) + '...',
      hasOnSelect: !!onSelect,
      onSelectType: typeof onSelect
    });

    if (!onSelect) {
      console.error('❌ onSelect no está definido en RecommendationCard');
      return;
    }
    
    setIsSelecting(true);
    try {
      console.log('🔄 Llamando a onSelect con:', goal.id);
      await onSelect(goal.id);
    } finally {
      setIsSelecting(false);
    }
  };

  const handleCreateOwn = () => {
    // Redirigir a crear meta propia con contexto
    const params = new URLSearchParams({
      dimension: goal.dimension,
      categoria: goal.categoria,
      source: 'brujula'
    });
    router.push(`/goals/new?${params.toString()}`);
  };

  const handleShowAlternatives = () => {
    if (onRequestAlternatives) {
      onRequestAlternatives();
    }
    setShowAlternativesModal(true);
  };

  return (
    <>
      <Card className={isUrgent ? 'border-red-500 border-2' : ''}>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={badgeVariants[badge]}>
                  {iconByBadge[badge]}
                  <span className="ml-1">{badge}</span>
                </Badge>
                <Badge variant="outline">{goal.dimension}</Badge>
              </div>
              <CardTitle className="text-lg font-headline">
                {goal.metaSmarter}
              </CardTitle>
            </div>
          </div>
          <CardDescription className="flex items-center gap-1 mt-2">
            <Sparkles className="h-3 w-3" />
            <span className="text-sm">{reason}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Pasos de acción */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              📋 Pasos de acción:
            </p>
            <p className="text-sm text-muted-foreground">
              {goal.pasosAccion}
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-2">
            {(() => {
              console.log('🔍 DEBUG RecommendationCard - Renderizando botón:', {
                goalId: goal.id,
                hasOnSelect: !!onSelect,
                onSelectType: typeof onSelect
              });
              
              return onSelect ? (
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🖱️ DEBUG Botón HTML clickeado:', {
                      goalId: goal.id,
                      isSelecting
                    });
                    handleSelect();
                  }}
                  disabled={isSelecting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  {isSelecting ? 'Guardando...' : 'Seleccionar esta meta'}
                </button>
              ) : (
                <div className="text-xs text-muted-foreground">
                  ❌ onSelect no disponible en RecommendationCard
                </div>
              );
            })()}
            
            {showAlternativesButton && alternatives.length > 0 && (
              <Button 
                onClick={handleShowAlternatives}
                variant="outline"
                className="flex-1"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Ver alternativas
              </Button>
            )}
            
            {showCreateOwnButton && (
              <Button 
                onClick={handleCreateOwn}
                variant="outline"
                className="flex-1"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Crear meta propia
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de alternativas */}
      <Dialog open={showAlternativesModal} onOpenChange={setShowAlternativesModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-headline">
              🔄 Alternativas para tu meta
            </DialogTitle>
            <DialogDescription>
              Estas son otras metas relacionadas que podrían interesarte
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {alternatives.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No hay alternativas disponibles en este momento. Puedes crear tu propia meta.
                </AlertDescription>
              </Alert>
            ) : (
              alternatives.map((altGoal, index) => (
                <Card key={altGoal.id} className="hover:border-primary transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">Alternativa {index + 1}</Badge>
                          <Badge variant="secondary">{altGoal.dimension}</Badge>
                        </div>
                        <CardTitle className="text-base font-headline">
                          {altGoal.metaSmarter}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {altGoal.pasosAccion}
                    </p>
                    {onSelect && (
                      <Button 
                        onClick={() => {
                          onSelect(altGoal.id);
                          setShowAlternativesModal(false);
                        }}
                        size="sm"
                        className="w-full"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Seleccionar esta alternativa
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
            )}

            <div className="flex gap-2 pt-4">
              <Button 
                onClick={() => setShowAlternativesModal(false)}
                variant="outline"
                className="flex-1"
              >
                Volver a recomendación original
              </Button>
              <Button 
                onClick={handleCreateOwn}
                variant="default"
                className="flex-1"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Crear meta propia
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

