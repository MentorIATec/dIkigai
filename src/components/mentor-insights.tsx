'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Target, 
  Lightbulb,
  TrendingUp,
  BookOpen,
  MessageSquare,
  Calendar,
  Star,
  Heart,
  Briefcase,
  Globe,
  Zap,
  ArrowRight,
  Download,
  Share2
} from 'lucide-react';
import { type PurposeAnswer } from '@/lib/purpose-discovery';

interface MentorInsightsProps {
  answers: PurposeAnswer[];
  studentName?: string;
  className?: string;
}

interface MentorRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'conversation' | 'activity' | 'resource' | 'goal';
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  expectedOutcome: string;
  questions: string[];
}

interface StudentProfile {
  strengths: string[];
  growthAreas: string[];
  interests: string[];
  communicationStyle: 'analytical' | 'creative' | 'practical' | 'social';
  motivationLevel: 'high' | 'medium' | 'low';
  engagementStyle: 'independent' | 'collaborative' | 'guided';
}

export function MentorInsights({ answers, studentName = 'Estudiante', className = '' }: MentorInsightsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Análisis del perfil del estudiante para mentores
  const analyzeStudentProfile = (): StudentProfile => {
    const allText = answers.map(a => a.response).join(' ').toLowerCase();
    
    // Análisis de fortalezas
    const strengths: string[] = [];
    if (answers.some(a => a.wordCount > 100)) {
      strengths.push('Reflexión profunda');
    }
    if (answers.length >= 4) {
      strengths.push('Exploración integral');
    }
    if (allText.includes('equipo') || allText.includes('colaborar')) {
      strengths.push('Orientación colaborativa');
    }
    if (allText.includes('futuro') || allText.includes('objetivo')) {
      strengths.push('Visión estratégica');
    }

    // Análisis de áreas de crecimiento
    const growthAreas: string[] = [];
    const categories = new Set(answers.map(a => a.category));
    if (categories.size < 4) {
      growthAreas.push('Exploración de dimensiones faltantes');
    }
    if (answers.some(a => a.wordCount < 50)) {
      growthAreas.push('Profundización en reflexiones');
    }
    if (!allText.includes('plan') && !allText.includes('objetivo')) {
      growthAreas.push('Planificación y objetivos');
    }

    // Análisis de intereses
    const interests: string[] = [];
    const words = allText.split(/\s+/).filter(word => word.length > 4);
    const wordFreq = new Map<string, number>();
    words.forEach(word => {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    });
    
    const frequentWords = Array.from(wordFreq.entries())
      .filter(([_, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
    
    interests.push(...frequentWords);

    // Análisis de estilo de comunicación
    let communicationStyle: 'analytical' | 'creative' | 'practical' | 'social' = 'practical';
    if (allText.includes('analizar') || allText.includes('sistemático')) {
      communicationStyle = 'analytical';
    } else if (allText.includes('crear') || allText.includes('innovar')) {
      communicationStyle = 'creative';
    } else if (allText.includes('equipo') || allText.includes('gente')) {
      communicationStyle = 'social';
    }

    // Análisis de nivel de motivación
    let motivationLevel: 'high' | 'medium' | 'low' = 'medium';
    const motivationWords = ['motivado', 'apasionado', 'energizado', 'inspirado'];
    const motivationCount = motivationWords.reduce((count, word) => 
      count + (allText.includes(word) ? 1 : 0), 0);
    
    if (motivationCount >= 2) {
      motivationLevel = 'high';
    } else if (motivationCount === 0) {
      motivationLevel = 'low';
    }

    // Análisis de estilo de engagement
    let engagementStyle: 'independent' | 'collaborative' | 'guided' = 'guided';
    if (allText.includes('independiente') || allText.includes('solo')) {
      engagementStyle = 'independent';
    } else if (allText.includes('equipo') || allText.includes('colaborar')) {
      engagementStyle = 'collaborative';
    }

    return {
      strengths,
      growthAreas,
      interests,
      communicationStyle,
      motivationLevel,
      engagementStyle
    };
  };

  // Generar recomendaciones para mentores
  const generateMentorRecommendations = (profile: StudentProfile): MentorRecommendation[] => {
    const recommendations: MentorRecommendation[] = [];

    // Recomendaciones basadas en fortalezas
    if (profile.strengths.includes('Reflexión profunda')) {
      recommendations.push({
        id: 'deep-reflection',
        title: 'Facilitar Reflexión Avanzada',
        description: 'El estudiante muestra capacidad de reflexión profunda. Guíalo hacia preguntas más complejas y conexiones interdisciplinarias.',
        category: 'conversation',
        priority: 'high',
        estimatedTime: '30-45 minutos',
        expectedOutcome: 'Mayor claridad en conexiones entre intereses y oportunidades',
        questions: [
          '¿Cómo se conectan tus intereses principales con problemas del mundo real?',
          '¿Qué patrones ves en tus experiencias más satisfactorias?',
          '¿Cómo podrías combinar tus fortalezas de manera única?'
        ]
      });
    }

    // Recomendaciones basadas en áreas de crecimiento
    if (profile.growthAreas.includes('Exploración de dimensiones faltantes')) {
      recommendations.push({
        id: 'explore-missing',
        title: 'Explorar Dimensiones Faltantes',
        description: 'Ayuda al estudiante a explorar las dimensiones del Ikigai que no ha desarrollado completamente.',
        category: 'activity',
        priority: 'high',
        estimatedTime: '20-30 minutos',
        expectedOutcome: 'Visión más completa del propósito personal',
        questions: [
          '¿Qué actividades te hacen sentir más vivo?',
          '¿Qué problemas del mundo te gustaría ayudar a resolver?',
          '¿En qué áreas te reconocen como experto?'
        ]
      });
    }

    // Recomendaciones basadas en estilo de comunicación
    if (profile.communicationStyle === 'analytical') {
      recommendations.push({
        id: 'data-driven-goals',
        title: 'Establecer Metas Basadas en Datos',
        description: 'El estudiante prefiere enfoques analíticos. Usa datos y métricas para establecer objetivos claros.',
        category: 'goal',
        priority: 'medium',
        estimatedTime: '25-35 minutos',
        expectedOutcome: 'Objetivos SMART claramente definidos',
        questions: [
          '¿Qué métricas usarías para medir tu progreso?',
          '¿Cómo dividirías tu objetivo principal en pasos medibles?',
          '¿Qué datos necesitas para tomar decisiones informadas?'
        ]
      });
    }

    // Recomendaciones basadas en nivel de motivación
    if (profile.motivationLevel === 'low') {
      recommendations.push({
        id: 'motivation-boost',
        title: 'Reconectar con Motivaciones',
        description: 'Ayuda al estudiante a reconectar con sus motivaciones intrínsecas y encontrar inspiración.',
        category: 'conversation',
        priority: 'high',
        estimatedTime: '40-50 minutos',
        expectedOutcome: 'Mayor claridad sobre motivaciones personales',
        questions: [
          '¿Cuándo fue la última vez que te sentiste realmente motivado?',
          '¿Qué te inspiraba cuando eras más joven?',
          '¿Qué harías si no tuvieras limitaciones?'
        ]
      });
    }

    // Recomendaciones basadas en intereses
    if (profile.interests.length > 0) {
      recommendations.push({
        id: 'interest-exploration',
        title: 'Profundizar en Intereses Clave',
        description: `Explora más profundamente los intereses identificados: ${profile.interests.join(', ')}.`,
        category: 'resource',
        priority: 'medium',
        estimatedTime: '15-25 minutos',
        expectedOutcome: 'Mayor claridad sobre cómo desarrollar estos intereses',
        questions: [
          '¿Cómo podrías desarrollar más estos intereses?',
          '¿Qué recursos necesitas para profundizar en estas áreas?',
          '¿Cómo se conectan estos intereses con oportunidades profesionales?'
        ]
      });
    }

    return recommendations;
  };

  const studentProfile = analyzeStudentProfile();
  const recommendations = generateMentorRecommendations(studentProfile);

  const filteredRecommendations = selectedCategory === 'all' 
    ? recommendations 
    : recommendations.filter(r => r.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'conversation': return <MessageSquare className="h-4 w-4" />;
      case 'activity': return <Target className="h-4 w-4" />;
      case 'resource': return <BookOpen className="h-4 w-4" />;
      case 'goal': return <TrendingUp className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'conversation': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'activity': return 'bg-green-100 text-green-800 border-green-200';
      case 'resource': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'goal': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
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

  const getCommunicationStyleIcon = (style: string) => {
    switch (style) {
      case 'analytical': return <TrendingUp className="h-4 w-4" />;
      case 'creative': return <Lightbulb className="h-4 w-4" />;
      case 'practical': return <Target className="h-4 w-4" />;
      case 'social': return <Users className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getMotivationColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExport = () => {
    const data = {
      estudiante: studentName,
      perfil: studentProfile,
      recomendaciones: recommendations,
      fecha: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `perfil-mentor-${studentName.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-6 w-6 mr-2" />
            Información para Mentores
          </CardTitle>
          <CardDescription>
            Análisis detallado del perfil de {studentName} para facilitar el mentoring efectivo
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Perfil del Estudiante */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="h-5 w-5 mr-2" />
            Perfil del Estudiante
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Fortalezas y Áreas de Crecimiento */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-sm mb-3 flex items-center">
                <Heart className="h-4 w-4 mr-1" />
                Fortalezas Identificadas
              </h4>
              <div className="space-y-2">
                {studentProfile.strengths.map((strength, index) => (
                  <Badge key={index} variant="secondary" className="mr-2 mb-2">
                    {strength}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-sm mb-3 flex items-center">
                <Target className="h-4 w-4 mr-1" />
                Áreas de Crecimiento
              </h4>
              <div className="space-y-2">
                {studentProfile.growthAreas.map((area, index) => (
                  <Badge key={index} variant="outline" className="mr-2 mb-2">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Características del Estudiante */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="flex justify-center mb-2">
                {getCommunicationStyleIcon(studentProfile.communicationStyle)}
              </div>
              <h5 className="font-semibold text-sm">Estilo de Comunicación</h5>
              <p className="text-sm text-muted-foreground capitalize">
                {studentProfile.communicationStyle}
              </p>
            </div>
            
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="flex justify-center mb-2">
                <Zap className="h-4 w-4" />
              </div>
              <h5 className="font-semibold text-sm">Nivel de Motivación</h5>
              <Badge className={getMotivationColor(studentProfile.motivationLevel)}>
                {studentProfile.motivationLevel}
              </Badge>
            </div>
            
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="flex justify-center mb-2">
                <Users className="h-4 w-4" />
              </div>
              <h5 className="font-semibold text-sm">Estilo de Engagement</h5>
              <p className="text-sm text-muted-foreground capitalize">
                {studentProfile.engagementStyle}
              </p>
            </div>
          </div>

          {/* Intereses Clave */}
          {studentProfile.interests.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-3 flex items-center">
                <Globe className="h-4 w-4 mr-1" />
                Intereses Clave Identificados
              </h4>
              <div className="flex flex-wrap gap-2">
                {studentProfile.interests.map((interest, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recomendaciones para Mentores */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2" />
                Recomendaciones para Mentoring
              </CardTitle>
              <CardDescription>
                Estrategias específicas basadas en el perfil del estudiante
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-1" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              Todas
            </Button>
            <Button
              variant={selectedCategory === 'conversation' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('conversation')}
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              Conversaciones
            </Button>
            <Button
              variant={selectedCategory === 'activity' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('activity')}
            >
              <Target className="h-3 w-3 mr-1" />
              Actividades
            </Button>
            <Button
              variant={selectedCategory === 'resource' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('resource')}
            >
              <BookOpen className="h-3 w-3 mr-1" />
              Recursos
            </Button>
            <Button
              variant={selectedCategory === 'goal' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('goal')}
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              Objetivos
            </Button>
          </div>

          {/* Lista de Recomendaciones */}
          <div className="space-y-4">
            {filteredRecommendations.map((recommendation) => (
              <Card key={recommendation.id} className="hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getCategoryColor(recommendation.category)}`}>
                        {getCategoryIcon(recommendation.category)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {recommendation.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(recommendation.priority)}>
                        {recommendation.priority}
                      </Badge>
                      <Badge variant="outline">
                        {recommendation.estimatedTime}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {/* Resultado Esperado */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Resultado Esperado
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {recommendation.expectedOutcome}
                      </p>
                    </div>

                    {/* Preguntas Sugeridas */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Preguntas Sugeridas
                      </h4>
                      <ul className="space-y-2">
                        {recommendation.questions.map((question, index) => (
                          <li key={index} className="text-sm flex items-start">
                            <ArrowRight className="h-3 w-3 mr-2 mt-1 flex-shrink-0" />
                            {question}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
