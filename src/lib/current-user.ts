import { getSessionCookie } from "@/lib/session-cookie";
import { resolveSession } from "@/modules/auth/auth-service";
import type { AuthorizedUser } from "@/modules/auth/permissions";

/**
 * Resolves the current request's authenticated user (if any) from the
 * session cookie. Safe to call from server components and route handlers.
 * Returns null when there is no session, or it's invalid/expired/revoked
 * -- callers must not assume a non-null result.
 */
export async function getCurrentUser(): Promise<AuthorizedUser | null> {
  const token = getSessionCookie();
  if (!token) return null;
  return resolveSession(token);
}
