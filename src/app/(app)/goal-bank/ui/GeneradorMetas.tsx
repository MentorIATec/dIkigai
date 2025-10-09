'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowRight, Compass, Sparkles, Target, FileText, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BrujulaTest } from '@/components/brújula-test';
import { FirstSemesterMini } from '@/components/async-first-semester-mini';
import { CompactRecommendations } from '@/components/async-compact-recommendations';
import { FilteredCatalog } from '@/components/async-filtered-catalog';
import { MinimalInspirationSidebar } from '@/components/minimal-inspiration-sidebar';
import { curatedGoalBankExtended } from '@/lib/curated-goals';
import type { SemesterStage } from '@/lib/types';
import type { DiagnosticAnswer, DiagnosticResult } from '@/lib/types.goal-templates';
import type { StudentProfile } from '@/lib/types';

interface GeneradorMetasProps {
  stage: SemesterStage;
  periodKey?: string;
}

type ViewMode = 'welcome' | 'brújula' | 'results';
type RightTab = 'results' | 'catalog' | 'explore';

export function GeneradorMetas({ stage, periodKey }: GeneradorMetasProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('welcome');
  const [rightTab, setRightTab] = useState<RightTab>('results');
  const [recommendedGoalIds, setRecommendedGoalIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [hasCompletedDiagnostic, setHasCompletedDiagnostic] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFullCatalogModal, setShowFullCatalogModal] = useState(false);

  // Cargar perfil y diagnóstico previo
  useEffect(() => {
    async function loadData() {
      try {
        // Cargar perfil
        const profileResponse = await fetch('/api/profile');
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setProfile(profileData.profile);
        }

        // Cargar diagnóstico previo si existe
        if (periodKey) {
          const diagnosticResponse = await fetch(`/api/diagnostics/${stage}?latest=1&periodKey=${periodKey}`);
          if (diagnosticResponse.ok) {
            const diagnosticData = await diagnosticResponse.json();
            if (diagnosticData.results && diagnosticData.results.length > 0) {
              const latestResult = diagnosticData.results[0] as DiagnosticResult;
              setRecommendedGoalIds(latestResult.recommendedGoalIds);
              setHasCompletedDiagnostic(true);
              setViewMode('results');
            }
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    }

    loadData();
  }, [stage, periodKey]);

  const handleBrújulaComplete = async (answers: DiagnosticAnswer[]) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/diagnostics/${stage}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          periodKey,
          answers
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendedGoalIds(data.recommendedGoalIds || []);
        setHasCompletedDiagnostic(true);
        setViewMode('results');
        setRightTab('results');
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Error del servidor (${response.status})`;
        setError(`No se pudieron generar las recomendaciones: ${errorMessage}`);
        console.error('Error submitting diagnostic:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      setError(`Error de conexión: ${errorMessage}`);
      console.error('Error submitting diagnostic:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateGoal = () => {
    // Lógica para generar una meta aleatoria
    const stageGoals = curatedGoalBankExtended[stage]?.metas || [];
    if (stageGoals.length > 0) {
      const randomGoal = stageGoals[Math.floor(Math.random() * stageGoals.length)];
      // Redirigir a crear meta con plantilla
      router.push(`/goals/new?template=${randomGoal.id}`);
    }
  };

  const handleOpenTemplate = () => {
    // Redirigir a crear meta desde plantilla vacía
    router.push('/goals/new');
  };

  const getStageLabel = (stage: SemesterStage) => {
    switch (stage) {
      case 'exploracion': return 'Exploración';
      case 'enfoque': return 'Enfoque';
      case 'especializacion': return 'Especialización';
      case 'graduacion': return 'Graduación';
      default: return stage;
    }
  };

  // Verificar si falta perfil
  if (!profile || !profile.semesterNumber || !profile.carreraName) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Compass className="h-5 w-5" />
            Asistente de Metas
          </CardTitle>
          <CardDescription>
            Completa tu perfil para acceder a recomendaciones personalizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <ExternalLink className="h-4 w-4" />
            <AlertDescription>
              Para recibir recomendaciones personalizadas, necesitas completar tu perfil académico.
            </AlertDescription>
          </Alert>
          <Button asChild className="mt-4 w-full">
            <Link href="/profile">
              Completar Perfil
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Caso especial: Primer semestre
  if (profile.semesterNumber === 1) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Columna izquierda: Mini asistente */}
        <div>
          <FirstSemesterMini 
            onGenerateGoal={handleGenerateGoal}
            onOpenTemplate={handleOpenTemplate}
          />
        </div>
        
        {/* Columna derecha: Sidebar minimalista */}
        <div>
          <MinimalInspirationSidebar
            stage={getStageLabel(stage)}
            onGenerateGoal={handleGenerateGoal}
            hasCompletedDiagnostic={hasCompletedDiagnostic}
            recommendedGoalIds={recommendedGoalIds}
          />
        </div>
      </div>
    );
  }

  // Layout principal con columnas
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Columna izquierda: Test o bienvenida */}
      <div>
        {viewMode === 'welcome' && (
          <Card className="bg-gradient-to-br from-blue-50/80 to-indigo-100/60 border-blue-200/60">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <Compass className="h-6 w-6 text-blue-600" />
                Brújula de {getStageLabel(stage)}
              </CardTitle>
              <CardDescription className="text-base">
                Completa un diagnóstico rápido para recibir recomendaciones personalizadas basadas en tu etapa académica.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-semibold">¿Qué incluye el test?</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Preguntas específicas para tu etapa</li>
                    <li>• Evaluación de tus áreas de enfoque</li>
                    <li>• Recomendaciones personalizadas</li>
                    <li>• Metas curadas para tu nivel</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Beneficios</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Metas alineadas con tu progreso</li>
                    <li>• Enfoque en áreas de mejora</li>
                    <li>• Planificación estratégica</li>
                    <li>• Seguimiento personalizado</li>
                  </ul>
                </div>
              </div>
              
              <Button onClick={() => setViewMode('brújula')} className="w-full">
                <Compass className="mr-2 h-4 w-4" />
                Iniciar Brújula de {getStageLabel(stage)}
              </Button>
            </CardContent>
          </Card>
        )}

        {viewMode === 'brújula' && (
          <BrujulaTest
            stage={stage as any}
            onComplete={handleBrújulaComplete}
            onBack={() => setViewMode('welcome')}
          />
        )}

        {viewMode === 'results' && (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Diagnóstico completado
              </CardTitle>
              <CardDescription>
                Has completado la Brújula de {getStageLabel(stage)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-muted-foreground mb-4">
                  Revisa tus recomendaciones en la columna derecha
                </p>
                <Button onClick={() => setViewMode('brújula')} variant="outline">
                  <Compass className="mr-2 h-4 w-4" />
                  Realizar nuevo diagnóstico
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Columna derecha: Sidebar minimalista */}
      <div>
        <MinimalInspirationSidebar
          stage={getStageLabel(stage)}
          onGenerateGoal={handleGenerateGoal}
          hasCompletedDiagnostic={hasCompletedDiagnostic}
          recommendedGoalIds={recommendedGoalIds}
        />
      </div>

      {/* Modal del catálogo completo */}
      <Dialog open={showFullCatalogModal} onOpenChange={setShowFullCatalogModal}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-headline flex items-center gap-2">
              <Target className="h-5 w-5" />
              Catálogo completo de metas
            </DialogTitle>
            <DialogDescription>
              Catálogo completo opcional con todas las metas disponibles para tu etapa de {getStageLabel(stage)}. 
              Las metas recomendadas aparecen destacadas.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <FilteredCatalog
              stage={stage}
              recommendedGoalIds={recommendedGoalIds}
              onGenerateGoal={handleGenerateGoal}
              onOpenTemplate={handleOpenTemplate}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
