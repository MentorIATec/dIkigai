'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CAREER_OPTIONS } from '@/lib/constants/careers';
import { computeStage, normalizeSemester } from '@/lib/profile/mapping';

const SEMESTER_OPTIONS = [
  { value: '1', label: '1° semestre' },
  { value: '2', label: '2° semestre' },
  { value: '3', label: '3° semestre' },
  { value: '4', label: '4° semestre' },
  { value: '5', label: '5° semestre' },
  { value: '6', label: '6° semestre' },
  { value: '7', label: '7° semestre' },
  { value: '8', label: '8° semestre' },
  { value: '8+', label: '8° o más' },
];

const STAGE_LABELS: Record<string, string> = {
  exploracion: 'Exploración (1° a 3° semestre)',
  enfoque: 'Enfoque (4° a 6° semestre)',
  especializacion: 'Especialización (7° semestre)',
  graduacion: 'Graduación (8° semestre o más)',
};

const CONSENT_VERSION = '1.0';

export function ProfileOnboardingClient() {
  const router = useRouter();
  const [semester, setSemester] = useState<string>('1');
  const [careerId, setCareerId] = useState<string>('');
  const [careerName, setCareerName] = useState<string>('');
  const [matricula, setMatricula] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const normalizedSemester = useMemo(() => normalizeSemester(semester), [semester]);
  const stage = useMemo(() => computeStage(normalizedSemester), [normalizedSemester]);
  const stageLabel = STAGE_LABELS[stage];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    try {
      const payload = {
        semesterNumber: semester,
        carreraId: careerId || null,
        carreraName: careerName || null,
        matricula,
        consentVersion: CONSENT_VERSION,
      };
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('failed');
      }
      setMatricula('');
      setFeedback('Guardamos tu información. Puedes continuar con tus metas.');
      router.refresh();
    } catch (error) {
      console.error('Failed to submit onboarding profile', error);
      setFeedback('No pudimos guardar tu información. Inténtalo nuevamente.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Completa tu perfil estudiantil</CardTitle>
          <CardDescription>
            Esta información nos ayuda a personalizar tus recomendaciones y a mantener tu matrícula segura.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md border border-muted-foreground/20 bg-muted/40 p-3 text-xs text-muted-foreground">
              Al guardar, aceptas la versión {CONSENT_VERSION} de nuestra{' '}
              <Link className="font-medium underline" href="/legal/privacy" target="_blank" rel="noopener noreferrer">
                Política de Privacidad
              </Link>{' '}
              y autorizas que resguardemos tu matrícula con cifrado.
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="semester">Semestre actual</Label>
                <Select value={semester} onValueChange={setSemester} disabled={submitting}>
                  <SelectTrigger id="semester">
                    <SelectValue placeholder="Selecciona semestre" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEMESTER_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Etapa estimada: {stageLabel}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="career">Carrera</Label>
                <Select
                  value={careerId}
                  onValueChange={(value) => {
                    const career = CAREER_OPTIONS.find((option) => option.id === value);
                    setCareerId(value);
                    setCareerName(career?.name ?? '');
                  }}
                  disabled={submitting}
                >
                  <SelectTrigger id="career">
                    <SelectValue placeholder="Selecciona tu carrera" />
                  </SelectTrigger>
                  <SelectContent>
                    {CAREER_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="matricula">Matrícula institucional</Label>
              <Input
                id="matricula"
                value={matricula}
                onChange={(event) => setMatricula(event.target.value)}
                autoComplete="off"
                placeholder="Ingresa tu matrícula"
                disabled={submitting}
              />
              <p className="text-xs text-muted-foreground">
                Guardamos solo los últimos 4 dígitos para reportes y ciframos el valor completo.
              </p>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                Una vez guardado, podrás actualizar tus datos en cualquier momento.
              </div>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Guardando…' : 'Guardar información'}
              </Button>
            </div>
            {feedback ? <p className="text-sm text-muted-foreground">{feedback}</p> : null}
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Privacidad de tu matrícula</CardTitle>
          <CardDescription>
            Solo las personas administradoras pueden ver tu matrícula completa y siempre desde un entorno seguro.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            • Tu matrícula se cifra con AES-256 y se guarda por separado de tu perfil visible.
          </p>
          <p>• Tu panel de estudiante solo muestra los últimos 4 dígitos como referencia.</p>
          <p>• Puedes solicitar la eliminación de estos datos escribiendo a la coordinación del programa.</p>
        </CardContent>
      </Card>
    </div>
  );
}
