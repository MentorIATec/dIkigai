'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sparkles, Eye, Plus, ArrowRight, Target, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { curatedGoalBankExtended } from '@/lib/curated-goals';
import type { CuratedGoal } from '@/lib/types';

interface FirstSemesterMiniProps {
  onGenerateGoal: () => void;
  onOpenTemplate: () => void;
}

const WELLNESS_DIMENSIONS = [
  { id: 'emocional', label: 'Emocional', icon: '❤️' },
  { id: 'intelectual', label: 'Intelectual', icon: '🧠' },
  { id: 'fisica', label: 'Física', icon: '💪' },
  { id: 'financiera', label: 'Financiera', icon: '💰' },
  { id: 'social', label: 'Social', icon: '👥' },
  { id: 'espiritual', label: 'Espiritual', icon: '🕊️' },
  { id: 'ocupacional', label: 'Ocupacional', icon: '💼' },
];

export function FirstSemesterMini({ onGenerateGoal, onOpenTemplate }: FirstSemesterMiniProps) {
  const [selectedDimension, setSelectedDimension] = useState<string | null>(null);
  const [suggestedGoal, setSuggestedGoal] = useState<CuratedGoal | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateGoal = () => {
    setIsGenerating(true);
    
    // Simular delay de generación
    setTimeout(() => {
      const exploracionGoals = curatedGoalBankExtended.exploracion?.metas || [];
      const longitudinalGoals = curatedGoalBankExtended.graduacion?.metas || []; // Mapeado desde longitudinal
      
      let filteredGoals = [...exploracionGoals, ...longitudinalGoals];
      
      // Filtrar por dimensión seleccionada si existe
      if (selectedDimension) {
        filteredGoals = filteredGoals.filter(goal => 
          goal.dimension.toLowerCase() === selectedDimension.toLowerCase()
        );
      }
      
      // Si no hay metas para la dimensión seleccionada, usar todas
      if (filteredGoals.length === 0) {
        filteredGoals = [...exploracionGoals, ...longitudinalGoals];
      }
      
      if (filteredGoals.length > 0) {
        const randomGoal = filteredGoals[Math.floor(Math.random() * filteredGoals.length)];
        setSuggestedGoal(randomGoal);
      }
      
      setIsGenerating(false);
    }, 1000);
  };

  useEffect(() => {
    // Generar meta inicial
    generateGoal();
  }, []);

  const handleDimensionSelect = (dimension: string) => {
    setSelectedDimension(dimension);
    generateGoal();
  };

  const handleRegenerate = () => {
    generateGoal();
  };

  return (
    <div className="space-y-6">
      {/* Pide inspiración */}
      <Card className="bg-gradient-to-br from-purple-50/80 to-pink-100/60 border-purple-200/60">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Pide inspiración
          </CardTitle>
          <CardDescription>
            Selecciona una dimensión del bienestar para recibir ejemplos de metas personalizadas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {WELLNESS_DIMENSIONS.map((dimension) => (
              <Button
                key={dimension.id}
                variant={selectedDimension === dimension.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleDimensionSelect(dimension.id)}
                className="h-auto p-3 flex flex-col items-center gap-1"
              >
                <span className="text-lg">{dimension.icon}</span>
                <span className="text-xs">{dimension.label}</span>
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleRegenerate} 
              variant="outline" 
              size="sm"
              disabled={isGenerating}
              className="flex-1"
            >
              <RefreshCw className={`mr-2 h-3 w-3 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Generando...' : 'Otra inspiración'}
            </Button>
            <Button onClick={onOpenTemplate} size="sm" className="flex-1">
              <Target className="mr-2 h-3 w-3" />
              Crear desde cero
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Meta sugerida */}
      {suggestedGoal && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Meta sugerida
              {selectedDimension && (
                <Badge variant="secondary" className="ml-2">
                  {WELLNESS_DIMENSIONS.find(d => d.id === selectedDimension)?.icon} {WELLNESS_DIMENSIONS.find(d => d.id === selectedDimension)?.label}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Ejemplo de meta basada en tu selección y etapa de exploración
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4 bg-muted/30">
              <div className="flex items-start justify-between mb-2">
                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {suggestedGoal.dimension}
                  </Badge>
                  <Badge variant="outline" className="text-xs capitalize">
                    {suggestedGoal.categoria}
                  </Badge>
                </div>
                <span className="text-xs font-mono text-muted-foreground">
                  {suggestedGoal.id}
                </span>
              </div>
              
              <h4 className="font-semibold text-sm mb-2 leading-tight">
                {suggestedGoal.metaSmarter}
              </h4>
              
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-3 w-3" />
                      Ver detalles
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <div className="flex gap-2">
                          <Badge variant="secondary">{suggestedGoal.dimension}</Badge>
                          <Badge variant="outline" className="capitalize">
                            {suggestedGoal.categoria}
                          </Badge>
                        </div>
                      </DialogTitle>
                      <DialogDescription>
                        Meta sugerida para tu primer semestre
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Objetivo</h4>
                        <p className="text-sm leading-relaxed">
                          {suggestedGoal.metaSmarter}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Pasos sugeridos</h4>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {suggestedGoal.pasosAccion}
                        </p>
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button asChild className="flex-1">
                          <Link href={`/goals/new?template=${suggestedGoal.id}`}>
                            <Plus className="mr-2 h-4 w-4" />
                            Agregar a mis metas
                          </Link>
                        </Button>
                        <Button asChild variant="outline" className="flex-1">
                          <Link href={`/goals/new?template=${suggestedGoal.id}`}>
                            <ArrowRight className="mr-2 h-4 w-4" />
                            Usar como plantilla
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button asChild size="sm">
                  <Link href={`/goals/new?template=${suggestedGoal.id}`}>
                    <Plus className="mr-2 h-3 w-3" />
                    Agregar
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Acceso rápido */}
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Acceso rápido</CardTitle>
          <CardDescription>
            Otras opciones para definir tus metas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <Button asChild variant="outline" className="h-auto p-4">
              <Link href="#catalog">
                <Target className="mr-2 h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium">Explorar catálogo</div>
                  <div className="text-xs text-muted-foreground">
                    Ver todas las metas disponibles
                  </div>
                </div>
                <ArrowRight className="ml-auto h-4 w-4" />
              </Link>
            </Button>
            
            <Button asChild className="h-auto p-4">
              <Link href="/goals/new">
                <Target className="mr-2 h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium">Crear meta nueva</div>
                  <div className="text-xs text-muted-foreground">
                    Desde cero con plantilla
                  </div>
                </div>
                <ArrowRight className="ml-auto h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
