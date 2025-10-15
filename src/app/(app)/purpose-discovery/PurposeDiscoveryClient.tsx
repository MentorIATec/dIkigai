'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Compass, 
  Heart, 
  Lightbulb, 
  Target, 
  Star,
  ArrowRight,
  Play,
  BookOpen,
  Trophy,
  Sparkles,
  Users,
  Clock
} from 'lucide-react';
import { PurposeDiscoveryTest } from '@/components/purpose-discovery-test';
import { PurposeInsightsView } from '@/components/purpose-insights-view';
import { 
  type PurposeAnswer, 
  type PurposeProfile,
  PURPOSE_QUESTIONS,
  calculateProgress,
  determineStage
} from '@/lib/purpose-discovery';
import { useToast } from '@/hooks/use-toast';

type ViewState = 'intro' | 'test' | 'results';

export function PurposeDiscoveryClient() {
  const [currentView, setCurrentView] = useState<ViewState>('intro');
  const [purposeProfile, setPurposeProfile] = useState<PurposeProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Cargar perfil existente al montar
  useEffect(() => {
    loadExistingProfile();
  }, []);

  const loadExistingProfile = async () => {
    try {
      const response = await fetch('/api/purpose-discovery');
      if (response.ok) {
        const data = await response.json();
        if (data.profile) {
          setPurposeProfile(data.profile);
          if (data.profile.answers.length > 0) {
            setCurrentView('results');
          }
        }
      }
    } catch (error) {
      console.error('Error loading purpose profile:', error);
    }
  };

  const savePurposeProfile = async (answers: PurposeAnswer[], progress: number, stage: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/purpose-discovery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers,
          progress,
          stage,
          lastUpdated: new Date().toISOString()
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPurposeProfile(data.profile);
        setCurrentView('results');
        
        toast({
          title: '¡Perfil guardado!',
          description: 'Tu perfil de propósito ha sido actualizado.',
        });
      } else {
        throw new Error('Error saving profile');
      }
    } catch (error) {
      console.error('Error saving purpose profile:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar tu perfil. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const savePurposeStatement = async (statement: string) => {
    if (!purposeProfile) return;

    try {
      const response = await fetch('/api/purpose-discovery', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          purposeStatement: statement,
          lastUpdated: new Date().toISOString()
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPurposeProfile(data.profile);
        
        toast({
          title: '¡Declaración guardada!',
          description: 'Tu declaración de propósito ha sido actualizada.',
        });
      }
    } catch (error) {
      console.error('Error saving purpose statement:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar tu declaración.',
        variant: 'destructive',
      });
    }
  };

  const handleTestComplete = (answers: PurposeAnswer[], progress: number, stage: string) => {
    savePurposeProfile(answers, progress, stage);
  };

  const handleRestartTest = () => {
    setPurposeProfile(null);
    setCurrentView('intro');
  };

  if (currentView === 'test') {
    return (
      <PurposeDiscoveryTest
        onComplete={handleTestComplete}
        onBack={() => setCurrentView('intro')}
        existingAnswers={purposeProfile?.answers || []}
      />
    );
  }

  if (currentView === 'results' && purposeProfile) {
    return (
      <PurposeInsightsView
        answers={purposeProfile.answers}
        progress={purposeProfile.completionProgress}
        stage={purposeProfile.currentStage}
        onRestart={handleRestartTest}
        onSavePurpose={savePurposeStatement}
      />
    );
  }

  // Vista introductoria
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <Compass className="h-20 w-20 text-primary" />
              <Sparkles className="h-8 w-8 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Descubrimiento del Propósito
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Un viaje guiado de autoconocimiento que te ayudará a descubrir tu propósito de vida 
              a través de preguntas reflexivas y insights personalizados.
            </p>
          </div>

          {purposeProfile && purposeProfile.answers.length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Trophy className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-800">Progreso Actual</span>
              </div>
              <div className="flex items-center justify-center space-x-4 text-sm">
                <Badge variant="outline">{purposeProfile.answers.length} respuestas</Badge>
                <Badge variant="outline">{purposeProfile.completionProgress}% completado</Badge>
                <Badge variant="outline">{purposeProfile.currentStage}</Badge>
              </div>
              {purposeProfile.purposeStatement && (
                <div className="mt-4 p-3 bg-white/50 rounded-lg">
                  <p className="text-sm text-green-800 italic">"{purposeProfile.purposeStatement}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Características principales */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Heart className="h-12 w-12 text-red-500" />
              </div>
              <CardTitle className="text-lg">Reflexión Profunda</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Preguntas cuidadosamente diseñadas para evocar autoconocimiento genuino 
                y descubrir lo que realmente te motiva.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Lightbulb className="h-12 w-12 text-yellow-500" />
              </div>
              <CardTitle className="text-lg">Insights Personalizados</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Análisis inteligente de tus respuestas para generar insights únicos 
                y pasos de acción específicos para tu crecimiento.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Target className="h-12 w-12 text-blue-500" />
              </div>
              <CardTitle className="text-lg">Propósito Claro</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Desarrolla una declaración de propósito personalizada que te guíe 
                en tus decisiones y metas futuras.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Proceso paso a paso */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Cómo Funciona
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-blue-600">1</span>
                  </div>
                </div>
                <h3 className="font-semibold">Explora</h3>
                <p className="text-sm text-muted-foreground">
                  Responde preguntas reflexivas sobre tus valores, pasiones y visión
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-green-600">2</span>
                  </div>
                </div>
                <h3 className="font-semibold">Descubre</h3>
                <p className="text-sm text-muted-foreground">
                  Recibe insights personalizados basados en tus respuestas
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-yellow-600">3</span>
                  </div>
                </div>
                <h3 className="font-semibold">Define</h3>
                <p className="text-sm text-muted-foreground">
                  Crea tu declaración de propósito personalizada
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-purple-600">4</span>
                  </div>
                </div>
                <h3 className="font-semibold">Actúa</h3>
                <p className="text-sm text-muted-foreground">
                  Recibe pasos concretos para vivir tu propósito
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{PURPOSE_QUESTIONS.length}</div>
              <div className="text-sm text-muted-foreground">Preguntas Curadas</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">8</div>
              <div className="text-sm text-muted-foreground">Categorías</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">15-20</div>
              <div className="text-sm text-muted-foreground">Minutos</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">100%</div>
              <div className="text-sm text-muted-foreground">Gratuito</div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="pt-8">
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">¿Listo para Descubrir Tu Propósito?</h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Comienza tu viaje de autoconocimiento ahora. No hay respuestas correctas o incorrectas, 
                  solo tu verdad más profunda esperando ser descubierta.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => setCurrentView('test')}
                  className="flex items-center space-x-2"
                >
                  <Play className="h-5 w-5" />
                  <span>Iniciar Test</span>
                </Button>
                
                {purposeProfile && purposeProfile.answers.length > 0 && (
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => setCurrentView('results')}
                    className="flex items-center space-x-2"
                  >
                    <ArrowRight className="h-5 w-5" />
                    <span>Ver Mis Resultados</span>
                  </Button>
                )}
              </div>
              
              <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>15-20 minutos</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>Completamente privado</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4" />
                  <span>Sin costo</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
