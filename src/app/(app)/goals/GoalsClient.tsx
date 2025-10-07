'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { goals, mockUser } from '@/lib/data';
import type { Goal } from '@/lib/types';
import { FilePlus2 } from 'lucide-react';

const statusVariantMap: { [key in Goal['status']]: 'default' | 'secondary' | 'outline' | 'destructive' } = {
  'en-progreso': 'secondary',
  completada: 'default',
  reajustada: 'outline',
  'sin-empezar': 'destructive',
};

const statusTextMap: { [key in Goal['status']]: string } = {
  'en-progreso': 'En Progreso',
  completada: 'Completada',
  reajustada: 'Reajustada',
  'sin-empezar': 'Sin Empezar',
};

export default function GoalsClient() {
  const userGoals = useMemo(() => goals.filter((goal) => goal.userId === mockUser.id), []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Mis Metas</h1>
          <p className="text-muted-foreground">Aquí puedes ver y gestionar todas tus metas académicas.</p>
        </div>
        <Button asChild>
          <Link href="/goals/new">
            <FilePlus2 className="mr-2 h-4 w-4" />
            Crear Nueva Meta
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Todas las Metas</CardTitle>
          <CardDescription>Un listado completo de tus objetivos.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Meta</TableHead>
                <TableHead>Semestre</TableHead>
                <TableHead>Progreso</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Plazo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userGoals.length > 0 ? (
                userGoals.map((goal) => (
                  <TableRow key={goal.id}>
                    <TableCell className="font-medium">{goal.title}</TableCell>
                    <TableCell>{goal.semester}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={goal.progress} className="w-24" />
                        <span>{goal.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariantMap[goal.status]}>{statusTextMap[goal.status]}</Badge>
                    </TableCell>
                    <TableCell>{format(goal.smarter.timeBound, 'dd/MM/yyyy')}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No se encontraron metas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
