'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { InspirationModal } from './inspiration-modal';
import type { SemesterStage } from '@/lib/types';

/**
 * Componente de prueba para el modal de inspiración
 * Permite probar el modal con diferentes etapas académicas
 */
export function InspirationModalTest() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<SemesterStage>('primerSemestre');

  const stages: { value: SemesterStage; label: string }[] = [
    { value: 'primerSemestre', label: 'Primer Semestre' },
    { value: 'exploracion', label: 'Exploración (2°-3°)' },
    { value: 'enfoque', label: 'Enfoque (4°-6°)' },
    { value: 'especializacion', label: 'Especialización (7°+)' },
    { value: 'graduacion', label: 'Graduación' }
  ];

  const handleSelectGoal = (goalId: string) => {
    console.log('Meta seleccionada:', goalId);
    alert(`Meta seleccionada: ${goalId}`);
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Prueba del Modal de Inspiración</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Selecciona una etapa académica:
          </label>
          <div className="flex flex-wrap gap-2">
            {stages.map((stage) => (
              <Button
                key={stage.value}
                variant={selectedStage === stage.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedStage(stage.value)}
              >
                {stage.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <Button onClick={() => setIsOpen(true)} size="lg">
            Abrir Modal de Inspiración
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <p><strong>Etapa seleccionada:</strong> {selectedStage}</p>
          <p><strong>Funcionalidades a probar:</strong></p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Seleccionar diferentes dimensiones del bienestar</li>
            <li>Ver metas de ejemplo adaptadas a la etapa</li>
            <li>Probar selección de metas existentes</li>
            <li>Probar creación de metas personalizadas</li>
            <li>Verificar adaptabilidad al semestre sin etiquetas explícitas</li>
          </ul>
        </div>
      </div>

      <InspirationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        stage={selectedStage}
        onSelectGoal={handleSelectGoal}
      />
    </div>
  );
}
