import { NextResponse } from 'next/server';
import { AUTH_PROVIDER, AUTH_SECRET } from '@/lib/auth/config';
import { setSessionCookie } from '@/lib/auth/cookies';
import { signDevToken } from '@/lib/auth/providers/dev';
import { createFirebaseSessionCookie } from '@/lib/auth/providers/firebase';
import { ensureUserProfile, isDomainAllowed } from '@/lib/auth/profile';
import { setFirebaseCustomUserClaims, verifyFirebaseIdToken } from '@/lib/auth/firebase-admin';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (AUTH_PROVIDER === 'dev') {
    if (!body || typeof body.email !== 'string') {
      return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
    }

    const email = body.email.trim().toLowerCase();
    const rawRole = typeof body.role === 'string' ? body.role : 'student';
    const allowedRoles = new Set(['admin', 'mentor', 'student']);
    const role = (allowedRoles.has(rawRole) ? rawRole : 'student') as 'admin' | 'mentor' | 'student';
    const name = typeof body.name === 'string' && body.name.trim().length > 0 ? body.name.trim() : undefined;
    const emailVerified = body.emailVerified !== false;
    const photoURL = typeof body.photoURL === 'string' ? body.photoURL : undefined;

    if (!email) {
      return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
    }

    const token = await signDevToken(AUTH_SECRET, {
      sub: email,
      email,
      role,
      name,
      emailVerified,
      photoURL,
    });
    await setSessionCookie(token);
    return NextResponse.json({ ok: true, role });
  }

  if (AUTH_PROVIDER === 'firebase') {
    const idToken = typeof body?.idToken === 'string' ? body.idToken : null;
    if (!idToken) {
      return NextResponse.json({ error: 'missing_id_token' }, { status: 400 });
    }

    try {
      const verification = await verifyFirebaseIdToken(idToken, true);
      const email = verification.email?.toLowerCase();
      const emailVerified = verification.emailVerified ?? false;

      if (!email) {
        return NextResponse.json({ error: 'email_missing' }, { status: 400 });
      }

      if (!emailVerified) {
        return NextResponse.json({ error: 'email_not_verified' }, { status: 403 });
      }

      if (!isDomainAllowed(email)) {
        return NextResponse.json({ error: 'domain_not_allowed' }, { status: 403 });
      }

      const allowedRoles = new Set(['admin', 'mentor', 'student']);
      let role = typeof verification.role === 'string' && allowedRoles.has(verification.role)
        ? (verification.role as 'admin' | 'mentor' | 'student')
        : ('student' as const);

      if (!verification.role || !allowedRoles.has(verification.role)) {
        try {
          await setFirebaseCustomUserClaims(verification.uid, { role });
        } catch (claimError) {
          console.warn('Unable to assign default Firebase custom claims', claimError);
        }
      }

      await ensureUserProfile({
        uid: verification.uid,
        email,
        role,
        displayName: verification.name,
        photoURL: verification.photoURL,
        emailVerified,
      });

      const sessionCookie = await createFirebaseSessionCookie(idToken);
      await setSessionCookie(sessionCookie);
      return NextResponse.json({ ok: true, role });
    } catch (error) {
      console.error('Failed to create Firebase session cookie', error);
      const code = error instanceof Error ? error.message : 'auth_failed';
      const status = code === 'email_not_verified' || code === 'domain_not_allowed' ? 403 : 401;
      return NextResponse.json({ error: 'auth_failed' }, { status });
    }
  }

  return NextResponse.json({ error: 'provider_not_configured' }, { status: 501 });
}
