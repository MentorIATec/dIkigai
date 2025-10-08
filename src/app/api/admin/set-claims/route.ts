import { NextResponse } from 'next/server';
import { AUTH_PROVIDER } from '@/lib/auth/config';
import { requireSession } from '@/lib/auth/server';
import { revokeFirebaseSessionByUid } from '@/lib/auth/providers/firebase';
import { setFirebaseCustomUserClaims } from '@/lib/auth/firebase-admin';

type RequestBody = {
  uid?: string;
  role?: string;
};

const ALLOWED_ROLES = new Set(['admin', 'mentor', 'student']);

export async function POST(request: Request) {
  const session = await requireSession();
  if (session.role !== 'admin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  if (AUTH_PROVIDER !== 'firebase') {
    return NextResponse.json({ error: 'provider_not_configured' }, { status: 501 });
  }

  const body = (await request.json().catch(() => null)) as RequestBody | null;
  const uid = typeof body?.uid === 'string' ? body.uid : null;
  const role = typeof body?.role === 'string' && ALLOWED_ROLES.has(body.role)
    ? (body.role as 'admin' | 'mentor' | 'student')
    : null;

  if (!uid || !role) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  await setFirebaseCustomUserClaims(uid, { role });
  await revokeFirebaseSessionByUid(uid).catch((error) => {
    console.warn('Failed to revoke sessions after updating claims', error);
  });

  return NextResponse.json({ ok: true });
}
