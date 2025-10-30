'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Compass, 
  Target, 
  Lightbulb, 
  ArrowRight,
  Sparkles,
  Heart
} from 'lucide-react';
import Link from 'next/link';

interface PurposeSummaryCardProps {
  className?: string;
}

export function PurposeSummaryCard({ className }: PurposeSummaryCardProps) {
  const [purposeProfile, setPurposeProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPurposeProfile();
  }, []);

  const loadPurposeProfile = async () => {
    try {
      const response = await fetch('/api/purpose-discovery');
      if (response.ok) {
        const data = await response.json();
        setPurposeProfile(data.profile);
      }
    } catch (error) {
      console.error('Error loading purpose profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
            <div className="h-2 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!purposeProfile || purposeProfile.answers.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Compass className="h-5 w-5 mr-2 text-primary" />
            Descubre Tu Propósito
          </CardTitle>
          <CardDescription>
            Un viaje de autoconocimiento para encontrar tu propósito de vida
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <Heart className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Comienza tu viaje de autoconocimiento y descubre lo que realmente te motiva
            </p>
          </div>
          <Button asChild className="w-full">
            <Link href="/purpose-discovery">
              <Compass className="h-4 w-4 mr-2" />
              Iniciar Test
            </Link>
          </Button>
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Target className="h-3 w-3" />
              <span>15-20 min</span>
            </div>
            <div className="flex items-center space-x-1">
              <Lightbulb className="h-3 w-3" />
              <span>Gratuito</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStageInfo = (stage: string) => {
    const stages = {
      exploration: { label: 'Exploración', color: 'bg-blue-100 text-blue-800' },
      clarity: { label: 'Claridad', color: 'bg-green-100 text-green-800' },
      action: { label: 'Acción', color: 'bg-yellow-100 text-yellow-800' },
      refinement: { label: 'Refinamiento', color: 'bg-purple-100 text-purple-800' }
    };
    return stages[stage as keyof typeof stages] || { label: stage, color: 'bg-gray-100 text-gray-800' };
  };

  const stageInfo = getStageInfo(purposeProfile.currentStage);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Compass className="h-5 w-5 mr-2 text-primary" />
          Mi Propósito
        </CardTitle>
        <CardDescription>
          Tu progreso en el descubrimiento del propósito
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progreso */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Progreso</span>
            <Badge variant="outline" className="text-xs">
              {purposeProfile.completionProgress}%
            </Badge>
          </div>
          <Progress value={purposeProfile.completionProgress} className="h-2" />
        </div>

        {/* Etapa actual */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Etapa:</span>
          <Badge className={`text-xs ${stageInfo.color}`}>
            {stageInfo.label}
          </Badge>
        </div>

        {/* Declaración de propósito (versión corta) */}
        {purposeProfile.purposeStatement && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border-l-4 border-blue-400">
            <div className="flex items-start space-x-2">
              <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-blue-900 mb-1">Mi Propósito:</p>
                <p className="text-xs text-blue-800 leading-relaxed line-clamp-2">
                  "{purposeProfile.purposeStatement}"
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-muted/30 rounded-lg">
            <div className="text-lg font-bold text-primary">{purposeProfile.answers.length}</div>
            <div className="text-xs text-muted-foreground">Respuestas</div>
          </div>
          <div className="text-center p-2 bg-muted/30 rounded-lg">
            <div className="text-lg font-bold text-primary">{purposeProfile.insights.length}</div>
            <div className="text-xs text-muted-foreground">Insights</div>
          </div>
        </div>

        {/* Acción */}
        <Button asChild variant="outline" className="w-full">
          <Link href="/purpose-discovery">
            {purposeProfile.completionProgress < 80 ? (
              <>
                <ArrowRight className="h-4 w-4 mr-2" />
                Continuar Explorando
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Ver Mis Resultados
              </>
            )}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
