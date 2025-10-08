import { NextResponse } from 'next/server';
import { AUTH_PROVIDER, AUTH_SECRET } from '@/lib/auth/config';
import { setSessionCookie } from '@/lib/auth/cookies';
import { signDevToken } from '@/lib/auth/providers/dev';
import { createFirebaseSessionCookie } from '@/lib/auth/providers/firebase';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.email !== 'string') {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  const email = body.email.trim().toLowerCase();
  const role = body.role === 'admin' ? 'admin' : 'user';
  const name = typeof body.name === 'string' && body.name.trim().length > 0 ? body.name.trim() : undefined;

  if (!email) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
  }

  if (AUTH_PROVIDER === 'dev') {
    const token = await signDevToken(AUTH_SECRET, { sub: email, email, role, name });
    await setSessionCookie(token);
    return NextResponse.json({ ok: true });
  }

  if (AUTH_PROVIDER === 'firebase') {
    if (typeof body.idToken !== 'string') {
      return NextResponse.json({ error: 'missing_id_token' }, { status: 400 });
    }
    const token = await createFirebaseSessionCookie(body.idToken);
    await setSessionCookie(token);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'provider_not_configured' }, { status: 501 });
}
