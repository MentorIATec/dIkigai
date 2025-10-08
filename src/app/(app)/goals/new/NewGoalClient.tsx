'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

import { GoalForm } from '@/components/goal-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { goalTemplates } from '@/lib/data';

export default function NewGoalClient() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template');

  const activeTemplate = useMemo(() => {
    if (!templateId) {
      return null;
    }

    return goalTemplates.find((template) => template.id === templateId) ?? null;
  }, [templateId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Crear Nueva Meta</h1>
        <p className="text-muted-foreground">
          Define tu próximo objetivo siguiendo la metodología SMARTER.
        </p>
      </div>
      {activeTemplate ? (
        <Alert>
          <AlertTitle>Plantilla sugerida</AlertTitle>
          <AlertDescription>
            Se aplicará automáticamente la plantilla “{activeTemplate.title}”.
          </AlertDescription>
        </Alert>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Formulario de Meta</CardTitle>
          <CardDescription>
            Completa todos los campos para crear una meta clara y alcanzable.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GoalForm prefillTemplateId={templateId ?? undefined} />
        </CardContent>
      </Card>
    </div>
  );
}
