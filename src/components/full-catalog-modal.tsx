'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { X, Target, Sparkles } from 'lucide-react';
import type { CuratedGoal } from '@/lib/types';

interface FullCatalogModalProps {
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

export function FullCatalogModal({ isOpen, onClose, goals, stageTitle, onSelectGoal }: FullCatalogModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-background z-10 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <Target className="h-6 w-6 text-primary" />
                Catálogo Completo - {stageTitle}
              </DialogTitle>
              <DialogDescription className="text-base mt-2">
                Explora todas las metas disponibles para tu etapa académica. Haz clic en "Seleccionar meta" para agregar cualquier meta a tu plan.
              </DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-6">
          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{goals.length}</div>
                <div className="text-sm text-blue-700">Metas disponibles</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {new Set(goals.map(g => g.dimension)).size}
                </div>
                <div className="text-sm text-green-700">Dimensiones</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(goals.map(g => g.categoria)).size}
                </div>
                <div className="text-sm text-purple-700">Categorías</div>
              </CardContent>
            </Card>
          </div>

          {/* Grid de metas */}
          <div className="grid gap-4">
            {goals.map((meta) => (
              <Card 
                key={meta.id}
                className="group hover:shadow-lg transition-all duration-200 hover:border-primary/30"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="text-xs font-medium">
                          {meta.dimension}
                        </Badge>
                        <Badge variant="outline" className="capitalize text-xs">
                          {meta.categoria}
                        </Badge>
                        <span className="text-xs font-mono uppercase tracking-wide text-muted-foreground/70">
                          {meta.id}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold leading-6 text-foreground">
                        {renderWithEmphasis(meta.metaSmarter)}
                      </h3>

                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Pasos sugeridos:</p>
                        <div className="space-y-1">
                          {getActionSteps(meta.pasosAccion).slice(0, 3).map((step, index) => (
                            <div key={index} className="flex items-start gap-3 p-2 rounded-md bg-muted/30">
                              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                                <span className="text-xs font-medium text-primary">{index + 1}</span>
                              </div>
                              <p className="text-sm leading-5 text-muted-foreground">
                                {renderWithEmphasis(step)}
                              </p>
                            </div>
                          ))}
                          {getActionSteps(meta.pasosAccion).length > 3 && (
                            <p className="text-xs text-muted-foreground ml-8">
                              +{getActionSteps(meta.pasosAccion).length - 3} pasos más...
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button 
                      size="sm"
                      onClick={() => onSelectGoal(meta)}
                      className="flex-shrink-0"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Seleccionar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
