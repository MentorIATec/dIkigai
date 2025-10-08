'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Grid, List, Target, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { curatedGoalBankExtended } from '@/lib/curated-goals';
import type { CuratedGoal, SemesterStage } from '@/lib/types';

interface GoalCatalogProps {
  stage: SemesterStage;
  onGenerateGoal: () => void;
  onOpenTemplate: () => void;
}

export function GoalCatalog({ stage, onGenerateGoal, onOpenTemplate }: GoalCatalogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDimension, setSelectedDimension] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const stageGoals = curatedGoalBankExtended[stage]?.metas || [];
  
  const categories = useMemo(() => {
    const cats = new Set(stageGoals.map(goal => goal.categoria));
    return Array.from(cats).sort();
  }, [stageGoals]);

  const dimensions = useMemo(() => {
    const dims = new Set(stageGoals.map(goal => goal.dimension));
    return Array.from(dims).sort();
  }, [stageGoals]);

  const filteredGoals = useMemo(() => {
    return stageGoals.filter(goal => {
      const matchesSearch = goal.metaSmarter.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           goal.pasosAccion.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || goal.categoria === selectedCategory;
      const matchesDimension = selectedDimension === 'all' || goal.dimension === selectedDimension;
      
      return matchesSearch && matchesCategory && matchesDimension;
    });
  }, [stageGoals, searchTerm, selectedCategory, selectedDimension]);

  const getStageLabel = (stage: SemesterStage) => {
    switch (stage) {
      case 'exploracion': return 'Exploración';
      case 'enfoque': return 'Enfoque';
      case 'especializacion': return 'Especialización';
      case 'graduacion': return 'Graduación';
      default: return stage;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="font-headline text-2xl">Catálogo de Metas</h2>
        <p className="text-muted-foreground">
          Explora metas curadas para la etapa de <strong>{getStageLabel(stage)}</strong>
        </p>
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
            <span>{filteredGoals.length} metas encontradas</span>
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
      {filteredGoals.length === 0 ? (
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
          {filteredGoals.map((goal) => (
            <Card key={goal.id} className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center gap-2 mb-2">
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
                <CardDescription className="text-sm leading-relaxed mb-4">
                  {goal.pasosAccion}
                </CardDescription>
                <Button asChild size="sm" className="w-full">
                  <Link href={`/goals/new?template=${goal.id}`}>
                    Usar como Plantilla
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
