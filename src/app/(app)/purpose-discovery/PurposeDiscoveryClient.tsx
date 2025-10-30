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
  Clock,
  Briefcase
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
              Descubre tu razón de ser a través de 4 dimensiones fundamentales
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
          <Card className="text-center border-red-200 bg-gradient-to-br from-red-50 to-red-100 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                  <Heart className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-lg text-red-800">🔥 Pasión</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-sm text-red-700">
                Lo que amas hacer y te energiza
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-green-200 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <Target className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-lg text-green-800">🌍 Misión</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-sm text-green-700">
                Lo que el mundo necesita de ti
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                  <Briefcase className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-lg text-blue-800">💼 Vocación</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-sm text-blue-700">
                Aquello por lo que te pagarían
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center">
                  <Star className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-lg text-purple-800">⭐ Profesión</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-sm text-purple-700">
                En lo que destacas y aportas valor
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Beneficios del Test */}
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="text-center text-xl">¿Por qué hacer este test?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <Lightbulb className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg">Autoconocimiento</h3>
                <p className="text-sm text-muted-foreground">
                  Conecta con tus verdaderas motivaciones
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg">Claridad de Propósito</h3>
                <p className="text-sm text-muted-foreground">
                  Define tu contribución al mundo
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg">Toma de Decisiones</h3>
                <p className="text-sm text-muted-foreground">
                  Alinea tus decisiones con tu propósito
                </p>
              </div>
            </div>
          </CardContent>
        </Card>



        {/* Call to Action simplificado */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="pt-8">
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ¿Listo para Descubrir Tu Ikigai?
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  Comienza tu viaje hacia encontrar tu "razón de ser". Conecta lo que amas, 
                  lo que el mundo necesita, aquello por lo que te pagarían y en lo que eres bueno.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => setCurrentView('selector')}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
                >
                  <Play className="h-5 w-5" />
                  <span>Comenzar mi viaje de autoconocimiento</span>
                </Button>
                
                {purposeProfile && purposeProfile.answers.length > 0 && (
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => setCurrentView('results')}
                    className="flex items-center space-x-2 border-2 px-8 py-3 text-lg"
                  >
                    <ArrowRight className="h-5 w-5" />
                    <span>Ver Mis Resultados</span>
                  </Button>
                )}
              </div>
              
              <div className="flex items-center justify-center text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>15-20 minutos</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
