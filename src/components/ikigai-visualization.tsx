'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Target, 
  Briefcase, 
  Star,
  Lightbulb,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';
import { type PurposeAnswer } from '@/lib/purpose-discovery';

interface IkigaiVisualizationProps {
  answers: PurposeAnswer[];
  className?: string;
}

interface IkigaiData {
  passion: {
    score: number;
    themes: string[];
    strength: 'low' | 'medium' | 'high';
  };
  mission: {
    score: number;
    themes: string[];
    strength: 'low' | 'medium' | 'high';
  };
  vocation: {
    score: number;
    themes: string[];
    strength: 'low' | 'medium' | 'high';
  };
  profession: {
    score: number;
    themes: string[];
    strength: 'low' | 'medium' | 'high';
  };
}

const CATEGORY_CONFIG = {
  pasion: {
    name: 'Pasión',
    icon: Heart,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    emoji: '🔥'
  },
  mision: {
    name: 'Misión',
    icon: Target,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    emoji: '🌍'
  },
  vocacion: {
    name: 'Vocación',
    icon: Briefcase,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    emoji: '💼'
  },
  profesion: {
    name: 'Profesión',
    icon: Star,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    emoji: '⭐'
  }
};

export function IkigaiVisualization({ answers, className = '' }: IkigaiVisualizationProps) {
  // Analizar respuestas por categoría
  const analyzeCategory = (category: string) => {
    const categoryAnswers = answers.filter(a => a.category === category);
    
    if (categoryAnswers.length === 0) {
      return {
        score: 0,
        themes: [],
        strength: 'low' as const
      };
    }

    // Calcular score basado en profundidad y cantidad de respuestas
    const totalWords = categoryAnswers.reduce((sum, answer) => sum + answer.wordCount, 0);
    const avgWords = totalWords / categoryAnswers.length;
    const depthScore = Math.min(avgWords / 50, 1); // Normalizar a 0-1
    const quantityScore = Math.min(categoryAnswers.length / 3, 1); // Normalizar a 0-1
    const score = (depthScore + quantityScore) / 2;

    // Extraer temas clave
    const allText = categoryAnswers.map(a => a.response).join(' ').toLowerCase();
    const words = allText.split(/\s+/)
      .filter(word => word.length > 4)
      .filter(word => !['que', 'para', 'como', 'donde', 'cuando', 'porque', 'desde', 'hasta', 'sobre', 'bajo', 'entre', 'hacia'].includes(word));
    
    const wordCount = new Map<string, number>();
    words.forEach(word => {
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    });

    const themes = Array.from(wordCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([word]) => word);

    // Determinar fuerza
    let strength: 'low' | 'medium' | 'high' = 'low';
    if (score > 0.7) strength = 'high';
    else if (score > 0.4) strength = 'medium';

    return {
      score: Math.round(score * 100),
      themes,
      strength
    };
  };

  const ikigaiData: IkigaiData = {
    passion: analyzeCategory('pasion'),
    mission: analyzeCategory('mision'),
    vocation: analyzeCategory('vocacion'),
    profession: analyzeCategory('profesion')
  };

  // Calcular intersecciones (áreas de superposición)
  const calculateIntersections = () => {
    const intersections = {
      passionMission: Math.min(ikigaiData.passion.score, ikigaiData.mission.score) * 0.8,
      passionProfession: Math.min(ikigaiData.passion.score, ikigaiData.profession.score) * 0.8,
      missionVocation: Math.min(ikigaiData.mission.score, ikigaiData.vocation.score) * 0.8,
      vocationProfession: Math.min(ikigaiData.vocation.score, ikigaiData.profession.score) * 0.8,
      center: Math.min(
        ikigaiData.passion.score,
        ikigaiData.mission.score,
        ikigaiData.vocation.score,
        ikigaiData.profession.score
      ) * 0.6
    };
    return intersections;
  };

  const intersections = calculateIntersections();

  // Determinar el área más fuerte
  const getStrongestArea = () => {
    const areas = [
      { name: 'Pasión', score: ikigaiData.passion.score },
      { name: 'Misión', score: ikigaiData.mission.score },
      { name: 'Vocación', score: ikigaiData.vocation.score },
      { name: 'Profesión', score: ikigaiData.profession.score }
    ];
    return areas.reduce((max, area) => area.score > max.score ? area : max);
  };

  const strongestArea = getStrongestArea();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Visualización del Diagrama de Venn */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="h-5 w-5 mr-2" />
            Tu Diagrama de Ikigai
          </CardTitle>
          <CardDescription>
            Visualización de las 4 dimensiones de tu propósito y sus intersecciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full max-w-2xl mx-auto">
            {/* Diagrama de Venn SVG */}
            <svg viewBox="0 0 400 400" className="w-full h-auto">
              {/* Círculo de Pasión */}
              <circle
                cx="150"
                cy="150"
                r="80"
                fill="rgba(239, 68, 68, 0.2)"
                stroke="rgb(239, 68, 68)"
                strokeWidth="2"
                className="transition-all duration-300"
              />
              
              {/* Círculo de Misión */}
              <circle
                cx="250"
                cy="150"
                r="80"
                fill="rgba(34, 197, 94, 0.2)"
                stroke="rgb(34, 197, 94)"
                strokeWidth="2"
                className="transition-all duration-300"
              />
              
              {/* Círculo de Vocación */}
              <circle
                cx="150"
                cy="250"
                r="80"
                fill="rgba(59, 130, 246, 0.2)"
                stroke="rgb(59, 130, 246)"
                strokeWidth="2"
                className="transition-all duration-300"
              />
              
              {/* Círculo de Profesión */}
              <circle
                cx="250"
                cy="250"
                r="80"
                fill="rgba(147, 51, 234, 0.2)"
                stroke="rgb(147, 51, 234)"
                strokeWidth="2"
                className="transition-all duration-300"
              />
              
              {/* Centro del Ikigai */}
              <circle
                cx="200"
                cy="200"
                r="30"
                fill="rgba(251, 191, 36, 0.8)"
                stroke="rgb(251, 191, 36)"
                strokeWidth="3"
                className="transition-all duration-300"
              />
              
              {/* Etiquetas */}
              <text x="150" y="140" textAnchor="middle" className="text-sm font-semibold fill-red-600">
                🔥 Pasión
              </text>
              <text x="250" y="140" textAnchor="middle" className="text-sm font-semibold fill-green-600">
                🌍 Misión
              </text>
              <text x="150" y="270" textAnchor="middle" className="text-sm font-semibold fill-blue-600">
                💼 Vocación
              </text>
              <text x="250" y="270" textAnchor="middle" className="text-sm font-semibold fill-purple-600">
                ⭐ Profesión
              </text>
              
              {/* Centro */}
              <text x="200" y="205" textAnchor="middle" className="text-xs font-bold fill-yellow-800">
                IKIGAI
              </text>
            </svg>
          </div>
        </CardContent>
      </Card>

      {/* Análisis por Categorías */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
          const data = ikigaiData[key as keyof IkigaiData];
          const Icon = config.icon;
          
          return (
            <Card key={key} className={`${config.bgColor} ${config.borderColor} border-2`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className={`h-5 w-5 ${config.color}`} />
                    <span className="font-semibold text-sm">{config.name}</span>
                  </div>
                  <Badge 
                    variant={data.strength === 'high' ? 'default' : data.strength === 'medium' ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    {data.score}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        data.strength === 'high' ? 'bg-green-500' :
                        data.strength === 'medium' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}
                      style={{ width: `${data.score}%` }}
                    />
                  </div>
                  
                  {data.themes.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Temas clave:</p>
                      <div className="flex flex-wrap gap-1">
                        {data.themes.map((theme, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {theme}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Insights del Diagrama */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Insights de tu Ikigai
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Área más desarrollada:</h4>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-sm">
                  {strongestArea.name}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {strongestArea.score}% de desarrollo
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Nivel de integración:</h4>
              <div className="flex items-center space-x-2">
                <Badge 
                  variant={intersections.center > 50 ? 'default' : intersections.center > 25 ? 'secondary' : 'outline'}
                  className="text-sm"
                >
                  {intersections.center > 50 ? 'Alto' : intersections.center > 25 ? 'Medio' : 'En desarrollo'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {Math.round(intersections.center)}% integrado
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/60 p-4 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Recomendación:</h4>
            <p className="text-sm text-muted-foreground">
              {intersections.center > 50 
                ? "¡Excelente! Tu Ikigai está bien integrado. Continúa desarrollando todas las dimensiones por igual."
                : intersections.center > 25
                ? "Tu Ikigai está tomando forma. Enfócate en fortalecer las áreas más débiles para mayor integración."
                : "Tu Ikigai está en desarrollo inicial. Explora más profundamente cada dimensión para encontrar conexiones."
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
