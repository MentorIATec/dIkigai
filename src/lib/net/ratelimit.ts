type RateLimitResult = { success: true } | { success: false; retryAfter: number };

type Bucket = {
  tokens: number;
  lastRefill: number;
};

const buckets = new Map<string, Bucket>();

export function consumeRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { tokens: limit, lastRefill: now };
  const elapsed = now - bucket.lastRefill;

  if (elapsed >= windowMs) {
    bucket.tokens = limit;
    bucket.lastRefill = now;
  }

  if (bucket.tokens > 0) {
    bucket.tokens -= 1;
    buckets.set(key, bucket);
    return { success: true };
  }

  const retryAfterMs = windowMs - elapsed;
  const retryAfter = Math.max(1, Math.ceil(retryAfterMs / 1000));
  buckets.set(key, bucket);
  return { success: false, retryAfter };
}
