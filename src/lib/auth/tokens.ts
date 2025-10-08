import { AUTH_PROVIDER, AUTH_SECRET } from './config';
import { verifyDevToken } from './providers/dev';
import { verifyFirebaseSessionCookie } from './providers/firebase';
import type { Session } from './server';
import type { SessionRole } from './server';

export async function verifySessionToken(token: string): Promise<Session> {
  if (AUTH_PROVIDER === 'dev') {
    const payload = await verifyDevToken(AUTH_SECRET, token);
    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
      emailVerified: payload.emailVerified ?? true,
      name: payload.name,
      photoURL: payload.photoURL,
    } satisfies Session;
  }
  if (AUTH_PROVIDER === 'firebase') {
    const payload = await verifyFirebaseSessionCookie(token, true);
    const role = (payload.role === 'admin' || payload.role === 'mentor'
      ? payload.role
      : 'student') as SessionRole;
    return {
      sub: payload.uid,
      email: payload.email ?? '',
      role,
      emailVerified: payload.emailVerified ?? false,
      name: payload.name,
      photoURL: payload.photoURL,
    } satisfies Session;
  }
  throw new Error(`Unsupported auth provider: ${AUTH_PROVIDER}`);
}
