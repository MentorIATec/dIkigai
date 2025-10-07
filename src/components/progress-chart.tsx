'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const chartData = [
  { semester: '2023-2', completed: 8, inProgress: 2 },
  { semester: '2024-1', completed: 5, inProgress: 3 },
  { semester: '2024-2', completed: 0, inProgress: 1 },
];

const chartConfig = {
  completed: {
    label: 'Completadas',
    color: 'hsl(var(--chart-2))',
  },
  inProgress: {
    label: 'En Progreso',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function ProgressChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='font-headline'>Progreso de Metas por Semestre</CardTitle>
        <CardDescription>Resumen de metas completadas y en progreso.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="semester"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 7)}
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="inProgress" stackId="a" fill="var(--color-inProgress)" radius={[0, 0, 4, 4]} />
            <Bar dataKey="completed" stackId="a" fill="var(--color-completed)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
