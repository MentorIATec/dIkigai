import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/server';
import { getFirebaseAccessToken } from '@/lib/auth/firebase-admin';
import { decryptAesGcm, encryptAesGcm, type AesGcmPayload } from '@/lib/crypto/aesgcm';
import { getCurrentKey, getKeyByKid } from '@/lib/crypto/keyring';

const FIRESTORE_BASE = 'https://firestore.googleapis.com/v1';
const PRIVATE_COLLECTION = 'student_private';

function getProjectId(): string {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error('FIREBASE_PROJECT_ID is not configured');
  }
  return projectId;
}

type RequestBody = {
  dryRun?: boolean;
  pageSize?: number;
  resumeToken?: string;
};

type FirestoreDocument = {
  name: string;
  fields?: Record<string, any>;
};

type ListResponse = {
  documents?: FirestoreDocument[];
  nextPageToken?: string;
};

function parsePayload(fields?: Record<string, any>): AesGcmPayload | null {
  if (!fields?.matricula_enc?.mapValue?.fields) {
    return null;
  }
  const payloadFields = fields.matricula_enc.mapValue.fields as Record<string, any>;
  const getString = (value: any): string | undefined => {
    if (!value) return undefined;
    if (typeof value.stringValue === 'string') return value.stringValue;
    return undefined;
  };
  const payload: AesGcmPayload = {
    v: ((getString(payloadFields.v) ?? '1') as '1'),
    alg: ((getString(payloadFields.alg) ?? 'A256GCM') as 'A256GCM'),
    kid: getString(payloadFields.kid),
    ivB64: getString(payloadFields.ivB64) ?? '',
    ciphertextB64: getString(payloadFields.ciphertextB64) ?? '',
    tagB64: getString(payloadFields.tagB64) ?? '',
  };
  if (!payload.ivB64 || !payload.ciphertextB64 || !payload.tagB64) {
    return null;
  }
  return payload;
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const body = ((await request.json().catch(() => ({}))) ?? {}) as RequestBody;
  const dryRun = Boolean(body.dryRun);
  const pageSize = Math.min(Math.max(body.pageSize ?? 25, 1), 200);
  const resumeToken = body.resumeToken ?? undefined;

  const projectId = getProjectId();
  const accessToken = await getFirebaseAccessToken();
  const params = new URLSearchParams({ pageSize: String(pageSize) });
  if (resumeToken) {
    params.set('pageToken', resumeToken);
  }
  const listUrl = `${FIRESTORE_BASE}/projects/${projectId}/databases/(default)/documents/${PRIVATE_COLLECTION}?${params.toString()}`;

  const listResponse = await fetch(listUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });

  if (!listResponse.ok) {
    return NextResponse.json({ error: 'list_failed' }, { status: 500 });
  }

  const data = (await listResponse.json()) as ListResponse;
  const documents = Array.isArray(data.documents) ? data.documents : [];

  let processed = 0;
  let reencrypted = 0;
  const currentKey = getCurrentKey();

  for (const document of documents) {
    if (!document.name) {
      continue;
    }
    processed += 1;
    const payload = parsePayload(document.fields);
    if (!payload) {
      continue;
    }
    if (payload.kid === currentKey.kid) {
      continue;
    }
    const keyRecord = getKeyByKid(payload.kid);
    const plain = decryptAesGcm(payload, keyRecord.keyB64);
    const updated = encryptAesGcm(plain, currentKey);
    reencrypted += 1;
    if (dryRun) {
      continue;
    }

    const documentUrl = `${FIRESTORE_BASE}/${document.name}`;
    const updateMask = new URLSearchParams({ 'updateMask.fieldPaths': 'matricula_enc' });
    const bodyPayload = {
      fields: {
        matricula_enc: {
          mapValue: {
            fields: {
              v: { stringValue: updated.v },
              alg: { stringValue: updated.alg },
              kid: updated.kid ? { stringValue: updated.kid } : { nullValue: null },
              ivB64: { stringValue: updated.ivB64 },
              ciphertextB64: { stringValue: updated.ciphertextB64 },
              tagB64: { stringValue: updated.tagB64 },
            },
          },
        },
      },
    };

    await fetch(`${documentUrl}?${updateMask.toString()}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify(bodyPayload),
    });
  }

  return NextResponse.json({
    ok: true,
    dryRun,
    processed,
    reencrypted,
    nextPageToken: data.nextPageToken ?? null,
  });
}
