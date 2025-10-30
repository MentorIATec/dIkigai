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
  CheckCircle,
  Clock
} from 'lucide-react';
import { 
  PURPOSE_QUESTIONS, 
  type PurposeQuestion, 
  type PurposeCategory 
} from '@/lib/purpose-discovery';
import { cn } from '@/lib/utils';

interface PurposeQuestionSelectorProps {
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
  challenging: '🔴 Retadora'
};

export function PurposeQuestionSelector({ onQuestionsSelected, onBack }: PurposeQuestionSelectorProps) {
  const [selectedQuestions, setSelectedQuestions] = useState<Record<PurposeCategory, string | null>>({
    pasion: null,
    mision: null,
    vocacion: null,
    profesion: null,
    carrera: null
  });

  const handleQuestionSelect = (category: PurposeCategory, questionId: string) => {
    setSelectedQuestions(prev => ({
      ...prev,
      [category]: prev[category] === questionId ? null : questionId
    }));
  };

  const getSelectedCount = () => {
    return Object.values(selectedQuestions).filter(Boolean).length;
  };

  const getRequiredCount = () => {
    return 4; // Las 4 dimensiones principales del Ikigai
  };

  const isCarreraSelected = () => {
    return selectedQuestions.carrera !== null;
  };

  const canProceed = () => {
    return getSelectedCount() >= getRequiredCount();
  };

  const handleContinue = () => {
    const questions: PurposeQuestion[] = [];
    
    Object.entries(selectedQuestions).forEach(([category, questionId]) => {
      if (questionId && category !== 'carrera') {
        const question = PURPOSE_QUESTIONS.find(q => q.id === questionId);
        if (question) questions.push(question);
      }
    });

    // Agregar pregunta de carrera si fue seleccionada
    if (selectedQuestions.carrera) {
      const carreraQuestion = PURPOSE_QUESTIONS.find(q => q.id === selectedQuestions.carrera);
      if (carreraQuestion) questions.push(carreraQuestion);
    }

    onQuestionsSelected(questions);
  };

  const getQuestionsByCategory = (category: PurposeCategory) => {
    return PURPOSE_QUESTIONS.filter(q => q.category === category);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Personaliza tu Reflexión
          </CardTitle>
          <CardDescription className="text-lg">
            Elige las preguntas que más te resuenen para descubrir tu Ikigai
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progreso de selección</span>
              <span className="text-sm text-muted-foreground">
                {getSelectedCount()} de {getRequiredCount()} preguntas principales
                {isCarreraSelected() && ' + carrera'}
              </span>
            </div>
            <Progress 
              value={(getSelectedCount() / getRequiredCount()) * 100} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Instrucciones */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800 font-medium">
                Instrucciones:
              </p>
              <ul className="text-sm text-blue-700 mt-1 space-y-1">
                <li>• Selecciona <strong>1 pregunta</strong> de cada dimensión principal del Ikigai</li>
                <li>• La sección de carrera es <strong>opcional</strong> pero recomendada</li>
                <li>• Las etiquetas indican el nivel de profundidad de reflexión</li>
                <li>• No hay respuestas correctas o incorrectas</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preguntas por categoría */}
      <div className="space-y-6">
        {(['pasion', 'mision', 'vocacion', 'profesion'] as PurposeCategory[]).map((category) => {
          const Icon = CATEGORY_ICONS[category];
          const questions = getQuestionsByCategory(category);
          
          return (
            <Card key={category} className={cn(CATEGORY_COLORS[category])}>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Icon className="h-5 w-5 text-gray-700" />
                  <CardTitle className="text-lg capitalize">
                    {category === 'pasion' ? 'Pasión' : 
                     category === 'mision' ? 'Misión' :
                     category === 'vocacion' ? 'Vocación' : 'Profesión'}
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    Requerido
                  </Badge>
                </div>
                <CardDescription>
                  {category === 'pasion' && 'Lo que amas hacer y te energiza'}
                  {category === 'mision' && 'Lo que el mundo necesita y te motiva'}
                  {category === 'vocacion' && 'Aquello por lo que te pudieran pagar'}
                  {category === 'profesion' && 'En lo que eres bueno y reconocido'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {questions.map((question) => {
                  const isSelected = selectedQuestions[category] === question.id;
                  
                  return (
                    <Card
                      key={question.id}
                      className={cn(
                        'cursor-pointer transition-all duration-200 hover:shadow-md',
                        isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                      )}
                      onClick={() => handleQuestionSelect(category, question.id)}
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge className={cn('text-xs', DEPTH_COLORS[question.depth])}>
                                {DEPTH_LABELS[question.depth]}
                              </Badge>
                              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>~{question.estimatedTime} min</span>
                              </div>
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
              </CardContent>
            </Card>
          );
        })}

        {/* Sección de Carrera (Opcional) */}
        <Card className={CATEGORY_COLORS.carrera}>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-5 w-5 text-gray-700" />
              <CardTitle className="text-lg">Ikigai + Carrera</CardTitle>
              <Badge variant="outline" className="text-xs bg-orange-100 text-orange-800 border-orange-200">
                Opcional
              </Badge>
            </div>
            <CardDescription>
              Conecta tu propósito con decisiones profesionales prácticas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {getQuestionsByCategory('carrera').map((question) => {
              const isSelected = selectedQuestions.carrera === question.id;
              
              return (
                <Card
                  key={question.id}
                  className={cn(
                    'cursor-pointer transition-all duration-200 hover:shadow-md',
                    isSelected ? 'ring-2 ring-orange-500 bg-orange-50' : 'hover:bg-gray-50'
                  )}
                  onClick={() => handleQuestionSelect('carrera', question.id)}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={cn('text-xs', DEPTH_COLORS[question.depth])}>
                            {DEPTH_LABELS[question.depth]}
                          </Badge>
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>~{question.estimatedTime} min</span>
                          </div>
                        </div>
                        <h4 className="font-medium text-sm mb-2">{question.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {question.basePrompt}
                        </p>
                      </div>
                      {isSelected && (
                        <CheckCircle className="h-5 w-5 text-orange-600 ml-3 flex-shrink-0" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Volver
        </Button>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-muted-foreground">
            {getSelectedCount()} preguntas seleccionadas
          </div>
          <Button 
            onClick={handleContinue}
            disabled={!canProceed()}
            className="flex items-center space-x-2"
          >
            <span>Continuar</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
