'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  ArrowLeft, 
  Lightbulb, 
  Heart, 
  Target, 
  Star,
  Sparkles,
  Compass,
  BookOpen,
  Trophy,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  PURPOSE_QUESTIONS, 
  type PurposeQuestion, 
  type PurposeAnswer,
  getRandomQuestions,
  calculateProgress,
  determineStage
} from '@/lib/purpose-discovery';
import { cn } from '@/lib/utils';

interface PurposeDiscoveryTestProps {
  onComplete: (answers: PurposeAnswer[], progress: number, stage: string) => void;
  onBack: () => void;
  existingAnswers?: PurposeAnswer[];
}

interface GamificationState {
  currentStreak: number;
  totalQuestionsAnswered: number;
  categoriesExplored: Set<string>;
  achievements: Achievement[];
  currentLevel: number;
  xp: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  unlockedAt?: Date;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_step',
    title: 'Primer Paso',
    description: 'Completaste tu primera pregunta de propósito',
    icon: <Star className="h-4 w-4" />,
    unlocked: false
  },
  {
    id: 'deep_thinker',
    title: 'Pensador Profundo',
    description: 'Respondiste 5 preguntas reflexivas',
    icon: <Lightbulb className="h-4 w-4" />,
    unlocked: false
  },
  {
    id: 'explorer',
    title: 'Explorador',
    description: 'Exploraste 3 categorías diferentes',
    icon: <Compass className="h-4 w-4" />,
    unlocked: false
  },
  {
    id: 'authentic',
    title: 'Auténtico',
    description: 'Completaste la sección de autoconocimiento',
    icon: <Heart className="h-4 w-4" />,
    unlocked: false
  },
  {
    id: 'visionary',
    title: 'Visionario',
    description: 'Definiste tu visión de futuro',
    icon: <Target className="h-4 w-4" />,
    unlocked: false
  },
  {
    id: 'purpose_master',
    title: 'Maestro del Propósito',
    description: 'Completaste el test completo',
    icon: <Trophy className="h-4 w-4" />,
    unlocked: false
  }
];

const CATEGORY_EMOJIS = {
  autoconocimiento: '🔍',
  valores: '💎',
  pasiones: '🔥',
  talentes: '⭐',
  impacto: '🌍',
  vision_futura: '🚀',
  obstaculos: '⚡',
  recursos: '🛠️'
};

const DIFFICULTY_COLORS = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800'
};

export function PurposeDiscoveryTest({ onComplete, onBack, existingAnswers = [] }: PurposeDiscoveryTestProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<PurposeAnswer[]>(existingAnswers);
  const [currentResponse, setCurrentResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [gamification, setGamification] = useState<GamificationState>({
    currentStreak: 0,
    totalQuestionsAnswered: existingAnswers.length,
    categoriesExplored: new Set(existingAnswers.map(a => a.category)),
    achievements: ACHIEVEMENTS,
    currentLevel: 1,
    xp: existingAnswers.length * 10
  });

  // Seleccionar preguntas de manera inteligente
  const [selectedQuestions] = useState(() => {
    if (existingAnswers.length === 0) {
      // Primera vez: empezar con preguntas fáciles de autoconocimiento
      return getRandomQuestions(8, []).sort((a, b) => {
        if (a.category === 'autoconocimiento' && b.category !== 'autoconocimiento') return -1;
        if (a.difficulty === 'easy' && b.difficulty !== 'easy') return -1;
        return 0;
      });
    } else {
      // Continuar: llenar categorías faltantes
      const answeredCategories = new Set(existingAnswers.map(a => a.category));
      const unansweredCategories = PURPOSE_QUESTIONS.filter(q => !answeredCategories.has(q.category));
      return [...unansweredCategories.slice(0, 5), ...getRandomQuestions(3, existingAnswers.map(a => a.questionId))];
    }
  });

  const currentQuestion = selectedQuestions[currentQuestionIndex];
  const progress = calculateProgress(answers);
  const stage = determineStage(answers, progress);

  // Efectos de gamificación
  useEffect(() => {
    checkAchievements();
  }, [answers]);

  const checkAchievements = () => {
    setGamification(prev => {
      const newAchievements = [...prev.achievements];
      
      // Primer paso
      if (prev.totalQuestionsAnswered >= 1 && !newAchievements[0].unlocked) {
        newAchievements[0] = { ...newAchievements[0], unlocked: true, unlockedAt: new Date() };
        setShowAchievements(true);
      }
      
      // Pensador profundo
      if (prev.totalQuestionsAnswered >= 5 && !newAchievements[1].unlocked) {
        newAchievements[1] = { ...newAchievements[1], unlocked: true, unlockedAt: new Date() };
        setShowAchievements(true);
      }
      
      // Explorador
      if (prev.categoriesExplored.size >= 3 && !newAchievements[2].unlocked) {
        newAchievements[2] = { ...newAchievements[2], unlocked: true, unlockedAt: new Date() };
        setShowAchievements(true);
      }
      
      // Auténtico
      if (answers.some(a => a.category === 'autoconocimiento') && !newAchievements[3].unlocked) {
        newAchievements[3] = { ...newAchievements[3], unlocked: true, unlockedAt: new Date() };
        setShowAchievements(true);
      }
      
      // Visionario
      if (answers.some(a => a.category === 'vision_futura') && !newAchievements[4].unlocked) {
        newAchievements[4] = { ...newAchievements[4], unlocked: true, unlockedAt: new Date() };
        setShowAchievements(true);
      }
      
      // Maestro del propósito
      if (progress >= 80 && !newAchievements[5].unlocked) {
        newAchievements[5] = { ...newAchievements[5], unlocked: true, unlockedAt: new Date() };
        setShowAchievements(true);
      }

      return {
        ...prev,
        achievements: newAchievements,
        currentLevel: Math.floor((prev.xp + (answers.length - prev.totalQuestionsAnswered) * 10) / 50) + 1,
        xp: prev.xp + (answers.length - prev.totalQuestionsAnswered) * 10
      };
    });
  };

  const handleAnswerSubmit = () => {
    if (!currentResponse.trim()) return;

    const newAnswer: PurposeAnswer = {
      questionId: currentQuestion.id,
      response: currentResponse.trim(),
      timestamp: new Date(),
      category: currentQuestion.category,
      type: currentQuestion.type,
      difficulty: currentQuestion.difficulty
    };

    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);
    setCurrentResponse('');

    setGamification(prev => ({
      ...prev,
      totalQuestionsAnswered: newAnswers.length,
      categoriesExplored: new Set(newAnswers.map(a => a.category)),
      currentStreak: prev.currentStreak + 1
    }));

    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleComplete(newAnswers);
    }
  };

  const handleComplete = async (finalAnswers: PurposeAnswer[]) => {
    setLoading(true);
    try {
      const finalProgress = calculateProgress(finalAnswers);
      const finalStage = determineStage(finalAnswers, finalProgress);
      onComplete(finalAnswers, finalProgress, finalStage);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentResponse('');
    } else {
      handleComplete(answers);
    }
  };

  const getCategoryIcon = (category: string) => {
    return CATEGORY_EMOJIS[category as keyof typeof CATEGORY_EMOJIS] || '📝';
  };

  const getMotivationalMessage = () => {
    const messages = [
      "¡Excelente reflexión! Cada respuesta te acerca más a tu propósito.",
      "Tu autenticidad brilla en cada palabra. Continúa así.",
      "Estás descubriendo aspectos increíbles de ti mismo.",
      "La claridad viene con la reflexión. ¡Sigue adelante!",
      "Cada pregunta es una semilla de autoconocimiento."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getCurrentPrompt = () => {
    if (!currentQuestion) return '';
    return currentQuestion.prompts[Math.floor(Math.random() * currentQuestion.prompts.length)];
  };

  if (currentQuestionIndex >= selectedQuestions.length) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Trophy className="h-16 w-16 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl">¡Test Completado!</CardTitle>
          <CardDescription>
            Has completado tu jornada de descubrimiento del propósito
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Tu Progreso</h3>
            <div className="flex justify-center items-center space-x-4">
              <Badge variant="secondary" className="text-sm">
                Nivel {gamification.currentLevel}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {progress}% Completado
              </Badge>
              <Badge variant="outline" className="text-sm">
                {gamification.totalQuestionsAnswered} Respuestas
              </Badge>
            </div>
          </div>
          
          <Button 
            onClick={() => onComplete(answers, progress, stage)}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Procesando...' : 'Ver Mis Insights'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header con gamificación */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Compass className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Descubrimiento del Propósito</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                Nivel {gamification.currentLevel}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAchievements(!showAchievements)}
              >
                <Trophy className="h-4 w-4" />
                {showAchievements ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
              </Button>
            </div>
          </div>
          
          <Progress value={(currentQuestionIndex + 1) / selectedQuestions.length * 100} className="mt-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Pregunta {currentQuestionIndex + 1} de {selectedQuestions.length}</span>
            <span>{Math.round((currentQuestionIndex + 1) / selectedQuestions.length * 100)}%</span>
          </div>
        </CardHeader>
      </Card>

      {/* Logros desbloqueados */}
      {showAchievements && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-yellow-600" />
              Logros Desbloqueados
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-2">
              {gamification.achievements.filter(a => a.unlocked).map(achievement => (
                <div key={achievement.id} className="flex items-center space-x-2 text-xs">
                  {achievement.icon}
                  <span className="font-medium">{achievement.title}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pregunta actual */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getCategoryIcon(currentQuestion.category)}</span>
              <Badge className={cn("text-xs", DIFFICULTY_COLORS[currentQuestion.difficulty])}>
                {currentQuestion.difficulty === 'easy' ? 'Fácil' : 
                 currentQuestion.difficulty === 'medium' ? 'Medio' : 'Difícil'}
              </Badge>
            </div>
            <Badge variant="outline" className="text-xs">
              ~{currentQuestion.estimatedTime} min
            </Badge>
          </div>
          
          <CardTitle className="text-xl leading-relaxed">
            {currentQuestion.title}
          </CardTitle>
          {currentQuestion.description && (
            <CardDescription className="text-base">
              {currentQuestion.description}
            </CardDescription>
          )}
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Prompt de reflexión */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-blue-400">
            <div className="flex items-start space-x-2">
              <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-900 mb-1">Pregunta de reflexión:</p>
                <p className="text-blue-800 leading-relaxed">{getCurrentPrompt()}</p>
              </div>
            </div>
          </div>

          {/* Área de respuesta */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tu respuesta:</label>
            <Textarea
              value={currentResponse}
              onChange={(e) => setCurrentResponse(e.target.value)}
              placeholder="Escribe tu reflexión aquí... No hay respuestas correctas o incorrectas, solo tu verdad."
              className="min-h-[120px] resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {currentResponse.length} caracteres
            </p>
          </div>

          {/* Mensaje motivacional */}
          {currentResponse.length > 50 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-green-600" />
                <p className="text-sm text-green-800">{getMotivationalMessage()}</p>
              </div>
            </div>
          )}

          {/* Controles */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={currentQuestionIndex === 0 ? onBack : () => {
                setCurrentQuestionIndex(currentQuestionIndex - 1);
                setCurrentResponse('');
              }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {currentQuestionIndex === 0 ? 'Volver' : 'Anterior'}
            </Button>
            
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-muted-foreground"
              >
                Saltar
              </Button>
              <Button
                onClick={handleAnswerSubmit}
                disabled={!currentResponse.trim() || loading}
                className="min-w-[120px]"
              >
                {loading ? 'Guardando...' : 
                 currentQuestionIndex === selectedQuestions.length - 1 ? 'Finalizar' : 'Continuar'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas rápidas */}
      <Card className="bg-muted/30">
        <CardContent className="pt-4">
          <div className="flex justify-between text-sm">
            <div className="flex items-center space-x-1">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span>{gamification.totalQuestionsAnswered} respuestas</span>
            </div>
            <div className="flex items-center space-x-1">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span>{gamification.categoriesExplored.size} categorías</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-muted-foreground" />
              <span>{progress}% progreso</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
