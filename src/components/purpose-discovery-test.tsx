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
  getQuestionsByCategory,
  calculateProgress,
  determineStage,
  type PurposeCategory
} from '@/lib/purpose-discovery';
import { cn } from '@/lib/utils';

interface PurposeDiscoveryTestProps {
  onComplete: (answers: PurposeAnswer[], progress: number, stage: string) => void;
  onBack: () => void;
  existingAnswers?: PurposeAnswer[];
  selectedQuestions?: any[];
}

interface InspirationState {
  totalQuestionsAnswered: number;
  categoriesExplored: Set<string>;
  currentDepth: 'surface' | 'deep' | 'profound';
  insights: string[];
}

const CATEGORY_EMOJIS = {
  pasion: '🔥',      // Lo que amas
  mision: '🌍',      // Lo que el mundo necesita  
  vocacion: '💼',    // Aquello por lo que te pudieran pagar
  profesion: '⭐'     // En lo que eres bueno
};

const DIFFICULTY_COLORS = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800'
};

const DEPTH_LABELS = {
  easy: '🟢 Fácil',
  intermediate: '🟡 Intermedia',
  challenging: '🔴 Introspectiva'
};

export function PurposeDiscoveryTest({ onComplete, onBack, existingAnswers = [], selectedQuestions = [] }: PurposeDiscoveryTestProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<PurposeAnswer[]>(existingAnswers);
  const [currentResponse, setCurrentResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [inspirationState, setInspirationState] = useState<InspirationState>({
    totalQuestionsAnswered: existingAnswers.length,
    categoriesExplored: new Set(existingAnswers.map(a => a.category)),
    currentDepth: 'surface',
    insights: []
  });

  // Usar preguntas seleccionadas o seleccionar automáticamente
  const [questionsToAnswer] = useState(() => {
    if (selectedQuestions.length > 0) {
      return selectedQuestions;
    }
    
    // Fallback: selección automática si no hay preguntas seleccionadas
    if (existingAnswers.length === 0) {
      const ikigaiOrder = ['pasion', 'mision', 'vocacion', 'profesion'];
      const questions: PurposeQuestion[] = [];
      
      ikigaiOrder.forEach(category => {
        const categoryQuestions = getQuestionsByCategory(category as PurposeCategory);
        questions.push(...categoryQuestions.slice(0, 2));
      });
      
      return questions;
    } else {
      const answeredCategories = new Set(existingAnswers.map(a => a.category));
      const ikigaiOrder = ['pasion', 'mision', 'vocacion', 'profesion'];
      const questions: PurposeQuestion[] = [];
      
      ikigaiOrder.forEach(category => {
        if (!answeredCategories.has(category)) {
          const categoryQuestions = getQuestionsByCategory(category as PurposeCategory);
          questions.push(...categoryQuestions.slice(0, 1));
        }
      });
      
      return questions;
    }
  });

  const currentQuestion = questionsToAnswer[currentQuestionIndex];
  const progress = calculateProgress(answers);
  const stage = determineStage(answers, progress);

  // Actualizar estado de inspiración
  useEffect(() => {
    setInspirationState(prev => ({
      ...prev,
      totalQuestionsAnswered: answers.length,
      categoriesExplored: new Set(answers.map(a => a.category)),
      currentDepth: determineCurrentDepth(answers)
    }));
  }, [answers]);

  const determineCurrentDepth = (answers: PurposeAnswer[]): 'surface' | 'deep' | 'profound' => {
    if (answers.length < 3) return 'surface';
    if (answers.length < 7) return 'deep';
    return 'profound';
  };

  const handleAnswerSubmit = () => {
    if (!currentResponse.trim()) return;

      const newAnswer: PurposeAnswer = {
        questionId: currentQuestion.id,
        response: currentResponse.trim(),
        timestamp: new Date(),
        category: currentQuestion.category,
        type: currentQuestion.type,
        difficulty: currentQuestion.difficulty,
        depth: currentQuestion.depth,
        wordCount: currentResponse.trim().split(/\s+/).length
      };

    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);
    setCurrentResponse('');

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


  const getCurrentPrompt = () => {
    if (!currentQuestion) return '';
    return currentQuestion.basePrompt;
  };

  const getCurrentExamples = () => {
    if (!currentQuestion) return [];
    return currentQuestion.examples || [];
  };

  const getReflectionLevel = (length: number): string => {
    if (length < 50) return 'Explorando';
    if (length < 150) return 'Profundizando';
    if (length < 300) return 'Excelente';
    return 'Extraordinario';
  };

  const getMotivationalMessage = (length: number): string | null => {
    if (length < 20) return null;
    if (length < 50) return '¡Buen comienzo! Sigue desarrollando tus ideas...';
    if (length < 100) return '¡Excelente! Cada detalle enriquece tu reflexión.';
    if (length < 150) return '¡Muy bien! Tu reflexión está tomando forma claramente.';
    if (length < 200) return '¡Fantástico! Estás construyendo una reflexión muy sólida.';
    if (length < 300) return '¡Increíble! Tu profundidad de reflexión es notable.';
    return '¡Extraordinario! Tu nivel de introspección es excepcional.';
  };

  const getPlaceholderExamples = (category: string) => {
    const currentExamples = getCurrentExamples();
    if (currentExamples.length > 0) {
      return currentExamples.join(', ') + '...';
    }
    
    // Fallback a ejemplos genéricos por categoría
    const examples = {
      pasion: 'Leer sobre tecnología, debatir ideas, crear contenido, organizar eventos, practicar un deporte...',
      mision: 'La desinformación, el acceso a la educación, la sostenibilidad ambiental, la salud mental...',
      vocacion: 'Analizar datos, diseñar interfaces, liderar equipos, hablar en público, resolver problemas...',
      profesion: 'Matemáticas, redacción, organización de ideas, soporte técnico, dar buenos consejos...'
    };
    return examples[category as keyof typeof examples] || 'Piensa en ejemplos específicos de tu experiencia...';
  };

  const getTextareaPlaceholder = (category: string) => {
    const placeholders = {
      pasion: 'Describe las actividades que te hacen sentir más vivo y con más energía...',
      mision: 'Explica los problemas que te gustaría ayudar a resolver y por qué te importan...',
      vocacion: 'Detalla las habilidades que quieres desarrollar y el ambiente laboral ideal...',
      profesion: 'Cuenta sobre tus fortalezas y las áreas donde otros te piden ayuda...'
    };
    return placeholders[category as keyof typeof placeholders] || 'Escribe tu reflexión aquí...';
  };

  if (currentQuestionIndex >= questionsToAnswer.length) {
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
                {inspirationState.currentDepth === 'surface' ? 'Explorando' : 
                 inspirationState.currentDepth === 'deep' ? 'Profundizando' : 'Revelando'}
              </Badge>
            </div>
          </div>
          
                <Progress value={(currentQuestionIndex + 1) / questionsToAnswer.length * 100} className="mt-2" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Pregunta {currentQuestionIndex + 1} de {questionsToAnswer.length}</span>
                  <span>{Math.round((currentQuestionIndex + 1) / questionsToAnswer.length * 100)}%</span>
                </div>
        </CardHeader>
      </Card>

      {/* Estado de inspiración */}
      {inspirationState.currentDepth !== 'surface' && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2 text-sm">
              <Lightbulb className="h-4 w-4 text-blue-600" />
              <span className="text-blue-800">
                {inspirationState.currentDepth === 'deep' 
                  ? 'Estás profundizando en temas importantes' 
                  : 'Descubriendo conexiones profundas en tus respuestas'}
              </span>
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
                {DEPTH_LABELS[currentQuestion.depth]}
              </Badge>
            </div>
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

          {/* Placeholder con ejemplos */}
          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-2 flex items-center space-x-1">
              <Lightbulb className="h-3 w-3" />
              <span>Ejemplos para inspirarte:</span>
            </p>
            <div className="space-y-1">
              {getCurrentExamples().map((example, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full mt-1.5 flex-shrink-0"></div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{example}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Área de respuesta */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tu respuesta:</label>
            <Textarea
              value={currentResponse}
              onChange={(e) => setCurrentResponse(e.target.value)}
              placeholder={getTextareaPlaceholder(currentQuestion.category)}
              className="min-h-[120px] resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {currentResponse.length} caracteres
            </p>
          </div>

        {/* Indicador de profundidad de reflexión */}
        {currentResponse.length > 0 && (
          <div className="space-y-3">
            {/* Barra de progreso de reflexión */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Profundidad de reflexión</span>
                <span>{getReflectionLevel(currentResponse.length)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    currentResponse.length < 50 ? "bg-yellow-400" :
                    currentResponse.length < 150 ? "bg-blue-500" :
                    currentResponse.length < 300 ? "bg-green-500" : "bg-purple-500"
                  )}
                  style={{ width: `${Math.min((currentResponse.length / 300) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Mensajes motivacionales contextuales */}
            {getMotivationalMessage(currentResponse.length) && (
              <div className={cn(
                "border rounded-lg p-3 transition-all duration-300",
                currentResponse.length < 50 ? "bg-yellow-50 border-yellow-200" :
                currentResponse.length < 150 ? "bg-blue-50 border-blue-200" :
                currentResponse.length < 300 ? "bg-green-50 border-green-200" : "bg-purple-50 border-purple-200"
              )}>
                <div className="flex items-center space-x-2">
                  <Heart className={cn(
                    "h-4 w-4",
                    currentResponse.length < 50 ? "text-yellow-600" :
                    currentResponse.length < 150 ? "text-blue-600" :
                    currentResponse.length < 300 ? "text-green-600" : "text-purple-600"
                  )} />
                  <p className={cn(
                    "text-sm",
                    currentResponse.length < 50 ? "text-yellow-800" :
                    currentResponse.length < 150 ? "text-blue-800" :
                    currentResponse.length < 300 ? "text-green-800" : "text-purple-800"
                  )}>
                    {getMotivationalMessage(currentResponse.length)}
                  </p>
                </div>
              </div>
            )}
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

      {/* Estadísticas de inspiración */}
      <Card className="bg-muted/30">
        <CardContent className="pt-4">
          <div className="flex justify-between text-sm">
            <div className="flex items-center space-x-1">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span>{inspirationState.totalQuestionsAnswered} reflexiones</span>
            </div>
            <div className="flex items-center space-x-1">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span>{inspirationState.categoriesExplored.size} áreas exploradas</span>
            </div>
            <div className="flex items-center space-x-1">
              <Compass className="h-4 w-4 text-muted-foreground" />
              <span>{progress}% completado</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
