'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Search, Filter, Grid, List, Target, FileText, ArrowRight, Eye, Plus, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { curatedGoalBankExtended } from '@/lib/curated-goals';
import type { CuratedGoal, SemesterStage } from '@/lib/types';

interface FilteredCatalogProps {
  stage: SemesterStage;
  recommendedGoalIds?: string[];
  onGenerateGoal: () => void;
  onOpenTemplate: () => void;
}

export function FilteredCatalog({ 
  stage, 
  recommendedGoalIds = [], 
  onGenerateGoal, 
  onOpenTemplate 
}: FilteredCatalogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDimension, setSelectedDimension] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFullCatalog, setShowFullCatalog] = useState(false);
  const [showFullCatalogDialog, setShowFullCatalogDialog] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(3);

  const stageGoals = curatedGoalBankExtended[stage]?.metas || [];
  
  // Filtrar metas relevantes (recomendadas + algunas adicionales de la misma etapa)
  const relevantGoals = useMemo(() => {
    const recommendedGoals = recommendedGoalIds
      .map(id => stageGoals.find(goal => goal.id === id))
      .filter(Boolean) as CuratedGoal[];
    
    // Agregar algunas metas adicionales de la misma etapa si no hay suficientes recomendadas
    const additionalGoals = stageGoals
      .filter(goal => !recommendedGoalIds.includes(goal.id))
      .slice(0, Math.max(0, 6 - recommendedGoals.length));
    
    return [...recommendedGoals, ...additionalGoals];
  }, [stageGoals, recommendedGoalIds]);

  const allGoals = showFullCatalog ? stageGoals : relevantGoals;
  
  const categories = useMemo(() => {
    const cats = new Set(allGoals.map(goal => goal.categoria));
    return Array.from(cats).sort();
  }, [allGoals]);

  const dimensions = useMemo(() => {
    const dims = new Set(allGoals.map(goal => goal.dimension));
    return Array.from(dims).sort();
  }, [allGoals]);

  const filteredGoals = useMemo(() => {
    return allGoals.filter(goal => {
      const matchesSearch = goal.metaSmarter.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           goal.pasosAccion.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || goal.categoria === selectedCategory;
      const matchesDimension = selectedDimension === 'all' || goal.dimension === selectedDimension;
      
      return matchesSearch && matchesCategory && matchesDimension;
    });
  }, [allGoals, searchTerm, selectedCategory, selectedDimension]);

  // Aplicar límite de visualización
  const displayedGoals = filteredGoals.slice(0, displayLimit);
  const hasMoreGoals = filteredGoals.length > displayLimit;

  const getStageLabel = (stage: SemesterStage) => {
    switch (stage) {
      case 'exploracion': return 'Exploración';
      case 'enfoque': return 'Enfoque';
      case 'especializacion': return 'Especialización';
      case 'graduacion': return 'Graduación';
      default: return stage;
    }
  };

  const handleShowFullCatalog = () => {
    setShowFullCatalogDialog(true);
  };

  const confirmShowFullCatalog = () => {
    setShowFullCatalog(true);
    setShowFullCatalogDialog(false);
    setDisplayLimit(filteredGoals.length); // Mostrar todas las metas
  };

  const loadMoreGoals = () => {
    setDisplayLimit(prev => Math.min(prev + 6, filteredGoals.length));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline text-xl">Catálogo de Metas</h2>
          <p className="text-sm text-muted-foreground">
            {showFullCatalog ? 'Catálogo completo' : 'Ejemplos priorizados'} para {getStageLabel(stage)}
          </p>
        </div>
        {!showFullCatalog && (
          <AlertDialog open={showFullCatalogDialog} onOpenChange={setShowFullCatalogDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                Ver catálogo completo
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Ver catálogo completo
                </AlertDialogTitle>
                <AlertDialogDescription>
                  El catálogo completo incluye todas las metas disponibles, no solo los ejemplos priorizados para tu etapa. 
                  Esto puede resultar en muchas opciones que no están alineadas con tu nivel académico actual.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={confirmShowFullCatalog}>
                  Ver catálogo completo
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar metas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDimension} onValueChange={setSelectedDimension}>
              <SelectTrigger>
                <SelectValue placeholder="Todas las dimensiones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las dimensiones</SelectItem>
                {dimensions.map(dimension => (
                  <SelectItem key={dimension} value={dimension}>
                    {dimension}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{displayedGoals.length} de {filteredGoals.length} metas mostradas</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onGenerateGoal}>
                <Target className="mr-2 h-4 w-4" />
                Generar Meta
              </Button>
              <Button size="sm" onClick={onOpenTemplate}>
                <FileText className="mr-2 h-4 w-4" />
                Crear Nueva
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de metas */}
      {displayedGoals.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No se encontraron metas</h3>
            <p className="text-muted-foreground mb-4">
              Intenta ajustar los filtros o crear una meta personalizada.
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={onGenerateGoal}>
                <Target className="mr-2 h-4 w-4" />
                Generar Meta
              </Button>
              <Button onClick={onOpenTemplate}>
                <FileText className="mr-2 h-4 w-4" />
                Crear Nueva
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
          {displayedGoals.map((goal) => {
            const isRecommended = recommendedGoalIds.includes(goal.id);
            
            return (
              <Card key={goal.id} className={`h-full hover:shadow-md transition-shadow ${isRecommended ? 'ring-2 ring-purple-200 bg-purple-50/30' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {isRecommended && (
                      <Badge variant="default" className="text-xs bg-purple-600">
                        Recomendada
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      {goal.dimension}
                    </Badge>
                    <Badge variant="outline" className="text-xs capitalize">
                      {goal.categoria}
                    </Badge>
                  </div>
                  <CardTitle className="text-base leading-tight">
                    {goal.metaSmarter}
                  </CardTitle>
                  <span className="text-xs font-mono text-muted-foreground">
                    {goal.id}
                  </span>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="mr-2 h-3 w-3" />
                          Ver detalles
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <div className="flex gap-2">
                              {isRecommended && (
                                <Badge variant="default" className="text-xs bg-purple-600">
                                  Recomendada
                                </Badge>
                              )}
                              <Badge variant="secondary">{goal.dimension}</Badge>
                              <Badge variant="outline" className="capitalize">
                                {goal.categoria}
                              </Badge>
                            </div>
                          </DialogTitle>
                          <DialogDescription>
                            Meta para tu etapa de {getStageLabel(stage)}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Objetivo</h4>
                            <p className="text-sm leading-relaxed">
                              {goal.metaSmarter}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Pasos sugeridos</h4>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                              {goal.pasosAccion}
                            </p>
                          </div>
                          <div className="flex gap-2 pt-4">
                            <Button asChild className="flex-1">
                              <Link href={`/goals/new?template=${goal.id}`}>
                                <Plus className="mr-2 h-4 w-4" />
                                Agregar a mis metas
                              </Link>
                            </Button>
                            <Button asChild variant="outline" className="flex-1">
                              <Link href={`/goals/new?template=${goal.id}`}>
                                <ArrowRight className="mr-2 h-4 w-4" />
                                Usar como plantilla
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button asChild size="sm" className="flex-1">
                      <Link href={`/goals/new?template=${goal.id}`}>
                        <Plus className="mr-2 h-3 w-3" />
                        Agregar
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Botón para cargar más metas */}
      {hasMoreGoals && !showFullCatalog && (
        <div className="text-center">
          <Button onClick={loadMoreGoals} variant="outline">
            <ArrowRight className="mr-2 h-4 w-4" />
            Cargar más metas ({filteredGoals.length - displayLimit} restantes)
          </Button>
        </div>
      )}
    </div>
  );
}

