import { describe, expect, it } from "vitest";
import {
  isLocked,
  recordFailedAttempt,
  resetLockoutState,
  MAX_FAILED_LOGIN_ATTEMPTS,
  LOCKOUT_DURATION_MS,
} from "@/modules/auth/lockout-policy";

describe("lockout policy", () => {
  it("is not locked with zero failed attempts", () => {
    expect(isLocked({ failedLoginAttempts: 0, lockedUntil: null })).toBe(false);
  });

  it("increments failed attempts without locking below the threshold", () => {
    const state = recordFailedAttempt({ failedLoginAttempts: 0, lockedUntil: null });
    expect(state.failedLoginAttempts).toBe(1);
    expect(state.lockedUntil).toBeNull();
  });

  it("locks the account once the max attempts is reached", () => {
    const now = new Date("2026-01-01T00:00:00Z");
    const state = recordFailedAttempt(
      { failedLoginAttempts: MAX_FAILED_LOGIN_ATTEMPTS - 1, lockedUntil: null },
      now,
    );
    expect(state.lockedUntil).not.toBeNull();
    expect(state.lockedUntil!.getTime()).toBe(now.getTime() + LOCKOUT_DURATION_MS);
  });

  it("reports locked while lockedUntil is in the future", () => {
    const now = new Date("2026-01-01T00:00:00Z");
    const future = new Date(now.getTime() + 60_000);
    expect(isLocked({ failedLoginAttempts: 5, lockedUntil: future }, now)).toBe(true);
  });

  it("reports not locked once lockedUntil has passed", () => {
    const now = new Date("2026-01-01T00:10:00Z");
    const past = new Date("2026-01-01T00:00:00Z");
    expect(isLocked({ failedLoginAttempts: 5, lockedUntil: past }, now)).toBe(false);
  });

  it("resets to a clean state", () => {
    expect(resetLockoutState()).toEqual({ failedLoginAttempts: 0, lockedUntil: null });
  });
});
