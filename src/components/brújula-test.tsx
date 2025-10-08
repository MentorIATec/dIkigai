'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ArrowLeft, CheckCircle, Compass } from 'lucide-react';
import { BRUJULA_TESTS, type BrujulaTestKey } from '@/lib/brújula-tests';
import type { StudentProfile } from '@/lib/types';
import type { DiagnosticAnswer } from '@/lib/types.goal-templates';

interface BrujulaTestProps {
  stage: BrujulaTestKey;
  onComplete: (answers: DiagnosticAnswer[]) => void;
  onBack: () => void;
}

export function BrujulaTest({ stage, onComplete, onBack }: BrujulaTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<DiagnosticAnswer[]>([]);
  const [loading, setLoading] = useState(false);

  const test = BRUJULA_TESTS[stage];
  const progress = ((currentQuestion + 1) / test.questions.length) * 100;

  const handleAnswerChange = (questionKey: string, score: number) => {
    const newAnswers = [...answers];
    const existingIndex = newAnswers.findIndex(a => a.key === questionKey);
    
    if (existingIndex >= 0) {
      newAnswers[existingIndex] = { key: questionKey, score };
    } else {
      newAnswers.push({ key: questionKey, score });
    }
    
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      onComplete(answers);
    } finally {
      setLoading(false);
    }
  };

  const currentQ = test.questions[currentQuestion];
  const currentAnswer = answers.find(a => a.key === currentQ.key);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Compass className="h-6 w-6 text-blue-600" />
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            {test.stageLabel}
          </Badge>
        </div>
        <CardTitle className="font-headline text-2xl">
          {test.title}
        </CardTitle>
        <CardDescription className="text-base">
          {test.description}
        </CardDescription>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Pregunta {currentQuestion + 1} de {test.questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 leading-relaxed">
            {currentQ.title}
          </h3>
        </div>

        <RadioGroup
          value={currentAnswer?.score.toString() || ''}
          onValueChange={(value) => handleAnswerChange(currentQ.key, parseInt(value))}
          className="space-y-3"
        >
          {currentQ.options.map((option, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <RadioGroupItem value={(index + 1).toString()} id={`${currentQ.key}-${index}`} className="mt-1" />
              <Label htmlFor={`${currentQ.key}-${index}`} className="text-sm cursor-pointer flex-1 leading-relaxed">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={currentQuestion === 0 ? onBack : () => setCurrentQuestion(currentQuestion - 1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {currentQuestion === 0 ? 'Volver' : 'Anterior'}
          </Button>
          <Button
            onClick={handleNext}
            disabled={!currentAnswer || loading}
            className="ml-auto"
          >
            {loading ? 'Procesando...' : currentQuestion === test.questions.length - 1 ? 'Finalizar Test' : 'Siguiente'}
            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
