import { describe, expect, it } from "vitest";
import { hasPermission, requirePermission, ForbiddenError } from "@/modules/auth/permissions";
import type { AuthorizedUser } from "@/modules/auth/permissions";

function makeUser(overrides: Partial<AuthorizedUser> = {}): AuthorizedUser {
  return {
    userId: "user_1",
    isSuperAdmin: false,
    permissions: new Set<string>(),
    ...overrides,
  };
}

describe("permission checks", () => {
  it("grants access when the permission is present", () => {
    const user = makeUser({ permissions: new Set(["sales.invoice.create"]) });
    expect(hasPermission(user, "sales.invoice.create")).toBe(true);
  });

  it("denies access when the permission is absent", () => {
    const user = makeUser({ permissions: new Set(["sales.invoice.view"]) });
    expect(hasPermission(user, "sales.invoice.create")).toBe(false);
  });

  it("super admins bypass all permission checks", () => {
    const user = makeUser({ isSuperAdmin: true, permissions: new Set() });
    expect(hasPermission(user, "anything.at.all")).toBe(true);
  });

  it("requirePermission throws ForbiddenError when missing", () => {
    const user = makeUser();
    expect(() => requirePermission(user, "sales.invoice.create")).toThrow(ForbiddenError);
  });

  it("requirePermission does not throw when permission is present", () => {
    const user = makeUser({ permissions: new Set(["sales.invoice.create"]) });
    expect(() => requirePermission(user, "sales.invoice.create")).not.toThrow();
  });
});
