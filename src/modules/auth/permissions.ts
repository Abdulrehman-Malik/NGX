/**
 * Centralized permission checking. Per docs/CURRENT_PHASE.md, Phase 1 does
 * not build out the full permission catalog from the master spec (§8) —
 * that grows module-by-module as each module is implemented. What exists
 * now is the mechanism: a set of permission codes on the resolved session,
 * checked here, never inferred from the UI.
 */

export interface AuthorizedUser {
  userId: string;
  isSuperAdmin: boolean;
  permissions: Set<string>;
}

export class ForbiddenError extends Error {
  constructor(permissionCode: string) {
    super(`Missing required permission: ${permissionCode}`);
    this.name = "ForbiddenError";
  }
}

export function hasPermission(user: AuthorizedUser, code: string): boolean {
  if (user.isSuperAdmin) return true;
  return user.permissions.has(code);
}

/** Throws ForbiddenError if the user lacks the permission. Use in API routes. */
export function requirePermission(user: AuthorizedUser, code: string): void {
  if (!hasPermission(user, code)) {
    throw new ForbiddenError(code);
  }
}
