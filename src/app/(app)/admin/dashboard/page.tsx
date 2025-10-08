import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { goals, mockUser } from "@/lib/data";
import type { Goal, StudentProfile } from "@/lib/types";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

// Mock function to get user profile status
const getUserProfileStatus = (userId: string): { complete: boolean; missing: string[] } => {
  // En una app real, esto vendría de la base de datos
  if (userId === 'user-1') {
    return { complete: true, missing: [] };
  }
  return { complete: false, missing: ['Carrera', 'Matrícula'] };
};

const getProfileStatusIcon = (complete: boolean) => {
  if (complete) {
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  }
  return <XCircle className="h-4 w-4 text-red-500" />;
};

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
                <TableHead>Perfil</TableHead>
                <TableHead className="w-[30%]">Meta</TableHead>
                <TableHead>Semestre</TableHead>
                <TableHead>Progreso</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allGoals.length > 0 ? allGoals.map(goal => {
                const profileStatus = getUserProfileStatus(goal.userId);
                return (
                  <TableRow key={goal.id}>
                    <TableCell className="font-medium">{getUserName(goal.userId)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getProfileStatusIcon(profileStatus.complete)}
                        <div className="flex flex-col">
                          <span className="text-xs font-medium">
                            {profileStatus.complete ? 'Completo' : 'Incompleto'}
                          </span>
                          {!profileStatus.complete && (
                            <span className="text-xs text-muted-foreground">
                              Falta: {profileStatus.missing.join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
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
                );
              }) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
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
