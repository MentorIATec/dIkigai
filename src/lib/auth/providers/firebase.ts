import {
  createFirebaseSessionCookie as createSession,
  verifyFirebaseSessionCookie as verifySession,
  revokeFirebaseSessions,
  type FirebaseSessionVerification,
} from '../firebase-admin';

export { FirebaseSessionVerification };

export async function createFirebaseSessionCookie(idToken: string, expiresInMs?: number): Promise<string> {
  return createSession(idToken, expiresInMs);
}

export async function verifyFirebaseSessionCookie(
  cookie: string,
  checkRevoked = true,
): Promise<FirebaseSessionVerification> {
  return verifySession(cookie, checkRevoked);
}

export async function revokeFirebaseSessionByUid(uid: string): Promise<void> {
  await revokeFirebaseSessions(uid);
}
