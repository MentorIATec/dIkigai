'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Target, FileText, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { curatedGoalBankExtended } from '@/lib/curated-goals';
import type { CuratedGoal } from '@/lib/types';

interface FirstSemesterGuideProps {
  onGenerateGoal: () => void;
  onOpenTemplate: () => void;
}

export function FirstSemesterGuide({ onGenerateGoal, onOpenTemplate }: FirstSemesterGuideProps) {
  const [suggestedGoal, setSuggestedGoal] = useState<CuratedGoal | null>(null);

  useEffect(() => {
    // Obtener una meta sugerida de exploración o longitudinal
    const exploracionGoals = curatedGoalBankExtended.exploracion?.metas || [];
    const longitudinalGoals = curatedGoalBankExtended.graduacion?.metas || []; // Mapeado desde longitudinal
    
    const allGoals = [...exploracionGoals, ...longitudinalGoals];
    if (allGoals.length > 0) {
      const randomGoal = allGoals[Math.floor(Math.random() * allGoals.length)];
      setSuggestedGoal(randomGoal);
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Instrucciones principales */}
      <Card className="bg-gradient-to-br from-blue-50/80 to-indigo-100/60 border-blue-200/60">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Target className="h-6 w-6 text-blue-600" />
            Guía para tu Primer Semestre
          </CardTitle>
          <CardDescription className="text-base">
            Como estudiante de primer semestre, te recomendamos seguir estos pasos para definir tus primeras metas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <div>
                <p className="font-medium">Revisa tu Índice de Bienestar Integral (IBI)</p>
                <p className="text-sm text-muted-foreground">
                  Ve a Mi Tec → MiVidaTec y completa tu evaluación de bienestar
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <div>
                <p className="font-medium">Identifica tus 3 dimensiones con menor puntaje</p>
                <p className="text-sm text-muted-foreground">
                  Estas serán tus áreas de enfoque para las primeras metas
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <div>
                <p className="font-medium">Explora metas sugeridas o crea la tuya</p>
                <p className="text-sm text-muted-foreground">
                  Te ayudamos con opciones basadas en tu etapa de exploración
                </p>
              </div>
            </div>
          </div>

          <Alert>
            <ExternalLink className="h-4 w-4" />
            <AlertDescription>
              <strong>Accede a MiVidaTec:</strong> Ve a Mi Tec y busca la sección "MiVidaTec" para completar tu IBI.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Meta sugerida */}
      {suggestedGoal && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Meta Sugerida para Ti
            </CardTitle>
            <CardDescription>
              Basada en tu etapa de exploración, te recomendamos esta meta:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4 bg-muted/30">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="secondary">{suggestedGoal.dimension}</Badge>
                <Badge variant="outline" className="capitalize">
                  {suggestedGoal.categoria}
                </Badge>
                <span className="text-xs font-mono text-muted-foreground">
                  {suggestedGoal.id}
                </span>
              </div>
              
              <p className="text-base leading-relaxed mb-3">
                {suggestedGoal.metaSmarter}
              </p>
              
              <div className="text-sm text-muted-foreground">
                <strong>Pasos sugeridos:</strong> {suggestedGoal.pasosAccion}
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={onGenerateGoal} variant="outline" className="flex-1">
                <Sparkles className="mr-2 h-4 w-4" />
                Generar Otra Meta
              </Button>
              <Button onClick={onOpenTemplate} className="flex-1">
                <FileText className="mr-2 h-4 w-4" />
                Crear Meta Personalizada
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Opciones adicionales */}
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">¿Qué prefieres hacer?</CardTitle>
          <CardDescription>
            Puedes explorar más opciones o crear tu propia meta desde cero.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <Button asChild variant="outline" className="h-auto p-4">
              <Link href="#catalog">
                <Target className="mr-2 h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium">Explorar Catálogo</div>
                  <div className="text-xs text-muted-foreground">
                    Ver todas las metas disponibles
                  </div>
                </div>
                <ArrowRight className="ml-auto h-4 w-4" />
              </Link>
            </Button>
            
            <Button asChild className="h-auto p-4">
              <Link href="/goals/new">
                <FileText className="mr-2 h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium">Crear Meta Nueva</div>
                  <div className="text-xs text-muted-foreground">
                    Desde cero con plantilla
                  </div>
                </div>
                <ArrowRight className="ml-auto h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
