import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/server';
import { ensureStudentProfile, getStudentProfile } from '@/lib/profile/server';
import { computeStage, normalizeSemester } from '@/lib/profile/mapping';

function normalizeCareerValue(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeMatricula(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const profile = await getStudentProfile(session.sub);
  const responseProfile = profile
    ? {
        uid: profile.uid,
        email: profile.email,
        semesterNumber: profile.semesterNumber,
        semesterStage: profile.semesterStage,
        carreraId: profile.carreraId,
        carreraName: profile.carreraName,
        matriculaLast4: profile.matriculaLast4,
      }
    : null;
  return NextResponse.json({ profile: responseProfile });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  const semesterNumberRaw = body.semesterNumber ?? body.semester;
  const carreraId = normalizeCareerValue(body.carreraId);
  const carreraName = normalizeCareerValue(body.carreraName ?? body.carrera);
  const matricula = normalizeMatricula(body.matricula);
  const normalizedSemester = normalizeSemester(semesterNumberRaw as number | string);
  const semesterStage = computeStage(normalizedSemester);
  const consentVersion = typeof body.consentVersion === 'string' ? body.consentVersion : undefined;

  try {
    const profile = await ensureStudentProfile({
      uid: session.sub,
      email: session.email,
      semesterNumber: normalizedSemester,
      carreraId,
      carreraName,
      matricula,
      consent: consentVersion
        ? {
            version: consentVersion,
          }
        : null,
    });

    const responseProfile = {
      uid: profile.uid,
      email: profile.email,
      semesterNumber: profile.semesterNumber,
      semesterStage,
      carreraId: profile.carreraId,
      carreraName: profile.carreraName,
      matriculaLast4: profile.matriculaLast4,
      consent: profile.consent
        ? {
            profile: profile.consent.profile,
            version: profile.consent.version,
            acceptedAt: profile.consent.acceptedAt,
          }
        : null,
    };

    return NextResponse.json({ ok: true, profile: responseProfile });
  } catch (error) {
    console.error('Failed to persist student profile');
    return NextResponse.json({ error: 'profile_write_failed' }, { status: 500 });
  }
}

export const POST = PUT;
