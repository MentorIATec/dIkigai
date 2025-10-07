import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { AUTH_PROVIDER, COOKIE_NAME } from '@/lib/auth/config';
import { clearSessionCookie } from '@/lib/auth/cookies';
import { verifyFirebaseSessionCookie, revokeFirebaseSessionByUid } from '@/lib/auth/providers/firebase';

export async function POST() {
  if (AUTH_PROVIDER === 'firebase') {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME)?.value;
    if (sessionCookie) {
      const decoded = await verifyFirebaseSessionCookie(sessionCookie, false).catch(() => null);
      if (decoded?.uid) {
        try {
          await revokeFirebaseSessionByUid(decoded.uid);
        } catch (error) {
          console.warn('Failed to revoke Firebase sessions', error);
        }
      }
    }
  }

  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
