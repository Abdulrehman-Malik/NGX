import { randomBytes, createHash } from "crypto";

/**
 * Opaque session tokens: a random value is what the browser holds (in the
 * session cookie); only its SHA-256 hash is ever persisted to the
 * database. This means a database read alone can't be replayed as a valid
 * cookie, and comparison happens purely by exact hash match (no timing
 * concerns around bcrypt-comparing a session token on every request).
 */

const SESSION_TOKEN_BYTES = 32;

/** Session lifetime. Not yet configurable per-company — see docs/TODO.md. */
export const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export function generateSessionToken(): string {
  return randomBytes(SESSION_TOKEN_BYTES).toString("hex");
}

export function hashSessionToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}
