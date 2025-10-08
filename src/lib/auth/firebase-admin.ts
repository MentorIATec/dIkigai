import {
  base64UrlDecode,
  base64UrlEncode,
  decodeBase64,
  utf8Decode,
  utf8Encode,
} from './base64';

const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';
const SESSION_AUDIENCE = 'https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit';
const SESSION_ISSUER_PREFIX = 'https://session.firebase.google.com/';
const ACCESS_TOKEN_SCOPE = 'https://www.googleapis.com/auth/identitytoolkit';
const MAX_SESSION_DURATION_SECONDS = 60 * 60 * 24 * 14;

type ServiceAccountConfig = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
};

type CachedAccessToken = {
  token: string;
  expiresAt: number;
};

type CachedKey = {
  key: CryptoKey;
  expiresAt: number;
};

type FirebaseUserRecord = {
  localId: string;
  email?: string;
  displayName?: string;
  validSince?: string;
  customAttributes?: string;
  emailVerified?: boolean;
  photoUrl?: string;
  lastLoginAt?: string;
  disabled?: boolean;
};

type AccountsLookupResponse = {
  users?: FirebaseUserRecord[];
};

export type FirebaseSessionVerification = {
  uid: string;
  email?: string;
  name?: string;
  role?: string;
  emailVerified?: boolean;
  photoURL?: string;
  issuedAt: number;
  expiresAt: number;
  authTime?: number;
  claims: Record<string, unknown>;
};

const textEncoder = new TextEncoder();

let cachedConfig: ServiceAccountConfig | null = null;
let cachedPrivateKey: Promise<CryptoKey> | null = null;
let cachedToken: CachedAccessToken | null = null;
const jwkCache = new Map<string, CachedKey>();
let jwkCacheExpiry = 0;

function getSubtleCrypto(): SubtleCrypto {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error('SubtleCrypto not available in this runtime.');
  }
  return subtle;
}

export function decodePrivateKey(rawValue?: string | null): string | undefined {
  if (!rawValue) {
    return undefined;
  }
  const decoded = utf8Decode(decodeBase64(rawValue));
  return decoded.replace(/\\n/g, '\n');
}

function getFirebaseConfig(): ServiceAccountConfig {
  if (cachedConfig) {
    return cachedConfig;
  }
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyValue = decodePrivateKey(process.env.FIREBASE_PRIVATE_KEY);

  if (!projectId || !clientEmail || !privateKeyValue) {
    throw new Error('Missing Firebase Admin configuration. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.');
  }

  cachedConfig = { projectId, clientEmail, privateKey: privateKeyValue };
  return cachedConfig;
}

function stripPem(pem: string, header: string, footer: string): string {
  return pem.replace(header, '').replace(footer, '').replace(/\s+/g, '');
}

function pemToArrayBuffer(pem: string, header: string, footer: string): ArrayBuffer {
  const normalized = stripPem(pem, header, footer);
  const bytes = decodeBase64(normalized);
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
}

async function getPrivateKey(): Promise<CryptoKey> {
  if (!cachedPrivateKey) {
    const { privateKey } = getFirebaseConfig();
    const keyData = pemToArrayBuffer(privateKey, '-----BEGIN PRIVATE KEY-----', '-----END PRIVATE KEY-----');
    cachedPrivateKey = getSubtleCrypto().importKey(
      'pkcs8',
      keyData,
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256',
      },
      false,
      ['sign'],
    );
  }
  return cachedPrivateKey;
}

function base64UrlEncodeObject(value: Record<string, unknown>): string {
  return base64UrlEncode(utf8Encode(JSON.stringify(value)));
}

function parseCacheControl(cacheControl: string | null): number {
  if (!cacheControl) {
    return 3600;
  }
  const match = cacheControl.match(/max-age=(\d+)/i);
  if (!match) {
    return 3600;
  }
  const parsed = Number.parseInt(match[1], 10);
  return Number.isNaN(parsed) ? 3600 : parsed;
}

async function createServiceAccountAssertion(scope: string): Promise<string> {
  const { clientEmail } = getFirebaseConfig();
  const issuedAt = Math.floor(Date.now() / 1000);
  const payload = {
    iss: clientEmail,
    sub: clientEmail,
    aud: TOKEN_ENDPOINT,
    scope,
    iat: issuedAt,
    exp: issuedAt + 3600,
  };
  const header = { alg: 'RS256', typ: 'JWT' } as const;
  const unsigned = `${base64UrlEncodeObject(header)}.${base64UrlEncodeObject(payload)}`;
  const privateKey = await getPrivateKey();
  const signature = await getSubtleCrypto().sign('RSASSA-PKCS1-v1_5', privateKey, utf8Encode(unsigned));
  return `${unsigned}.${base64UrlEncode(signature)}`;
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token;
  }

  const assertion = await createServiceAccountAssertion(ACCESS_TOKEN_SCOPE);
  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion,
  });

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!response.ok) {
    throw new Error(`Failed to obtain Firebase access token (${response.status})`);
  }

  const data = (await response.json()) as { access_token?: string; expires_in?: number };
  if (!data.access_token) {
    throw new Error('Firebase token response missing access_token');
  }

  const expiresIn = typeof data.expires_in === 'number' ? data.expires_in : 3600;
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + Math.max(0, expiresIn - 60) * 1000,
  };

  return cachedToken.token;
}

async function refreshJwks(): Promise<void> {
  const response = await fetch(JWKS_URL, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Unable to download Firebase JWKS (${response.status})`);
  }

  type FirebaseJwk = JsonWebKey & { kid: string };
  const body = (await response.json()) as { keys: FirebaseJwk[] };
  const maxAge = parseCacheControl(response.headers.get('cache-control'));
  const expiresAt = Date.now() + maxAge * 1000;

  jwkCache.clear();
  await Promise.all(
    body.keys.map(async (entry) => {
      const key = await getSubtleCrypto().importKey(
        'jwk',
        entry,
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['verify'],
      );
      jwkCache.set(entry.kid, { key, expiresAt });
    }),
  );
  jwkCacheExpiry = expiresAt;
}

async function getPublicKey(kid: string): Promise<CryptoKey> {
  const now = Date.now();
  const cached = jwkCache.get(kid);
  if (cached && cached.expiresAt > now) {
    return cached.key;
  }

  if (jwkCacheExpiry <= now || !cached) {
    await refreshJwks();
  }

  const refreshed = jwkCache.get(kid);
  if (!refreshed) {
    throw new Error(`Unable to resolve Firebase JWKS for kid=${kid}`);
  }
  return refreshed.key;
}

async function lookupUser(uid: string): Promise<FirebaseUserRecord | null> {
  const { projectId } = getFirebaseConfig();
  const accessToken = await getAccessToken();
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:lookup`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ localId: [uid] }),
  });

  if (!response.ok) {
    throw new Error(`Failed to lookup Firebase user (${response.status})`);
  }

  const data = (await response.json()) as AccountsLookupResponse;
  return data.users && data.users.length > 0 ? data.users[0] : null;
}

function assertSessionClaims(payload: Record<string, unknown>): asserts payload is Record<string, unknown> {
  const { projectId } = getFirebaseConfig();
  const issuer = `${SESSION_ISSUER_PREFIX}${projectId}`;
  if (payload.iss !== issuer) {
    throw new Error('Invalid Firebase session issuer');
  }
  if (payload.aud !== SESSION_AUDIENCE) {
    throw new Error('Invalid Firebase session audience');
  }
  if (typeof payload.sub !== 'string' || payload.sub.length === 0) {
    throw new Error('Firebase session missing uid');
  }
  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp !== 'number' || payload.exp <= now) {
    throw new Error('Firebase session cookie expired');
  }
  if (typeof payload.iat !== 'number') {
    throw new Error('Firebase session cookie missing issued-at');
  }
}

function extractRole(payload: Record<string, unknown>, customAttributes?: string | null): string | undefined {
  const directRole = typeof payload.role === 'string' ? payload.role : undefined;
  if (directRole) {
    return directRole;
  }
  if (!customAttributes) {
    return undefined;
  }
  try {
    const parsed = JSON.parse(customAttributes) as Record<string, unknown>;
    const attributeRole = parsed.role;
    return typeof attributeRole === 'string' ? attributeRole : undefined;
  } catch (error) {
    console.warn('Failed to parse Firebase custom attributes', error);
    return undefined;
  }
}

export async function createFirebaseSessionCookie(idToken: string, expiresInMs = 1000 * 60 * 60 * 24 * 7): Promise<string> {
  const { projectId } = getFirebaseConfig();
  const accessToken = await getAccessToken();
  const validDuration = Math.min(Math.max(60, Math.floor(expiresInMs / 1000)), MAX_SESSION_DURATION_SECONDS);

  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/projects/${projectId}:createSessionCookie`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ idToken, validDuration }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create Firebase session cookie (${response.status})`);
  }

  const data = (await response.json()) as { sessionCookie?: string };
  if (!data.sessionCookie) {
    throw new Error('Firebase session cookie response missing value');
  }

  return data.sessionCookie;
}

export async function verifyFirebaseSessionCookie(cookie: string, checkRevoked = true): Promise<FirebaseSessionVerification> {
  const parts = cookie.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid Firebase session cookie format');
  }

  const [headerPart, payloadPart, signaturePart] = parts;
  const header = JSON.parse(utf8Decode(base64UrlDecode(headerPart))) as Record<string, unknown>;
  if (header.alg !== 'RS256' || typeof header.kid !== 'string') {
    throw new Error('Unsupported Firebase session header');
  }

  const publicKey = await getPublicKey(header.kid);
  const isValid = await getSubtleCrypto().verify(
    'RSASSA-PKCS1-v1_5',
    publicKey,
    base64UrlDecode(signaturePart),
    utf8Encode(`${headerPart}.${payloadPart}`),
  );

  if (!isValid) {
    throw new Error('Firebase session signature invalid');
  }

  const payload = JSON.parse(utf8Decode(base64UrlDecode(payloadPart))) as Record<string, unknown>;
  assertSessionClaims(payload);

  const uid = payload.sub as string;
  const issuedAt = payload.iat as number;
  const expiresAt = payload.exp as number;
  const authTime = typeof payload.auth_time === 'number' ? payload.auth_time : undefined;

  let email = typeof payload.email === 'string' ? payload.email : undefined;
  let name = typeof payload.name === 'string' ? payload.name : undefined;
  let role = extractRole(payload);
  let emailVerified = typeof payload.email_verified === 'boolean' ? payload.email_verified : undefined;
  let photoURL = typeof payload.picture === 'string' ? payload.picture : undefined;

  if (checkRevoked || !role || !email || !name) {
    const user = await lookupUser(uid);
    if (user) {
      if (checkRevoked && user.validSince) {
        const validSince = Number.parseInt(user.validSince, 10);
        if (!Number.isNaN(validSince) && issuedAt < validSince) {
          throw new Error('Firebase session has been revoked');
        }
      }
      email = email ?? (typeof user.email === 'string' ? user.email : undefined);
      name = name ?? (typeof user.displayName === 'string' ? user.displayName : undefined);
      role = role ?? extractRole(payload, user.customAttributes ?? null);
      emailVerified = emailVerified ?? (typeof user.emailVerified === 'boolean' ? user.emailVerified : undefined);
      photoURL = photoURL ?? (typeof user.photoUrl === 'string' ? user.photoUrl : undefined);
    }
  }

  return {
    uid,
    email,
    name,
    role,
    emailVerified,
    photoURL,
    issuedAt,
    expiresAt,
    authTime,
    claims: payload,
  };
}

export async function revokeFirebaseSessions(uid: string): Promise<void> {
  const { projectId } = getFirebaseConfig();
  const accessToken = await getAccessToken();
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:revokeRefreshTokens`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ localId: uid }),
  });

  if (!response.ok) {
    throw new Error(`Failed to revoke Firebase sessions (${response.status})`);
  }
}

export type FirebaseIdTokenVerification = {
  uid: string;
  email?: string;
  name?: string;
  role?: string;
  emailVerified?: boolean;
  photoURL?: string;
  authTime?: number;
  claims: Record<string, unknown>;
};

export async function verifyFirebaseIdToken(idToken: string, checkRevoked = true): Promise<FirebaseIdTokenVerification> {
  const parts = idToken.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid Firebase ID token format');
  }

  const [headerPart, payloadPart, signaturePart] = parts;
  const header = JSON.parse(utf8Decode(base64UrlDecode(headerPart))) as Record<string, unknown>;
  if (header.alg !== 'RS256' || typeof header.kid !== 'string') {
    throw new Error('Unsupported Firebase ID token header');
  }

  const publicKey = await getPublicKey(header.kid);
  const isValid = await getSubtleCrypto().verify(
    'RSASSA-PKCS1-v1_5',
    publicKey,
    base64UrlDecode(signaturePart),
    utf8Encode(`${headerPart}.${payloadPart}`),
  );

  if (!isValid) {
    throw new Error('Firebase ID token signature invalid');
  }

  const payload = JSON.parse(utf8Decode(base64UrlDecode(payloadPart))) as Record<string, unknown>;
  const { projectId } = getFirebaseConfig();
  const issuer = `https://securetoken.google.com/${projectId}`;
  if (payload.iss !== issuer) {
    throw new Error('Invalid Firebase ID token issuer');
  }
  if (payload.aud !== projectId) {
    throw new Error('Invalid Firebase ID token audience');
  }
  if (typeof payload.sub !== 'string' || payload.sub.length === 0) {
    throw new Error('Firebase ID token missing uid');
  }

  const uid = payload.sub;
  const authTime = typeof payload.auth_time === 'number' ? payload.auth_time : undefined;
  let email = typeof payload.email === 'string' ? payload.email : undefined;
  let name = typeof payload.name === 'string' ? payload.name : undefined;
  let role = extractRole(payload);
  let emailVerified = typeof payload.email_verified === 'boolean' ? payload.email_verified : undefined;
  let photoURL = typeof payload.picture === 'string' ? payload.picture : undefined;

  if (checkRevoked || !role || !email || !emailVerified || !photoURL) {
    const user = await lookupUser(uid);
    if (!user) {
      throw new Error('User not found for Firebase ID token');
    }
    if (checkRevoked && user.validSince) {
      const validSince = Number.parseInt(user.validSince, 10);
      if (!Number.isNaN(validSince) && typeof payload.iat === 'number' && payload.iat < validSince) {
        throw new Error('Firebase ID token has been revoked');
      }
    }
    if (user.disabled) {
      throw new Error('Firebase account is disabled');
    }
    email = email ?? (typeof user.email === 'string' ? user.email : undefined);
    name = name ?? (typeof user.displayName === 'string' ? user.displayName : undefined);
    role = role ?? extractRole(payload, user.customAttributes ?? null);
    emailVerified = emailVerified ?? (typeof user.emailVerified === 'boolean' ? user.emailVerified : undefined);
    photoURL = photoURL ?? (typeof user.photoUrl === 'string' ? user.photoUrl : undefined);
  }

  return {
    uid,
    email,
    name,
    role,
    emailVerified,
    photoURL,
    authTime,
    claims: payload,
  };
}

export async function setFirebaseCustomUserClaims(uid: string, claims: Record<string, unknown>): Promise<void> {
  const { projectId } = getFirebaseConfig();
  const accessToken = await getAccessToken();
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:update`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      localId: uid,
      customAttributes: JSON.stringify(claims),
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to set Firebase custom claims (${response.status})`);
  }
}

export async function getFirebaseUser(uid: string): Promise<FirebaseUserRecord | null> {
  return lookupUser(uid);
}

export async function getFirebaseAccessToken(): Promise<string> {
  return getAccessToken();
}

