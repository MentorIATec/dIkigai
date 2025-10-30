'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { careers } from '@/lib/constants/careers';
import { computeStage } from '@/lib/profile/mapping';
import type { StudentProfile } from '@/lib/types';
import { Compass, Target, Lightbulb } from 'lucide-react';
import Link from 'next/link';

const profileSchema = z.object({
  semesterNumber: z.union([z.number().min(1).max(8), z.literal('8+')]),
  carreraId: z.string().min(1, 'Debes seleccionar una carrera'),
  matricula: z.string()
    .min(1, 'La matrícula es obligatoria')
    .regex(/^[A-Z]\d{8}$/, 'Formato inválido. Debe ser una letra seguida de 8 dígitos (ej: A01234567)'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [purposeProfile, setPurposeProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      semesterNumber: 1,
      carreraId: '',
      matricula: '',
    },
  });

  // Cargar perfil existente
  useEffect(() => {
    async function loadProfile() {
      try {
        const [profileResponse, purposeResponse] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/purpose-discovery')
        ]);
        
        // Cargar perfil académico
        if (profileResponse.ok) {
          const data = await profileResponse.json();
          if (data.profile) {
            setProfile(data.profile);
            form.reset({
              semesterNumber: data.profile.semesterNumber,
              carreraId: data.profile.carreraId || '',
              matricula: '', // No cargar matrícula por seguridad
            });
          }
        } else if (profileResponse.status === 401) {
          // Usuario no autenticado - redirigir al login
          toast({
            title: 'Sesión expirada',
            description: 'Por favor, inicia sesión nuevamente para continuar.',
            variant: 'destructive',
          });
          setTimeout(() => {
            window.location.href = '/login?next=/profile';
          }, 2000);
          return;
        } else {
          const error = await profileResponse.json();
          toast({
            title: 'Error',
            description: error.error || 'No se pudo cargar el perfil',
            variant: 'destructive',
          });
        }

        // Cargar perfil de propósito
        if (purposeResponse.ok) {
          const purposeData = await purposeResponse.json();
          if (purposeData.profile) {
            setPurposeProfile(purposeData.profile);
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast({
          title: 'Error',
          description: 'No se pudo cargar el perfil. Verifica tu conexión.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [form, toast]);

  const onSubmit = async (data: ProfileFormData) => {
    setSaving(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          semesterNumber: data.semesterNumber,
          carreraId: data.carreraId,
          carreraName: data.carreraId ? careers.find(c => c.id === data.carreraId)?.name : undefined,
          matricula: data.matricula || undefined,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setProfile(result.profile);
        
        // Limpiar matrícula del formulario
        form.setValue('matricula', '');
        
        toast({
          title: '¡Perfil actualizado!',
          description: 'Tu información ha sido guardada correctamente.',
        });
        
        // Redirigir al dashboard para mostrar el estado actualizado
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      } else if (response.status === 401) {
        // Usuario no autenticado - redirigir al login
        toast({
          title: 'Sesión expirada',
          description: 'Por favor, inicia sesión nuevamente para continuar.',
          variant: 'destructive',
        });
        setTimeout(() => {
          window.location.href = '/login?next=/profile';
        }, 2000);
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'No se pudo guardar el perfil',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar el perfil',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const semesterNumber = form.watch('semesterNumber');
  const computedStage = computeStage(typeof semesterNumber === 'number' ? semesterNumber : 8);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Perfil del Estudiante</h1>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Perfil del Estudiante</h1>
        <p className="text-muted-foreground">
          Completa tu información académica para recibir recomendaciones personalizadas.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Información Académica</CardTitle>
            <CardDescription>
              Actualiza tu información para recibir recomendaciones más precisas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="semesterNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Semestre Actual</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value === '8+' ? '8+' : parseInt(value));
                        }}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona tu semestre" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7].map((sem) => (
                            <SelectItem key={sem} value={sem.toString()}>
                              {sem}° Semestre
                            </SelectItem>
                          ))}
                          <SelectItem value="8+">8° o más</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Etapa académica automática</FormDescription>
                      <div>
                        <Badge variant="secondary">{computedStage}</Badge>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="carreraId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Carrera *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona tu carrera" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {careers.map((career) => (
                            <SelectItem key={career.id} value={career.id}>
                              {career.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="matricula"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Matrícula *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: A01234567"
                          {...field}
                          type="text"
                          className="uppercase"
                          onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                        />
                      </FormControl>
                      <FormDescription>
                        Formato: Una letra seguida de 8 dígitos. Tu matrícula se cifrará y solo se guardarán los últimos 4 dígitos.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={saving} className="w-full">
                  {saving ? 'Guardando...' : 'Guardar Perfil'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {profile && (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Resumen del Perfil</CardTitle>
              <CardDescription>Tu información académica actual</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Semestre:</span>
                <Badge variant="outline">{profile.semesterNumber}°</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Etapa:</span>
                <Badge variant="secondary">{profile.semesterStage}</Badge>
              </div>
              {profile.carreraName && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Carrera:</span>
                  <span className="text-sm">{profile.carreraName}</span>
                </div>
              )}
              {profile.matricula_last4 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Matrícula:</span>
                  <span className="text-sm font-mono">****{profile.matricula_last4}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Sección de Propósito de Vida */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Compass className="h-5 w-5 mr-2 text-primary" />
              Mi Propósito de Vida
            </CardTitle>
            <CardDescription>
              Descubre y define tu propósito personal a través de la reflexión guiada
            </CardDescription>
          </CardHeader>
          <CardContent>
            {purposeProfile && purposeProfile.answers.length > 0 ? (
              <div className="space-y-4">
                {/* Progreso */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Progreso del Descubrimiento</span>
                    <Badge variant="outline">{purposeProfile.completionProgress}%</Badge>
                  </div>
                  <Progress value={purposeProfile.completionProgress} className="h-2" />
                </div>

                {/* Etapa actual */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Etapa Actual:</span>
                  <Badge variant="secondary" className="capitalize">
                    {purposeProfile.currentStage.replace('_', ' ')}
                  </Badge>
                </div>

                {/* Declaración de propósito */}
                {purposeProfile.purposeStatement ? (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-l-4 border-blue-400">
                    <div className="flex items-start space-x-2">
                      <Target className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-blue-900 mb-1">Mi Propósito:</p>
                        <p className="text-blue-800 leading-relaxed italic">
                          "{purposeProfile.purposeStatement}"
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-muted/30 p-4 rounded-lg text-center">
                    <Lightbulb className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Aún no has definido tu declaración de propósito
                    </p>
                  </div>
                )}

                {/* Estadísticas */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-lg font-bold text-primary">{purposeProfile.answers.length}</div>
                    <div className="text-xs text-muted-foreground">Respuestas</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-lg font-bold text-primary">{purposeProfile.keyThemes.length}</div>
                    <div className="text-xs text-muted-foreground">Temas Clave</div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button asChild className="flex-1">
                    <Link href="/purpose-discovery">
                      <Compass className="h-4 w-4 mr-2" />
                      Ver Mis Resultados
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link href="/purpose-discovery">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Continuar Explorando
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <Compass className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Comienza tu Viaje de Autoconocimiento</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Descubre tu propósito de vida a través de preguntas reflexivas diseñadas para 
                    ayudarte a conocerte mejor y definir lo que realmente te motiva.
                  </p>
                </div>
                <Button asChild className="w-full">
                  <Link href="/purpose-discovery">
                    <Compass className="h-4 w-4 mr-2" />
                    Iniciar Descubrimiento del Propósito
                  </Link>
                </Button>
                <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Target className="h-3 w-3" />
                    <span>15-20 min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Lightbulb className="h-3 w-3" />
                    <span>Insights personalizados</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
