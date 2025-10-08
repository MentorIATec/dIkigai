import {
  base64UrlDecode,
  base64UrlEncode,
  utf8Decode,
  utf8Encode,
} from '../base64';

const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

async function getKey(secret: string) {
  return crypto.subtle.importKey('raw', utf8Encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
    'verify',
  ]);
}

export type DevRole = 'admin' | 'mentor' | 'student';

export type DevClaims = {
  sub: string;
  email: string;
  role: DevRole;
  name?: string;
  emailVerified?: boolean;
  photoURL?: string;
  iat?: number;
  exp?: number;
};

export async function signDevToken(secret: string, claims: DevClaims) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const issuedAt = Math.floor(Date.now() / 1000);
  const payload: DevClaims = {
    ...claims,
    iat: issuedAt,
    exp: issuedAt + ONE_WEEK_IN_SECONDS,
  };

  const headerPart = base64UrlEncode(JSON.stringify(header));
  const payloadPart = base64UrlEncode(JSON.stringify(payload));
  const data = `${headerPart}.${payloadPart}`;
  const key = await getKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, utf8Encode(data));
  return `${data}.${base64UrlEncode(signature)}`;
}

export async function verifyDevToken(secret: string, token: string): Promise<DevClaims> {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('invalid token');
  }

  const [headerPart, payloadPart, signaturePart] = parts;
  const data = `${headerPart}.${payloadPart}`;
  const key = await getKey(secret);
  const expectedValid = await crypto.subtle.verify(
    'HMAC',
    key,
    base64UrlDecode(signaturePart),
    utf8Encode(data),
  );

  if (!expectedValid) {
    throw new Error('invalid signature');
  }

  const payloadBytes = base64UrlDecode(payloadPart);
  const payload = JSON.parse(utf8Decode(payloadBytes)) as DevClaims;
  if (!payload.sub || !payload.email || !payload.role) {
    throw new Error('invalid payload');
  }

  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp === 'number' && payload.exp < now) {
    throw new Error('token expired');
  }

  return {
    sub: payload.sub,
    email: payload.email,
    role: payload.role,
    name: payload.name,
    emailVerified: payload.emailVerified ?? true,
    photoURL: payload.photoURL,
  };
}
