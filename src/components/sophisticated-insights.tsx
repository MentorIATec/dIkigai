'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Lightbulb,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Zap,
  Users,
  BookOpen,
  Star,
  Heart,
  Briefcase,
  Globe
} from 'lucide-react';
import { type PurposeAnswer } from '@/lib/purpose-discovery';

interface SophisticatedInsightsProps {
  answers: PurposeAnswer[];
  className?: string;
}

interface InsightPattern {
  id: string;
  title: string;
  description: string;
  category: 'strength' | 'opportunity' | 'pattern' | 'recommendation';
  confidence: number;
  evidence: string[];
  actionableSteps: string[];
  priority: 'high' | 'medium' | 'low';
}

interface PersonalityInsight {
  trait: string;
  score: number;
  description: string;
  implications: string[];
}

export function SophisticatedInsights({ answers, className = '' }: SophisticatedInsightsProps) {
  const [expandedInsights, setExpandedInsights] = useState<Set<string>>(new Set());

  // Análisis avanzado de patrones
  const analyzePatterns = (): InsightPattern[] => {
    const patterns: InsightPattern[] = [];
    
    // Análisis de longitud de respuestas
    const avgLength = answers.reduce((sum, a) => sum + a.wordCount, 0) / answers.length;
    if (avgLength > 100) {
      patterns.push({
        id: 'deep-thinker',
        title: 'Pensador Profundo',
        description: 'Tus respuestas muestran una tendencia hacia la reflexión profunda y el análisis detallado.',
        category: 'strength',
        confidence: 85,
        evidence: [`Promedio de ${Math.round(avgLength)} palabras por respuesta`],
        actionableSteps: [
          'Aprovecha esta capacidad para roles que requieren análisis estratégico',
          'Considera carreras en investigación, consultoría o planificación',
          'Desarrolla habilidades de síntesis para comunicar ideas complejas'
        ],
        priority: 'high'
      });
    }

    // Análisis de diversidad temática
    const categories = new Set(answers.map(a => a.category));
    if (categories.size === 4) {
      patterns.push({
        id: 'well-rounded',
        title: 'Perfil Integral',
        description: 'Has explorado todas las dimensiones del Ikigai, mostrando un enfoque equilibrado.',
        category: 'strength',
        confidence: 90,
        evidence: ['Exploración completa de las 4 dimensiones del Ikigai'],
        actionableSteps: [
          'Tu versatilidad es una fortaleza - busca roles que aprovechen múltiples habilidades',
          'Considera posiciones de liderazgo generalista',
          'Desarrolla especialización en un área mientras mantienes amplitud'
        ],
        priority: 'high'
      });
    }

    // Análisis de coherencia temática
    const allText = answers.map(a => a.response).join(' ').toLowerCase();
    const words = allText.split(/\s+/).filter(word => word.length > 4);
    const wordFreq = new Map<string, number>();
    words.forEach(word => {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    });

    const frequentWords = Array.from(wordFreq.entries())
      .filter(([_, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    if (frequentWords.length > 0) {
      patterns.push({
        id: 'thematic-coherence',
        title: 'Coherencia Temática',
        description: `Tus respuestas muestran una fuerte coherencia alrededor de temas como: ${frequentWords.map(([word]) => word).join(', ')}.`,
        category: 'pattern',
        confidence: 75,
        evidence: frequentWords.map(([word, count]) => `"${word}" aparece ${count} veces`),
        actionableSteps: [
          'Estos temas centrales pueden guiar tus decisiones profesionales',
          'Busca oportunidades que se alineen con estos intereses recurrentes',
          'Desarrolla expertise en estas áreas temáticas'
        ],
        priority: 'medium'
      });
    }

    // Análisis de balance emocional vs racional
    const emotionalWords = ['siento', 'emocion', 'pasión', 'amor', 'feliz', 'satisfecho', 'motivado'];
    const rationalWords = ['analizar', 'lógico', 'sistemático', 'método', 'proceso', 'eficiente', 'objetivo'];
    
    const emotionalCount = emotionalWords.reduce((count, word) => 
      count + (allText.includes(word) ? 1 : 0), 0);
    const rationalCount = rationalWords.reduce((count, word) => 
      count + (allText.includes(word) ? 1 : 0), 0);

    if (emotionalCount > rationalCount) {
      patterns.push({
        id: 'emotionally-driven',
        title: 'Impulsado por Emociones',
        description: 'Tus respuestas muestran una fuerte conexión emocional con tus intereses y motivaciones.',
        category: 'strength',
        confidence: 80,
        evidence: [`${emotionalCount} referencias emocionales vs ${rationalCount} racionales`],
        actionableSteps: [
          'Busca roles que te permitan conectar emocionalmente con el trabajo',
          'Considera carreras en servicios humanos, arte, o educación',
          'Desarrolla habilidades de inteligencia emocional'
        ],
        priority: 'medium'
      });
    }

    return patterns;
  };

  // Análisis de personalidad basado en respuestas
  const analyzePersonality = (): PersonalityInsight[] => {
    const insights: PersonalityInsight[] = [];
    
    // Análisis de introversión vs extroversión
    const socialWords = ['equipo', 'gente', 'colaborar', 'social', 'comunidad', 'grupo'];
    const individualWords = ['solo', 'independiente', 'personal', 'privado', 'individual'];
    
    const allText = answers.map(a => a.response).join(' ').toLowerCase();
    const socialCount = socialWords.reduce((count, word) => count + (allText.includes(word) ? 1 : 0), 0);
    const individualCount = individualWords.reduce((count, word) => count + (allText.includes(word) ? 1 : 0), 0);
    
    if (socialCount > individualCount) {
      insights.push({
        trait: 'Orientación Social',
        score: Math.min((socialCount / (socialCount + individualCount)) * 100, 100),
        description: 'Tus respuestas sugieren una preferencia por entornos colaborativos y trabajo en equipo.',
        implications: [
          'Te desempeñas mejor en roles que involucran interacción humana',
          'Considera carreras en gestión, ventas, o servicios',
          'Desarrolla habilidades de liderazgo y comunicación'
        ]
      });
    }

    // Análisis de orientación al futuro
    const futureWords = ['futuro', 'objetivo', 'meta', 'plan', 'visión', 'proyecto', 'crecer'];
    const presentWords = ['ahora', 'actual', 'presente', 'hoy', 'inmediato'];
    
    const futureCount = futureWords.reduce((count, word) => count + (allText.includes(word) ? 1 : 0), 0);
    const presentCount = presentWords.reduce((count, word) => count + (allText.includes(word) ? 1 : 0), 0);
    
    if (futureCount > presentCount) {
      insights.push({
        trait: 'Orientación al Futuro',
        score: Math.min((futureCount / (futureCount + presentCount)) * 100, 100),
        description: 'Muestras una fuerte orientación hacia la planificación y visión a largo plazo.',
        implications: [
          'Excelente para roles estratégicos y de planificación',
          'Considera carreras en consultoría, desarrollo de productos, o emprendimiento',
          'Desarrolla habilidades de pensamiento estratégico'
        ]
      });
    }

    return insights;
  };

  const patterns = analyzePatterns();
  const personalityInsights = analyzePersonality();

  const toggleInsight = (id: string) => {
    const newExpanded = new Set(expandedInsights);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedInsights(newExpanded);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'strength': return <Star className="h-4 w-4" />;
      case 'opportunity': return <Lightbulb className="h-4 w-4" />;
      case 'pattern': return <Brain className="h-4 w-4" />;
      case 'recommendation': return <Target className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'strength': return 'bg-green-100 text-green-800 border-green-200';
      case 'opportunity': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pattern': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'recommendation': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-6 w-6 mr-2" />
            Análisis Avanzado de Patrones
          </CardTitle>
          <CardDescription>
            Insights sofisticados basados en análisis de lenguaje y patrones en tus respuestas
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Patrones Identificados */}
      <div className="space-y-4">
        {patterns.map((pattern) => (
          <Card key={pattern.id} className="hover:shadow-md transition-all duration-200">
            <CardHeader 
              className="cursor-pointer"
              onClick={() => toggleInsight(pattern.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getCategoryColor(pattern.category)}`}>
                    {getCategoryIcon(pattern.category)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{pattern.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {pattern.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getPriorityColor(pattern.priority)}>
                    {pattern.priority}
                  </Badge>
                  <Badge variant="outline">
                    {pattern.confidence}% confianza
                  </Badge>
                  {expandedInsights.has(pattern.id) ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                </div>
              </div>
            </CardHeader>
            
            {expandedInsights.has(pattern.id) && (
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Evidencia */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      Evidencia
                    </h4>
                    <ul className="space-y-1">
                      {pattern.evidence.map((evidence, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start">
                          <ArrowRight className="h-3 w-3 mr-1 mt-1 flex-shrink-0" />
                          {evidence}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pasos Accionables */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center">
                      <Target className="h-4 w-4 mr-1" />
                      Pasos Sugeridos
                    </h4>
                    <ul className="space-y-2">
                      {pattern.actionableSteps.map((step, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                            <span className="text-xs font-semibold text-primary">{index + 1}</span>
                          </div>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Insights de Personalidad */}
      {personalityInsights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Perfil de Personalidad
            </CardTitle>
            <CardDescription>
              Análisis de rasgos de personalidad basado en tus respuestas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {personalityInsights.map((insight, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{insight.trait}</h4>
                    <Badge variant="outline">{Math.round(insight.score)}%</Badge>
                  </div>
                  
                  <Progress value={insight.score} className="h-2" />
                  
                  <p className="text-sm text-muted-foreground">
                    {insight.description}
                  </p>
                  
                  <div>
                    <h5 className="font-medium text-sm mb-2">Implicaciones:</h5>
                    <ul className="space-y-1">
                      {insight.implications.map((implication, impIndex) => (
                        <li key={impIndex} className="text-sm flex items-start">
                          <ArrowRight className="h-3 w-3 mr-1 mt-1 flex-shrink-0" />
                          {implication}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumen Ejecutivo */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Resumen Ejecutivo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white/60 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{patterns.length}</div>
                <div className="text-sm text-green-800">Patrones Identificados</div>
              </div>
              <div className="text-center p-3 bg-white/60 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{personalityInsights.length}</div>
                <div className="text-sm text-blue-800">Rasgos de Personalidad</div>
              </div>
              <div className="text-center p-3 bg-white/60 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(patterns.reduce((sum, p) => sum + p.confidence, 0) / patterns.length)}%
                </div>
                <div className="text-sm text-purple-800">Confianza Promedio</div>
              </div>
            </div>
            
            <div className="bg-white/60 p-4 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Recomendación Principal:</h4>
              <p className="text-sm text-muted-foreground">
                {patterns.length > 0 
                  ? `Basado en el análisis, tu perfil más fuerte es "${patterns[0].title}". ${patterns[0].actionableSteps[0]}`
                  : "Continúa explorando para obtener insights más específicos sobre tu perfil."
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
