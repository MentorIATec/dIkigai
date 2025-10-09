'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Target, ArrowRight, CheckCircle } from 'lucide-react';
import { InspirationModal } from './inspiration-modal';

interface MinimalInspirationSidebarProps {
  stage: string;
  onGenerateGoal: (dimension: string) => void;
  hasCompletedDiagnostic?: boolean;
  recommendedGoalIds?: string[];
}

export function MinimalInspirationSidebar({ 
  stage, 
  onGenerateGoal, 
  hasCompletedDiagnostic = false,
  recommendedGoalIds = []
}: MinimalInspirationSidebarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGenerateGoal = (dimension: string) => {
    onGenerateGoal(dimension);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Card principal de inspiración */}
      <Card className="bg-gradient-to-br from-purple-50/80 to-blue-50/60 border-purple-200/60">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Tu Inspiración
          </CardTitle>
          <CardDescription className="text-sm">
            Metas personalizadas para tu etapa de {stage}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasCompletedDiagnostic && recommendedGoalIds.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-green-700">
                <CheckCircle className="h-4 w-4" />
                <span>Diagnóstico completado</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {recommendedGoalIds.length} metas recomendadas
              </Badge>
              <p className="text-xs text-muted-foreground">
                Revisa tus recomendaciones personalizadas basadas en tu diagnóstico.
              </p>
            </div>
          ) : (
            <div className="text-center py-4">
              <Target className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-4">
                Genera metas personalizadas para tu etapa académica
              </p>
            </div>
          )}
          
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="w-full"
            size="sm"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Generar inspiración
          </Button>
        </CardContent>
      </Card>

      {/* Card de acciones rápidas */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-between"
            onClick={() => onGenerateGoal('random')}
          >
            <span>Inspiración aleatoria</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-between"
            onClick={() => onGenerateGoal('custom')}
          >
            <span>Crear meta personalizada</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Modal de inspiración */}
      <InspirationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGenerateGoal={handleGenerateGoal}
        stage={stage}
      />
    </div>
  );
}
