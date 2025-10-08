'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, User, GraduationCap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { StudentProfile } from '@/lib/types';

interface ProfileHeroCardProps {
  onProfileComplete?: () => void;
}

export function ProfileHeroCard({ onProfileComplete }: ProfileHeroCardProps) {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const data = await response.json();
          setProfile(data.profile);
          if (data.profile && isProfileComplete(data.profile)) {
            onProfileComplete?.();
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [onProfileComplete]);

  const isProfileComplete = (profile: StudentProfile): boolean => {
    return !!(
      profile.semesterNumber &&
      profile.carreraName &&
      profile.matricula_last4
    );
  };

  const getCompletionStatus = () => {
    if (!profile) return { completed: 0, total: 3 };
    
    let completed = 0;
    if (profile.semesterNumber) completed++;
    if (profile.carreraName) completed++;
    if (profile.matricula_last4) completed++;
    
    return { completed, total: 3 };
  };

  const { completed, total } = getCompletionStatus();
  const isComplete = completed === total;

  if (loading) {
    return (
      <Card className="bg-blue-50/50 border-blue-200/50 rounded-xl">
        <CardContent className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-blue-100 rounded w-1/3"></div>
            <div className="h-4 bg-blue-100 rounded w-2/3"></div>
            <div className="h-10 bg-blue-100 rounded w-1/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isComplete) {
    return null; // No mostrar el hero si el perfil está completo
  }

  const checklistItems = [
    {
      label: 'Semestre actual',
      completed: Boolean(profile?.semesterNumber),
      badge: profile?.semesterNumber ? (
        <Badge variant="outline">{profile.semesterNumber}°</Badge>
      ) : null,
    },
    {
      label: 'Programa académico',
      completed: Boolean(profile?.carreraName),
      badge: profile?.carreraName ? (
        <Badge variant="outline" className="max-w-[200px] truncate">
          {profile.carreraName}
        </Badge>
      ) : null,
    },
    {
      label: 'Matrícula (obligatoria)',
      completed: Boolean(profile?.matricula_last4),
      badge: profile?.matricula_last4 ? (
        <Badge variant="outline">****{profile.matricula_last4}</Badge>
      ) : null,
    },
  ];

  return (
    <Card className="bg-gradient-to-br from-blue-50/80 to-blue-100/60 border-blue-200/60 rounded-xl shadow-lg">
      <CardContent className="p-8">
        <div className="flex items-start gap-6">
          {/* Ícono grande */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Contenido principal */}
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                ¡Completa tu perfil académico!
              </h2>
              <p className="text-gray-600 text-lg">
                Necesitamos algunos datos para personalizar tu experiencia y darte recomendaciones más precisas.
              </p>
            </div>

            {/* Checklist de campos pendientes */}
            <div className="space-y-3">
              {checklistItems.map((item, index) => (
                <div className="flex items-center gap-3" key={item.label}>
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                      item.completed
                        ? 'border-green-500 bg-green-100 text-green-700'
                        : 'border-blue-200 bg-white text-blue-600'
                    }`}
                  >
                    {item.completed ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span className="text-sm font-semibold">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-sm font-medium ${
                        item.completed ? 'text-green-700' : 'text-gray-700'
                      }`}
                    >
                      {item.label}
                    </span>
                    {item.badge}
                  </div>
                </div>
              ))}
            </div>

            {/* Progreso */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progreso del perfil</span>
                <span className="font-medium text-blue-600">{completed}/{total}</span>
              </div>
              <div className="w-full bg-blue-100 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(completed / total) * 100}%` }}
                />
              </div>
            </div>

            {/* Botón de acción */}
            <div className="pt-2">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/profile">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  {completed === 0 ? 'Comenzar perfil' : 'Completar perfil'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
