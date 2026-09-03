/**
 * Failed-login / account-lockout policy, kept as pure functions so the
 * rule can be unit tested without a database and reused consistently
 * wherever login is attempted.
 */

export const MAX_FAILED_LOGIN_ATTEMPTS = 5;
export const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export interface LockoutState {
  failedLoginAttempts: number;
  lockedUntil: Date | null;
}

export function isLocked(state: LockoutState, now: Date = new Date()): boolean {
  return state.lockedUntil !== null && state.lockedUntil.getTime() > now.getTime();
}

/**
 * Given the current failure count (before this attempt), returns the next
 * state to persist after another failed login attempt.
 */
export function recordFailedAttempt(
  state: LockoutState,
  now: Date = new Date(),
): LockoutState {
  const nextAttempts = state.failedLoginAttempts + 1;
  const shouldLock = nextAttempts >= MAX_FAILED_LOGIN_ATTEMPTS;

  return {
    failedLoginAttempts: shouldLock ? 0 : nextAttempts,
    lockedUntil: shouldLock ? new Date(now.getTime() + LOCKOUT_DURATION_MS) : state.lockedUntil,
  };
}

export function resetLockoutState(): LockoutState {
  return { failedLoginAttempts: 0, lockedUntil: null };
}
