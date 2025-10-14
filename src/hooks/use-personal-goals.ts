import { useState, useEffect } from 'react';
import { useToast } from './use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export interface PersonalGoal {
  id: string;
  title: string;
  semester: string;
  templateId?: string;
  smarter: {
    specific: string;
    measurable: string;
    achievable: string;
    relevant: string;
    timeBound: Date;
    evaluated: string;
    readjusted: string;
  };
  createdAt: string;
  updatedAt: string;
  status: 'pendiente' | 'en-progreso' | 'completada' | 'cancelada';
  progress: number;
}

const STORAGE_KEY = 'personal-goals';

export function usePersonalGoals() {
  const [personalGoals, setPersonalGoals] = useState<PersonalGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Cargar metas desde localStorage
  useEffect(() => {
    const loadPersonalGoals = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const goals = JSON.parse(stored).map((goal: any) => ({
            ...goal,
            smarter: {
              ...goal.smarter,
              timeBound: new Date(goal.smarter.timeBound)
            }
          }));
          setPersonalGoals(goals);
        }
      } catch (error) {
        console.error('Error loading personal goals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPersonalGoals();
  }, []);

  // Guardar metas en localStorage
  const savePersonalGoals = (goals: PersonalGoal[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
      setPersonalGoals(goals);
    } catch (error) {
      console.error('Error saving personal goals:', error);
      throw error;
    }
  };

  // Agregar nueva meta personalizada
  const addPersonalGoal = async (goalData: Omit<PersonalGoal, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'progress'>) => {
    try {
      const newGoal: PersonalGoal = {
        ...goalData,
        id: `personal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'pendiente',
        progress: 0,
      };

      const updatedGoals = [...personalGoals, newGoal];
      savePersonalGoals(updatedGoals);

      // También intentar guardar en API (opcional)
      try {
        await fetch('/api/goals/personal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newGoal),
        });
      } catch (apiError) {
        console.warn('API save failed, but localStorage save succeeded:', apiError);
      }

      toast({
        title: '¡Meta creada!',
        description: 'Tu meta personalizada ha sido guardada exitosamente.',
        duration: 3000,
      });

      return newGoal;
    } catch (error) {
      console.error('Error adding personal goal:', error);
      toast({
        title: 'Error',
        description: 'No se pudo crear la meta. Por favor, intenta nuevamente.',
        variant: 'destructive',
        duration: 4000,
      });
      throw error;
    }
  };

  // Actualizar meta personalizada
  const updatePersonalGoal = async (goalId: string, updates: Partial<PersonalGoal>) => {
    try {
      const updatedGoals = personalGoals.map(goal => 
        goal.id === goalId 
          ? { 
              ...goal, 
              ...updates, 
              updatedAt: new Date().toISOString() 
            }
          : goal
      );
      
      savePersonalGoals(updatedGoals);

      toast({
        title: 'Meta actualizada',
        description: 'Los cambios han sido guardados exitosamente.',
        duration: 3000,
      });

      return updatedGoals.find(goal => goal.id === goalId);
    } catch (error) {
      console.error('Error updating personal goal:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la meta. Por favor, intenta nuevamente.',
        variant: 'destructive',
        duration: 4000,
      });
      throw error;
    }
  };

  // Eliminar meta personalizada
  const removePersonalGoal = async (goalId: string) => {
    try {
      const updatedGoals = personalGoals.filter(goal => goal.id !== goalId);
      savePersonalGoals(updatedGoals);

      toast({
        title: 'Meta eliminada',
        description: 'La meta ha sido removida de tu plan de vida.',
        duration: 3000,
      });

      return true;
    } catch (error) {
      console.error('Error removing personal goal:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la meta. Por favor, intenta nuevamente.',
        variant: 'destructive',
        duration: 4000,
      });
      throw error;
    }
  };

  // Formatear fecha para mostrar
  const formatGoalDate = (date: Date) => {
    return format(date, 'dd/MM/yyyy', { locale: es });
  };

  // Obtener metas por período académico
  const getGoalsByPeriod = (period: string) => {
    return personalGoals.filter(goal => goal.semester === period);
  };

  // Obtener metas por estado
  const getGoalsByStatus = (status: PersonalGoal['status']) => {
    return personalGoals.filter(goal => goal.status === status);
  };

  return {
    personalGoals,
    isLoading,
    addPersonalGoal,
    updatePersonalGoal,
    removePersonalGoal,
    formatGoalDate,
    getGoalsByPeriod,
    getGoalsByStatus,
  };
}
