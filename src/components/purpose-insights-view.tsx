'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Lightbulb, 
  Heart, 
  Target, 
  Star,
  ArrowRight,
  RefreshCw,
  Download,
  Share2,
  BookOpen,
  Trophy,
  Sparkles,
  Compass,
  Zap
} from 'lucide-react';
import { 
  type PurposeAnswer, 
  type PurposeInsight,
  PURPOSE_INSIGHTS,
  generateInsights,
  calculateProgress,
  determineStage
} from '@/lib/purpose-discovery';

interface PurposeInsightsViewProps {
  answers: PurposeAnswer[];
  progress: number;
  stage: string;
  onRestart: () => void;
  onSavePurpose: (purposeStatement: string) => void;
}

interface PurposeStatement {
  id: string;
  statement: string;
  confidence: number;
  keyThemes: string[];
  nextSteps: string[];
}

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

const STAGE_DESCRIPTIONS = {
  exploration: {
    title: 'Exploración',
    description: 'Estás comenzando a explorar quién eres y qué te motiva',
    color: 'bg-blue-100 text-blue-800',
    icon: <Compass className="h-4 w-4" />
  },
  clarity: {
    title: 'Claridad',
    description: 'Tienes una comprensión más clara de tus valores y pasiones',
    color: 'bg-green-100 text-green-800',
    icon: <Lightbulb className="h-4 w-4" />
  },
  action: {
    title: 'Acción',
    description: 'Estás listo para tomar acciones concretas hacia tu propósito',
    color: 'bg-yellow-100 text-yellow-800',
    icon: <Target className="h-4 w-4" />
  },
  refinement: {
    title: 'Refinamiento',
    description: 'Estás perfeccionando y profundizando tu comprensión del propósito',
    color: 'bg-purple-100 text-purple-800',
    icon: <Trophy className="h-4 w-4" />
  }
};

export function PurposeInsightsView({ answers, progress, stage, onRestart, onSavePurpose }: PurposeInsightsViewProps) {
  const [selectedInsight, setSelectedInsight] = useState<PurposeInsight | null>(null);
  const [purposeStatement, setPurposeStatement] = useState('');
  const [isEditingStatement, setIsEditingStatement] = useState(false);

  const insights = generateInsights(answers);
  const stageInfo = STAGE_DESCRIPTIONS[stage as keyof typeof STAGE_DESCRIPTIONS];
  
  // Generar estadísticas por categoría
  const categoryStats = answers.reduce((acc, answer) => {
    if (!acc[answer.category]) {
      acc[answer.category] = 0;
    }
    acc[answer.category]++;
    return acc;
  }, {} as Record<string, number>);

  // Extraer temas clave de las respuestas
  const extractKeyThemes = (answers: PurposeAnswer[]): string[] => {
    const themes = new Set<string>();
    
    answers.forEach(answer => {
      const words = answer.response.toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 4)
        .filter(word => !['que', 'para', 'como', 'donde', 'cuando', 'porque'].includes(word));
      
      words.forEach(word => {
        if (word.length > 4) themes.add(word);
      });
    });
    
    return Array.from(themes).slice(0, 8);
  };

  const keyThemes = extractKeyThemes(answers);

  // Generar declaración de propósito sugerida
  const generatePurposeStatement = (): string => {
    const passionAnswers = answers.filter(a => a.category === 'pasiones');
    const valueAnswers = answers.filter(a => a.category === 'valores');
    const impactAnswers = answers.filter(a => a.category === 'impacto');
    
    let statement = "Mi propósito es ";
    
    if (passionAnswers.length > 0) {
      const passionWords = passionAnswers[0].response.split(' ').slice(0, 3).join(' ');
      statement += `usar mi pasión por ${passionWords} `;
    }
    
    if (valueAnswers.length > 0) {
      statement += "para crear un impacto positivo ";
    }
    
    if (impactAnswers.length > 0) {
      const impactWords = impactAnswers[0].response.split(' ').slice(0, 4).join(' ');
      statement += `que ayude a ${impactWords}`;
    }
    
    return statement + " y contribuir a un mundo mejor.";
  };

  const handleSavePurpose = () => {
    if (purposeStatement.trim()) {
      onSavePurpose(purposeStatement);
      setIsEditingStatement(false);
    }
  };

  const handleExport = () => {
    const data = {
      answers: answers.map(a => ({
        pregunta: PURPOSE_INSIGHTS.find(i => i.triggerAnswers.includes(a.questionId))?.title || 'Pregunta',
        respuesta: a.response,
        categoria: a.category,
        fecha: a.timestamp
      })),
      insights: insights.map(i => ({
        titulo: i.title,
        descripcion: i.description,
        pasos: i.actionableSteps
      })),
      progreso: progress,
      etapa: stageInfo.title,
      declaracion_proposito: purposeStatement
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mi-proposito-de-vida.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header con resumen */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Trophy className="h-16 w-16 text-yellow-500" />
              <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-1 -right-1" />
            </div>
          </div>
          <CardTitle className="text-2xl">¡Tu Propósito Está Tomando Forma!</CardTitle>
          <CardDescription className="text-base">
            Has completado un viaje profundo de autoconocimiento. Aquí están tus insights.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <Badge className={`${stageInfo.color} text-sm px-3 py-1`}>
              {stageInfo.icon}
              <span className="ml-1">{stageInfo.title}</span>
            </Badge>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            {stageInfo.description}
          </p>
          <div className="flex justify-center">
            <Progress value={progress} className="w-48" />
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas por categoría */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Exploración por Categorías
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(categoryStats).map(([category, count]) => (
              <div key={category} className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-2xl mb-1">
                  {CATEGORY_EMOJIS[category as keyof typeof CATEGORY_EMOJIS]}
                </div>
                <div className="text-sm font-medium capitalize">
                  {category.replace('_', ' ')}
                </div>
                <div className="text-xs text-muted-foreground">
                  {count} respuesta{count !== 1 ? 's' : ''}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Declaración de propósito */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Mi Declaración de Propósito
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isEditingStatement ? (
            <div>
              {purposeStatement ? (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-l-4 border-green-400">
                  <p className="text-lg font-medium leading-relaxed">{purposeStatement}</p>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Tu declaración de propósito aparecerá aquí</p>
                </div>
              )}
              <div className="flex justify-center space-x-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (!purposeStatement) {
                      setPurposeStatement(generatePurposeStatement());
                    }
                    setIsEditingStatement(true);
                  }}
                >
                  {purposeStatement ? 'Editar' : 'Crear'} Declaración
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <textarea
                value={purposeStatement}
                onChange={(e) => setPurposeStatement(e.target.value)}
                className="w-full p-4 border rounded-lg min-h-[100px] resize-none"
                placeholder="Escribe tu declaración de propósito aquí..."
              />
              <div className="flex justify-center space-x-2">
                <Button variant="outline" onClick={() => setIsEditingStatement(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSavePurpose} disabled={!purposeStatement.trim()}>
                  Guardar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Insights generados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="h-5 w-5 mr-2" />
            Insights Descubiertos
          </CardTitle>
          <CardDescription>
            Basado en tus respuestas, hemos identificado patrones y oportunidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          {insights.length > 0 ? (
            <div className="space-y-4">
              {insights.map((insight) => (
                <Card 
                  key={insight.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedInsight?.id === insight.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedInsight(selectedInsight?.id === insight.id ? null : insight)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center">
                        <Star className="h-5 w-5 mr-2 text-yellow-500" />
                        {insight.title}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {insight.category}
                      </Badge>
                    </div>
                    <CardDescription className="text-base">
                      {insight.description}
                    </CardDescription>
                  </CardHeader>
                  {selectedInsight?.id === insight.id && insight.actionableSteps && (
                    <CardContent className="pt-0">
                      <Separator className="mb-4" />
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center">
                          <Zap className="h-4 w-4 mr-2" />
                          Pasos Sugeridos
                        </h4>
                        <ul className="space-y-2">
                          {insight.actionableSteps.map((step, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <ArrowRight className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Continúa explorando para descubrir más insights</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Temas clave */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="h-5 w-5 mr-2" />
            Temas Clave en Tus Respuestas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {keyThemes.map((theme, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {theme}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Acciones */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={onRestart} variant="outline" className="flex items-center">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reiniciar Test
            </Button>
            <Button onClick={handleExport} variant="outline" className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Exportar Resultados
            </Button>
            <Button variant="outline" className="flex items-center">
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
