'use client';
import { useCallback, useEffect } from 'react';
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
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { goalTemplates, semesters } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const goalSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres.'),
  semester: z.string({ required_error: 'Por favor selecciona un semestre.' }),
  templateId: z.string().optional(),
  smarter: z.object({
    specific: z.string().min(10, 'Sé más específico (mínimo 10 caracteres).'),
    measurable: z.string().min(10, 'Define cómo medirás tu progreso (mínimo 10 caracteres).'),
    achievable: z.string().min(10, 'Describe por qué es alcanzable (mínimo 10 caracteres).'),
    relevant: z.string().min(10, 'Explica la relevancia de esta meta (mínimo 10 caracteres).'),
    timeBound: z.date({ required_error: 'Se requiere una fecha límite.' }),
    evaluated: z.string().min(10, 'Define cómo evaluarás tu meta (mínimo 10 caracteres).'),
    readjusted: z.string().min(10, 'Plantea cómo podrías reajustar tu meta (mínimo 10 caracteres).'),
  }),
});

type GoalFormProps = {
  prefillTemplateId?: string;
};

export function GoalForm({ prefillTemplateId }: GoalFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof goalSchema>>({
    resolver: zodResolver(goalSchema),
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

  function onSubmit(values: z.infer<typeof goalSchema>) {
    console.log(values);
    toast({
      title: '¡Meta Creada!',
      description: 'Tu nueva meta ha sido guardada con éxito.',
    });
    router.push('/goals');
  }

  const handleTemplateChange = useCallback(
    (templateId: string) => {
      const template = goalTemplates.find((t) => t.id === templateId);
      if (template) {
        form.setValue('title', template.title);
        Object.entries(template.smarterSuggestion).forEach(([key, value]) => {
          if(key === 'timeBound' && value instanceof Date) {
               form.setValue(`smarter.timeBound`, value);
          } else if (typeof value === 'string') {
               form.setValue(`smarter.${key as keyof typeof template.smarterSuggestion}`, value);
          }
        });
      }
    },
    [form],
  );

  useEffect(() => {
    if (!prefillTemplateId) {
      return;
    }
    form.setValue('templateId', prefillTemplateId);
    handleTemplateChange(prefillTemplateId);
  }, [prefillTemplateId, form, handleTemplateChange]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="templateId"
            render={({ field }) => (
                <FormItem>
                <FormLabel>¿Usar una plantilla?</FormLabel>
                <Select onValueChange={(value) => {
                    field.onChange(value);
                    handleTemplateChange(value);
                }}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona una plantilla como punto de partida" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {goalTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                        {template.title}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormDescription>Las plantillas te ayudarán a estructurar mejor tu meta.</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Título de la Meta</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Mejorar mi promedio en..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="semester"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Semestre</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el semestre para esta meta" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {semesters.map((semester) => (
                    <SelectItem key={semester} value={semester}>
                      {semester}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-6 pt-4 border-t">
            <h3 className='text-xl font-headline font-bold text-accent'>Define tu Meta SMARTER</h3>
            {Object.entries({
                specific: "S - Específico",
                measurable: "M - Medible",
                achievable: "A - Alcanzable",
                relevant: "R - Relevante",
                evaluated: "E - Evaluado",
                readjusted: "R - Reajustado",
            }).map(([key, label]) => (
                <FormField
                key={key}
                control={form.control}
                name={`smarter.${key as 'specific' | 'measurable' | 'achievable' | 'relevant' | 'evaluated' | 'readjusted'}`}
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Textarea placeholder={`Describe el aspecto "${label.split(' - ')[1]}" de tu meta...`} {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            ))}
             <FormField
                control={form.control}
                name="smarter.timeBound"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>T - Con Plazo Definido</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value ? (
                                format(field.value, "PPP", { locale: es })
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
                            disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
                />

        </div>


        <Button type="submit" size="lg">Guardar Meta</Button>
      </form>
    </Form>
  );
}
