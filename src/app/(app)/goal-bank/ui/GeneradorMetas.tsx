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
import { useToast } from '@/hooks/use-toast';
import { BrujulaTest } from '@/components/brújula-test';
import { FirstSemesterMini } from '@/components/async-first-semester-mini';
import { CompactRecommendations } from '@/components/async-compact-recommendations';
import { FilteredCatalog } from '@/components/async-filtered-catalog';
import { MinimalInspirationSidebar } from '@/components/minimal-inspiration-sidebar';
import { SmartRecommendationsView } from '@/components/smart-recommendations-view';
import { InspirationModal } from '@/components/inspiration-modal';
import { curatedGoalBankExtended } from '@/lib/curated-goals';
import { generateSmartRecommendations, type SmartRecommendations } from '@/lib/recommend';
import { useDiagnosticStorage, useSelectedGoalsStorage } from '@/hooks/use-local-storage';
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
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>('welcome');
  const [rightTab, setRightTab] = useState<RightTab>('results');
  const [recommendedGoalIds, setRecommendedGoalIds] = useState<string[]>([]);
  const [smartRecommendations, setSmartRecommendations] = useState<SmartRecommendations | null>(null);
  const [diagnosticAnswers, setDiagnosticAnswers] = useState<DiagnosticAnswer[]>([]);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [hasCompletedDiagnostic, setHasCompletedDiagnostic] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFullCatalogModal, setShowFullCatalogModal] = useState(false);
  const [showInspirationModal, setShowInspirationModal] = useState(false);

  // 🗄️ HOOKS DE PERSISTENCIA BÁSICA
  const { 
    markDiagnosticCompleted, 
    getCompletedDiagnostic, 
    hasCompletedDiagnostic: hasCompletedInStorage,
    isLoaded: diagnosticStorageLoaded 
  } = useDiagnosticStorage();
  
  const { 
    selectedGoals, 
    addSelectedGoal, 
    removeSelectedGoal 
  } = useSelectedGoalsStorage();

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

        // 🗄️ PRIORIDAD: Cargar desde localStorage si está disponible
        if (diagnosticStorageLoaded && hasCompletedInStorage(stage)) {
          const localData = getCompletedDiagnostic(stage);
          if (localData) {
            console.log('📱 Cargando diagnóstico desde localStorage:', localData);
            setRecommendedGoalIds(localData.recommendedGoalIds || []);
            setHasCompletedDiagnostic(true);
            
            // Generar recomendaciones desde datos locales
            if (localData.answers && localData.answers.length > 0) {
              const recommendations = generateSmartRecommendations({
                stage,
                answers: localData.answers,
                selectedGoalIds: localData.recommendedGoalIds || []
              });
              setSmartRecommendations(recommendations);
            }
            
            setViewMode('results');
            return; // Salir temprano si encontramos datos locales
          }
        }

        // Fallback: Cargar diagnóstico previo desde API si existe
        if (periodKey) {
          const diagnosticResponse = await fetch(`/api/diagnostics/${stage}?latest=1&periodKey=${periodKey}`);
          if (diagnosticResponse.ok) {
            const diagnosticData = await diagnosticResponse.json();
            if (diagnosticData.results && diagnosticData.results.length > 0) {
              const latestResult = diagnosticData.results[0] as DiagnosticResult;
              setRecommendedGoalIds(latestResult.recommendedGoalIds);
              setHasCompletedDiagnostic(true);
              
              // CRÍTICO: Generar recomendaciones inteligentes con las respuestas guardadas
              if (latestResult.answers && latestResult.answers.length > 0) {
                console.log('🔄 Regenerando recomendaciones desde diagnóstico previo:', latestResult.answers);
                const recommendations = generateSmartRecommendations({
                  stage,
                  answers: latestResult.answers,
                  selectedGoalIds: latestResult.recommendedGoalIds || []
                });
                setSmartRecommendations(recommendations);
              }
              
              setViewMode('results');
            }
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    }

    loadData();
  }, [stage, periodKey, diagnosticStorageLoaded, hasCompletedInStorage, getCompletedDiagnostic]);

  const handleBrújulaComplete = async (answers: DiagnosticAnswer[]) => {
    setLoading(true);
    setError(null);
    try {
      // Guardar respuestas
      setDiagnosticAnswers(answers);

      // Generar recomendaciones inteligentes
      const recommendations = generateSmartRecommendations({
        stage,
        answers,
        profile: profile || undefined,
        selectedGoalIds: recommendedGoalIds
      });

      setSmartRecommendations(recommendations);

      // Extraer IDs de todas las metas recomendadas
      const allRecommendedIds = [
        recommendations.priorityGoal?.id,
        recommendations.complementaryGoal?.id,
        ...recommendations.longitudinalGoals.map(g => g.id),
        ...recommendations.otherRecommendations.map(g => g.id)
      ].filter(Boolean) as string[];

      // Guardar en el servidor
      const response = await fetch(`/api/diagnostics/${stage}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          periodKey,
          answers,
          recommendedGoalIds: allRecommendedIds
        }),
      });

      // 🗄️ GUARDAR EN LOCALSTORAGE (PERSISTENCIA BÁSICA)
      const diagnosticData = {
        stage,
        answers,
        recommendedGoalIds: allRecommendedIds,
        recommendations,
        periodKey,
        completedAt: new Date().toISOString()
      };

      
      markDiagnosticCompleted(stage, diagnosticData);
      console.log('💾 Guardado en localStorage:', diagnosticData);

      // 🗄️ SIEMPRE ACTUALIZAR EL ESTADO LOCAL (persistencia básica funciona)
      setRecommendedGoalIds(allRecommendedIds);
      setHasCompletedDiagnostic(true);
      setViewMode('results');
      setRightTab('results');

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "¡Diagnóstico completado!",
          description: "Tus respuestas y recomendaciones se han guardado correctamente.",
        });
      } else {
        // API falló, pero localStorage funcionó
        console.warn('⚠️ API falló, pero datos guardados en localStorage:', {
          status: response.status,
          statusText: response.statusText
        });
        
        toast({
          title: "¡Diagnóstico completado!",
          description: "Tus respuestas se guardaron localmente. Los datos se sincronizarán cuando sea posible.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error submitting diagnostic:', error);
      
      // 🗄️ SIEMPRE MOSTRAR RECOMENDACIONES (localStorage ya funcionó)
      setRecommendedGoalIds(allRecommendedIds);
      setHasCompletedDiagnostic(true);
      setViewMode('results');
      setRightTab('results');
      
      // Mostrar toast informativo
      toast({
        title: "¡Diagnóstico completado!",
        description: "Hubo un problema de conexión, pero tus datos se guardaron localmente.",
        variant: "default"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectGoal = async (goalId: string) => {
    try {
      console.log('🎯 DEBUG handleSelectGoal - Iniciando:', {
        goalId,
        currentRecommendedGoalIds: recommendedGoalIds,
        alreadySelected: recommendedGoalIds.includes(goalId)
      });

      // Verificar si la meta ya fue seleccionada
      if (recommendedGoalIds.includes(goalId)) {
        console.log('⚠️ Meta ya seleccionada en recommendedGoalIds:', goalId);
        // No retornar, permitir que se guarde en selectedGoals
      }

      // Verificar si la meta ya fue seleccionada en selectedGoals
      if (selectedGoals.includes(goalId)) {
        console.log('⚠️ Meta ya seleccionada en selectedGoals:', goalId);
        toast({
          title: 'Meta ya seleccionada',
          description: 'Esta meta ya está en tu plan de vida.',
          variant: 'default',
          duration: 3000,
        });
        return;
      }

      // 🗄️ SIEMPRE GUARDAR EN LOCALSTORAGE (persistencia básica funciona)
      setRecommendedGoalIds(prev => [...prev, goalId]);
      addSelectedGoal(goalId);
      console.log('💾 Meta guardada en localStorage:', {
        goalId,
        newRecommendedGoalIds: [...recommendedGoalIds, goalId],
        selectedGoalsAfterAdd: [...selectedGoals, goalId]
      });

      const response = await fetch('/api/goals/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ goalId }),
      });

      if (response.ok) {
        // API funcionó correctamente
        toast({
          title: '¡Meta guardada exitosamente! 🎯',
          description: 'La meta ha sido agregada a tu plan de vida.',
          duration: 3000,
        });
      } else {
        // API falló, pero localStorage funcionó
        console.warn('⚠️ API de metas falló, pero guardado en localStorage:', {
          status: response.status,
          goalId
        });
        
        toast({
          title: '¡Meta guardada localmente! 🎯',
          description: 'La meta se guardó localmente y se sincronizará cuando sea posible.',
          duration: 3000,
        });
      }

      console.log('Meta guardada exitosamente:', goalId);
    } catch (error) {
      console.error('Error al guardar meta:', error);
      
      // 🗄️ SIEMPRE MOSTRAR ÉXITO (localStorage ya funcionó)
      toast({
        title: '¡Meta guardada localmente! 🎯',
        description: 'Hubo un problema de conexión, pero la meta se guardó localmente.',
        duration: 3000,
      });
    }
  };

  const handleGenerateGoal = () => {
    setShowInspirationModal(true);
  };

  const handleOpenTemplate = () => {
    // Redirigir a crear meta desde plantilla vacía
    router.push('/goals/new');
  };

  const getStageLabel = (stage: SemesterStage) => {
    switch (stage) {
      case 'exploracion': return 'Cambio de Etapa';
      case 'enfoque': return 'Cambio de Etapa';
      case 'especializacion': return 'Cierre de Mentoría';
      case 'graduacion': return 'Cierre de Mentoría';
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
            stage={stage}
            onGenerateGoal={handleGenerateGoal}
            hasCompletedDiagnostic={hasCompletedDiagnostic}
            recommendedGoalIds={recommendedGoalIds}
            onSelectGoal={handleSelectGoal}
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
                {stage === 'especializacion' || stage === 'graduacion' ? 'Planea tus metas como futuro EXATEC' : `Brújula de ${getStageLabel(stage)}`}
              </CardTitle>
              <CardDescription className="text-base">
                {stage === 'especializacion' || stage === 'graduacion' 
                  ? 'Completa este diagnóstico para validar tu preparación profesional y definir metas para tu transición como EXATEC.'
                  : 'Completa un diagnóstico rápido para recibir recomendaciones personalizadas basadas en tu etapa académica.'}
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
                {stage === 'especializacion' || stage === 'graduacion' ? 'Iniciar Cierre de Mentoría' : `Iniciar Brújula de ${getStageLabel(stage)}`}
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

        {viewMode === 'results' && smartRecommendations && (
          <>
            {console.log('🎯 RENDERIZANDO SmartRecommendationsView:', smartRecommendations)}
            <SmartRecommendationsView
              recommendations={smartRecommendations}
              stage={stage}
              onSelectGoal={handleSelectGoal}
              onNewDiagnostic={() => setViewMode('brújula')}
            />
          </>
        )}

        {viewMode === 'results' && !smartRecommendations && (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Diagnóstico completado
              </CardTitle>
              <CardDescription>
                {stage === 'especializacion' || stage === 'graduacion' 
                  ? 'Has completado tu Cierre de Mentoría'
                  : `Has completado la Brújula de ${getStageLabel(stage)}`}
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
          stage={stage}
          onGenerateGoal={handleGenerateGoal}
          hasCompletedDiagnostic={hasCompletedDiagnostic}
          recommendedGoalIds={recommendedGoalIds}
          onSelectGoal={handleSelectGoal}
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

      {/* Modal de inspiración */}
      <InspirationModal
        isOpen={showInspirationModal}
        onClose={() => setShowInspirationModal(false)}
        stage={stage}
        onSelectGoal={handleSelectGoal}
      />
    </div>
  );
}
