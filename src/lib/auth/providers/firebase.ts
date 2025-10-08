export async function createFirebaseSessionCookie(_idToken: string): Promise<string> {
  throw new Error('FIREBASE provider not configured');
}

export async function verifyFirebaseSessionCookie(_cookie: string): Promise<{
  sub: string;
  email: string;
  role: 'admin' | 'user';
  name?: string;
}> {
  throw new Error('FIREBASE provider not configured');
}
