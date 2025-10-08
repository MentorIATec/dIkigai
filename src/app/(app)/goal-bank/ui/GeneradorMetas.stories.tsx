import type { Meta, StoryObj } from '@storybook/react';
import GeneradorMetas, { type GeneradorMetasProps } from '@/app/(app)/goal-bank/ui/GeneradorMetas';
import { PERIODOS } from '@/lib/types.goal-templates';

const meta: Meta<GeneradorMetasProps> = {
  title: 'GoalBank/GeneradorMetas',
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    disablePersistence: true,
  },
  argTypes: {
    initialPeriodoId: {
      control: { type: 'select' },
      options: PERIODOS.map((periodo) => periodo.id),
    },
  },
  render: (args: GeneradorMetasProps) => <GeneradorMetas key={JSON.stringify(args)} {...args} />,
};

export default meta;

type Story = StoryObj<GeneradorMetasProps>;

export const PrimerSemestre: Story = {
  args: {
    initialPeriodoId: 'AD-2025',
  },
};

export const DiagnosticoIncompleto: Story = {
  args: {
    initialPeriodoId: 'FJ-2026',
    initialAnswers: {
      carrera: 2,
    },
  },
};

export const DiagnosticoCompleto: Story = {
  args: {
    initialPeriodoId: 'FJ-2026',
    initialAnswers: {
      carrera: 2,
      academico: 3,
      practicas: 2,
      servicio_social: 1,
    },
  },
};
