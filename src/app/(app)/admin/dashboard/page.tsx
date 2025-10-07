import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { goals, mockUser } from "@/lib/data";
import type { Goal } from "@/lib/types";

const allGoals = goals; // In a real app, this would be a fetch for all users' goals.

const statusVariantMap: { [key in Goal['status']]: 'default' | 'secondary' | 'outline' | 'destructive' } = {
    'en-progreso': 'secondary',
    'completada': 'default',
    'reajustada': 'outline',
    'sin-empezar': 'destructive',
}

const statusTextMap: { [key in Goal['status']]: string } = {
    'en-progreso': 'En Progreso',
    'completada': 'Completada',
    'reajustada': 'Reajustada',
    'sin-empezar': 'Sin Empezar',
}

// Mock function to get user name
const getUserName = (userId: string) => userId === 'user-1' ? 'Ana Pérez' : 'Carlos Ruíz';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Panel de Administrador</h1>
        <p className="text-muted-foreground">Revisa las metas y el progreso de todos los estudiantes.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Metas de Estudiantes</CardTitle>
          <CardDescription>Listado completo de metas registradas en la plataforma.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estudiante</TableHead>
                <TableHead className="w-[35%]">Meta</TableHead>
                <TableHead>Semestre</TableHead>
                <TableHead>Progreso</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allGoals.length > 0 ? allGoals.map(goal => (
                <TableRow key={goal.id}>
                  <TableCell className="font-medium">{getUserName(goal.userId)}</TableCell>
                  <TableCell>{goal.title}</TableCell>
                  <TableCell>{goal.semester}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={goal.progress} className="w-24"/>
                      <span>{goal.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariantMap[goal.status]}>
                      {statusTextMap[goal.status]}
                    </Badge>
                  </TableCell>
                </TableRow>
              )) : (
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
