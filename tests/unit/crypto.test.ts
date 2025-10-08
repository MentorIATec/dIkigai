import test from 'node:test';
import assert from 'node:assert/strict';
import { encryptAesGcm, decryptAesGcm } from '../../src/lib/crypto/aesgcm';
import { getCurrentKey, getKeyByKid } from '../../src/lib/crypto/keyring';
import { hashMatricula } from '../../src/lib/crypto/hash';

// Mock key ring for unit test environments
process.env.MATRICULA_KEYS_JSON = JSON.stringify({ default: Buffer.alloc(32, 1).toString('base64') });
process.env.MATRICULA_ENC_KEY_CURRENT_KID = 'default';
process.env.MATRICULA_SALT = 'unit-test-salt';

test('AES-GCM encrypt/decrypt roundtrip preserves payload and kid', () => {
  const key = getCurrentKey();
  const payload = encryptAesGcm('A01712345', key);
  assert.equal(payload.kid, key.kid);
  const decoded = decryptAesGcm(payload, getKeyByKid(payload.kid).keyB64);
  assert.equal(decoded, 'A01712345');
});

test('hashMatricula produces deterministic salted hash', () => {
  const hashA = hashMatricula('A01712345', process.env.MATRICULA_SALT!);
  const hashB = hashMatricula('A01712345', process.env.MATRICULA_SALT!);
  const hashC = hashMatricula('A01712346', process.env.MATRICULA_SALT!);
  assert.equal(hashA, hashB);
  assert.notEqual(hashA, hashC);
});
