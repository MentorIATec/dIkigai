'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Edit, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { StudentAvatar } from './student-avatar';
import type { StudentProfile } from '@/lib/types';

export function StudentProfileCard() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const data = await response.json();
          setProfile(data.profile);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <User className="h-5 w-5" />
            Perfil del Estudiante
          </CardTitle>
          <CardDescription>Cargando...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <User className="h-5 w-5" />
            Perfil del Estudiante
          </CardTitle>
          <CardDescription>Completa tu información académica</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-4">
              Completa tu perfil para recibir recomendaciones personalizadas de metas.
            </p>
            <Button asChild className="w-full">
              <Link href="/profile">
                <Edit className="mr-2 h-4 w-4" />
                Completar Perfil
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <StudentAvatar size="sm" />
          Perfil del Estudiante
        </CardTitle>
        <CardDescription>Tu información académica</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Semestre:</span>
            <Badge variant="outline">{profile.semesterNumber}°</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Etapa:</span>
            <Badge variant="secondary" className="capitalize">
              {profile.semesterStage}
            </Badge>
          </div>
          
          {profile.carreraName && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Carrera:</span>
              <span className="text-sm text-right max-w-[120px] truncate">
                {profile.carreraName}
              </span>
            </div>
          )}
          
          {profile.matricula_last4 && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Matrícula:</span>
              <span className="text-sm font-mono">****{profile.matricula_last4}</span>
            </div>
          )}
        </div>
        
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href="/profile">
            <Edit className="mr-2 h-4 w-4" />
            Editar Perfil
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
