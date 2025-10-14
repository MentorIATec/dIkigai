import { useState, useEffect } from 'react';

/**
 * Hook personalizado para manejar localStorage con tipado TypeScript
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Estado para almacenar el valor
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  // Función para obtener el valor del localStorage
  const getValue = (): T => {
    try {
      if (typeof window === 'undefined') return initialValue;
      
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // Función para guardar el valor en localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Cargar el valor inicial desde localStorage
  useEffect(() => {
    const value = getValue();
    setStoredValue(value);
    setIsLoaded(true);
  }, [key]);

  return [storedValue, setValue, isLoaded] as const;
}

/**
 * Hook específico para manejar diagnósticos completados
 */
export function useDiagnosticStorage() {
  const [completedDiagnostics, setCompletedDiagnostics] = useLocalStorage<Record<string, any>>(
    'dIkigai_completed_diagnostics',
    {}
  );

  const markDiagnosticCompleted = (stage: string, data: any) => {
    setCompletedDiagnostics(prev => ({
      ...prev,
      [stage]: {
        ...data,
        completedAt: new Date().toISOString(),
        id: `${stage}_${Date.now()}`
      }
    }));
  };

  const getCompletedDiagnostic = (stage: string) => {
    return completedDiagnostics[stage] || null;
  };

  const hasCompletedDiagnostic = (stage: string) => {
    return !!completedDiagnostics[stage];
  };

  const clearDiagnostic = (stage: string) => {
    setCompletedDiagnostics(prev => {
      const newData = { ...prev };
      delete newData[stage];
      return newData;
    });
  };

  return {
    completedDiagnostics,
    markDiagnosticCompleted,
    getCompletedDiagnostic,
    hasCompletedDiagnostic,
    clearDiagnostic
  };
}

/**
 * Hook específico para manejar metas seleccionadas
 */
export function useSelectedGoalsStorage() {
  const [selectedGoals, setSelectedGoals] = useLocalStorage<string[]>('dIkigai_selected_goals', []);

  const addSelectedGoal = (goalId: string) => {
    setSelectedGoals(prev => {
      if (prev.includes(goalId)) return prev;
      return [...prev, goalId];
    });
  };

  const removeSelectedGoal = (goalId: string) => {
    setSelectedGoals(prev => prev.filter(id => id !== goalId));
  };

  const clearSelectedGoals = () => {
    setSelectedGoals([]);
  };

  return {
    selectedGoals,
    setSelectedGoals,
    addSelectedGoal,
    removeSelectedGoal,
    clearSelectedGoals
  };
}

