'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { SessionRole } from './server';
import type { StudentStage } from '@/lib/profile/mapping';

export type AuthStudentProfile = {
  semesterNumber: number | null;
  semesterStage: StudentStage | null;
  carreraId: string | null;
  carreraName: string | null;
  matriculaLast4: string | null;
  consent?: {
    profile: boolean;
    version: string | null;
    acceptedAt: string | null;
  } | null;
};

export type AuthUser = {
  uid: string;
  email: string;
  role: SessionRole;
  emailVerified: boolean;
  displayName?: string | null;
  photoURL?: string | null;
  profile?: AuthStudentProfile | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function fetchCurrentUser(): Promise<AuthUser | null> {
  const response = await fetch('/api/me', {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });
  if (!response.ok) {
    return null;
  }
  const data = (await response.json()) as { user: AuthUser | null };
  return data.user ?? null;
}

export function AuthProvider({
  children,
  initialUser,
  eagerRefresh,
}: {
  children: ReactNode;
  initialUser: AuthUser | null;
  eagerRefresh?: boolean;
}) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const nextUser = await fetchCurrentUser();
      setUser(nextUser);
    } catch (error) {
      console.error('Failed to refresh auth state', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (eagerRefresh) {
      void refresh();
    }
  }, [eagerRefresh, refresh]);

  const value = useMemo<AuthContextValue>(() => ({ user, loading, refresh, setUser }), [user, loading, refresh]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
