export const AUTH_PROVIDER = process.env.AUTH_PROVIDER ?? 'dev';
export const AUTH_SECRET = process.env.AUTH_SECRET ?? 'CHANGE_ME_DEV_SECRET';
export const COOKIE_NAME = 'session';
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function parseAllowlist(value: string | undefined): string[] {
  if (!value) {
    return [];
  }
  return value
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter((entry) => entry.length > 0);
}

export const ALLOWLIST_DOMAINS = parseAllowlist(process.env.ALLOWLIST_DOMAINS);
