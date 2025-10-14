'use client';

import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Sparkles, Target, Plus, Briefcase, Brain, Users, Heart, DollarSign, Leaf, Lightbulb } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { curatedGoalBankExtended } from '@/lib/curated-goals';
import type { SemesterStage, CuratedGoal } from '@/lib/types';

interface InspirationModalProps {
  isOpen: boolean;
  onClose: () => void;
  stage: SemesterStage;
  onSelectGoal?: (goalId: string) => void;
}

// Dimensiones del bienestar con sus iconos y colores
const WELLBEING_DIMENSIONS = [
  {
    id: 'Ocupacional',
    name: 'Ocupacional',
    icon: Briefcase,
    color: 'blue',
    description: 'Carrera, desarrollo profesional y crecimiento laboral',
    gradient: 'from-blue-50 to-blue-100',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-900',
    bgColor: 'bg-blue-600'
  },
  {
    id: 'Intelectual',
    name: 'Intelectual',
    icon: Brain,
    color: 'purple',
    description: 'Aprendizaje, habilidades académicas y desarrollo cognitivo',
    gradient: 'from-purple-50 to-purple-100',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-900',
    bgColor: 'bg-purple-600'
  },
  {
    id: 'Social',
    name: 'Social',
    icon: Users,
    color: 'green',
    description: 'Relaciones, networking y conexiones interpersonales',
    gradient: 'from-green-50 to-green-100',
    borderColor: 'border-green-200',
    textColor: 'text-green-900',
    bgColor: 'bg-green-600'
  },
  {
    id: 'Física',
    name: 'Física',
    icon: Heart,
    color: 'red',
    description: 'Salud, bienestar físico y hábitos saludables',
    gradient: 'from-red-50 to-red-100',
    borderColor: 'border-red-200',
    textColor: 'text-red-900',
    bgColor: 'bg-red-600'
  },
  {
    id: 'Emocional',
    name: 'Emocional',
    icon: Leaf,
    color: 'emerald',
    description: 'Bienestar mental, manejo de emociones y mindfulness',
    gradient: 'from-emerald-50 to-emerald-100',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-900',
    bgColor: 'bg-emerald-600'
  },
  {
    id: 'Financiera',
    name: 'Financiera',
    icon: DollarSign,
    color: 'amber',
    description: 'Educación financiera, ahorro e inversión',
    gradient: 'from-amber-50 to-amber-100',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-900',
    bgColor: 'bg-amber-600'
  },
  {
    id: 'Espiritual',
    name: 'Espiritual',
    icon: Lightbulb,
    color: 'indigo',
    description: 'Propósito, valores y desarrollo personal',
    gradient: 'from-indigo-50 to-indigo-100',
    borderColor: 'border-indigo-200',
    textColor: 'text-indigo-900',
    bgColor: 'bg-indigo-600'
  }
];

type ViewMode = 'dimensions' | 'goals';

export function InspirationModal({ isOpen, onClose, stage, onSelectGoal }: InspirationModalProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>('dimensions');
  const [selectedDimension, setSelectedDimension] = useState<string | null>(null);

  // Obtener metas filtradas por dimensión y etapa
  const filteredGoals = useMemo(() => {
    if (!selectedDimension) return [];
    
    // Obtener metas de la etapa específica
    const stageData = curatedGoalBankExtended[stage];
    const stageGoals = stageData?.metas.filter(goal => goal.dimension === selectedDimension) || [];
    
    // Para primer semestre y exploración, solo usar metas específicas (no longitudinales)
    if (stage === 'primerSemestre' || stage === 'exploracion') {
      console.log('🎯 DEBUG Etapa Específica - Solo metas de la etapa:', {
        stage,
        selectedDimension,
        stageGoals: stageGoals.length,
        sampleGoals: stageGoals.slice(0, 2).map(g => ({ id: g.id, dimension: g.dimension }))
      });
      return stageGoals;
    }
    
    // Para etapas avanzadas (enfoque, especialización), combinar metas específicas + longitudinales
    const longitudinalData = curatedGoalBankExtended['graduacion']; // longitudinal mapeado a graduacion
    const longitudinalGoals = longitudinalData?.metas.filter(goal => goal.dimension === selectedDimension) || [];
    
    // Combinar metas de la etapa específica + longitudinales
    const allGoals = [...stageGoals, ...longitudinalGoals];
    
    // Debug logging
    console.log('🔍 DEBUG InspirationModal:', {
      stage,
      selectedDimension,
      stageData: stageData ? `${stageData.metas.length} metas` : 'no data',
      stageGoals: stageGoals.length,
      longitudinalGoals: longitudinalGoals.length,
      totalGoals: allGoals.length,
      sampleGoals: allGoals.slice(0, 2).map(g => ({ id: g.id, dimension: g.dimension }))
    });
    
    return allGoals;
  }, [selectedDimension, stage]);

  // Obtener 3-4 metas de ejemplo (aleatorias pero consistentes)
  const exampleGoals = useMemo(() => {
    if (filteredGoals.length === 0) return [];
    
    // Usar un algoritmo determinístico basado en la dimensión para mantener consistencia
    const seed = selectedDimension?.charCodeAt(0) || 0;
    const shuffled = [...filteredGoals].sort((a, b) => {
      const aHash = a.id.charCodeAt(0) + seed;
      const bHash = b.id.charCodeAt(0) + seed;
      return aHash - bHash;
    });
    
    return shuffled.slice(0, 4);
  }, [filteredGoals, selectedDimension]);

  const handleDimensionSelect = (dimensionId: string) => {
    setSelectedDimension(dimensionId);
    setViewMode('goals');
  };

  const handleBackToDimensions = () => {
    setViewMode('dimensions');
    setSelectedDimension(null);
  };

  const handleSelectGoal = (goal: CuratedGoal) => {
    if (onSelectGoal) {
      onSelectGoal(goal.id);
    } else {
      // Redirigir a crear meta con plantilla
      router.push(`/goals/new?template=${goal.id}`);
    }
    onClose();
  };

  const handleCreateCustom = () => {
    // Redirigir a crear meta personalizada
    router.push('/goals/new');
    onClose();
  };

  const getSelectedDimensionInfo = () => {
    return WELLBEING_DIMENSIONS.find(d => d.id === selectedDimension);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-headline flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            {viewMode === 'dimensions' ? 'Generador de Inspiración' : 'Metas de Ejemplo'}
          </DialogTitle>
          <DialogDescription>
            {viewMode === 'dimensions' 
              ? 'Selecciona una dimensión del bienestar para ver metas de ejemplo adaptadas a tu etapa actual.'
              : `Metas de ejemplo para la dimensión ${selectedDimension}. Puedes seleccionar una existente o crear una personalizada.`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {viewMode === 'dimensions' && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {WELLBEING_DIMENSIONS.map((dimension) => {
                const IconComponent = dimension.icon;
                return (
                  <Card 
                    key={dimension.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 bg-gradient-to-br ${dimension.gradient} ${dimension.borderColor}`}
                    onClick={() => handleDimensionSelect(dimension.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full ${dimension.bgColor} flex items-center justify-center`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className={`text-lg ${dimension.textColor}`}>
                            {dimension.name}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className={`${dimension.textColor} opacity-80`}>
                        {dimension.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {viewMode === 'goals' && (
            <div className="space-y-6">
              {/* Header con dimensión seleccionada */}
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleBackToDimensions}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Volver
                </Button>
                <div className="flex items-center gap-3">
                  {(() => {
                    const dimensionInfo = getSelectedDimensionInfo();
                    if (!dimensionInfo) return null;
                    const IconComponent = dimensionInfo.icon;
                    return (
                      <>
                        <div className={`w-10 h-10 rounded-full ${dimensionInfo.bgColor} flex items-center justify-center`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className={`font-semibold ${dimensionInfo.textColor}`}>
                            {dimensionInfo.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {exampleGoals.length} metas de ejemplo
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Metas de ejemplo */}
              <div className="grid gap-4">
                {exampleGoals.map((goal, index) => (
                  <Card key={goal.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base font-medium line-clamp-2">
                            {goal.metaSmarter}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {goal.categoria}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-sm line-clamp-3">
                        {goal.pasosAccion}
                      </CardDescription>
                      <div className="flex gap-2 mt-4">
                        <Button 
                          size="sm" 
                          onClick={() => handleSelectGoal(goal)}
                          className="flex-1"
                        >
                          <Target className="mr-2 h-4 w-4" />
                          Usar esta meta
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Opción para crear personalizada */}
              <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
                <CardContent className="pt-6">
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                      <Plus className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">¿No encuentras lo que buscas?</h4>
                      <p className="text-sm text-muted-foreground">
                        Crea tu propia meta personalizada basada en tus necesidades específicas.
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleCreateCustom}
                      className="mt-2"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Crear meta personalizada
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}