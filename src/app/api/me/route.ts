import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/server';
import { getStudentProfile } from '@/lib/profile/server';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const profileRecord = await getStudentProfile(session.sub).catch(() => null);
  const profile = profileRecord
    ? {
        semesterNumber: profileRecord.semesterNumber,
        semesterStage: profileRecord.semesterStage,
        carreraId: profileRecord.carreraId,
        carreraName: profileRecord.carreraName,
        matriculaLast4: profileRecord.matriculaLast4,
        consent: profileRecord.consent
          ? {
              profile: Boolean(profileRecord.consent.profile),
              version: profileRecord.consent.version,
              acceptedAt: profileRecord.consent.acceptedAt,
            }
          : null,
      }
    : null;

  return NextResponse.json({
    user: {
      uid: session.sub,
      email: session.email,
      role: session.role,
      emailVerified: session.emailVerified,
      displayName: session.name ?? null,
      photoURL: session.photoURL ?? null,
      profile,
    },
  });
}
