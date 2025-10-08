const encoder = new TextEncoder();
const decoder = new TextDecoder();

const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

function encodeBase64(bytes: Uint8Array): string {
  if (typeof btoa === 'function') {
    let binary = '';
    for (let i = 0; i < bytes.length; i += 1) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  const BufferCtor = (globalThis as { Buffer?: { from(data: Uint8Array, encoding?: string): { toString(enc: string): string } } }).Buffer;
  if (BufferCtor) {
    return BufferCtor.from(bytes).toString('base64');
  }

  throw new Error('Base64 encoder not available');
}

function decodeBase64(str: string): Uint8Array {
  if (typeof atob === 'function') {
    const binary = atob(str);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  const BufferCtor = (globalThis as { Buffer?: { from(data: string, encoding: string): Uint8Array } }).Buffer;
  if (BufferCtor) {
    return new Uint8Array(BufferCtor.from(str, 'base64'));
  }

  throw new Error('Base64 decoder not available');
}

function base64UrlEncode(data: string | ArrayBuffer): string {
  const bytes = typeof data === 'string' ? encoder.encode(data) : new Uint8Array(data);
  return encodeBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlDecode(value: string): Uint8Array {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
  return decodeBase64(padded);
}

async function getKey(secret: string) {
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
    'verify',
  ]);
}

export type DevRole = 'admin' | 'user';

export type DevClaims = {
  sub: string;
  email: string;
  role: DevRole;
  name?: string;
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
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
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
    encoder.encode(data),
  );

  if (!expectedValid) {
    throw new Error('invalid signature');
  }

  const payloadBytes = base64UrlDecode(payloadPart);
  const payload = JSON.parse(decoder.decode(payloadBytes)) as DevClaims;
  if (!payload.sub || !payload.email || !payload.role) {
    throw new Error('invalid payload');
  }

  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp === 'number' && payload.exp < now) {
    throw new Error('token expired');
  }

  return { sub: payload.sub, email: payload.email, role: payload.role, name: payload.name };
}
