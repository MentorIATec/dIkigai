'use client';

import { useMemo } from 'react';
import Link from 'next/link';

import { GoalCard } from '@/components/goal-card';
import { ProgressChart } from '@/components/progress-chart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { goals, mockUser } from '@/lib/data';
import { ArrowRight, CheckCircle, FilePlus2, ListTodo } from 'lucide-react';

export default function DashboardClient() {
  const userGoals = useMemo(() => goals.filter((goal) => goal.userId === mockUser.id), []);
  const activeGoals = useMemo(() => userGoals.filter((goal) => goal.status === 'en-progreso').length, [userGoals]);
  const completedGoals = useMemo(() => userGoals.filter((goal) => goal.status === 'completada').length, [userGoals]);
  const avgProgress = useMemo(() => {
    if (userGoals.length === 0) {
      return 0;
    }
    const totalProgress = userGoals.reduce((acc, goal) => acc + goal.progress, 0);
    return Math.round(totalProgress / userGoals.length);
  }, [userGoals]);
  const recentGoals = useMemo(() => userGoals.slice(0, 3), [userGoals]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Bienvenida, {mockUser.name.split(' ')[0]}!</h1>
        <p className="text-muted-foreground">Aquí tienes un resumen de tu progreso académico.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Metas Activas</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeGoals}</div>
            <p className="text-xs text-muted-foreground">Metas actualmente en progreso</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Metas Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedGoals}</div>
            <p className="text-xs text-muted-foreground">Total de metas alcanzadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso Promedio</CardTitle>
            <div className="h-4 w-4 text-muted-foreground text-accent">%</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgProgress}%</div>
            <p className="text-xs text-muted-foreground">En todas tus metas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <ProgressChart />
        </div>
        <div className="lg:col-span-3 flex flex-col gap-4">
          <Card className="flex flex-col items-center justify-center text-center p-6 bg-primary/10 border-dashed">
            <FilePlus2 className="h-12 w-12 text-accent mb-4" />
            <CardTitle className="font-headline mb-2">¿Listo para un nuevo reto?</CardTitle>
            <CardContent className="p-0">
              <p className="text-sm text-muted-foreground mb-4">
                Define tu próxima gran meta y empieza a trabajar hacia tu éxito.
              </p>
              <Button asChild>
                <Link href="/goals/new">
                  Crear Nueva Meta <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold font-headline tracking-tight mb-4">Metas Recientes</h2>
        {recentGoals.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Aún no has creado ninguna meta. ¡Empieza hoy!</p>
        )}
      </div>
    </div>
  );
}
