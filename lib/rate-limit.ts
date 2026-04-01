const RATE_LIMIT_KEY = "wedding_upload_timestamps";
const MAX_UPLOADS = 5; // max upload batches per window
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

export function checkRateLimit(): { allowed: boolean; retryAfterMs: number } {
  if (typeof window === "undefined") return { allowed: true, retryAfterMs: 0 };

  const now = Date.now();
  const stored = localStorage.getItem(RATE_LIMIT_KEY);
  const timestamps: number[] = stored ? JSON.parse(stored) : [];

  // Remove expired timestamps
  const valid = timestamps.filter((t) => now - t < WINDOW_MS);

  if (valid.length >= MAX_UPLOADS) {
    const oldest = valid[0];
    return { allowed: false, retryAfterMs: WINDOW_MS - (now - oldest) };
  }

  valid.push(now);
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(valid));
  return { allowed: true, retryAfterMs: 0 };
}
