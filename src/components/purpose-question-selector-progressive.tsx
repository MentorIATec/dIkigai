'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Target, 
  Briefcase, 
  Star, 
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Clock,
  Lightbulb
} from 'lucide-react';
import { 
  PURPOSE_QUESTIONS, 
  type PurposeQuestion, 
  type PurposeCategory 
} from '@/lib/purpose-discovery';
import { cn } from '@/lib/utils';

interface PurposeQuestionSelectorProgressiveProps {
  onQuestionsSelected: (selectedQuestions: PurposeQuestion[]) => void;
  onBack: () => void;
}

const CATEGORY_ICONS = {
  pasion: Heart,
  mision: Target,
  vocacion: Briefcase,
  profesion: Star,
  carrera: GraduationCap
};

const CATEGORY_COLORS = {
  pasion: 'border-red-200 bg-red-50',
  mision: 'border-green-200 bg-green-50',
  vocacion: 'border-blue-200 bg-blue-50',
  profesion: 'border-purple-200 bg-purple-50',
  carrera: 'border-orange-200 bg-orange-50'
};

const DEPTH_COLORS = {
  easy: 'bg-green-100 text-green-800 border-green-200',
  intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  challenging: 'bg-red-100 text-red-800 border-red-200'
};

const DEPTH_LABELS = {
  easy: '🟢 Fácil',
  intermediate: '🟡 Intermedia',
  challenging: '🔴 Introspectiva'
};

const CATEGORY_ORDER: PurposeCategory[] = ['pasion', 'mision', 'vocacion', 'profesion'];

export function PurposeQuestionSelectorProgressive({ onQuestionsSelected, onBack }: PurposeQuestionSelectorProgressiveProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedQuestions, setSelectedQuestions] = useState<Record<PurposeCategory, string | null>>({
    pasion: null,
    mision: null,
    vocacion: null,
    profesion: null,
    carrera: null
  });
  const [showCarreraOption, setShowCarreraOption] = useState(false);
  const [includeCarrera, setIncludeCarrera] = useState(false);

  const currentCategory = showCarreraOption ? 'carrera' : CATEGORY_ORDER[currentStep];
  const currentQuestions = PURPOSE_QUESTIONS.filter(q => q.category === currentCategory);
  const isLastStep = currentStep >= CATEGORY_ORDER.length - 1;
  const selectedCount = Object.values(selectedQuestions).filter(Boolean).length;

  const handleQuestionSelect = (questionId: string) => {
    setSelectedQuestions(prev => ({
      ...prev,
      [currentCategory]: prev[currentCategory] === questionId ? null : questionId
    }));
    
    // Si selecciona una pregunta de carrera, marcar includeCarrera como true
    if (currentCategory === 'carrera') {
      setIncludeCarrera(true);
    }
  };

  const handleNext = () => {
    if (showCarreraOption) {
      // Si está en la pantalla de carrera, finalizar
      const questions: PurposeQuestion[] = [];
      
      console.log('Selected questions:', selectedQuestions);
      console.log('Include carrera:', includeCarrera);
      
      Object.entries(selectedQuestions).forEach(([category, questionId]) => {
        console.log(`Processing category: ${category}, questionId: ${questionId}`);
        if (questionId) {
          // Incluir todas las preguntas principales (no carrera)
          if (category !== 'carrera') {
            const question = PURPOSE_QUESTIONS.find(q => q.id === questionId);
            if (question) {
              console.log(`Adding main question: ${question.id}`);
              questions.push(question);
            }
          }
        }
      });
      
      // Incluir pregunta de carrera por separado si fue seleccionada
      if (includeCarrera && selectedQuestions.carrera) {
        const carreraQuestion = PURPOSE_QUESTIONS.find(q => q.id === selectedQuestions.carrera);
        if (carreraQuestion) {
          console.log(`Adding carrera question: ${carreraQuestion.id}`);
          questions.push(carreraQuestion);
        }
      }

      console.log('Final questions array:', questions.map(q => q.id));
      onQuestionsSelected(questions);
    } else if (isLastStep) {
      // Si completó las 4 dimensiones, mostrar opción de carrera
      setShowCarreraOption(true);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (showCarreraOption) {
      // Si está en carrera, volver a la última dimensión
      setShowCarreraOption(false);
    } else if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const canProceed = () => {
    if (showCarreraOption) {
      // En la pantalla de carrera, puede proceder sin seleccionar (es opcional)
      return true;
    }
    return selectedQuestions[currentCategory] !== null;
  };

  const handleSkipCarrera = () => {
    setIncludeCarrera(false);
    handleNext();
  };

  const handleIncludeCarrera = () => {
    setIncludeCarrera(true);
    // Si ya hay una pregunta de carrera seleccionada, proceder
    if (selectedQuestions.carrera) {
      handleNext();
    }
  };

  const getCategoryTitle = (category: PurposeCategory) => {
    switch (category) {
      case 'pasion': return 'Pasión';
      case 'mision': return 'Misión';
      case 'vocacion': return 'Vocación';
      case 'profesion': return 'Profesión';
      case 'carrera': return 'Carrera';
      default: return category;
    }
  };

  const getCategoryDescription = (category: PurposeCategory) => {
    switch (category) {
      case 'pasion': return 'Lo que amas hacer y te energiza';
      case 'mision': return 'Lo que el mundo necesita y te motiva';
      case 'vocacion': return 'Aquello por lo que te pudieran pagar';
      case 'profesion': return 'En lo que eres bueno y reconocido';
      case 'carrera': return 'Conexión con decisiones profesionales';
      default: return '';
    }
  };

  const Icon = CATEGORY_ICONS[currentCategory];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header con progreso */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Descubre tu Ikigai
          </CardTitle>
          <CardDescription className="text-lg">
            {showCarreraOption ? 'Pregunta opcional sobre tu carrera' : 'Vamos a explorar cada dimensión paso a paso'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {showCarreraOption ? (
                  'Paso 5 (Opcional): Carrera'
                ) : (
                  `Paso ${currentStep + 1} de ${CATEGORY_ORDER.length}: ${getCategoryTitle(currentCategory)}`
                )}
              </span>
              <span className="text-sm text-muted-foreground">
                {selectedCount} preguntas seleccionadas
              </span>
            </div>
            <Progress 
              value={showCarreraOption ? 100 : ((currentStep + 1) / CATEGORY_ORDER.length) * 100} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Dimensión actual */}
      <Card className={cn(CATEGORY_COLORS[currentCategory])}>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Icon className="h-6 w-6 text-gray-700" />
            <div>
              <CardTitle className="text-xl capitalize">
                {getCategoryTitle(currentCategory)}
              </CardTitle>
              <CardDescription>
                {showCarreraOption ? 'Conecta tu propósito con decisiones profesionales' : getCategoryDescription(currentCategory)}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        {/* Mensaje especial para carrera */}
        {showCarreraOption && (
          <CardContent className="pb-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Lightbulb className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-orange-800 mb-1">
                    Esta pregunta es opcional
                  </p>
                  <p className="text-sm text-orange-700">
                    Puedes elegir una pregunta para reflexionar sobre cómo tu Ikigai se conecta con tu carrera profesional, o puedes omitirla y continuar directamente con el test.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        )}
        <CardContent className="space-y-4">
          <div className="bg-white/60 p-4 rounded-lg border">
            <div className="flex items-center space-x-2 mb-3">
              <Lightbulb className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Elige una pregunta que te resuene más:
              </span>
            </div>
            
            <div className="space-y-3">
              {currentQuestions.map((question) => {
                const isSelected = selectedQuestions[currentCategory] === question.id;
                
                return (
                  <Card
                    key={question.id}
                    className={cn(
                      'cursor-pointer transition-all duration-200 hover:shadow-md',
                      isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    )}
                    onClick={() => handleQuestionSelect(question.id)}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className={cn('text-xs', DEPTH_COLORS[question.depth])}>
                              {DEPTH_LABELS[question.depth]}
                            </Badge>
                          </div>
                          <h4 className="font-medium text-sm mb-2">{question.title}</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {question.basePrompt}
                          </p>
                        </div>
                        {isSelected && (
                          <CheckCircle className="h-5 w-5 text-blue-600 ml-3 flex-shrink-0" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controles de navegación */}
      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={currentStep === 0 && !showCarreraOption ? onBack : handlePrevious}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{currentStep === 0 && !showCarreraOption ? 'Volver' : 'Anterior'}</span>
        </Button>
        
        <div className="flex items-center space-x-4">
          {showCarreraOption && (
            <Button 
              variant="outline"
              onClick={handleSkipCarrera}
              className="flex items-center space-x-2 text-orange-600 border-orange-200 hover:bg-orange-50"
            >
              <span>Omitir esta pregunta</span>
            </Button>
          )}
          
          {!isLastStep && !showCarreraOption && (
            <div className="text-sm text-muted-foreground">
              Siguiente: {getCategoryTitle(CATEGORY_ORDER[currentStep + 1])}
            </div>
          )}
          
          <Button 
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex items-center space-x-2"
          >
            <span>{showCarreraOption ? 'Finalizar Selección' : (isLastStep ? 'Continuar' : 'Continuar')}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Indicadores de progreso */}
      <div className="flex justify-center space-x-2 flex-wrap gap-2">
        {CATEGORY_ORDER.map((category, index) => {
          const Icon = CATEGORY_ICONS[category];
          const isCompleted = selectedQuestions[category] !== null;
          const isCurrent = index === currentStep && !showCarreraOption;
          
          return (
            <div
              key={category}
              className={cn(
                'flex items-center space-x-1 px-2 py-1 rounded-full text-xs',
                isCompleted ? 'bg-green-100 text-green-800' :
                isCurrent ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-600'
              )}
            >
              <Icon className="h-3 w-3" />
              <span className="hidden sm:inline">{getCategoryTitle(category)}</span>
            </div>
          );
        })}
        
        {/* Indicador de carrera */}
        <div
          className={cn(
            'flex items-center space-x-1 px-2 py-1 rounded-full text-xs',
            includeCarrera ? 'bg-orange-100 text-orange-800' :
            showCarreraOption ? 'bg-orange-100 text-orange-800 border-2 border-orange-400' :
            'bg-gray-100 text-gray-600'
          )}
        >
          <GraduationCap className="h-3 w-3" />
          <span className="hidden sm:inline">Carrera</span>
        </div>
      </div>
    </div>
  );
}
