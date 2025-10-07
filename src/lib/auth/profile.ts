import { ALLOWLIST_DOMAINS } from './config';
import { getFirebaseAccessToken } from './firebase-admin';
import type { SessionRole } from './server';

type FirestoreValue =
  | { stringValue: string }
  | { booleanValue: boolean }
  | { timestampValue: string };

type FirestoreDocument = {
  name: string;
  fields?: Record<string, FirestoreValue>;
  createTime?: string;
  updateTime?: string;
};

type EnsureUserProfileInput = {
  uid: string;
  email?: string;
  role: SessionRole;
  displayName?: string;
  photoURL?: string;
  emailVerified?: boolean;
};

type FirestoreEnsureResult = {
  created: boolean;
  updated: boolean;
};

function getProjectId(): string {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error('FIREBASE_PROJECT_ID is not configured');
  }
  return projectId;
}

function buildStringField(value: string | undefined): FirestoreValue | undefined {
  if (!value) {
    return undefined;
  }
  return { stringValue: value };
}

function buildBooleanField(value: boolean | undefined): FirestoreValue | undefined {
  if (typeof value !== 'boolean') {
    return undefined;
  }
  return { booleanValue: value };
}

function buildTimestampField(value: string | undefined): FirestoreValue | undefined {
  if (!value) {
    return undefined;
  }
  return { timestampValue: value };
}

function buildFields(input: EnsureUserProfileInput, nowIso: string, created: boolean) {
  const fields: Record<string, FirestoreValue> = {};
  const maybeAdd = (key: string, field: FirestoreValue | undefined) => {
    if (field) {
      fields[key] = field;
    }
  };

  maybeAdd('uid', buildStringField(input.uid));
  maybeAdd('email', buildStringField(input.email?.toLowerCase()));
  maybeAdd('role', buildStringField(input.role));
  maybeAdd('displayName', buildStringField(input.displayName));
  maybeAdd('photoURL', buildStringField(input.photoURL));
  maybeAdd('emailVerified', buildBooleanField(input.emailVerified));
  maybeAdd('updatedAt', buildTimestampField(nowIso));
  maybeAdd('lastLoginAt', buildTimestampField(nowIso));
  if (created) {
    maybeAdd('createdAt', buildTimestampField(nowIso));
  }

  return fields;
}

function buildUpdateMask(fields: Record<string, FirestoreValue>): string {
  const params = new URLSearchParams();
  Object.keys(fields).forEach((key) => {
    params.append('updateMask.fieldPaths', key);
  });
  return params.toString();
}

export async function ensureUserProfile(input: EnsureUserProfileInput): Promise<FirestoreEnsureResult> {
  const projectId = getProjectId();
  const accessToken = await getFirebaseAccessToken();
  const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
  const documentUrl = `${baseUrl}/users/${encodeURIComponent(input.uid)}`;
  const nowIso = new Date().toISOString();

  let existing: FirestoreDocument | null = null;
  const response = await fetch(documentUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  if (response.status === 200) {
    existing = (await response.json()) as FirestoreDocument;
  } else if (response.status !== 404) {
    throw new Error(`Failed to inspect user profile (${response.status})`);
  }

  const created = !existing;
  const fields = buildFields(input, nowIso, created);

  if (created) {
    const createResponse = await fetch(`${baseUrl}/users?documentId=${encodeURIComponent(input.uid)}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    });

    if (!createResponse.ok) {
      throw new Error(`Failed to create user profile (${createResponse.status})`);
    }

    return { created: true, updated: false };
  }

  const updateMask = buildUpdateMask(fields);
  const updateResponse = await fetch(`${documentUrl}?${updateMask}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  });

  if (!updateResponse.ok) {
    throw new Error(`Failed to update user profile (${updateResponse.status})`);
  }

  return { created: false, updated: true };
}

export function isDomainAllowed(email: string | undefined): boolean {
  if (!email) {
    return false;
  }
  if (ALLOWLIST_DOMAINS.length === 0) {
    return true;
  }
  const normalized = email.toLowerCase();
  return ALLOWLIST_DOMAINS.some((domain) => normalized.endsWith(`@${domain}`));
}
