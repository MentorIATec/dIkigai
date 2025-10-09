'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Heart, Brain, Activity, DollarSign, Users, Bird, Briefcase, RefreshCw, Target } from 'lucide-react';

interface InspirationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateGoal: (dimension: string) => void;
  stage: string;
}

const wellBeingDimensions = [
  { id: 'emocional', label: 'Emocional', icon: Heart, color: 'text-red-500', bgColor: 'bg-red-50' },
  { id: 'intelectual', label: 'Intelectual', icon: Brain, color: 'text-pink-500', bgColor: 'bg-pink-50' },
  { id: 'fisica', label: 'Física', icon: Activity, color: 'text-yellow-500', bgColor: 'bg-yellow-50' },
  { id: 'financiera', label: 'Financiera', icon: DollarSign, color: 'text-green-500', bgColor: 'bg-green-50' },
  { id: 'social', label: 'Social', icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-50' },
  { id: 'espiritual', label: 'Espiritual', icon: Bird, color: 'text-purple-500', bgColor: 'bg-purple-50' },
  { id: 'ocupacional', label: 'Ocupacional', icon: Briefcase, color: 'text-orange-500', bgColor: 'bg-orange-50' },
];

export function InspirationModal({ isOpen, onClose, onGenerateGoal, stage }: InspirationModalProps) {
  const [selectedDimension, setSelectedDimension] = useState<string | null>(null);

  const handleDimensionSelect = (dimension: string) => {
    setSelectedDimension(dimension);
    onGenerateGoal(dimension);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-purple-600" />
            Generador de Inspiración
          </DialogTitle>
          <DialogDescription className="text-base">
            Selecciona una dimensión del bienestar para recibir ejemplos de metas personalizadas para tu etapa de {stage}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Grid de dimensiones */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {wellBeingDimensions.map((dimension) => {
              const IconComponent = dimension.icon;
              return (
                <Card 
                  key={dimension.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${dimension.bgColor} border-2 hover:border-primary/30`}
                  onClick={() => handleDimensionSelect(dimension.id)}
                >
                  <CardContent className="p-6 text-center space-y-3">
                    <div className={`w-12 h-12 mx-auto rounded-full bg-white/80 flex items-center justify-center shadow-sm`}>
                      <IconComponent className={`h-6 w-6 ${dimension.color}`} />
                    </div>
                    <h3 className="font-semibold text-sm">{dimension.label}</h3>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Acciones adicionales */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onGenerateGoal('random')}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Otra inspiración
            </Button>
            <Button 
              className="flex-1"
              onClick={() => onGenerateGoal('custom')}
            >
              <Target className="mr-2 h-4 w-4" />
              Crear desde cero
            </Button>
          </div>

          {/* Información adicional */}
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">¿Cómo funciona?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Selecciona una dimensión para recibir metas específicas de esa área</p>
              <p>• Las metas están adaptadas a tu etapa académica actual</p>
              <p>• Puedes personalizar cualquier meta generada</p>
              <p>• Todas las metas siguen el formato SMARTER</p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
