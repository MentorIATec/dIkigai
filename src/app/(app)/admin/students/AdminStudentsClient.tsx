'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CAREER_OPTIONS } from '@/lib/constants/careers';

const STAGE_LABELS: Record<string, string> = {
  exploracion: 'Exploración',
  enfoque: 'Enfoque',
  especializacion: 'Especialización',
  graduacion: 'Graduación',
};

type StudentRow = {
  uid: string;
  email: string | null;
  carreraId: string | null;
  carreraName: string | null;
  semesterNumber: number | null;
  semesterStage: string | null;
  matricula_last4: string | null;
};

export function AdminStudentsClient() {
  const [stageFilter, setStageFilter] = useState<string>('');
  const [careerFilter, setCareerFilter] = useState<string>('');
  const [search, setSearch] = useState('');
  const [rows, setRows] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMatricula, setDialogMatricula] = useState<string | null>(null);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [dialogAuditId, setDialogAuditId] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();
    async function fetchRows() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (stageFilter) {
          params.set('stage', stageFilter);
        }
        if (careerFilter) {
          params.set('carrera', careerFilter);
        }
        const query = params.toString();
        const response = await fetch(`/api/admin/students${query ? `?${query}` : ''}`, {
          signal: controller.signal,
          cache: 'no-store',
        });
        if (!response.ok) {
          if (response.status === 429) {
            setError('Llegaste al límite de consultas. Intenta nuevamente en unos minutos.');
            return;
          }
          throw new Error('failed');
        }
        const data = (await response.json()) as { items: StudentRow[] };
        if (!ignore) {
          setRows(Array.isArray(data.items) ? data.items : []);
        }
      } catch (fetchError) {
        if (!ignore && !(fetchError instanceof DOMException && fetchError.name === 'AbortError')) {
          console.error('Failed to load student profiles', fetchError);
          setError('No pudimos cargar los perfiles. Intenta de nuevo.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    void fetchRows();
    return () => {
      ignore = true;
      controller.abort();
    };
  }, [stageFilter, careerFilter]);

  const filteredRows = useMemo(() => {
    if (!search) {
      return rows;
    }
    const query = search.toLowerCase();
    return rows.filter((row) => {
      return (
        (row.email ?? '').toLowerCase().includes(query) ||
        (row.carreraName ?? '').toLowerCase().includes(query) ||
        (row.matricula_last4 ?? '').toLowerCase().includes(query)
      );
    });
  }, [rows, search]);

  async function handleViewMatricula(uid: string) {
    setDialogOpen(true);
    setDialogMatricula(null);
    setDialogLoading(true);
    setDialogAuditId(null);
    try {
      const response = await fetch(`/api/admin/students/${uid}/matricula`, { cache: 'no-store' });
      if (!response.ok) {
        if (response.status === 429) {
          setDialogMatricula('Demasiadas consultas. Inténtalo más tarde.');
          return;
        }
        throw new Error('failed');
      }
      const data = (await response.json()) as { matricula: string | null; auditId?: string | null };
      setDialogMatricula(data.matricula ?? 'Sin matrícula registrada');
      setDialogAuditId(data.auditId ?? response.headers.get('X-Audit-Id'));
    } catch (fetchError) {
      console.error('Failed to decrypt matricula', fetchError);
      setDialogMatricula('No pudimos recuperar la matrícula.');
    } finally {
      setDialogLoading(false);
    }
  }

  function handleDownloadCsv() {
    const params = new URLSearchParams();
    if (stageFilter) {
      params.set('stage', stageFilter);
    }
    if (careerFilter) {
      params.set('carrera', careerFilter);
    }
    const query = params.toString();

    fetch(`/api/admin/students/export${query ? `?${query}` : ''}`, {
      cache: 'no-store',
    })
      .then(async (response) => {
        if (!response.ok) {
          if (response.status === 429) {
            throw new Error('rate');
          }
          throw new Error('failed');
        }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'student-profiles.csv';
        anchor.click();
        URL.revokeObjectURL(url);
        const auditId = response.headers.get('X-Audit-Id');
        setNotice(
          auditId
            ? `Descarga generada. ID de auditoría: ${auditId}`
            : 'Descarga generada y registrada en auditoría.',
        );
      })
      .catch((downloadError) => {
        console.error('Failed to export CSV', downloadError);
        if (downloadError instanceof Error && downloadError.message === 'rate') {
          setNotice('Has excedido el límite de descargas. Inténtalo más tarde.');
        } else {
          setNotice('No pudimos generar el CSV. Inténtalo de nuevo.');
        }
      });
  }

  return (
    <div className="space-y-6">
      {notice ? (
        <div className="rounded-md border border-amber-400/40 bg-amber-50 p-3 text-sm text-amber-900">
          {notice}
        </div>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle>Perfiles de estudiantes</CardTitle>
          <CardDescription>
            Visualiza carrera, etapa y últimos dígitos de matrícula. Filtra por etapa o carrera y descarga los resultados.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="space-y-2">
              <Label>Etapa</Label>
              <Select value={stageFilter} onValueChange={setStageFilter} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  {Object.entries(STAGE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Carrera</Label>
              <Select value={careerFilter} onValueChange={setCareerFilter} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  {CAREER_OPTIONS.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Búsqueda rápida</Label>
              <Input
                placeholder="Buscar por correo, carrera o últimos dígitos"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              {filteredRows.length} registros coinciden con los filtros seleccionados.
            </div>
            <Button onClick={handleDownloadCsv} variant="secondary" disabled={loading}>
              Descargar CSV
            </Button>
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre/Correo</TableHead>
                  <TableHead>Carrera</TableHead>
                  <TableHead>Etapa</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRows.map((row) => (
                  <TableRow key={row.uid}>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">{row.email ?? 'Sin correo'}</span>
                        <span className="text-xs text-muted-foreground">UID: {row.uid}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span>{row.carreraName ?? 'Sin carrera'}</span>
                        <span className="text-xs text-muted-foreground">
                          Últimos 4 dígitos: {row.matricula_last4 ?? '—'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {row.semesterStage ? (
                          <Badge variant="outline">{STAGE_LABELS[row.semesterStage] ?? row.semesterStage}</Badge>
                        ) : null}
                        <span className="text-xs text-muted-foreground">
                          Semestre {row.semesterNumber ?? '—'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewMatricula(row.uid)}
                        disabled={dialogLoading && dialogOpen}
                      >
                        Ver matrícula
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Matrícula completa</DialogTitle>
            <DialogDescription>Solo disponible para personal autorizado.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {dialogLoading ? <p className="text-sm text-muted-foreground">Cargando…</p> : null}
            {!dialogLoading && dialogMatricula ? (
              <p className="text-lg font-semibold tracking-wide">{dialogMatricula}</p>
            ) : null}
            <p className="text-xs text-muted-foreground">
              🔒 Acceso registrado{dialogAuditId ? ` · ID ${dialogAuditId}` : ''}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
