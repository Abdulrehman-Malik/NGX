import bcrypt from "bcryptjs";

/**
 * Password hashing/verification, isolated behind this module so the rest
 * of the app never touches a hashing library directly. If the algorithm
 * ever changes (e.g. bcrypt -> argon2), only this file needs to change.
 */

const SALT_ROUNDS = 12;

/** Minimum password policy for Phase 1. Extend in docs/DECISIONS.md if this changes. */
export const PASSWORD_MIN_LENGTH = 8;

export async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

export async function verifyPassword(
  plainPassword: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, passwordHash);
}
