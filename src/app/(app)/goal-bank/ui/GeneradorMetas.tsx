"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { buildFlatTemplates, indexByDimension } from '@/lib/build-templates';
import { curatedGoalBank, curatedGoalStages } from '@/lib/curated-goals';
import { getStageCuratedKey, getStageDiagnostic, periodoToStage } from '@/lib/diagnostics.stage-map';
import { recommendGoals } from '@/lib/recommend';
import type { CuratedGoal } from '@/lib/types';
import {
  PERIODOS,
  isPeriodoId,
  isStage,
  type GoalTemplate,
  type PeriodoId,
  type Stage,
  type WellbeingDimension,
} from '@/lib/types.goal-templates';
import { cn } from '@/lib/utils';
import { useTelemetry } from '@/hooks/use-telemetry';

const emphasisPattern = /(\*\*[^*]+\*\*)/g;

const STORAGE_KEYS = {
  periodo: 'goal-generator:periodo',
  answers: (stage: Stage) => `goal-generator:answers:${stage}`,
};

function renderWithEmphasis(text: string): ReactNode[] {
  return text
    .split(emphasisPattern)
    .filter(Boolean)
    .map((segment, index) => {
      if (segment.startsWith('**') && segment.endsWith('**')) {
        return (
          <span key={index} className="font-semibold text-foreground">
            {segment.slice(2, -2)}
          </span>
        );
      }

      return (
        <span key={index}>
          {segment}
        </span>
      );
    });
}

function getActionSteps(pasosAccion: CuratedGoal['pasosAccion']): string[] {
  return pasosAccion
    .split(';')
    .map((step) => step.trim())
    .filter((step) => step.length > 0);
}

type CustomGoal = {
  description: string;
  dimension: string;
  deadline: string;
};

const templates = buildFlatTemplates(curatedGoalBank);
const templatesByDimension = indexByDimension(templates);
const templatesByStageId = templates.reduce<Record<string, GoalTemplate[]>>((acc, template) => {
  if (!acc[template.stageId]) {
    acc[template.stageId] = [];
  }
  acc[template.stageId].push(template);
  return acc;
}, {} as Record<string, GoalTemplate[]>);

const dimensionOptions = Object.keys(templatesByDimension).sort((a, b) =>
  a.localeCompare(b, 'es-MX'),
) as WellbeingDimension[];

const DEFAULT_PERIODO: PeriodoId = PERIODOS[0]?.id ?? 'AD-2025';

export type GeneradorMetasProps = {
  initialPeriodoId?: PeriodoId;
  initialAnswers?: Record<string, number>;
  disablePersistence?: boolean;
};

export default function GeneradorMetas({
  initialPeriodoId,
  initialAnswers,
  disablePersistence = false,
}: GeneradorMetasProps = {}): JSX.Element {
  const telemetry = useTelemetry();
  const searchParams = useSearchParams();
  const searchParamsKey = searchParams?.toString();
  const isPreview = searchParams?.get('preview') === '1';
  const persistenceEnabled = !disablePersistence && isPreview;
  const [periodoId, setPeriodoId] = useState<PeriodoId>(initialPeriodoId ?? DEFAULT_PERIODO);
  const [selectedDimension, setSelectedDimension] = useState<WellbeingDimension | ''>('');
  const [customGoals, setCustomGoals] = useState<CustomGoal[]>(() =>
    Array.from({ length: 3 }, () => ({ description: '', dimension: '', deadline: '' })),
  );
  const [answers, setAnswers] = useState<Record<string, number>>(initialAnswers ?? {});
  const [submitted, setSubmitted] = useState(false);
  const [recommended, setRecommended] = useState<GoalTemplate[]>([]);
  const [showFullStage, setShowFullStage] = useState(false);
  const [validationActive, setValidationActive] = useState(false);

  const stage = useMemo<Stage>(() => periodoToStage(periodoId), [periodoId]);
  const diagnostic = useMemo(() => getStageDiagnostic(stage), [stage]);
  const curatedStageKey = useMemo(() => getStageCuratedKey(stage), [stage]);
  const curatedStage = useMemo(
    () => curatedGoalStages.find((stageEntry) => stageEntry.etapa === curatedStageKey),
    [curatedStageKey],
  );
  const stageTemplates = useMemo(
    () => (curatedStageKey ? templatesByStageId[curatedStageKey] ?? [] : []),
    [curatedStageKey],
  );
  const selectedDimensionMetas = selectedDimension
    ? templatesByDimension[selectedDimension] ?? []
    : [];

  const initialAnswersRef = useRef(initialAnswers);
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (hydratedRef.current) {
      return;
    }
    hydratedRef.current = true;

    let resolvedPeriodo: PeriodoId = initialPeriodoId ?? DEFAULT_PERIODO;
    const queryPeriodo = searchParams?.get('periodo');
    const queryStage = searchParams?.get('stage');

    if (isPeriodoId(queryPeriodo)) {
      resolvedPeriodo = queryPeriodo;
    } else if (isStage(queryStage)) {
      const matching = PERIODOS.find((periodo) => periodo.stage === queryStage);
      if (matching) {
        resolvedPeriodo = matching.id;
      }
    } else if (persistenceEnabled && typeof window !== 'undefined') {
      const storedPeriodo = window.localStorage.getItem(STORAGE_KEYS.periodo);
      if (isPeriodoId(storedPeriodo)) {
        resolvedPeriodo = storedPeriodo;
      }
    }

    setPeriodoId(resolvedPeriodo);
  }, [searchParamsKey, initialPeriodoId, disablePersistence, persistenceEnabled]);

  useEffect(() => {
    if (!persistenceEnabled || typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(STORAGE_KEYS.periodo, periodoId);
  }, [periodoId, persistenceEnabled]);

  useEffect(() => {
    telemetry.track('goal_generator.stage_selected', { stage, periodoId });
  }, [telemetry, stage, periodoId]);

  useEffect(() => {
    if (!diagnostic) {
      setAnswers({});
      setRecommended([]);
      setSubmitted(false);
      setShowFullStage(false);
      setValidationActive(false);
      return;
    }

    let stageAnswers: Record<string, number> | null = null;

    if (persistenceEnabled && typeof window !== 'undefined') {
      const stored = window.localStorage.getItem(STORAGE_KEYS.answers(stage));
      if (stored) {
        try {
          stageAnswers = JSON.parse(stored) as Record<string, number>;
        } catch {
          stageAnswers = null;
        }
      }
    }

    if (!stageAnswers && initialAnswersRef.current) {
      stageAnswers = initialAnswersRef.current;
      initialAnswersRef.current = undefined;
    }

    setAnswers(stageAnswers ?? {});
    setRecommended([]);
    setSubmitted(false);
    setShowFullStage(false);
    setValidationActive(false);
  }, [diagnostic, stage, disablePersistence, persistenceEnabled]);

  useEffect(() => {
    if (!diagnostic || !persistenceEnabled || typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(STORAGE_KEYS.answers(stage), JSON.stringify(answers));
  }, [answers, diagnostic, stage, persistenceEnabled]);

  const allQuestionsAnswered = diagnostic
    ? diagnostic.questions.every((question) => typeof answers[question.key] === 'number')
    : false;

  const recommendedAreaKeys = useMemo(
    () => new Set(recommended.map((item) => `${item.dimension}|${item.categoria}`)),
    [recommended],
  );

  const handlePeriodoChange = (value: PeriodoId) => {
    setPeriodoId(value);
    telemetry.track('goal_generator.period_selected', {
      periodoId: value,
      stage: periodoToStage(value),
    });
  };

  const handleAnswerChange = (questionKey: string, value: string) => {
    setValidationActive(true);
    setAnswers((prev) => ({
      ...prev,
      [questionKey]: Number.parseInt(value, 10),
    }));
  };

  const handleGenerateRecommendations = () => {
    if (!diagnostic) {
      return;
    }

    if (!allQuestionsAnswered) {
      setValidationActive(true);
      return;
    }

    const normalizedAnswers = diagnostic.questions.map((question) => ({
      key: question.key,
      value: Number(answers[question.key]),
    }));

    const suggestions = recommendGoals(normalizedAnswers, {
      templates: stageTemplates,
      limit: 6,
    });

    setSubmitted(true);
    setRecommended(suggestions);
    setShowFullStage(false);
    telemetry.track('goal_generator.recommendations_generated', {
      stage,
      periodoId,
      totalSuggestions: suggestions.length,
    });
  };

  const handleRevealFullStage = () => {
    setShowFullStage((previous) => {
      const next = !previous;
      telemetry.track('goal_generator.toggle_full_bank', {
        stage,
        periodoId,
        expanded: next,
      });
      return next;
    });
  };

  const handleClearResponses = () => {
    setAnswers({});
    setRecommended([]);
    setSubmitted(false);
    setShowFullStage(false);
    setValidationActive(false);
    if (persistenceEnabled && diagnostic && typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEYS.answers(stage));
    }
    telemetry.track('goal_generator.cleared', { stage, periodoId });
  };

  const handleDimensionSelect = (value: string) => {
    setSelectedDimension(value as WellbeingDimension);
    telemetry.track('goal_generator.dimension_selected', { dimension: value });
  };

  const handleCustomGoalChange = (index: number, field: keyof CustomGoal, value: string) => {
    setCustomGoals((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        [field]: value,
      };
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold font-headline tracking-tight">Generador de metas</h1>
        <p className="max-w-3xl text-muted-foreground">
          Selecciona tu periodo académico, completa el diagnóstico correspondiente y obtén metas SMARTER sugeridas.
          Después, personalízalas y regístralas en{' '}
          <span className="font-medium text-foreground">MiVidaTec → Mi Plan de Vida</span>.
        </p>
      </header>

      <Card className="border-dashed">
        <CardHeader className="space-y-2">
          <CardTitle className="font-headline text-2xl">¿En qué periodo académico te encuentras?</CardTitle>
          <CardDescription className="text-base leading-7">
            Elige tu periodo actual para mostrar el diagnóstico y las metas alineadas a tu etapa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-sm space-y-2">
            <Label htmlFor="periodo-select" className="text-sm font-semibold">
              Periodo actual
            </Label>
            <Select value={periodoId} onValueChange={(value) => handlePeriodoChange(value as PeriodoId)}>
              <SelectTrigger id="periodo-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PERIODOS.map((periodo) => (
                  <SelectItem key={periodo.id} value={periodo.id}>
                    {periodo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {stage === 'primerSemestre' ? (
        <Card>
          <CardHeader className="space-y-3">
            <CardTitle className="font-headline text-2xl">Construye tus primeras metas</CardTitle>
            <CardDescription className="text-base leading-7">
              Sigue las indicaciones para interpretar tu Índice de Bienestar Integral y diseña tres metas SMARTER iniciales
              antes de registrarlas en tu plan de vida.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ol className="list-decimal space-y-3 pl-5 text-sm leading-6 text-muted-foreground">
              <li>
                Revisa tus resultados del Índice de Bienestar Integral en{' '}
                <span className="font-medium text-foreground">Mi Tec → MiVidaTec → Índice de Bienestar Integral</span>.
              </li>
              <li>Selecciona tres dimensiones que desees reforzar.</li>
              <li>Usa las sugerencias para redactar tres metas SMARTER que después registrarás en MiVidaTec.</li>
            </ol>

            <div className="space-y-4">
              <div className="max-w-md space-y-2">
                <Label htmlFor="dimension-select" className="text-sm font-semibold">
                  Explora metas por dimensión
                </Label>
                <Select value={selectedDimension} onValueChange={handleDimensionSelect}>
                  <SelectTrigger id="dimension-select">
                    <SelectValue placeholder="Selecciona una dimensión" />
                  </SelectTrigger>
                  <SelectContent>
                    {dimensionOptions.map((dimension) => (
                      <SelectItem key={dimension} value={dimension}>
                        {dimension}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedDimensionMetas.length > 0 ? (
                <Accordion type="single" collapsible className="space-y-2">
                  {selectedDimensionMetas.map((meta) => (
                    <AccordionItem key={meta.id} value={meta.id}>
                      <AccordionTrigger className="text-left text-sm font-semibold">
                        {renderWithEmphasis(meta.metaSmarter)}
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 text-sm leading-6 text-muted-foreground">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="secondary">{meta.dimension}</Badge>
                          <Badge variant="outline" className="capitalize">
                            {meta.categoria}
                          </Badge>
                          <span className="text-xs font-mono uppercase tracking-wide text-muted-foreground">{meta.id}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">Pasos sugeridos</p>
                          <ul className="mt-2 list-disc space-y-1.5 pl-5">
                            {getActionSteps(meta.pasosAccion).map((step, index) => (
                              <li key={`${meta.id}-dimension-${index}`}>{renderWithEmphasis(step)}</li>
                            ))}
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <p className="text-sm text-muted-foreground">Selecciona una dimensión para ver sugerencias relacionadas.</p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Define tus tres metas iniciales</h3>
              <div className="grid gap-4 md:grid-cols-3">
                {customGoals.map((goal, index) => (
                  <div key={`custom-goal-${index}`} className="space-y-3 rounded-lg border p-4">
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Meta {index + 1}</h4>
                    <div className="space-y-2">
                      <Label htmlFor={`meta-description-${index}`}>Descripción</Label>
                      <Textarea
                        id={`meta-description-${index}`}
                        placeholder="Describe tu meta SMARTER"
                        value={goal.description}
                        onChange={(event) => handleCustomGoalChange(index, 'description', event.target.value)}
                        className="min-h-[96px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`meta-dimension-${index}`}>Dimensión</Label>
                      <Select value={goal.dimension} onValueChange={(value) => handleCustomGoalChange(index, 'dimension', value)}>
                        <SelectTrigger id={`meta-dimension-${index}`}>
                          <SelectValue placeholder="Selecciona una dimensión" />
                        </SelectTrigger>
                        <SelectContent>
                          {dimensionOptions.map((dimension) => (
                            <SelectItem key={`${dimension}-${index}`} value={dimension}>
                              {dimension}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`meta-date-${index}`}>Fecha objetivo</Label>
                      <Input
                        id={`meta-date-${index}`}
                        type="date"
                        value={goal.deadline}
                        onChange={(event) => handleCustomGoalChange(index, 'deadline', event.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <MiVidaTecReminder />
          </CardContent>
        </Card>
      ) : (
        diagnostic && (
          <div className="space-y-6">
            <Card className="border-dashed">
              <CardHeader className="space-y-2">
                <CardTitle className="font-headline text-2xl">{diagnostic.stageLabel}</CardTitle>
                <CardDescription className="text-base leading-7">{diagnostic.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-5"
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleGenerateRecommendations();
                  }}
                >
                  {diagnostic.questions.map((question) => {
                    const questionValue = answers[question.key]?.toString() ?? '';
                    const showValidationMessage = validationActive && typeof answers[question.key] !== 'number';

                    return (
                      <fieldset
                        key={question.key}
                        className="space-y-3 rounded-lg border border-border/70 bg-muted/40 p-4"
                      >
                        <legend className="text-sm font-semibold leading-6">{question.title}</legend>
                        <RadioGroup
                          value={questionValue}
                          onValueChange={(value) => handleAnswerChange(question.key, value)}
                          className="space-y-2"
                        >
                          {question.options.map((option, index) => {
                            const optionValue = (index + 1).toString();
                            const inputId = `${diagnostic.stage}-${question.key}-${index}`;

                            return (
                              <div
                                key={optionValue}
                                className="flex items-start gap-3 rounded-md border border-transparent bg-background/80 p-3 shadow-sm transition hover:border-primary/60 hover:bg-background"
                              >
                                <RadioGroupItem value={optionValue} id={inputId} className="mt-1" />
                                <Label htmlFor={inputId} className="flex-1 cursor-pointer text-sm leading-6">
                                  {option}
                                </Label>
                              </div>
                            );
                          })}
                        </RadioGroup>
                        {showValidationMessage && (
                          <p className="text-xs font-medium text-destructive">Selecciona una opción para continuar.</p>
                        )}
                      </fieldset>
                    );
                  })}

                  <div className="flex flex-wrap items-center gap-3">
                    <Button type="submit" disabled={!allQuestionsAnswered}>
                      Generar metas sugeridas
                    </Button>
                    <Button type="button" variant="outline" onClick={handleClearResponses}>
                      Limpiar respuestas
                    </Button>
                    {!allQuestionsAnswered && (
                      <p className="text-xs text-muted-foreground">
                        Responde todas las preguntas para habilitar el generador.
                      </p>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {curatedStage && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">{curatedStage.titulo}</CardTitle>
                  <CardDescription className="text-base leading-7">
                    {renderWithEmphasis(curatedStage.descripcion)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {submitted ? (
                    recommended.length > 0 ? (
                      <section className="space-y-4">
                        <h3 className="text-lg font-semibold">Metas sugeridas</h3>
                        <div className="space-y-4">
                          {recommended.map((meta) => (
                            <GoalTemplateCard key={meta.id} meta={meta} highlighted />
                          ))}
                        </div>
                      </section>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        ¡Excelente! Tus respuestas muestran buen avance. Explora más metas para mantener tu ritmo.
                      </p>
                    )
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Responde el diagnóstico y genera sugerencias personalizadas para tu etapa.
                    </p>
                  )}

                  {submitted && (
                    <div className="space-y-3">
                      <Button variant="outline" onClick={handleRevealFullStage}>
                        {showFullStage ? 'Ocultar más sugerencias' : 'Generar más sugerencias'}
                      </Button>
                      {showFullStage && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Más metas curadas</h3>
                          {stageTemplates.length > 0 ? (
                            <div className="space-y-4">
                              {stageTemplates.map((meta) => {
                                const isHighlighted = recommendedAreaKeys.has(`${meta.dimension}|${meta.categoria}`);
                                return <GoalTemplateCard key={meta.id} meta={meta} highlighted={isHighlighted} />;
                              })}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              Aún no hay un banco curado disponible para esta etapa.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <MiVidaTecReminder />
                </CardContent>
              </Card>
            )}
          </div>
        )
      )}
    </div>
  );
}

type GoalTemplateCardProps = {
  meta: GoalTemplate;
  highlighted?: boolean;
};

function GoalTemplateCard({ meta, highlighted }: GoalTemplateCardProps) {
  return (
    <article
      className={cn(
        'rounded-lg border bg-card/60 p-5 shadow-sm transition hover:border-primary/50 hover:shadow-md',
        highlighted && 'border-primary/60 bg-primary/10',
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{meta.dimension}</Badge>
          <Badge variant="outline" className="capitalize">
            {meta.categoria}
          </Badge>
        </div>
        <span className="text-xs font-mono uppercase tracking-wide text-muted-foreground">{meta.id}</span>
      </div>
      <p className="mt-3 text-base leading-7">{renderWithEmphasis(meta.metaSmarter)}</p>
      <div className="mt-4">
        <p className="text-sm font-semibold text-muted-foreground">Pasos sugeridos</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-6 text-muted-foreground">
          {getActionSteps(meta.pasosAccion).map((step, index) => (
            <li key={`${meta.id}-step-${index}`}>{renderWithEmphasis(step)}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function MiVidaTecReminder() {
  return (
    <Alert className="border-primary/40 bg-primary/5">
      <AlertTitle>Guarda tus metas en MiVidaTec</AlertTitle>
      <AlertDescription className="space-y-2 text-sm leading-6">
        <p>
          Una vez definidas tus metas, regístralas en{' '}
          <span className="font-medium">MiVidaTec → Mi Plan de Vida</span> para darles seguimiento.
        </p>
        <p>
          Consulta el{' '}
          <Link
            href="https://drive.google.com/file/d/18kojUabG2z00cgmQXGU_6zLGmAL3weE9/view"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline"
          >
            tutorial de apoyo
          </Link>{' '}
          si necesitas ayuda durante el registro.
        </p>
      </AlertDescription>
    </Alert>
  );
}
