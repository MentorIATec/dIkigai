import type { Goal } from '@/lib/types';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import Link from 'next/link';

interface GoalCardProps {
  goal: Goal;
}

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

export function GoalCard({ goal }: GoalCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="font-headline text-lg mb-2">{goal.title}</CardTitle>
            <Badge variant={statusVariantMap[goal.status]}>{statusTextMap[goal.status]}</Badge>
        </div>
        <CardDescription>{goal.semester}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center gap-4">
          <Progress value={goal.progress} className="flex-1" />
          <span className="text-sm font-medium text-muted-foreground">{goal.progress}%</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" asChild>
          <Link href="#">Ver detalles</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
