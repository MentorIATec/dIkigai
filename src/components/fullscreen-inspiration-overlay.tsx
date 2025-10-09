'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Sparkles, Heart, Brain, Activity, DollarSign, Users, Bird, Briefcase, ArrowRight, CheckCircle } from 'lucide-react';
import type { CuratedGoal } from '@/lib/types';

interface FullscreenInspirationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  stageTitle: string;
  onGenerateGoal: (dimension: string) => void;
}

const dimensions = [
  { id: 'emocional', label: 'Emocional', icon: Heart, color: 'text-red-500', bgColor: 'bg-red-50', hoverColor: 'hover:bg-red-100' },
  { id: 'intelectual', label: 'Intelectual', icon: Brain, color: 'text-pink-500', bgColor: 'bg-pink-50', hoverColor: 'hover:bg-pink-100' },
  { id: 'fisica', label: 'Física', icon: Activity, color: 'text-yellow-500', bgColor: 'bg-yellow-50', hoverColor: 'hover:bg-yellow-100' },
  { id: 'financiera', label: 'Financiera', icon: DollarSign, color: 'text-green-500', bgColor: 'bg-green-50', hoverColor: 'hover:bg-green-100' },
  { id: 'social', label: 'Social', icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-50', hoverColor: 'hover:bg-blue-100' },
  { id: 'espiritual', label: 'Espiritual', icon: Bird, color: 'text-purple-500', bgColor: 'bg-purple-50', hoverColor: 'hover:bg-purple-100' },
  { id: 'ocupacional', label: 'Ocupacional', icon: Briefcase, color: 'text-orange-500', bgColor: 'bg-orange-50', hoverColor: 'hover:bg-orange-100' },
];

export function FullscreenInspirationOverlay({ isOpen, onClose, stageTitle, onGenerateGoal }: FullscreenInspirationOverlayProps) {
  const [selectedDimension, setSelectedDimension] = useState<string | null>(null);
  const [step, setStep] = useState<'select' | 'customize' | 'results'>('select');

  const handleDimensionSelect = (dimension: string) => {
    setSelectedDimension(dimension);
    setStep('customize');
  };

  const handleGenerate = () => {
    if (selectedDimension) {
      onGenerateGoal(selectedDimension);
      setStep('results');
    }
  };

  const handleReset = () => {
    setSelectedDimension(null);
    setStep('select');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-50 to-pink-50">
            <div>
              <h2 className="text-2xl font-bold text-purple-900">Generador de Inspiración</h2>
              <p className="text-purple-700 mt-1">Crea metas personalizadas para tu etapa de {stageTitle}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {step === 'select' && (
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold mb-4">¿En qué dimensión del bienestar te gustaría enfocarte?</h3>
                  <p className="text-lg text-muted-foreground">
                    Selecciona una dimensión para recibir metas personalizadas específicas para esa área
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {dimensions.map((dimension) => {
                    const IconComponent = dimension.icon;
                    return (
                      <Card 
                        key={dimension.id}
                        className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${dimension.bgColor} border-2 hover:border-primary/30`}
                        onClick={() => handleDimensionSelect(dimension.id)}
                      >
                        <CardContent className="p-6 text-center">
                          <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${dimension.bgColor} flex items-center justify-center ${dimension.hoverColor} transition-colors`}>
                            <IconComponent className={`h-8 w-8 ${dimension.color}`} />
                          </div>
                          <h4 className="font-semibold text-lg">{dimension.label}</h4>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 'customize' && selectedDimension && (
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                    {(() => {
                      const dimension = dimensions.find(d => d.id === selectedDimension);
                      const IconComponent = dimension?.icon || Sparkles;
                      return <IconComponent className="h-10 w-10 text-purple-600" />;
                    })()}
                  </div>
                  <h3 className="text-3xl font-bold mb-4">
                    Personalizando metas para {dimensions.find(d => d.id === selectedDimension)?.label}
                  </h3>
                  <p className="text-lg text-muted-foreground mb-6">
                    Estamos preparando metas específicas para esta dimensión. ¿Listo para generar?
                  </p>
                </div>

                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                  <CardContent className="p-8">
                    <div className="text-center space-y-6">
                      <div className="space-y-4">
                        <h4 className="text-xl font-semibold">¿Qué incluirá tu inspiración?</h4>
                        <div className="grid gap-3 text-left">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span>Metas específicas para {stageTitle}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span>Pasos de acción detallados</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span>Enfoque en {dimensions.find(d => d.id === selectedDimension)?.label}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-4 justify-center">
                        <Button variant="outline" onClick={handleReset}>
                          <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                          Cambiar dimensión
                        </Button>
                        <Button onClick={handleGenerate} className="bg-purple-600 hover:bg-purple-700">
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generar Inspiración
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {step === 'results' && (
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">¡Inspiración Generada!</h3>
                  <p className="text-lg text-muted-foreground">
                    Hemos creado metas personalizadas para tu dimensión {dimensions.find(d => d.id === selectedDimension)?.label}
                  </p>
                </div>

                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardContent className="p-8">
                    <div className="text-center space-y-6">
                      <p className="text-lg">
                        Tu inspiración personalizada está lista. Las metas han sido generadas basándose en tu etapa académica y la dimensión seleccionada.
                      </p>
                      
                      <div className="flex gap-4 justify-center">
                        <Button variant="outline" onClick={handleReset}>
                          Generar otra inspiración
                        </Button>
                        <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
                          Ver mis metas
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
