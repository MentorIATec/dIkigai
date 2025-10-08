import crypto from 'node:crypto';
import type { KeyRecord } from './keyring';

type AesGcmPayload = {
  v: '1';
  alg: 'A256GCM';
  kid?: string;
  ivB64: string;
  ciphertextB64: string;
  tagB64: string;
};

function getKeyBuffer(keyB64: string): Buffer {
  if (!keyB64) {
    throw new Error('Encryption key is not configured');
  }
  const key = Buffer.from(keyB64, 'base64');
  if (key.length !== 32) {
    throw new Error('Encryption key must decode to 32 bytes');
  }
  return key;
}

export function encryptAesGcm(plain: string, key: KeyRecord): AesGcmPayload {
  const keyBuffer = getKeyBuffer(key.keyB64);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', keyBuffer, iv);
  const ciphertext = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    v: '1',
    alg: 'A256GCM',
    kid: key.kid,
    ivB64: iv.toString('base64'),
    ciphertextB64: ciphertext.toString('base64'),
    tagB64: tag.toString('base64'),
  };
}

export function decryptAesGcm(payload: AesGcmPayload, keyB64: string): string {
  const keyBuffer = getKeyBuffer(keyB64);
  const iv = Buffer.from(payload.ivB64, 'base64');
  const ciphertext = Buffer.from(payload.ciphertextB64, 'base64');
  const tag = Buffer.from(payload.tagB64, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return decrypted.toString('utf8');
}

export type { AesGcmPayload };
