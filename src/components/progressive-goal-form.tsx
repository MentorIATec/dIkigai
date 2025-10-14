'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CalendarIcon, ArrowRight, ArrowLeft, CheckCircle, Target, Clock, Lightbulb } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { goalTemplates } from '@/lib/data';
import { getFutureAcademicPeriods, type AcademicPeriod } from '@/lib/academic-periods';
import { useToast } from '@/hooks/use-toast';
import { usePersonalGoals } from '@/hooks/use-personal-goals';
import { useRouter } from 'next/navigation';

// Schema progresivo por pasos
const step1Schema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres.'),
  semester: z.string({ required_error: 'Por favor selecciona un semestre.' }),
  templateId: z.string().optional(),
});

const step2Schema = z.object({
  specific: z.string().min(10, 'Sé más específico (mínimo 10 caracteres).'),
  measurable: z.string().min(10, 'Define cómo medirás tu progreso (mínimo 10 caracteres).'),
  timeBound: z.date({ required_error: 'Se requiere una fecha límite.' }),
});

const step3Schema = z.object({
  achievable: z.string().min(10, 'Describe por qué es alcanzable (mínimo 10 caracteres).'),
  relevant: z.string().min(10, 'Explica la relevancia de esta meta (mínimo 10 caracteres).'),
  evaluated: z.string().min(10, 'Define cómo evaluarás tu meta (mínimo 10 caracteres).'),
  readjusted: z.string().min(10, 'Plantea cómo podrías reajustar tu meta (mínimo 10 caracteres).'),
});

const completeSchema = step1Schema.merge(step2Schema).merge(step3Schema);

type ProgressiveGoalFormProps = {
  prefillTemplateId?: string;
};

export function ProgressiveGoalForm({ prefillTemplateId }: ProgressiveGoalFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { addPersonalGoal } = usePersonalGoals();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<z.infer<typeof completeSchema>>>({});
  
  // Obtener períodos académicos futuros
  const academicPeriods = getFutureAcademicPeriods();

  const form = useForm<z.infer<typeof completeSchema>>({
    resolver: zodResolver(completeSchema),
    defaultValues: {
      title: '',
      smarter: {
        specific: '',
        measurable: '',
        achievable: '',
        relevant: '',
        evaluated: '',
        readjusted: '',
      },
    },
  });

  const handleTemplateChange = useCallback(
    (templateId: string) => {
      const template = goalTemplates.find((t) => t.id === templateId);
      if (template) {
        form.setValue('title', template.title);
        // Pre-rellenar campos SMARTER si están disponibles
        if (template.smarterSuggestion.specific) {
          form.setValue('specific', template.smarterSuggestion.specific);
        }
        if (template.smarterSuggestion.measurable) {
          form.setValue('measurable', template.smarterSuggestion.measurable);
        }
        if (template.smarterSuggestion.achievable) {
          form.setValue('achievable', template.smarterSuggestion.achievable);
        }
        if (template.smarterSuggestion.relevant) {
          form.setValue('relevant', template.smarterSuggestion.relevant);
        }
        if (template.smarterSuggestion.timeBound instanceof Date) {
          form.setValue('timeBound', template.smarterSuggestion.timeBound);
        }
      }
    },
    [form],
  );

  const handleNext = async () => {
    let isValid = false;
    
    if (currentStep === 1) {
      isValid = await form.trigger(['title', 'semester']);
    } else if (currentStep === 2) {
      isValid = await form.trigger(['specific', 'measurable', 'timeBound']);
    } else if (currentStep === 3) {
      isValid = await form.trigger(['achievable', 'relevant', 'evaluated', 'readjusted']);
    }

    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (values: z.infer<typeof completeSchema>) => {
    try {
      console.log('Meta creada:', values);
      
      // Guardar la meta personalizada
      await addPersonalGoal({
        title: values.title,
        semester: values.semester,
        templateId: values.templateId,
        smarter: {
          specific: values.specific,
          measurable: values.measurable,
          achievable: values.achievable,
          relevant: values.relevant,
          timeBound: values.timeBound,
          evaluated: values.evaluated,
          readjusted: values.readjusted,
        },
      });
      
      router.push('/goals');
    } catch (error) {
      console.error('Error creating goal:', error);
      // El error ya se maneja en addPersonalGoal con toast
    }
  };

  const steps = [
    {
      number: 1,
      title: '¿Qué quieres lograr?',
      description: 'Define tu meta y cuándo la quieres alcanzar',
      icon: Target,
    },
    {
      number: 2,
      title: '¿Cómo lo medirás?',
      description: 'Especifica los detalles y la medición',
      icon: Clock,
    },
    {
      number: 3,
      title: '¿Es realista?',
      description: 'Evalúa la viabilidad y relevancia',
      icon: Lightbulb,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header con progreso */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">Crear Meta SMARTER</h1>
            <p className="text-muted-foreground">
              Crea tu meta paso a paso con nuestra guía progresiva.
            </p>
          </div>
          <Badge variant="outline" className="text-sm">
            Paso {currentStep} de 3
          </Badge>
        </div>

        {/* Indicador de progreso */}
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            const Icon = step.icon;
            
            return (
              <div key={step.number} className="flex items-center space-x-2">
                <div
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors',
                    isCompleted && 'bg-green-500 border-green-500 text-white',
                    isCurrent && 'bg-blue-500 border-blue-500 text-white',
                    !isCompleted && !isCurrent && 'border-gray-300 text-gray-400'
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    'w-8 h-0.5 transition-colors',
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  )} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Paso 1: ¿Qué quieres lograr? */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  {steps[0].title}
                </CardTitle>
                <CardDescription>{steps[0].description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Plantilla */}
                <FormField
                  control={form.control}
                  name="templateId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>¿Usar una plantilla?</FormLabel>
                      <Select onValueChange={(value) => {
                        field.onChange(value);
                        handleTemplateChange(value);
                      }} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una plantilla como punto de partida" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {goalTemplates.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              <div className="flex flex-col">
                                <span className="font-medium">{template.title}</span>
                                <span className="text-xs text-muted-foreground">{template.category}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Las plantillas te ayudarán a estructurar mejor tu meta.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Título */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título de la Meta</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Mejorar mi promedio en..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Describe tu meta en una oración clara y concisa.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Semestre */}
                <FormField
                  control={form.control}
                  name="semester"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Período Académico</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el período académico para esta meta" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {academicPeriods.map((period) => (
                            <SelectItem key={period.value} value={period.value}>
                              <div className="flex flex-col">
                                <span className="font-medium">{period.label}</span>
                                {period.isCurrent && (
                                  <span className="text-xs text-blue-600">(Período actual)</span>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        ¿En qué período académico quieres alcanzar esta meta?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Paso 2: ¿Cómo lo medirás? */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  {steps[1].title}
                </CardTitle>
                <CardDescription>{steps[1].description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="specific"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>S - Específico</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="¿Qué exactamente quieres lograr? Sé muy específico..." 
                          {...field} 
                          rows={3}
                        />
                      </FormControl>
                      <FormDescription>
                        Define claramente qué quieres conseguir.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="measurable"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>M - Medible</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="¿Cómo sabrás que lo lograste? ¿Qué números o indicadores usarás?" 
                          {...field} 
                          rows={3}
                        />
                      </FormControl>
                      <FormDescription>
                        Define cómo medirás tu progreso y éxito.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timeBound"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>T - Con Plazo Definido</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP', { locale: es })
                              ) : (
                                <span>Elige una fecha</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        ¿Para cuándo quieres lograr esta meta?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Paso 3: ¿Es realista? */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                  {steps[2].title}
                </CardTitle>
                <CardDescription>{steps[2].description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="achievable"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>A - Alcanzable</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="¿Tienes los recursos y habilidades necesarias? ¿Es realista?" 
                          {...field} 
                          rows={3}
                        />
                      </FormControl>
                      <FormDescription>
                        Evalúa si esta meta es factible con tus recursos actuales.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="relevant"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>R - Relevante</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="¿Por qué es importante esta meta para ti? ¿Cómo se conecta con tus objetivos?" 
                          {...field} 
                          rows={3}
                        />
                      </FormControl>
                      <FormDescription>
                        Explica por qué esta meta es importante para ti.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="evaluated"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E - Evaluado</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="¿Cómo revisarás tu progreso? ¿Cuándo y cómo te evaluarás?" 
                          {...field} 
                          rows={3}
                        />
                      </FormControl>
                      <FormDescription>
                        Define cómo harás seguimiento a tu progreso.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="readjusted"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>R - Reajustado</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="¿Qué harás si necesitas cambiar la meta? ¿Cómo la adaptarías?" 
                          {...field} 
                          rows={3}
                        />
                      </FormControl>
                      <FormDescription>
                        Piensa en cómo podrías ajustar la meta si es necesario.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Botones de navegación */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </Button>

            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2"
              >
                Siguiente
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Crear Meta
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
