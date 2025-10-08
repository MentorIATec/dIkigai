import { AUTH_PROVIDER, AUTH_SECRET } from './config';
import { verifyDevToken } from './providers/dev';
import { verifyFirebaseSessionCookie } from './providers/firebase';
import type { Session } from './server';

export async function verifySessionToken(token: string): Promise<Session> {
  if (AUTH_PROVIDER === 'dev') {
    const payload = await verifyDevToken(AUTH_SECRET, token);
    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
      name: payload.name,
    } as Session;
  }
  if (AUTH_PROVIDER === 'firebase') {
    return verifyFirebaseSessionCookie(token) as unknown as Session;
  }
  throw new Error(`Unsupported auth provider: ${AUTH_PROVIDER}`);
}
