import type { ReactNode } from 'react';
import { AUTH_PROVIDER } from '@/lib/auth/config';
import { getSession } from '@/lib/auth/server';
import { getStudentProfile } from '@/lib/profile/server';
import { AuthProvider } from '@/lib/auth/context';
import type { AuthUser } from '@/lib/auth/context';
import { AppLayoutClient } from './AppLayoutClient';

export const dynamic = 'force-dynamic';

function mapSessionToUser(
  session: Awaited<ReturnType<typeof getSession>>,
  profile: Awaited<ReturnType<typeof getStudentProfile>>,
): AuthUser | null {
  if (!session) {
    return null;
  }
  return {
    uid: session.sub,
    email: session.email,
    role: session.role,
    emailVerified: session.emailVerified,
    displayName: session.name ?? null,
    photoURL: session.photoURL ?? null,
    profile: profile
      ? {
          semesterNumber: profile.semesterNumber,
          semesterStage: profile.semesterStage,
          carreraId: profile.carreraId,
          carreraName: profile.carreraName,
          matriculaLast4: profile.matriculaLast4,
          consent: profile.consent,
        }
      : null,
  };
}

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  const profileRecord = session ? await getStudentProfile(session.sub).catch(() => null) : null;
  const initialUser = mapSessionToUser(session, profileRecord);

  return (
    <AuthProvider initialUser={initialUser} eagerRefresh={!session}>
      <AppLayoutClient authProvider={AUTH_PROVIDER}>{children}</AppLayoutClient>
    </AuthProvider>
  );
}
