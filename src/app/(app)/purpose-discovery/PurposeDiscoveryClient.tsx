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
import { PurposeQuestionSelectorProgressive } from '@/components/purpose-question-selector-progressive';
import { 
  type PurposeAnswer, 
  type PurposeProfile,
  PURPOSE_QUESTIONS,
  calculateProgress,
  determineStage
} from '@/lib/purpose-discovery';
import { useToast } from '@/hooks/use-toast';

type ViewState = 'intro' | 'selector' | 'test' | 'results';

export function PurposeDiscoveryClient() {
  const [currentView, setCurrentView] = useState<ViewState>('intro');
  const [purposeProfile, setPurposeProfile] = useState<PurposeProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<any[]>([]);
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

  const handleQuestionsSelected = (questions: any[]) => {
    setSelectedQuestions(questions);
    setCurrentView('test');
  };

  const handleBackToSelector = () => {
    setCurrentView('selector');
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

  if (currentView === 'selector') {
    return (
      <PurposeQuestionSelectorProgressive
        onQuestionsSelected={handleQuestionsSelected}
        onBack={() => setCurrentView('intro')}
      />
    );
  }

  if (currentView === 'test') {
    return (
      <PurposeDiscoveryTest
        onComplete={handleTestComplete}
        onBack={handleBackToSelector}
        existingAnswers={purposeProfile?.answers || []}
        selectedQuestions={selectedQuestions}
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
              Descubre tu Ikigai
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Un viaje guiado basado en el concepto japonés del Ikigai - tu "razón de ser" - 
              que conecta lo que amas, lo que el mundo necesita, aquello por lo que te pagarían y en lo que eres bueno.
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

        {/* Las 4 dimensiones del Ikigai */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center border-red-200 bg-red-50">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Heart className="h-12 w-12 text-red-500" />
              </div>
              <CardTitle className="text-lg text-red-800">🔥 Pasión</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-red-700">
                Lo que amas hacer y te hace sentir vivo y energizado.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-green-200 bg-green-50">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Target className="h-12 w-12 text-green-500" />
              </div>
              <CardTitle className="text-lg text-green-800">🌍 Misión</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-green-700">
                Lo que el mundo necesita y te motiva a crear impacto positivo.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Lightbulb className="h-12 w-12 text-blue-500" />
              </div>
              <CardTitle className="text-lg text-blue-800">💼 Vocación</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-blue-700">
                Aquello por lo que te pudieran pagar y tu trabajo ideal.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-purple-200 bg-purple-50">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Star className="h-12 w-12 text-purple-500" />
              </div>
              <CardTitle className="text-lg text-purple-800">⭐ Profesión</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-purple-700">
                En lo que eres bueno y donde otros reconocen tu expertise.
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
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">🔥</span>
                  </div>
                </div>
                <h3 className="font-semibold">Pasión</h3>
                <p className="text-sm text-muted-foreground">
                  Descubre lo que amas hacer y te energiza
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">🌍</span>
                  </div>
                </div>
                <h3 className="font-semibold">Misión</h3>
                <p className="text-sm text-muted-foreground">
                  Identifica cómo quieres impactar al mundo
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">💼</span>
                  </div>
                </div>
                <h3 className="font-semibold">Vocación</h3>
                <p className="text-sm text-muted-foreground">
                  Define tu trabajo ideal y ambiente profesional
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">⭐</span>
                  </div>
                </div>
                <h3 className="font-semibold">Profesión</h3>
                <p className="text-sm text-muted-foreground">
                  Reconoce tus fortalezas y áreas de expertise
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
              <div className="text-sm text-muted-foreground">Preguntas Ikigai</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">4</div>
              <div className="text-sm text-muted-foreground">Dimensiones</div>
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
                <h2 className="text-2xl font-bold">¿Listo para Descubrir Tu Ikigai?</h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Comienza tu viaje hacia encontrar tu "razón de ser". Conecta lo que amas, 
                  lo que el mundo necesita, aquello por lo que te pagarían y en lo que eres bueno.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => setCurrentView('selector')}
                  className="flex items-center space-x-2"
                >
                  <Play className="h-5 w-5" />
                  <span>Descubrir mi Ikigai</span>
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
