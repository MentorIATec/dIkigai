'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

import { ProgressiveGoalForm } from '@/components/progressive-goal-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { goalTemplates } from '@/lib/data';
import { Compass, Sparkles } from 'lucide-react';

export default function NewGoalClient() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template');
  const dimension = searchParams.get('dimension');
  const categoria = searchParams.get('categoria');
  const source = searchParams.get('source');

  const activeTemplate = useMemo(() => {
    if (!templateId) {
      return null;
    }

    return goalTemplates.find((template) => template.id === templateId) ?? null;
  }, [templateId]);

  const isFromBrujula = source === 'brujula';

  return (
    <div className="space-y-6">
      {/* Alerta si viene de brújula */}
      {isFromBrujula && (dimension || categoria) && (
        <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950">
          <Compass className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-900 dark:text-blue-100">
            Contexto de tu diagnóstico
          </AlertTitle>
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            <div className="flex flex-wrap gap-2 mt-2">
              {dimension && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-900">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Dimensión: {dimension}
                </Badge>
              )}
              {categoria && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-900">
                  Categoría: {categoria}
                </Badge>
              )}
            </div>
            <p className="mt-2 text-sm">
              Estas sugerencias están basadas en tu diagnóstico. Puedes usarlas como guía para crear tu meta personalizada.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Alerta de plantilla */}
      {activeTemplate && !isFromBrujula && (
        <Alert>
          <AlertTitle>Plantilla sugerida</AlertTitle>
          <AlertDescription>
            Se aplicará automáticamente la plantilla "{activeTemplate.title}".
          </AlertDescription>
        </Alert>
      )}

      <ProgressiveGoalForm prefillTemplateId={templateId ?? undefined} />
    </div>
  );
}
