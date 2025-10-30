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
  ArrowDown,
  RefreshCw,
  Download,
  Share2,
  BookOpen,
  Trophy,
  Sparkles,
  Compass,
  Zap,
  Users
} from 'lucide-react';
import { 
  type PurposeAnswer, 
  type PurposeInsight,
  PURPOSE_INSIGHTS,
  generateInsights,
  calculateProgress,
  determineStage
} from '@/lib/purpose-discovery';
import { IkigaiVisualization } from './ikigai-visualization';

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
  pasion: '🔥',      // Lo que amas
  mision: '🌍',      // Lo que el mundo necesita  
  vocacion: '💼',    // Aquello por lo que te pudieran pagar
  profesion: '⭐'     // En lo que eres bueno
};

const STAGE_DESCRIPTIONS = {
  exploration: {
    title: 'Exploración',
    description: 'Estás comenzando a explorar quién eres y qué te motiva',
    color: 'bg-blue-100 text-blue-800',
    icon: <Compass className="h-4 w-4" />,
    order: 1,
    progressRange: '0-24%'
  },
  clarity: {
    title: 'Claridad',
    description: 'Tienes una comprensión más clara de tus valores y pasiones',
    color: 'bg-green-100 text-green-800',
    icon: <Lightbulb className="h-4 w-4" />,
    order: 2,
    progressRange: '25-49%'
  },
  action: {
    title: 'Alineación',
    description: 'Estás alineando tus valores, pasiones y habilidades hacia tu propósito',
    color: 'bg-yellow-100 text-yellow-800',
    icon: <Target className="h-4 w-4" />,
    order: 3,
    progressRange: '50-74%'
  },
  refinement: {
    title: 'Vivir el Propósito',
    description: 'Estás viviendo y perfeccionando tu propósito de forma activa',
    color: 'bg-purple-100 text-purple-800',
    icon: <Trophy className="h-4 w-4" />,
    order: 4,
    progressRange: '75-100%'
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

  // Generar declaración de propósito con estructura básica y palabras clave
  const generatePurposeStatement = (): string => {
    return `Tu Ikigai está tomando forma.

Usa lo que ya compartiste en "Exploración por Categorías" y tus "Insights Clave" para construir tu propósito:

Mi propósito es [LO QUE AMAS HACER] para [QUIÉN NECESITA AYUDA], 
utilizando mis habilidades en [EN LO QUE ERES BUENO] y 
contribuyendo a [QUÉ PROBLEMA QUIERES RESOLVER].

Ejemplo:
"Mi propósito es enseñar a estudiantes que necesitan apoyo, 
utilizando mis habilidades en comunicación y 
contribuyendo a una educación más accesible."

💡 Revisa tus respuestas anteriores para encontrar las palabras que resuenan contigo.`;
  };

  // Función helper para extraer temas de respuestas específicas
  const extractThemesFromAnswers = (specificAnswers: PurposeAnswer[]): string[] => {
    if (specificAnswers.length === 0) return [];
    
    const allText = specificAnswers.map(a => a.response).join(' ');
    const words = allText.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => 
        word.length > 4 && 
        !['que', 'para', 'como', 'donde', 'cuando', 'porque', 'desde', 'hasta', 'sobre', 'bajo', 'entre', 'hacia', 'tengo', 'quiero', 'puedo', 'debo', 'necesito'].includes(word)
      );
    
    // Contar frecuencia de palabras
    const wordCount = new Map<string, number>();
    words.forEach(word => {
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    });
    
    return Array.from(wordCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([word]) => word);
  };

  const handleSavePurpose = () => {
    if (purposeStatement.trim()) {
      onSavePurpose(purposeStatement);
      setIsEditingStatement(false);
    }
  };

  const handleExport = () => {
    const fecha = new Date().toLocaleDateString('es-MX', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Agrupar respuestas por categoría
    const respuestasPorCategoria = answers.reduce((acc, answer) => {
      if (!acc[answer.category]) {
        acc[answer.category] = [];
      }
      acc[answer.category].push({
        pregunta: PURPOSE_INSIGHTS.find(i => i.triggerAnswers.includes(answer.questionId))?.title || 'Pregunta',
        respuesta: answer.response
      });
      return acc;
    }, {} as Record<string, Array<{ pregunta: string; respuesta: string }>>);

    // Función para convertir clave de categoría a nombre legible
    const getCategoryName = (cat: string): string => {
      const names: Record<string, string> = {
        pasion: 'Pasión',
        mision: 'Misión',
        vocacion: 'Vocación',
        profesion: 'Profesión',
        carrera: 'Carrera'
      };
      return names[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
    };

    // Construir contenido del archivo
    let contenido = 'MI PROPÓSITO IKIGAI - RESULTADOS\n';
    contenido += '='.repeat(50) + '\n\n';
    contenido += `Fecha: ${fecha}\n`;
    contenido += `Etapa: ${stageInfo.title}\n\n`;
    contenido += '━'.repeat(50) + '\n\n';

    // Sección de Respuestas
    contenido += 'MIS RESPUESTAS POR CATEGORÍA\n\n';
    Object.entries(respuestasPorCategoria).forEach(([categoria, respuestas]) => {
      contenido += `${getCategoryName(categoria).toUpperCase()}\n`;
      contenido += '-'.repeat(30) + '\n';
      respuestas.forEach((item, index) => {
        contenido += `${index + 1}. ${item.pregunta}\n`;
        contenido += `   ${item.respuesta}\n\n`;
      });
    });

    // Sección de Insights (mostrar todos para referencia completa)
    if (insights.length > 0) {
      contenido += '━'.repeat(50) + '\n\n';
      contenido += 'INSIGHTS CLAVE\n';
      contenido += '(Nota: En la pantalla se muestran los 2 principales. Aquí encontrarás todos)\n\n';
      insights.forEach((insight, index) => {
        contenido += `${index + 1}. ${insight.title}\n`;
        contenido += `   ${insight.description}\n`;
        if (insight.actionableSteps && insight.actionableSteps.length > 0) {
          contenido += `   Pasos sugeridos:\n`;
          insight.actionableSteps.slice(0, 3).forEach((step) => {
            contenido += `   • ${step}\n`;
          });
        }
        contenido += '\n';
      });
    }

    // Sección de Declaración de Propósito
    if (purposeStatement) {
      contenido += '━'.repeat(50) + '\n\n';
      contenido += 'MI DECLARACIÓN DE PROPÓSITO\n\n';
      contenido += purposeStatement + '\n\n';
    }

    contenido += '━'.repeat(50) + '\n';
    contenido += `Generado desde dIkigai - ${new Date().getFullYear()}\n`;

    // Crear y descargar archivo
    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fechaArchivo = new Date().toISOString().split('T')[0];
    link.download = `mi-proposito-ikigai-${fechaArchivo}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
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
            Has completado un viaje profundo de autoconocimiento. Explora tus insights desde diferentes perspectivas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Badge de etapa actual */}
          <div className="flex justify-center">
            <Badge className={`${stageInfo.color} text-sm px-3 py-1`}>
              {stageInfo.icon}
              <span className="ml-1">{stageInfo.title}</span>
            </Badge>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            {stageInfo.description}
          </p>

          {/* Escala de desarrollo visual */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs font-medium text-center text-muted-foreground mb-3">
              Tu nivel de desarrollo en el propósito
            </p>
            <p className="text-xs text-center text-gray-500 mb-4">
              Basado en las categorías del Ikigai que has explorado
            </p>
            <div className="flex items-center justify-between gap-2">
              {Object.values(STAGE_DESCRIPTIONS)
                .sort((a, b) => a.order - b.order)
                .map((stage, index) => {
                  const isActive = stage.title === stageInfo.title;
                  const stages = Object.values(STAGE_DESCRIPTIONS).sort((a, b) => a.order - b.order);
                  const isLast = index === stages.length - 1;
                  const isCompleted = stages.findIndex(s => s.title === stageInfo.title) > index;
                  
                  return (
                    <div key={stage.title} className="flex items-center flex-1">
                      <div className="flex flex-col items-center flex-1 relative">
                        {/* Círculo de etapa */}
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                            isActive
                              ? `${stage.color} scale-110 ring-2 ring-offset-2 ring-current shadow-md`
                              : isCompleted
                              ? 'bg-gray-300 text-gray-600'
                              : 'bg-gray-200 text-gray-400'
                          }`}
                          title={stage.description}
                        >
                          {isActive ? stage.icon : isCompleted ? <Trophy className="h-4 w-4" /> : index + 1}
                        </div>
                        {/* Nombre de etapa */}
                        <p
                          className={`text-xs mt-2 text-center font-medium ${
                            isActive ? 'text-gray-900' : isCompleted ? 'text-gray-600' : 'text-gray-400'
                          }`}
                        >
                          {stage.title}
                        </p>
                      </div>
                      {/* Línea conectora */}
                      {!isLast && (
                        <div
                          className={`flex-1 h-0.5 mx-1 transition-colors ${
                            isCompleted || isActive || stages[index + 1].title === stageInfo.title
                              ? 'bg-gray-300'
                              : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diagrama de Venn del Ikigai */}
      <IkigaiVisualization answers={answers} />

      {/* Exploración por categorías con texto del estudiante */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Exploración por Categorías
          </CardTitle>
          <CardDescription>
            Revisa tus respuestas y cómo se conectan con tu Ikigai
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(categoryStats).map(([category, count]) => {
                  const categoryAnswers = answers.filter(a => a.category === category);
                  const categoryEmoji = CATEGORY_EMOJIS[category as keyof typeof CATEGORY_EMOJIS];
                  
                  return (
                    <Card key={category} className="hover:shadow-md transition-all duration-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{categoryEmoji}</span>
                          <CardTitle className="text-lg">
                            {category === 'pasion' ? 'Pasión' :
                             category === 'mision' ? 'Misión' :
                             category === 'vocacion' ? 'Vocación' :
                             category === 'profesion' ? 'Profesión' :
                             category === 'carrera' ? 'Carrera' :
                             category.replace('_', ' ')}
                          </CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {count} respuesta{count !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        {categoryAnswers.length > 0 ? (
                          <div className="space-y-3">
                            {categoryAnswers.map((answer, index) => (
                              <div key={index} className="bg-muted/30 p-3 rounded-lg">
                                <p className="text-sm leading-relaxed">
                                  {answer.response.length > 150 
                                    ? `${answer.response.substring(0, 150)}...` 
                                    : answer.response
                                  }
                                </p>
                                {answer.response.length > 150 && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="mt-2 text-xs"
                                    onClick={() => {
                                      // Aquí podrías implementar un modal para mostrar el texto completo
                                      alert(answer.response);
                                    }}
                                  >
                                    Ver respuesta completa
                                  </Button>
                                )}
                                
                                {/* Análisis especial para carrera */}
                                {category === 'carrera' && (
                                  <div className="mt-3 p-2 bg-blue-50 border-l-2 border-blue-200 rounded">
                                    <p className="text-xs text-blue-700 font-medium mb-1">
                                      💡 Análisis de carrera:
                                    </p>
                                    <p className="text-xs text-blue-600">
                                      Tu visión de carrera muestra {answer.response.includes('liderazgo') || answer.response.includes('líder') ? 'orientación hacia el liderazgo' : 'enfoque en desarrollo profesional'}. 
                                      {answer.response.includes('innovación') || answer.response.includes('innovador') ? ' Considera explorar roles que valoren la innovación.' : ''}
                                      {answer.response.includes('mentor') || answer.response.includes('enseñar') ? ' Tu interés en mentoría sugiere potencial para roles de desarrollo de talento.' : ''}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">
                            No hay respuestas en esta categoría
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
          </div>
        </CardContent>
      </Card>

      {/* Insights Clave - Inspiración para la declaración */}
      {insights.length > 0 && (
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-800">
              <Lightbulb className="h-5 w-5 mr-2" />
              💡 Insights Clave - Tu Inspiración
            </CardTitle>
            <CardDescription className="text-yellow-700">
              Los patrones más importantes identificados en tus respuestas. Úsalos como inspiración para construir tu declaración de propósito.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.slice(0, 2).map((insight) => (
                    <Card 
                      key={insight.id} 
                      className="cursor-pointer transition-all hover:shadow-md"
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
                              {insight.actionableSteps.slice(0, 3).map((step, index) => (
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
          </CardContent>
        </Card>
      )}

      {/* Declaración de propósito */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Mi Propósito de Vida
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isEditingStatement ? (
            <div>
              {purposeStatement ? (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-l-4 border-green-400">
                      <p className="text-lg font-medium leading-relaxed whitespace-pre-line">{purposeStatement}</p>
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
                    className="w-full p-6 border rounded-lg min-h-[200px] resize-none text-base leading-relaxed"
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

      {/* Siguientes Pasos - Instrucciones concisas */}
      <Card className="bg-gradient-to-r from-blue-50/50 to-green-50/50 border-blue-100">
        <CardContent className="pt-6 pb-5">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 py-3">
            <div className="flex flex-col items-center text-center group">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2 transition-transform group-hover:scale-110">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <p className="font-semibold text-sm">Guarda tu Propósito</p>
              <p className="text-xs text-muted-foreground mt-1">Ve a Mi Vida Tec → Guarda en Plan de Vida</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground hidden md:block" />
            <ArrowDown className="h-5 w-5 text-muted-foreground block md:hidden" />
            <div className="flex flex-col items-center text-center group">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2 transition-transform group-hover:scale-110">
                <Lightbulb className="h-6 w-6 text-green-600" />
              </div>
              <p className="font-semibold text-sm">Define Metas</p>
              <p className="text-xs text-muted-foreground mt-1">Alineadas con tu Ikigai</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-100/50">
            <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-blue-500" />
              <span>
                <strong>Sugerencia:</strong> Comparte tus resultados con tu mentor/a para profundizar en tu propósito y definir metas alineadas.
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Acciones */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar Resultados
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={async (e) => {
                const button = e.currentTarget;
                const textoCompartir = purposeStatement 
                  ? `Mi Propósito Ikigai:\n\n${purposeStatement}\n\nGenerado desde dIkigai`
                  : 'He completado el test de propósito Ikigai en dIkigai';

                // Intentar usar Web Share API (solo funciona en HTTPS)
                if (navigator.share) {
                  try {
                    await navigator.share({
                      title: 'Mi Propósito Ikigai',
                      text: textoCompartir,
                      url: window.location.href
                    });
                    return;
                  } catch (error) {
                    // Si el usuario cancela, no hacer nada más
                    if (error instanceof Error && error.name === 'AbortError') {
                      return;
                    }
                    // Si hay otro error, continuar con fallback
                    console.error('Error compartiendo:', error);
                  }
                }

                // Fallback 1: Intentar usar Clipboard API moderna
                if (navigator.clipboard && navigator.clipboard.writeText) {
                  try {
                    await navigator.clipboard.writeText(textoCompartir);
                    const originalText = button.textContent;
                    button.textContent = '¡Copiado!';
                    setTimeout(() => {
                      button.textContent = originalText;
                    }, 2000);
                    return;
                  } catch (error) {
                    console.error('Error copiando al portapapeles:', error);
                    // Continuar con fallback alternativo
                  }
                }

                // Fallback 2: Método compatible antiguo (crear elemento temporal)
                try {
                  const textArea = document.createElement('textarea');
                  textArea.value = textoCompartir;
                  textArea.style.position = 'fixed';
                  textArea.style.left = '-999999px';
                  textArea.style.top = '-999999px';
                  document.body.appendChild(textArea);
                  textArea.focus();
                  textArea.select();
                  
                  const successful = document.execCommand('copy');
                  document.body.removeChild(textArea);
                  
                  if (successful) {
                    const originalText = button.textContent;
                    button.textContent = '¡Copiado!';
                    setTimeout(() => {
                      button.textContent = originalText;
                    }, 2000);
                    return;
                  }
                } catch (error) {
                  console.error('Error con método alternativo:', error);
                }

                // Último recurso: Mostrar en un área de texto seleccionable
                const modal = document.createElement('div');
                modal.style.cssText = `
                  position: fixed;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background: rgba(0, 0, 0, 0.5);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  z-index: 9999;
                `;
                
                const content = document.createElement('div');
                content.style.cssText = `
                  background: white;
                  padding: 24px;
                  border-radius: 8px;
                  max-width: 500px;
                  width: 90%;
                  max-height: 80vh;
                  overflow-y: auto;
                `;
                
                const title = document.createElement('h3');
                title.textContent = 'Copia tu Propósito';
                title.style.cssText = 'margin: 0 0 16px 0; font-weight: 600;';
                
                const textarea = document.createElement('textarea');
                textarea.value = textoCompartir;
                textarea.readOnly = true;
                textarea.style.cssText = `
                  width: 100%;
                  min-height: 150px;
                  padding: 12px;
                  border: 1px solid #ddd;
                  border-radius: 4px;
                  font-family: inherit;
                  font-size: 14px;
                  resize: vertical;
                `;
                
                const closeBtn = document.createElement('button');
                closeBtn.textContent = 'Cerrar';
                closeBtn.style.cssText = `
                  margin-top: 16px;
                  padding: 8px 16px;
                  background: #007bff;
                  color: white;
                  border: none;
                  border-radius: 4px;
                  cursor: pointer;
                `;
                closeBtn.onclick = () => {
                  document.body.removeChild(modal);
                  textarea.select();
                };
                
                content.appendChild(title);
                content.appendChild(textarea);
                content.appendChild(closeBtn);
                modal.appendChild(content);
                document.body.appendChild(modal);
                
                // Seleccionar texto automáticamente
                setTimeout(() => {
                  textarea.focus();
                  textarea.select();
                }, 100);
              }}
            >
              <Share2 className="h-4 w-4" />
              Compartir
            </Button>
            <Button onClick={onRestart} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Reiniciar Test
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
