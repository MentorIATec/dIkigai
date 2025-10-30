'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Target, 
  Briefcase, 
  Star, 
  GraduationCap,
  CheckCircle,
  Edit,
  ArrowRight
} from 'lucide-react';
import { 
  type PurposeQuestion, 
  type PurposeCategory 
} from '@/lib/purpose-discovery';
import { cn } from '@/lib/utils';

interface PurposeQuestionsReviewProps {
  selectedQuestions: PurposeQuestion[];
  onConfirm: () => void;
  onEdit: () => void;
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

export function PurposeQuestionsReview({ selectedQuestions, onConfirm, onEdit }: PurposeQuestionsReviewProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Revisa tu Selección
          </CardTitle>
          <CardDescription className="text-lg">
            Estas son las preguntas que responderás para descubrir tu Ikigai
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800 mb-1">
                  Todo listo para comenzar
                </p>
                <p className="text-sm text-blue-700">
                  Has seleccionado {selectedQuestions.length} preguntas. Puedes editarlas antes de continuar o comenzar el test ahora.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de preguntas seleccionadas */}
      <div className="space-y-4">
        {selectedQuestions.map((question, index) => {
          const Icon = CATEGORY_ICONS[question.category];
          
          return (
            <Card key={question.id} className={cn(CATEGORY_COLORS[question.category])}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/80 text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Icon className="h-4 w-4 text-gray-700" />
                        <span className="text-xs font-medium text-gray-600 uppercase">
                          {question.category === 'pasion' ? 'Pasión' : 
                           question.category === 'mision' ? 'Misión' :
                           question.category === 'vocacion' ? 'Vocación' : 
                           question.category === 'profesion' ? 'Profesión' : 'Carrera'}
                        </span>
                      </div>
                      <CardTitle className="text-lg">{question.title}</CardTitle>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {question.depth === 'easy' ? '🟢 Fácil' : 
                     question.depth === 'intermediate' ? '🟡 Intermedia' : '🔴 Introspectiva'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {question.basePrompt}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Controles */}
      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={onEdit}
          className="flex items-center space-x-2"
        >
          <Edit className="h-4 w-4" />
          <span>Editar Selección</span>
        </Button>
        
        <Button 
          onClick={onConfirm}
          className="flex items-center space-x-2"
        >
          <span>Comenzar Test</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
