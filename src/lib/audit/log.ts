import { getFirebaseAccessToken } from '@/lib/auth/firebase-admin';

const FIRESTORE_BASE = 'https://firestore.googleapis.com/v1';
const AUDIT_COLLECTION = 'audit_logs';

type AuditEvent = {
  action: string;
  resource: string;
  who: { uid: string; email?: string | null };
  role: string;
  subjectUid?: string | null;
  metadata?: Record<string, unknown> | null;
};

function getProjectId(): string {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error('FIREBASE_PROJECT_ID is not configured');
  }
  return projectId;
}

function encodeValue(value: unknown): Record<string, unknown> {
  if (value === null || value === undefined) {
    return { nullValue: null };
  }
  if (typeof value === 'string') {
    return { stringValue: value };
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return { doubleValue: value };
  }
  if (typeof value === 'boolean') {
    return { booleanValue: value };
  }
  return { stringValue: JSON.stringify(value) };
}

export async function writeAudit(event: AuditEvent): Promise<string> {
  const projectId = getProjectId();
  const accessToken = await getFirebaseAccessToken();
  const base = `${FIRESTORE_BASE}/projects/${projectId}/databases/(default)/documents/${AUDIT_COLLECTION}`;
  const timestamp = new Date().toISOString();

  const fields: Record<string, unknown> = {
    action: { stringValue: event.action },
    resource: { stringValue: event.resource },
    role: { stringValue: event.role },
    subjectUid: event.subjectUid ? { stringValue: event.subjectUid } : { nullValue: null },
    at: { timestampValue: timestamp },
    who: {
      mapValue: {
        fields: {
          uid: { stringValue: event.who.uid },
          email: event.who.email ? { stringValue: event.who.email } : { nullValue: null },
        },
      },
    },
  };

  if (event.metadata && Object.keys(event.metadata).length > 0) {
    fields.metadata = {
      mapValue: {
        fields: Object.fromEntries(
          Object.entries(event.metadata).map(([key, value]) => [key, encodeValue(value)]),
        ),
      },
    };
  }

  const response = await fetch(base, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  });

  if (!response.ok) {
    throw new Error(`Failed to persist audit log (${response.status})`);
  }

  const data = (await response.json()) as { name?: string };
  const name = data.name ?? '';
  const parts = name.split('/');
  return parts[parts.length - 1] ?? '';
}

export type { AuditEvent };
