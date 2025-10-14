'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { curatedGoalBankExtended } from '@/lib/curated-goals';
import { useSelectedGoalsStorage } from '@/hooks/use-local-storage';
import { usePersonalGoals } from '@/hooks/use-personal-goals';
import { useToast } from '@/hooks/use-toast';
import type { CuratedGoal, SemesterStage } from '@/lib/types';
import { FilePlus2, Trash2, ExternalLink, Sparkles, Target, Users, Brain, Heart, DollarSign, Leaf, Lightbulb, Briefcase } from 'lucide-react';


// Iconos para las dimensiones del bienestar
const dimensionIcons: { [key: string]: any } = {
  'Ocupacional': Briefcase,
  'Intelectual': Brain,
  'Social': Users,
  'Física': Heart,
  'Emocional': Leaf,
  'Financiera': DollarSign,
  'Espiritual': Lightbulb,
};

// Colores para las dimensiones
const dimensionColors: { [key: string]: string } = {
  'Ocupacional': 'text-blue-600 bg-blue-100',
  'Intelectual': 'text-purple-600 bg-purple-100',
  'Social': 'text-green-600 bg-green-100',
  'Física': 'text-red-600 bg-red-100',
  'Emocional': 'text-emerald-600 bg-emerald-100',
  'Financiera': 'text-amber-600 bg-amber-100',
  'Espiritual': 'text-indigo-600 bg-indigo-100',
};

export default function GoalsClient() {
  const { selectedGoals, removeSelectedGoal } = useSelectedGoalsStorage();
  const { personalGoals, removePersonalGoal, formatGoalDate } = usePersonalGoals();
  const { toast } = useToast();
  const [selectedCuratedGoals, setSelectedCuratedGoals] = useState<CuratedGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  // Obtener las metas curadas seleccionadas
  useEffect(() => {
    const loadSelectedGoals = () => {
      const goals: CuratedGoal[] = [];
      
      console.log('🔍 DEBUG GoalsClient - Cargando metas:', {
        selectedGoals,
        selectedGoalsCount: selectedGoals.length
      });
      
      // Buscar en todas las etapas
      const stages: SemesterStage[] = ['primerSemestre', 'exploracion', 'enfoque', 'especializacion', 'graduacion'];
      
      stages.forEach(stage => {
        const stageData = curatedGoalBankExtended[stage];
        if (stageData) {
          console.log(`🔍 DEBUG Etapa ${stage}:`, {
            totalMetas: stageData.metas.length,
            metasEncontradas: stageData.metas.filter(goal => selectedGoals.includes(goal.id)).map(g => g.id)
          });
          
          stageData.metas.forEach(goal => {
            if (selectedGoals.includes(goal.id)) {
              goals.push(goal);
              console.log(`✅ Meta encontrada: ${goal.id} - ${goal.metaSmarter.substring(0, 50)}...`);
            }
          });
        }
      });
      
      console.log('🎯 DEBUG GoalsClient - Metas finales:', {
        totalMetasEncontradas: goals.length,
        metas: goals.map(g => ({ id: g.id, titulo: g.metaSmarter.substring(0, 30) + '...' }))
      });
      
      setSelectedCuratedGoals(goals);
      setIsLoading(false);
    };

    loadSelectedGoals();
  }, [selectedGoals]);

  const handleRemoveGoal = async (goalId: string) => {
    try {
      removeSelectedGoal(goalId);
      
      toast({
        title: 'Meta eliminada',
        description: 'La meta ha sido removida de tu plan de vida.',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error al eliminar meta:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la meta. Por favor, intenta nuevamente.',
        variant: 'destructive',
        duration: 4000,
      });
    }
  };

  const getDimensionIcon = (dimension: string) => {
    const IconComponent = dimensionIcons[dimension] || Target;
    const colorClass = dimensionColors[dimension] || 'text-gray-600 bg-gray-100';
    
    return (
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClass}`}>
        <IconComponent className="h-4 w-4" />
      </div>
    );
  };

  const getActionSteps = (pasosAccion: string): string[] => {
    return pasosAccion
      .split(';')
      .map(step => step.trim())
      .filter(step => step.length > 0);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">Mis Metas</h1>
            <p className="text-muted-foreground">Aquí puedes ver y gestionar todas tus metas académicas.</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="text-sm text-muted-foreground">Cargando metas...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Mis Metas</h1>
          <p className="text-muted-foreground">Aquí puedes ver y gestionar todas tus metas académicas.</p>
        </div>
               <div className="flex gap-2">
                 <Button asChild>
                   <Link href="/goal-bank">
                     <Sparkles className="mr-2 h-4 w-4" />
                     Generar Inspiración
                   </Link>
                 </Button>
                 <Button asChild variant="outline">
                   <Link href="/goals/new">
                     <FilePlus2 className="mr-2 h-4 w-4" />
                     Crear Meta Personalizada
                   </Link>
                 </Button>
               </div>
      </div>

      {/* Resumen del Plan de Vida */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Mi Plan de Vida
          </CardTitle>
          <CardDescription>
            Metas curadas seleccionadas para tu desarrollo integral. Estas metas están listas para ser cargadas en MiTec.
          </CardDescription>
        </CardHeader>
        <CardContent>
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                     <div className="text-2xl font-bold text-blue-600">
                       {selectedCuratedGoals.length + personalGoals.length}
                     </div>
                     <div>
                       <div className="font-medium">Metas en tu plan de vida</div>
                       <div className="text-sm text-muted-foreground">
                         {selectedCuratedGoals.length > 0 && `${selectedCuratedGoals.length} curadas`}
                         {selectedCuratedGoals.length > 0 && personalGoals.length > 0 && ' • '}
                         {personalGoals.length > 0 && `${personalGoals.length} personalizadas`}
                         {selectedCuratedGoals.length === 0 && personalGoals.length === 0 && 'Aún no tienes metas en tu plan de vida'}
                       </div>
                     </div>
                   </div>
                   {(selectedCuratedGoals.length > 0 || personalGoals.length > 0) && (
                     <Button asChild variant="outline">
                       <a href="https://mitec.tec.mx/#/" target="_blank" rel="noopener noreferrer">
                         <ExternalLink className="mr-2 h-4 w-4" />
                         Ir a MiTec
                       </a>
                     </Button>
                   )}
                 </div>
        </CardContent>
      </Card>

      {/* Metas Curadas Seleccionadas */}
      {selectedCuratedGoals.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Metas de tu Plan de Vida</CardTitle>
            <CardDescription>
              Metas curadas que has seleccionado para tu desarrollo integral. Puedes eliminarlas de tu plan de vida si cambias de opinión.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedCuratedGoals.map((goal) => {
                const IconComponent = dimensionIcons[goal.dimension] || Target;
                const colorClass = dimensionColors[goal.dimension] || 'text-gray-600 bg-gray-100';
                
                return (
                  <Card key={goal.id} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          {getDimensionIcon(goal.dimension)}
                          <div className="flex-1">
                            <CardTitle className="text-base font-medium line-clamp-2">
                              {goal.metaSmarter}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {goal.categoria}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {goal.dimension}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveGoal(goal.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Pasos de acción:</p>
                        <div className="space-y-1">
                          {getActionSteps(goal.pasosAccion).map((step, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <span className="text-xs text-muted-foreground mt-1">{index + 1}.</span>
                              <span className="text-sm text-muted-foreground">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
             ) : (
               <Card className="border-dashed border-2 border-blue-200 bg-blue-50/50">
                 <CardContent className="pt-6">
                   <div className="text-center space-y-4">
                     <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
                       <Sparkles className="h-8 w-8 text-blue-600" />
                     </div>
                     <div>
                       <h3 className="text-lg font-semibold text-blue-900">¡Comienza a construir tu plan de vida!</h3>
                       <p className="text-sm text-blue-700 mt-2">
                         Selecciona metas curadas específicas para tu etapa académica y crea un plan personalizado.
                       </p>
                       <div className="mt-3 text-xs text-blue-600">
                         ✨ Metas diseñadas por expertos • 🎯 Adaptadas a tu semestre • 📋 Listas para MiTec
                       </div>
                     </div>
                     <div className="flex gap-2 justify-center">
                       <Button asChild size="lg">
                         <Link href="/goal-bank">
                           <Sparkles className="mr-2 h-4 w-4" />
                           Generar Inspiración
                         </Link>
                       </Button>
                     </div>
                   </div>
                 </CardContent>
               </Card>
             )}

             {/* Metas Personalizadas */}
             {personalGoals.length > 0 && (
               <Card>
                 <CardHeader>
                   <CardTitle className="font-headline">Metas Personalizadas</CardTitle>
                   <CardDescription>
                     Metas que has creado usando el formulario SMARTER. Puedes editarlas o eliminarlas según tus necesidades.
                   </CardDescription>
                 </CardHeader>
                 <CardContent>
                   <div className="space-y-4">
                     {personalGoals.map((goal) => (
                       <Card key={goal.id} className="border-l-4 border-l-green-500">
                         <CardHeader className="pb-3">
                           <div className="flex items-start justify-between">
                             <div className="flex-1">
                               <CardTitle className="text-base font-medium line-clamp-2">
                                 {goal.title}
                               </CardTitle>
                               <div className="flex items-center gap-2 mt-2">
                                 <Badge variant="secondary" className="text-xs">
                                   {goal.semester}
                                 </Badge>
                                 <Badge variant="outline" className="text-xs">
                                   {goal.status}
                                 </Badge>
                                 <Badge variant="outline" className="text-xs">
                                   Vence: {formatGoalDate(goal.smarter.timeBound)}
                                 </Badge>
                               </div>
                             </div>
                             <Button
                               variant="ghost"
                               size="sm"
                               onClick={() => removePersonalGoal(goal.id)}
                               className="text-red-600 hover:text-red-700 hover:bg-red-50"
                             >
                               <Trash2 className="h-4 w-4" />
                             </Button>
                           </div>
                         </CardHeader>
                         <CardContent className="pt-0">
                           <div className="space-y-3">
                             <div>
                               <p className="text-sm font-medium text-muted-foreground">Específico:</p>
                               <p className="text-sm">{goal.smarter.specific}</p>
                             </div>
                             <div>
                               <p className="text-sm font-medium text-muted-foreground">Medible:</p>
                               <p className="text-sm">{goal.smarter.measurable}</p>
                             </div>
                             <div>
                               <p className="text-sm font-medium text-muted-foreground">Fecha límite:</p>
                               <p className="text-sm">{formatGoalDate(goal.smarter.timeBound)}</p>
                             </div>
                           </div>
                         </CardContent>
                       </Card>
                     ))}
                   </div>
                 </CardContent>
               </Card>
             )}

             {/* Opción para crear metas personalizadas (secundaria) */}
             {selectedCuratedGoals.length === 0 && personalGoals.length === 0 && (
               <Card className="border-dashed border-2 border-gray-200">
                 <CardContent className="pt-6">
                   <div className="text-center space-y-4">
                     <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                       <FilePlus2 className="h-6 w-6 text-gray-600" />
                     </div>
                     <div>
                       <h3 className="text-base font-medium text-gray-900">¿Prefieres crear una meta personalizada?</h3>
                       <p className="text-sm text-gray-500 mt-1">
                         Si tienes una meta específica en mente, puedes crearla desde cero usando nuestro formulario SMARTER.
                       </p>
                     </div>
                     <Button asChild variant="outline" size="sm">
                       <Link href="/goals/new">
                         <FilePlus2 className="mr-2 h-4 w-4" />
                         Crear Meta Personalizada
                       </Link>
                     </Button>
                   </div>
                 </CardContent>
               </Card>
             )}
    </div>
  );
}
