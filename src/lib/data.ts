import type { User, Goal, GoalTemplate, Semester } from './types';

export const mockUser: User = {
  id: 'user-1',
  name: 'Ana Pérez',
  email: 'ana.perez@example.com',
  avatarUrl: 'https://picsum.photos/seed/avatar1/40/40',
};

export const semesters: Semester[] = [
  'Semestre 2024-1',
  'Semestre 2024-2',
  'Semestre 2025-1',
  'Semestre 2025-2',
];

export const goalTemplates: GoalTemplate[] = [
  {
    id: 'template-1',
    title: 'Mejorar Calificación en [Materia]',
    description: 'Establecer un plan de estudio para mejorar la calificación final en una materia específica.',
    category: 'Académico',
    smarterSuggestion: {
      specific: 'Obtener una calificación de A en [Materia].',
      measurable: 'Asistir a todas las clases, completar todas las tareas a tiempo, y estudiar 2 horas diarias.',
      achievable: 'Buscar tutorías y formar un grupo de estudio.',
      relevant: 'Esta materia es fundamental para mi carrera.',
    },
  },
  {
    id: 'template-2',
    title: 'Aprender Nueva Habilidad Técnica',
    description: 'Adquirir conocimientos en una nueva tecnología o software relevante para mi campo.',
    category: 'Desarrollo Profesional',
    smarterSuggestion: {
      specific: 'Completar un curso en línea de [Tecnología] y desarrollar un proyecto básico.',
      measurable: 'Dedicar 5 horas semanales al curso y finalizar el proyecto en 2 meses.',
      timeBound: new Date(new Date().setMonth(new Date().getMonth() + 2)),
    },
  },
  {
    id: 'template-3',
    title: 'Participar en Actividades Extracurriculares',
    description: 'Involucrarse en clubes u organizaciones estudiantiles para desarrollar habilidades de liderazgo.',
    category: 'Desarrollo Personal',
    smarterSuggestion: {
        specific: 'Unirme a [Club Estudiantil] y participar activamente en sus reuniones y eventos.',
        measurable: 'Asistir al 80% de las reuniones y voluntariar en un evento por semestre.'
    },
  },
];

export const goals: Goal[] = [
  {
    id: 'goal-1',
    userId: 'user-1',
    title: 'Mejorar Calificación en Cálculo II',
    semester: 'Semestre 2024-1',
    smarter: {
      specific: 'Obtener una calificación final de B+ o superior en Cálculo II.',
      measurable: 'Completar el 100% de las tareas y obtener al menos 85% en los exámenes parciales.',
      achievable: 'Asistir a las horas de consulta del profesor dos veces al mes.',
      relevant: 'Es un pre-requisito clave para materias avanzadas de mi carrera.',
      timeBound: new Date('2024-06-15'),
      evaluated: 'Revisar calificaciones después de cada examen parcial.',
      readjusted: 'Si el primer parcial es bajo, aumentar las sesiones de estudio a 3 por semana.',
    },
    progress: 75,
    status: 'en-progreso',
    createdAt: new Date('2024-02-10'),
  },
  {
    id: 'goal-2',
    userId: 'user-1',
    title: 'Completar curso de Python para Ciencia de Datos',
    semester: 'Semestre 2024-1',
    smarter: {
      specific: 'Finalizar el curso "Python for Data Science" en Coursera.',
      measurable: 'Completar un módulo por semana.',
      achievable: 'Dedicar 4 horas cada fin de semana.',
      relevant: 'Me abrirá oportunidades de prácticas en análisis de datos.',
      timeBound: new Date('2024-05-20'),
      evaluated: 'Al final de cada módulo, realizar el quiz de evaluación.',
      readjusted: 'N/A',
    },
    progress: 100,
    status: 'completada',
    createdAt: new Date('2024-02-15'),
  },
  {
    id: 'goal-3',
    userId: 'user-1',
    title: 'Postular a una pasantía de verano',
    semester: 'Semestre 2024-2',
    smarter: {
      specific: 'Enviar al menos 10 postulaciones a pasantías de verano en mi área.',
      measurable: 'Postular a 2 empresas por semana.',
      achievable: 'Tener mi CV y carta de presentación listos para el inicio del semestre.',
      relevant: 'La experiencia laboral es crucial para mi futuro profesional.',
      timeBound: new Date('2024-10-30'),
      evaluated: 'Hacer seguimiento de las respuestas y ajustar mi CV si es necesario.',
      readjusted: 'N/A',
    },
    progress: 10,
    status: 'sin-empezar',
    createdAt: new Date('2024-08-01'),
  },
   {
    id: 'goal-4',
    userId: 'user-2', // Other user for admin view
    title: 'Aprender Francés Básico',
    semester: 'Semestre 2024-1',
    smarter: {
      specific: 'Alcanzar el nivel A1 de francés.',
      measurable: 'Usar Duolingo 15 minutos al día y asistir a un grupo de conversación semanal.',
      achievable: 'Es un objetivo realista para un semestre.',
      relevant: 'Quiero hacer un intercambio a Francia el próximo año.',
      timeBound: new Date('2024-06-01'),
      evaluated: 'Tomar un examen de práctica A1 al final del semestre.',
      readjusted: 'N/A',
    },
    progress: 40,
    status: 'en-progreso',
    createdAt: new Date('2024-02-20'),
  },
];
