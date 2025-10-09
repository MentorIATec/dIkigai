'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { X, Target, Sparkles, Search, Filter, Grid, List } from 'lucide-react';
import type { CuratedGoal } from '@/lib/types';

interface FullscreenCatalogOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  goals: CuratedGoal[];
  stageTitle: string;
  onSelectGoal: (goal: CuratedGoal) => void;
}

function renderWithEmphasis(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function getActionSteps(pasosAccion: string): string[] {
  return pasosAccion
    .split('\n')
    .map(step => step.trim())
    .filter(step => step.length > 0);
}

export function FullscreenCatalogOverlay({ isOpen, onClose, goals, stageTitle, onSelectGoal }: FullscreenCatalogOverlayProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-green-900">Catálogo Completo</h2>
                <p className="text-green-700">{stageTitle} - {goals.length} metas disponibles</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filtrar
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="px-6 py-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{goals.length}</div>
                  <div className="text-sm text-blue-700">Metas totales</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {new Set(goals.map(g => g.dimension)).size}
                  </div>
                  <div className="text-sm text-green-700">Dimensiones</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {new Set(goals.map(g => g.categoria)).size}
                  </div>
                  <div className="text-sm text-purple-700">Categorías</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Grid className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid gap-6">
              {goals.map((meta, index) => (
                <Card 
                  key={meta.id}
                  className="group hover:shadow-xl transition-all duration-300 hover:border-primary/30 border-2"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <Badge variant="secondary" className="text-sm font-medium">
                            {meta.dimension}
                          </Badge>
                          <Badge variant="outline" className="capitalize text-sm">
                            {meta.categoria}
                          </Badge>
                          <span className="text-sm font-mono uppercase tracking-wide text-muted-foreground/70 bg-gray-100 px-2 py-1 rounded">
                            {meta.id}
                          </span>
                          <div className="ml-auto">
                            <span className="text-sm text-muted-foreground">#{index + 1}</span>
                          </div>
                        </div>

                        <h3 className="text-xl font-semibold leading-6 text-foreground">
                          {renderWithEmphasis(meta.metaSmarter)}
                        </h3>

                        <div className="space-y-3">
                          <p className="text-sm font-medium text-muted-foreground">Pasos de acción:</p>
                          <div className="space-y-2">
                            {getActionSteps(meta.pasosAccion).slice(0, 3).map((step, stepIndex) => (
                              <div key={stepIndex} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                                  <span className="text-xs font-medium text-primary">{stepIndex + 1}</span>
                                </div>
                                <p className="text-sm leading-5 text-muted-foreground">
                                  {renderWithEmphasis(step)}
                                </p>
                              </div>
                            ))}
                            {getActionSteps(meta.pasosAccion).length > 3 && (
                              <p className="text-xs text-muted-foreground ml-9">
                                +{getActionSteps(meta.pasosAccion).length - 3} pasos adicionales
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <Button 
                          size="lg"
                          onClick={() => onSelectGoal(meta)}
                          className="bg-green-600 hover:bg-green-700 min-w-[140px]"
                        >
                          <Sparkles className="mr-2 h-4 w-4" />
                          Seleccionar Meta
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {goals.length === 0 && (
              <div className="text-center py-12">
                <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No hay metas disponibles</h3>
                <p className="text-muted-foreground">
                  No se encontraron metas para esta etapa académica.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
