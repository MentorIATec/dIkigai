import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/server';
import { updateStudentProfileConsent } from '@/lib/profile/server';

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { version?: string } | null;
  if (!body?.version) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  const acceptedAt = new Date().toISOString();
  await updateStudentProfileConsent({
    uid: session.sub,
    email: session.email,
    version: body.version,
    acceptedAt,
  });

  return NextResponse.json({ ok: true, version: body.version, acceptedAt });
}

export const POST = PUT;
