import { prisma } from "@/lib/db";
import { verifyPassword } from "./password";
import { generateSessionToken, hashSessionToken, SESSION_DURATION_MS } from "./session-token";
import { isLocked, recordFailedAttempt, resetLockoutState } from "./lockout-policy";
import type { AuthorizedUser } from "./permissions";

export class AuthenticationError extends Error {
  constructor(message = "Invalid username/email or password") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class AccountLockedError extends Error {
  constructor(lockedUntil: Date) {
    super(`Account is locked until ${lockedUntil.toISOString()}`);
    this.name = "AccountLockedError";
  }
}

export interface LoginResult {
  sessionToken: string;
  expiresAt: Date;
  user: {
    id: string;
    username: string;
    email: string;
    fullName: string;
  };
}

export interface LoginContext {
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Authenticates a user by username or email + password.
 *
 * On failure, increments the failed-attempt counter and may lock the
 * account per docs/modules/auth/lockout-policy.ts. On success, creates a
 * server-side session record and returns the raw token to be set as the
 * session cookie by the calling API route (never stored in plaintext).
 */
export async function login(
  usernameOrEmail: string,
  plainPassword: string,
  context: LoginContext = {},
): Promise<LoginResult> {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      deletedAt: null,
    },
  });

  // Same generic error whether the user doesn't exist or the password is
  // wrong -- do not leak which one it was.
  if (!user || !user.isActive) {
    throw new AuthenticationError();
  }

  if (isLocked({ failedLoginAttempts: user.failedLoginAttempts, lockedUntil: user.lockedUntil })) {
    throw new AccountLockedError(user.lockedUntil as Date);
  }

  const passwordValid = await verifyPassword(plainPassword, user.passwordHash);

  if (!passwordValid) {
    const nextState = recordFailedAttempt({
      failedLoginAttempts: user.failedLoginAttempts,
      lockedUntil: user.lockedUntil,
    });
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: nextState.failedLoginAttempts,
        lockedUntil: nextState.lockedUntil,
      },
    });
    throw new AuthenticationError();
  }

  const resetState = resetLockoutState();
  const rawToken = generateSessionToken();
  const tokenHash = hashSessionToken(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: resetState.failedLoginAttempts,
        lockedUntil: resetState.lockedUntil,
        lastLoginAt: new Date(),
      },
    }),
    prisma.session.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
      },
    }),
  ]);

  return {
    sessionToken: rawToken,
    expiresAt,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
    },
  };
}

export async function logout(rawToken: string): Promise<void> {
  const tokenHash = hashSessionToken(rawToken);
  await prisma.session.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

/**
 * Resolves a raw session token (from the cookie) into the authenticated
 * user + their effective permission set. Returns null for any invalid,
 * expired, or revoked session -- callers must treat null as "not logged in".
 */
export async function resolveSession(rawToken: string): Promise<AuthorizedUser | null> {
  const tokenHash = hashSessionToken(rawToken);

  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: {
      user: {
        include: {
          userRoles: {
            include: {
              role: {
                include: {
                  rolePermissions: { include: { permission: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!session || session.revokedAt || session.expiresAt.getTime() < Date.now()) {
    return null;
  }

  if (!session.user.isActive || session.user.deletedAt) {
    return null;
  }

  const isSuperAdmin = session.user.userRoles.some(
    (ur: { role: { isSuperAdmin: boolean } }) => ur.role.isSuperAdmin,
  );
  const permissions = new Set<string>();
  for (const userRole of session.user.userRoles) {
    for (const rolePermission of userRole.role.rolePermissions) {
      permissions.add(rolePermission.permission.code);
    }
  }

  return {
    userId: session.user.id,
    isSuperAdmin,
    permissions,
  };
}
