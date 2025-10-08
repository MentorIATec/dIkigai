import { getFirebaseAccessToken } from '@/lib/auth/firebase-admin';
import { hashMatricula } from '@/lib/crypto/hash';
import { decryptAesGcm, encryptAesGcm, type AesGcmPayload } from '@/lib/crypto/aesgcm';
import { getCurrentKey, getKeyByKid, type KeyRecord } from '@/lib/crypto/keyring';
import { computeStage, normalizeSemester, type StudentStage } from './mapping';

const FIRESTORE_BASE = 'https://firestore.googleapis.com/v1';
const PROFILE_COLLECTION = 'student_profiles';
const PRIVATE_COLLECTION = 'student_private';

type FirestoreListResponse = {
  documents?: FirestoreDocument[];
  nextPageToken?: string;
};

type FirestoreValue =
  | { stringValue: string }
  | { integerValue: string }
  | { timestampValue: string }
  | { booleanValue: boolean }
  | { nullValue: null }
  | { mapValue: { fields: Record<string, FirestoreValue> } };

type FirestoreDocument = {
  name: string;
  fields?: Record<string, FirestoreValue>;
};

type EnsureStudentProfileInput = {
  uid: string;
  email: string;
  semesterNumber: number | string;
  carreraId?: string | null;
  carreraName?: string | null;
  matricula?: string | null;
  consent?: {
    version: string;
    acceptedAt?: string;
  } | null;
};

type UpdateConsentInput = {
  uid: string;
  email: string;
  version: string;
  acceptedAt: string;
};

type StudentProfileRecord = {
  uid: string;
  email: string | null;
  semesterNumber: number | null;
  semesterStage: StudentStage | null;
  carreraId: string | null;
  carreraName: string | null;
  matriculaLast4: string | null;
  matriculaHash: string | null;
  consent?: {
    profile: boolean;
    version: string | null;
    acceptedAt: string | null;
  } | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

function getProjectId(): string {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error('FIREBASE_PROJECT_ID is not configured');
  }
  return projectId;
}

function getMatriculaSalt(): string {
  const salt = process.env.MATRICULA_SALT;
  if (!salt) {
    throw new Error('MATRICULA_SALT is not configured');
  }
  return salt;
}

function buildDocumentUrl(projectId: string, documentPath: string): { documentUrl: string; createUrl: string } {
  const base = `${FIRESTORE_BASE}/projects/${projectId}/databases/(default)/documents`;
  const documentUrl = `${base}/${documentPath}`;
  const pathParts = documentPath.split('/');
  const documentId = pathParts.pop();
  const parentPath = pathParts.join('/');
  const createUrl = `${base}/${parentPath}?documentId=${encodeURIComponent(documentId ?? '')}`;
  return { documentUrl, createUrl };
}

async function inspectDocument(documentPath: string): Promise<{ exists: boolean; document?: FirestoreDocument | null }> {
  const projectId = getProjectId();
  const accessToken = await getFirebaseAccessToken();
  const { documentUrl } = buildDocumentUrl(projectId, documentPath);
  const response = await fetch(documentUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });
  if (response.status === 404) {
    return { exists: false, document: null };
  }
  if (!response.ok) {
    throw new Error(`Failed to inspect Firestore document (${response.status})`);
  }
  const document = (await response.json()) as FirestoreDocument;
  return { exists: true, document };
}

async function upsertDocument(
  documentPath: string,
  fields: Record<string, FirestoreValue>,
  options: { exists: boolean },
): Promise<void> {
  const projectId = getProjectId();
  const accessToken = await getFirebaseAccessToken();
  const { documentUrl, createUrl } = buildDocumentUrl(projectId, documentPath);
  const body = JSON.stringify({ fields });

  if (!options.exists) {
    const createResponse = await fetch(createUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'content-type': 'application/json',
      },
      body,
    });
    if (!createResponse.ok) {
      throw new Error(`Failed to create Firestore document (${createResponse.status})`);
    }
    return;
  }

  const params = new URLSearchParams();
  Object.keys(fields).forEach((key) => {
    params.append('updateMask.fieldPaths', key);
  });
  const updateMask = params.toString();

  const patchResponse = await fetch(`${documentUrl}?${updateMask}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json',
    },
    body,
  });

  if (!patchResponse.ok) {
    throw new Error(`Failed to update Firestore document (${patchResponse.status})`);
  }
}

function buildProfileFields(
  input: EnsureStudentProfileInput,
  semesterNumber: number,
  semesterStage: StudentStage,
  nowIso: string,
  created: boolean,
  hashedMatricula: string | null,
  matriculaLast4: string | null,
  consent: { version: string; acceptedAt: string } | null,
): Record<string, FirestoreValue> {
  const fields: Record<string, FirestoreValue> = {
    uid: { stringValue: input.uid },
    email: { stringValue: input.email.toLowerCase() },
    semesterNumber: { integerValue: semesterNumber.toString() },
    semesterStage: { stringValue: semesterStage },
    updatedAt: { timestampValue: nowIso },
    matricula_hash: hashedMatricula ? { stringValue: hashedMatricula } : { nullValue: null },
    matricula_last4:
      matriculaLast4 && matriculaLast4.length > 0 ? { stringValue: matriculaLast4 } : { nullValue: null },
  };

  if (created) {
    fields.createdAt = { timestampValue: nowIso };
  }

  fields.carreraId = input.carreraId
    ? { stringValue: input.carreraId }
    : { nullValue: null };

  fields.carreraName = input.carreraName
    ? { stringValue: input.carreraName }
    : { nullValue: null };

  if (consent) {
    fields.consent = {
      mapValue: {
        fields: {
          profile: { booleanValue: true },
          version: { stringValue: consent.version },
          acceptedAt: { timestampValue: consent.acceptedAt },
        },
      },
    };
  }

  return fields;
}

function buildPrivateFields(
  encrypted: AesGcmPayload,
  nowIso: string,
  created: boolean,
): Record<string, FirestoreValue> {
  const fields: Record<string, FirestoreValue> = {
    matricula_enc: {
      mapValue: {
        fields: {
          v: { stringValue: encrypted.v },
          alg: { stringValue: encrypted.alg },
          kid: encrypted.kid ? { stringValue: encrypted.kid } : { nullValue: null },
          ivB64: { stringValue: encrypted.ivB64 },
          ciphertextB64: { stringValue: encrypted.ciphertextB64 },
          tagB64: { stringValue: encrypted.tagB64 },
        },
      },
    },
    updatedAt: { timestampValue: nowIso },
  };
  if (created) {
    fields.createdAt = { timestampValue: nowIso };
  }
  return fields;
}

function parseString(value: FirestoreValue | undefined): string | null {
  if (!value) {
    return null;
  }
  if ('stringValue' in value) {
    return value.stringValue;
  }
  if ('nullValue' in value) {
    return null;
  }
  return null;
}

function parseBoolean(value: FirestoreValue | undefined): boolean | null {
  if (!value) {
    return null;
  }
  if ('booleanValue' in value) {
    return Boolean(value.booleanValue);
  }
  if ('nullValue' in value) {
    return null;
  }
  return null;
}

function parseInteger(value: FirestoreValue | undefined): number | null {
  if (!value) {
    return null;
  }
  if ('integerValue' in value) {
    const parsed = Number.parseInt(value.integerValue, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
}

function parseMap(value: FirestoreValue | undefined): Record<string, FirestoreValue> | null {
  if (!value) {
    return null;
  }
  if ('mapValue' in value) {
    return value.mapValue.fields ?? null;
  }
  return null;
}

function mapFieldsToProfile(uid: string, fields: Record<string, FirestoreValue>): StudentProfileRecord {
  const consentFields = parseMap(fields.consent);
  const consent = consentFields
    ? {
        profile: parseBoolean(consentFields.profile) ?? false,
        version: parseString(consentFields.version),
        acceptedAt: parseString(consentFields.acceptedAt),
      }
    : null;

  return {
    uid,
    email: parseString(fields.email),
    semesterNumber: parseInteger(fields.semesterNumber),
    semesterStage: (parseString(fields.semesterStage) as StudentStage | null) ?? null,
    carreraId: parseString(fields.carreraId),
    carreraName: parseString(fields.carreraName),
    matriculaLast4: parseString(fields.matricula_last4),
    matriculaHash: parseString(fields.matricula_hash),
    consent,
    createdAt: parseString(fields.createdAt),
    updatedAt: parseString(fields.updatedAt),
  };
}

async function listCollectionDocuments(collectionPath: string): Promise<FirestoreDocument[]> {
  const projectId = getProjectId();
  const accessToken = await getFirebaseAccessToken();
  const base = `${FIRESTORE_BASE}/projects/${projectId}/databases/(default)/documents/${collectionPath}`;
  const documents: FirestoreDocument[] = [];
  let pageToken: string | undefined;

  do {
    const params = new URLSearchParams({ pageSize: '200' });
    if (pageToken) {
      params.set('pageToken', pageToken);
    }
    const response = await fetch(`${base}?${params.toString()}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error(`Failed to list Firestore documents (${response.status})`);
    }
    const data = (await response.json()) as FirestoreListResponse;
    if (Array.isArray(data.documents)) {
      documents.push(...data.documents);
    }
    pageToken = data.nextPageToken ?? undefined;
  } while (pageToken);

  return documents;
}

export async function ensureStudentProfile(input: EnsureStudentProfileInput): Promise<StudentProfileRecord> {
  const normalizedSemester = normalizeSemester(input.semesterNumber);
  const semesterStage = computeStage(normalizedSemester);
  const nowIso = new Date().toISOString();
  const salt = getMatriculaSalt();
  const matricula = input.matricula ? String(input.matricula) : null;
  const matriculaLast4 = matricula ? matricula.slice(-4) : null;
  const hashedMatricula = matricula ? hashMatricula(matricula, salt) : null;
  const keyMaterial: KeyRecord | null = matricula ? getCurrentKey() : null;
  const encrypted = matricula && keyMaterial ? encryptAesGcm(matricula, keyMaterial) : null;
  const consentInput = input.consent
    ? {
        version: input.consent.version,
        acceptedAt: input.consent.acceptedAt ?? nowIso,
      }
    : null;
  const profilePath = `${PROFILE_COLLECTION}/${encodeURIComponent(input.uid)}`;
  const privatePath = `${PRIVATE_COLLECTION}/${encodeURIComponent(input.uid)}`;

  const { exists: profileExists } = await inspectDocument(profilePath);
  const profileFields = buildProfileFields(
    input,
    normalizedSemester,
    semesterStage,
    nowIso,
    !profileExists,
    hashedMatricula,
    matriculaLast4,
    consentInput,
  );
  await upsertDocument(profilePath, profileFields, { exists: profileExists });

  if (encrypted) {
    const { exists: privateExists } = await inspectDocument(privatePath);
    const privateFields = buildPrivateFields(encrypted, nowIso, !privateExists);
    await upsertDocument(privatePath, privateFields, { exists: privateExists });
  }

  return {
    uid: input.uid,
    email: input.email,
    semesterNumber: normalizedSemester,
    semesterStage,
    carreraId: input.carreraId ?? null,
    carreraName: input.carreraName ?? null,
    matriculaLast4,
    matriculaHash: hashedMatricula,
    consent: consentInput
      ? { profile: true, version: consentInput.version, acceptedAt: consentInput.acceptedAt }
      : undefined,
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}

export async function getStudentProfile(uid: string): Promise<StudentProfileRecord | null> {
  const profilePath = `${PROFILE_COLLECTION}/${encodeURIComponent(uid)}`;
  const { exists, document } = await inspectDocument(profilePath);
  if (!exists || !document?.fields) {
    return null;
  }
  return mapFieldsToProfile(uid, document.fields);
}

export async function getAdminStudentPrivate(uid: string): Promise<string | null> {
  const privatePath = `${PRIVATE_COLLECTION}/${encodeURIComponent(uid)}`;
  const { exists, document } = await inspectDocument(privatePath);
  if (!exists || !document?.fields) {
    return null;
  }
  const payloadFields = parseMap(document.fields.matricula_enc);
  if (!payloadFields) {
    return null;
  }
  const payload: AesGcmPayload = {
    v: (parseString(payloadFields.v) ?? '1') as '1',
    alg: (parseString(payloadFields.alg) ?? 'A256GCM') as 'A256GCM',
    kid: parseString(payloadFields.kid) ?? undefined,
    ivB64: parseString(payloadFields.ivB64) ?? '',
    ciphertextB64: parseString(payloadFields.ciphertextB64) ?? '',
    tagB64: parseString(payloadFields.tagB64) ?? '',
  };
  if (!payload.ivB64 || !payload.ciphertextB64 || !payload.tagB64) {
    return null;
  }
  const keyRecord = getKeyByKid(payload.kid);
  return decryptAesGcm(payload, keyRecord.keyB64);
}

export async function listStudentProfiles(): Promise<StudentProfileRecord[]> {
  const documents = await listCollectionDocuments(PROFILE_COLLECTION);
  return documents
    .map((document) => {
      if (!document.name || !document.fields) {
        return null;
      }
      const parts = document.name.split('/');
      const uid = parts[parts.length - 1];
      return mapFieldsToProfile(uid, document.fields);
    })
    .filter((record): record is StudentProfileRecord => record !== null);
}

export async function updateStudentProfileConsent(input: UpdateConsentInput): Promise<void> {
  const profilePath = `${PROFILE_COLLECTION}/${encodeURIComponent(input.uid)}`;
  const { exists } = await inspectDocument(profilePath);
  const fields: Record<string, FirestoreValue> = {
    updatedAt: { timestampValue: input.acceptedAt },
    consent: {
      mapValue: {
        fields: {
          profile: { booleanValue: true },
          version: { stringValue: input.version },
          acceptedAt: { timestampValue: input.acceptedAt },
        },
      },
    },
  };

  if (!exists) {
    fields.uid = { stringValue: input.uid };
    fields.email = { stringValue: input.email.toLowerCase() };
    fields.createdAt = { timestampValue: input.acceptedAt };
    fields.semesterNumber = { integerValue: '1' };
    fields.semesterStage = { stringValue: computeStage(1) };
    fields.carreraId = { nullValue: null };
    fields.carreraName = { nullValue: null };
    fields.matricula_hash = { nullValue: null };
    fields.matricula_last4 = { nullValue: null };
  }

  await upsertDocument(profilePath, fields, { exists });
}

export type { EnsureStudentProfileInput, StudentProfileRecord, UpdateConsentInput };
