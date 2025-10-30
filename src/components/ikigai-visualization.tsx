'use client';

import React, { useState } from 'react';
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
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);
  const [selectedIntersection, setSelectedIntersection] = useState<string | null>(null);

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

  // Calcular tamaños dinámicos de círculos basados en porcentajes
  const getCircleRadius = (score: number) => {
    const baseRadius = 80;
    const maxRadius = 100;
    const minRadius = 60;
    return Math.max(minRadius, Math.min(maxRadius, baseRadius + (score - 50) * 0.4));
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
          <p className="text-center text-sm text-muted-foreground mb-4">
            Pasa el cursor o toca las áreas del diagrama para explorar tus insights
          </p>
          <div className="relative w-full max-w-2xl mx-auto">
            {/* Diagrama de Venn SVG Interactivo */}
            <svg viewBox="0 0 400 400" className="w-full h-auto">
              {/* Círculo de Pasión */}
              <circle
                cx="150"
                cy="150"
                r={getCircleRadius(ikigaiData.passion.score)}
                fill={hoveredArea === 'passion' ? "rgba(239, 68, 68, 0.4)" : "rgba(239, 68, 68, 0.2)"}
                stroke="rgb(239, 68, 68)"
                strokeWidth={hoveredArea === 'passion' ? "3" : "2"}
                className="transition-all duration-500 cursor-pointer"
                onMouseEnter={() => setHoveredArea('passion')}
                onMouseLeave={() => setHoveredArea(null)}
                onClick={() => setSelectedIntersection(selectedIntersection === 'passion' ? null : 'passion')}
              />
              
              {/* Círculo de Misión */}
              <circle
                cx="250"
                cy="150"
                r={getCircleRadius(ikigaiData.mission.score)}
                fill={hoveredArea === 'mission' ? "rgba(34, 197, 94, 0.4)" : "rgba(34, 197, 94, 0.2)"}
                stroke="rgb(34, 197, 94)"
                strokeWidth={hoveredArea === 'mission' ? "3" : "2"}
                className="transition-all duration-500 cursor-pointer"
                onMouseEnter={() => setHoveredArea('mission')}
                onMouseLeave={() => setHoveredArea(null)}
                onClick={() => setSelectedIntersection(selectedIntersection === 'mission' ? null : 'mission')}
              />
              
              {/* Círculo de Vocación */}
              <circle
                cx="150"
                cy="250"
                r={getCircleRadius(ikigaiData.vocation.score)}
                fill={hoveredArea === 'vocation' ? "rgba(59, 130, 246, 0.4)" : "rgba(59, 130, 246, 0.2)"}
                stroke="rgb(59, 130, 246)"
                strokeWidth={hoveredArea === 'vocation' ? "3" : "2"}
                className="transition-all duration-500 cursor-pointer"
                onMouseEnter={() => setHoveredArea('vocation')}
                onMouseLeave={() => setHoveredArea(null)}
                onClick={() => setSelectedIntersection(selectedIntersection === 'vocation' ? null : 'vocation')}
              />
              
              {/* Círculo de Profesión */}
              <circle
                cx="250"
                cy="250"
                r={getCircleRadius(ikigaiData.profession.score)}
                fill={hoveredArea === 'profession' ? "rgba(147, 51, 234, 0.4)" : "rgba(147, 51, 234, 0.2)"}
                stroke="rgb(147, 51, 234)"
                strokeWidth={hoveredArea === 'profession' ? "3" : "2"}
                className="transition-all duration-500 cursor-pointer"
                onMouseEnter={() => setHoveredArea('profession')}
                onMouseLeave={() => setHoveredArea(null)}
                onClick={() => setSelectedIntersection(selectedIntersection === 'profession' ? null : 'profession')}
              />
              
              {/* Centro del Ikigai */}
              <circle
                cx="200"
                cy="200"
                r="30"
                fill="rgba(251, 191, 36, 0.8)"
                stroke="rgb(251, 191, 36)"
                strokeWidth="3"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredArea('center')}
                onMouseLeave={() => setHoveredArea(null)}
                onClick={() => setSelectedIntersection(selectedIntersection === 'center' ? null : 'center')}
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

            {/* Tooltip de información */}
            {hoveredArea && (
              <div className="absolute top-4 right-4 bg-white border border-gray-200 rounded-lg p-3 shadow-lg max-w-xs z-10">
                {hoveredArea === 'passion' && (
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">🔥 Pasión</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {ikigaiData.passion.score}% desarrollado
                    </p>
                    <p className="text-xs text-gray-500">
                      {ikigaiData.passion.themes.length > 0 
                        ? `Temas: ${ikigaiData.passion.themes.join(', ')}`
                        : 'Explora más esta área'
                      }
                    </p>
                  </div>
                )}
                {hoveredArea === 'mission' && (
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">🌍 Misión</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {ikigaiData.mission.score}% desarrollado
                    </p>
                    <p className="text-xs text-gray-500">
                      {ikigaiData.mission.themes.length > 0 
                        ? `Temas: ${ikigaiData.mission.themes.join(', ')}`
                        : 'Explora más esta área'
                      }
                    </p>
                  </div>
                )}
                {hoveredArea === 'vocation' && (
                  <div>
                    <h4 className="font-semibold text-blue-600 mb-2">💼 Vocación</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {ikigaiData.vocation.score}% desarrollado
                    </p>
                    <p className="text-xs text-gray-500">
                      {ikigaiData.vocation.themes.length > 0 
                        ? `Temas: ${ikigaiData.vocation.themes.join(', ')}`
                        : 'Explora más esta área'
                      }
                    </p>
                  </div>
                )}
                {hoveredArea === 'profession' && (
                  <div>
                    <h4 className="font-semibold text-purple-600 mb-2">⭐ Profesión</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {ikigaiData.profession.score}% desarrollado
                    </p>
                    <p className="text-xs text-gray-500">
                      {ikigaiData.profession.themes.length > 0 
                        ? `Temas: ${ikigaiData.profession.themes.join(', ')}`
                        : 'Explora más esta área'
                      }
                    </p>
                  </div>
                )}
                {hoveredArea === 'center' && (
                  <div>
                    <h4 className="font-semibold text-yellow-600 mb-2">🎯 Tu Ikigai</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {Math.round(intersections.center)}% integrado
                    </p>
                    <p className="text-xs text-gray-500">
                      {intersections.center > 50 
                        ? '¡Excelente integración!'
                        : intersections.center > 25
                        ? 'Buen progreso'
                        : 'En desarrollo'
                      }
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Panel de información expandida */}
            {selectedIntersection && (
              <div className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                {selectedIntersection === 'passion' && (
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">🔥 Análisis de tu Pasión</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Basado en tus respuestas, tu pasión se centra en: <strong>{ikigaiData.passion.themes.join(', ')}</strong>
                    </p>
                    <p className="text-xs text-gray-500">
                      Nivel de desarrollo: {ikigaiData.passion.strength === 'high' ? 'Alto' : ikigaiData.passion.strength === 'medium' ? 'Medio' : 'En desarrollo'}
                    </p>
                  </div>
                )}
                {selectedIntersection === 'mission' && (
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">🌍 Análisis de tu Misión</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Basado en tus respuestas, tu misión se centra en: <strong>{ikigaiData.mission.themes.join(', ')}</strong>
                    </p>
                    <p className="text-xs text-gray-500">
                      Nivel de desarrollo: {ikigaiData.mission.strength === 'high' ? 'Alto' : ikigaiData.mission.strength === 'medium' ? 'Medio' : 'En desarrollo'}
                    </p>
                  </div>
                )}
                {selectedIntersection === 'vocation' && (
                  <div>
                    <h4 className="font-semibold text-blue-600 mb-2">💼 Análisis de tu Vocación</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Basado en tus respuestas, tu vocación se centra en: <strong>{ikigaiData.vocation.themes.join(', ')}</strong>
                    </p>
                    <p className="text-xs text-gray-500">
                      Nivel de desarrollo: {ikigaiData.vocation.strength === 'high' ? 'Alto' : ikigaiData.vocation.strength === 'medium' ? 'Medio' : 'En desarrollo'}
                    </p>
                  </div>
                )}
                {selectedIntersection === 'profession' && (
                  <div>
                    <h4 className="font-semibold text-purple-600 mb-2">⭐ Análisis de tu Profesión</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Basado en tus respuestas, tu profesión se centra en: <strong>{ikigaiData.profession.themes.join(', ')}</strong>
                    </p>
                    <p className="text-xs text-gray-500">
                      Nivel de desarrollo: {ikigaiData.profession.strength === 'high' ? 'Alto' : ikigaiData.profession.strength === 'medium' ? 'Medio' : 'En desarrollo'}
                    </p>
                  </div>
                )}
                {selectedIntersection === 'center' && (
                  <div>
                    <h4 className="font-semibold text-yellow-600 mb-2">🎯 Análisis de tu Ikigai</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Tu Ikigai está {intersections.center > 50 ? 'bien integrado' : intersections.center > 25 ? 'tomando forma' : 'en desarrollo inicial'}.
                    </p>
                    <p className="text-xs text-gray-500">
                      Área más desarrollada: <strong>{strongestArea.name}</strong> ({strongestArea.score}%)
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Análisis por Categorías */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
          // Mapear las claves del CATEGORY_CONFIG a las claves del IkigaiData
          const dataKey = key === 'pasion' ? 'passion' : 
                         key === 'mision' ? 'mission' : 
                         key === 'vocacion' ? 'vocation' : 
                         key === 'profesion' ? 'profession' : key;
          const data = ikigaiData[dataKey as keyof IkigaiData];
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

    </div>
  );
}
