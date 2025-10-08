import crypto from 'node:crypto';

export function hashMatricula(raw: string, salt: string): string {
  if (!salt) {
    throw new Error('MATRICULA_SALT is not configured');
  }
  return crypto.createHash('sha256').update(`${salt}${raw}`, 'utf8').digest('hex');
}
