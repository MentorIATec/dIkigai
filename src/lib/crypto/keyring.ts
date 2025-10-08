import { Buffer } from 'node:buffer';

type KeyRecord = { kid: string; keyB64: string };

type KeyRing = Record<string, string>;

let cachedKeyRing: KeyRing | null = null;
let cachedCurrentKid: string | null = null;

function parseKeyRing(): { ring: KeyRing; currentKid: string } {
  if (cachedKeyRing && cachedCurrentKid) {
    return { ring: cachedKeyRing, currentKid: cachedCurrentKid };
  }

  const currentKid = process.env.MATRICULA_ENC_KEY_CURRENT_KID ?? 'default';
  const keysJson = process.env.MATRICULA_KEYS_JSON;
  const legacyKey = process.env.MATRICULA_ENC_KEY;

  let ring: KeyRing | null = null;

  if (keysJson) {
    try {
      const parsed = JSON.parse(keysJson) as KeyRing;
      ring = parsed && typeof parsed === 'object' ? parsed : null;
    } catch (error) {
      throw new Error('Invalid MATRICULA_KEYS_JSON. Expected valid JSON map of kid->base64Key.');
    }
  }

  if (!ring && legacyKey) {
    ring = { default: legacyKey };
  }

  if (!ring) {
    throw new Error('MATRICULA_KEYS_JSON or MATRICULA_ENC_KEY must be configured');
  }

  const normalizedRing: KeyRing = {};
  Object.entries(ring).forEach(([kid, key]) => {
    if (!kid || typeof kid !== 'string') {
      return;
    }
    if (typeof key !== 'string' || key.length === 0) {
      return;
    }
    const decoded = Buffer.from(key, 'base64');
    if (decoded.length !== 32) {
      throw new Error(`Key for kid "${kid}" must decode to 32 bytes.`);
    }
    normalizedRing[kid] = key;
  });

  if (!normalizedRing[currentKid]) {
    throw new Error(`Current matricula key kid "${currentKid}" not found in key ring.`);
  }

  cachedKeyRing = normalizedRing;
  cachedCurrentKid = currentKid;
  return { ring: normalizedRing, currentKid };
}

export function getCurrentKey(): KeyRecord {
  const { ring, currentKid } = parseKeyRing();
  return { kid: currentKid, keyB64: ring[currentKid] };
}

export function getKeyByKid(kid?: string | null): KeyRecord {
  const { ring, currentKid } = parseKeyRing();
  const resolvedKid = kid && ring[kid] ? kid : currentKid;
  return { kid: resolvedKid, keyB64: ring[resolvedKid] };
}

export function listKeyIds(): string[] {
  const { ring } = parseKeyRing();
  return Object.keys(ring);
}

export type { KeyRecord };
