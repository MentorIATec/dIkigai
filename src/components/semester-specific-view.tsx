'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Compass, Sparkles, Target, GraduationCap, AlertCircle, ExternalLink, FileText } from 'lucide-react';
import Link from 'next/link';
import { computeStage } from '@/lib/profile/mapping';
import { InspirationModal } from './inspiration-modal';
import { useSelectedGoalsStorage } from '@/hooks/use-local-storage';
import type { SemesterStage, StudentProfile } from '@/lib/types';

interface SemesterSpecificViewProps {
  semester: number;
  profile?: StudentProfile;
  onGenerateGoal?: () => void;
}

/**
 * Vista específica por semestre - UX LEAN
 * Muestra solo la etapa relevante al estudiante
 */
export function SemesterSpecificView({ semester, profile, onGenerateGoal }: SemesterSpecificViewProps) {
  const { toast } = useToast();
  const [stage, setStage] = useState<SemesterStage>('primerSemestre');

  useEffect(() => {
    const computedStage = computeStage(semester);
    console.log('🎯 STAGE DEBUG:', { 
      semester, 
      computedStage, 
      profileStage: profile?.semesterStage 
    });
    setStage(computedStage);
  }, [semester, profile]);

  // Renderizar vista específica según la etapa
  switch (stage) {
    case 'primerSemestre':
      return <FirstSemesterView semester={semester} profile={profile} onGenerateGoal={onGenerateGoal} />;
    case 'exploracion':
      return <ExploracionView semester={semester} profile={profile} />;
    case 'enfoque':
      return <EnfoqueView semester={semester} profile={profile} />;
    case 'especializacion':
      return <EspecializacionView semester={semester} profile={profile} />;
    case 'graduacion':
      return <GraduacionView semester={semester} profile={profile} />;
    default:
      return <FirstSemesterView semester={semester} profile={profile} onGenerateGoal={onGenerateGoal} />;
  }
}

/**
 * Vista para 1er semestre - EXCEPCIÓN: Solo IBI + modal de dimensiones
 */
function FirstSemesterView({ semester, profile, onGenerateGoal }: SemesterSpecificViewProps & { onGenerateGoal?: () => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoalIds, setSelectedGoalIds] = useState<string[]>([]);
  const { toast } = useToast();
  const { addSelectedGoal } = useSelectedGoalsStorage();

  const handleSelectGoal = async (goalId: string) => {
    try {
      // Verificar si la meta ya fue seleccionada
      if (selectedGoalIds.includes(goalId)) {
        toast({
          title: 'Meta ya seleccionada',
          description: 'Esta meta ya está en tu plan de vida.',
          variant: 'default',
          duration: 3000,
        });
        return;
      }

      // 🗄️ SIEMPRE GUARDAR EN LOCALSTORAGE (persistencia básica funciona)
      setSelectedGoalIds(prev => [...prev, goalId]);
      addSelectedGoal(goalId);
      console.log('💾 Meta guardada en localStorage:', goalId);

      const response = await fetch('/api/goals/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ goalId }),
      });

      if (response.ok) {
        // API funcionó correctamente
        toast({
          title: '¡Meta guardada exitosamente! 🎯',
          description: 'La meta ha sido agregada a tu plan de vida.',
          duration: 3000,
        });
      } else {
        // API falló, pero localStorage funcionó
        console.warn('⚠️ API de metas falló, pero guardado en localStorage:', {
          status: response.status,
          goalId
        });
        
        toast({
          title: '¡Meta guardada localmente! 🎯',
          description: 'La meta se guardó localmente y se sincronizará cuando sea posible.',
          duration: 3000,
        });
      }

      console.log('Meta guardada exitosamente:', goalId);
    } catch (error) {
      console.error('Error al guardar meta:', error);
      
      // 🗄️ SIEMPRE MOSTRAR ÉXITO (localStorage ya funcionó)
      toast({
        title: '¡Meta guardada localmente! 🎯',
        description: 'Hubo un problema de conexión, pero la meta se guardó localmente.',
        duration: 3000,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-green-900">Tu Primer Semestre</h1>
        </div>
        <p className="text-lg text-green-800 max-w-2xl mx-auto">
          ¡Bienvenido/a al Tec! Tu enfoque debe estar en la adaptación y el desarrollo de hábitos sólidos.
        </p>
      </div>

      {/* IBI Section */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
        <CardHeader>
          <CardTitle className="text-xl text-green-900 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Tu Índice de Bienestar Integral (IBI)
          </CardTitle>
          <CardDescription className="text-green-800">
            Ya tienes tu IBI completado. Úsalo como base para crear metas alineadas a tus necesidades.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild variant="default" className="flex-1 bg-green-600 hover:bg-green-700">
              <a href="http://mitec.tec.mx/#/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Ver mi IBI
              </a>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <a href="https://drive.google.com/file/d/18kojUabG2z00cgmQXGU_6zLGmAL3weE9/view" target="_blank" rel="noopener noreferrer">
                <FileText className="mr-2 h-4 w-4" />
                Tutorial: Cómo actualizar metas
              </a>
            </Button>
          </div>
          <p className="text-sm text-green-700 text-center">
            💡 Flujo recomendado: Consulta tu IBI → Crea metas alineadas → Actualiza en Mi Plan de Vida
          </p>
        </CardContent>
      </Card>

      {/* Inspiration Section */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-xl text-purple-900 flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Genera Inspiración
          </CardTitle>
          <CardDescription className="text-purple-800">
            Crea metas personalizadas basadas en tus necesidades específicas de primer semestre.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-purple-100 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-purple-700">
              Metas específicas para adaptación, hábitos de estudio e integración social.
            </p>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => setIsModalOpen(true)}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Generar inspiración
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal de inspiración */}
      <InspirationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        stage="primerSemestre"
        onSelectGoal={handleSelectGoal}
      />
    </div>
  );
}

/**
 * Vista para 2°-3° semestre - Etapa de Exploración (Test: Brújula de Enfoque)
 */
function ExploracionView({ semester, profile }: SemesterSpecificViewProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <Compass className="h-6 w-6 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-green-900">Tu etapa actual: Exploración</h1>
        </div>
        <p className="text-lg text-green-800 max-w-2xl mx-auto">
          Explora tus opciones vocacionales y prepara el terreno para decisiones importantes.
        </p>
      </div>

      {/* Brújula Section */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
        <CardHeader>
          <CardTitle className="text-xl text-green-900 flex items-center gap-2">
            <Compass className="h-5 w-5" />
            Brújula de Cambio de Etapa
          </CardTitle>
          <CardDescription className="text-green-800">
            Completa este diagnóstico para prepararte para tu siguiente etapa académica.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-semibold text-green-900">¿Qué evalúa?</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Claridad vocacional</li>
                  <li>• Desempeño académico</li>
                  <li>• Preparación para prácticas</li>
                  <li>• Plan de servicio social</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-green-900">Beneficios</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Claridad en tu camino</li>
                  <li>• Preparación académica</li>
                  <li>• Estrategia de prácticas</li>
                  <li>• Planificación integral</li>
                </ul>
              </div>
            </div>
            
            <Button asChild className="w-full bg-green-600 hover:bg-green-700">
              <Link href="/goal-bank?test=enfoque">
                <Compass className="mr-2 h-4 w-4" />
                Iniciar Brújula de Cambio de Etapa
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Vista para 4°-6° semestre - Etapa de Enfoque (Test: Brújula de Especialización)
 */
function EnfoqueView({ semester, profile }: SemesterSpecificViewProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Compass className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-blue-900">Tu etapa actual: Enfoque</h1>
        </div>
        <p className="text-lg text-blue-800 max-w-2xl mx-auto">
          Es momento de definir tu claridad vocacional y prepararte para el siguiente paso académico.
        </p>
      </div>

      {/* Brújula Section */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
        <CardHeader>
          <CardTitle className="text-xl text-blue-900 flex items-center gap-2">
            <Compass className="h-5 w-5" />
            Brújula de Cambio de Etapa
          </CardTitle>
          <CardDescription className="text-blue-800">
            Completa este diagnóstico para prepararte para tu siguiente etapa académica.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-900">¿Qué evalúa?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Claridad vocacional</li>
                  <li>• Desempeño académico</li>
                  <li>• Preparación para prácticas</li>
                  <li>• Plan de servicio social</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-900">Beneficios</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Metas alineadas a tu progreso</li>
                  <li>• Enfoque en áreas de mejora</li>
                  <li>• Planificación estratégica</li>
                  <li>• Seguimiento personalizado</li>
                </ul>
              </div>
            </div>
            
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link href="/goal-bank?test=especializacion">
                <Compass className="mr-2 h-4 w-4" />
                Iniciar Brújula de Cambio de Etapa
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Vista para 4°-6° semestre - Brújula de Especialización
 */
function EspecializacionView({ semester, profile }: SemesterSpecificViewProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
              {/* Header */}
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <h1 className="text-3xl font-bold text-purple-900">Preparación para Graduación</h1>
                </div>
        <p className="text-lg text-purple-800 max-w-2xl mx-auto">
          ¡Felicitaciones! Estás en tu último año. Completa este checklist para asegurar una transición exitosa al mundo profesional.
        </p>
      </div>

      {/* Brújula Section */}
      <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200">
        <CardHeader>
          <CardTitle className="text-xl text-purple-900">
            Checklist de Graduación
          </CardTitle>
          <CardDescription className="text-purple-800">
            Valida tu preparación profesional, metas de primer año como EXATEC y balance de vida para una transición exitosa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-900">¿Qué evalúa?</h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Situación profesional actual</li>
                  <li>• Metas para primer año como EXATEC</li>
                  <li>• Balance de vida en transición</li>
                  <li>• Preparación para retos profesionales</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-900">Beneficios</h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Transición exitosa a profesional</li>
                  <li>• Metas claras post-graduación</li>
                  <li>• Balance personal-profesional</li>
                  <li>• Preparación integral</li>
                </ul>
              </div>
            </div>
            
            <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
              <Link href="/goal-bank?test=graduacion">
                Iniciar Checklist
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Vista para 7°+ semestre - Checklist de Graduación
 */
function GraduacionView({ semester, profile }: SemesterSpecificViewProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold text-amber-900">Etapa de Graduación</h1>
        </div>
        <p className="text-lg text-amber-800 max-w-2xl mx-auto">
          ¡Última recta! Enfócate en completar tu tesis/proyecto final, aplicar a posiciones y prepararte para la transición profesional.
        </p>
      </div>

      {/* Checklist Section */}
      <Card className="bg-gradient-to-br from-amber-50 to-yellow-100 border-amber-200">
        <CardHeader>
          <CardTitle className="text-xl text-amber-900 flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Brújula de Cambio de Etapa
          </CardTitle>
          <CardDescription className="text-amber-800">
            Valida tu preparación profesional, metas de primer año como EXATEC y balance de vida en esta transición.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-semibold text-amber-900">¿Qué evalúa?</h4>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Situación profesional actual</li>
                  <li>• Meta para primer año EXATEC</li>
                  <li>• Balance de vida en transición</li>
                  <li>• Preparación para retos profesionales</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-amber-900">Beneficios</h4>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Validación de preparación</li>
                  <li>• Plan post-graduación</li>
                  <li>• Estrategia de transición</li>
                  <li>• Metas EXATEC claras</li>
                </ul>
              </div>
            </div>
            
            <Button asChild className="w-full bg-amber-600 hover:bg-amber-700">
              <Link href="/goal-bank?test=graduacion">
                <GraduationCap className="mr-2 h-4 w-4" />
                Iniciar Brújula de Cambio de Etapa
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
