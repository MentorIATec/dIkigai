import { cookies } from 'next/headers';
import { COOKIE_NAME } from './config';
import { verifySessionToken } from './tokens';

export type SessionRole = 'admin' | 'mentor' | 'student';

export type Session = {
  sub: string;
  email: string;
  role: SessionRole;
  emailVerified: boolean;
  name?: string;
  photoURL?: string;
};

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }

  try {
    return await verifySessionToken(token);
  } catch (error) {
    return null;
  }
}

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) {
    throw new Error('UNAUTHORIZED');
  }
  return session;
}

export async function getUserClaims() {
  const session = await getSession();
  if (!session) {
    return null;
  }
  return {
    role: session.role,
    email: session.email,
    emailVerified: session.emailVerified,
    name: session.name,
    photoURL: session.photoURL,
  };
}

export { verifySessionToken } from './tokens';
