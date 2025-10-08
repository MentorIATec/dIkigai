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
import { useToast } from '@/hooks/use-toast';
import { careers } from '@/lib/constants/careers';
import { computeStage } from '@/lib/profile/mapping';
import type { StudentProfile } from '@/lib/types';

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
        const response = await fetch('/api/profile');
        if (response.ok) {
          const data = await response.json();
          if (data.profile) {
            setProfile(data.profile);
            form.reset({
              semesterNumber: data.profile.semesterNumber,
              carreraId: data.profile.carreraId || '',
              matricula: '', // No cargar matrícula por seguridad
            });
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [form]);

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
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                            <SelectItem key={sem} value={sem.toString()}>
                              {sem}° Semestre
                            </SelectItem>
                          ))}
                          <SelectItem value="8+">8° o más</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Etapa calculada</FormDescription>
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
      </div>
    </div>
  );
}
