# CURRENT PHASE

## Phase 0 — Foundation & Architecture (near complete)

**Goal:** Repository structure, DB strategy, conventions, environment,
documentation — no business features yet.

### Scope

- [x] Architecture proposal presented and approved
- [x] `docs/` handoff/playbook system created
- [x] Next.js + TypeScript + Tailwind scaffolded
- [x] Prisma + PostgreSQL datasource configured (no models yet)
- [x] Docker Compose for local Postgres
- [x] `.env.example`
- [x] Vitest configured with a passing smoke test
- [x] Toolchain verified: install, typecheck, lint, test all pass
- [ ] `next build` + `prisma generate` confirmed working with normal
      internet access (blocked only in this sandbox — see
      `docs/TEST_STATUS.md`)

### Exact next steps to close Phase 0

1. On a machine with normal internet access: `npm install`, then
   `npx prisma generate`, then `npm run build`. Confirm all three succeed.
2. Update `docs/PROJECT_STATE.md` and `docs/TEST_STATUS.md` marking Phase 0
   DONE.
3. Commit with message `docs(phase-0): confirm build verification, close
   phase 0`.

---

## Phase 1 — Authentication & Security (in progress)

**Goal (per `docs/Enterprise_Multi-Company_Multi-Branch_POS_and_ERP_Architecture.pdf`
§6–§8 and the Playbook's phase plan):** Login, sessions, password security,
users, roles, permissions foundation.

### Planned work

1. [x] Prisma models: `User`, `Role`, `Permission`, `RolePermission`,
   `UserRole`, `Session`. ID strategy: `cuid()` (see `docs/DECISIONS.md`).
2. [x] `prisma/seed.ts` with one super-admin role + admin user
   (bcrypt-hashed password) for local testing.
   **Not yet run against a real database** — needs Phase 0's remaining
   verification step first (see `docs/TEST_STATUS.md`).
3. [x] `src/modules/auth`: password hashing (`password.ts`), session
   tokens (`session-token.ts`), lockout policy (`lockout-policy.ts`),
   permission checks (`permissions.ts`), Zod schemas (`schemas.ts`), and
   `auth-service.ts` (login/logout/resolveSession) — framework-agnostic,
   callable from API routes.
4. [x] `POST /api/auth/login`, `POST /api/auth/logout`,
   `GET /api/auth/me` route handlers with Zod validation. Rate limiting
   is **not** implemented yet — noted as a gap, not silently skipped.
5. [x] Session resolution: `src/lib/current-user.ts` +
   `src/lib/session-cookie.ts` resolve the authenticated user + effective
   permissions from the session cookie, callable from server components
   and route handlers.
6. [x] Login UI screen (`src/app/login/page.tsx`) + first design-system
   primitives: `Button`, `Input`, `Label`/`FormField`
   (`src/components/ui/`). Home page (`src/app/page.tsx`) now shows signed
   in/out state and a logout button as an end-to-end smoke check.
7. [x] `requirePermission()`/`hasPermission()` helper
   (`src/modules/auth/permissions.ts`), with a super-admin bypass
   (`Role.isSuperAdmin`) so there's a usable administrator before the full
   permission catalog exists.
8. [x] Unit tests: password hashing (3), lockout policy (6), permission
   checks (5) — all pure-function tests, no DB required, all passing.
   **Not yet tested:** `auth-service.ts` itself (login/logout/
   resolveSession) end-to-end, since that requires a live database — this
   is the main remaining risk area for this phase.

### Remaining before Phase 1 can be marked DONE

- Run `npx prisma generate` + `npx prisma migrate dev --name init_auth` on
  a machine with real internet/DB access, confirm the migration applies
  cleanly.
- Run `npm run db:seed` and confirm the admin user is created.
- Manually verify the login → home → logout flow works in the browser
  against a real Postgres instance.
- Re-run `npx tsc --noEmit` **after** `prisma generate` succeeds — the
  current typecheck pass is against an ungenerated Prisma client stub and
  is not a reliable signal (see `docs/TEST_STATUS.md` caveat).
- Add integration tests for `auth-service.ts` (likely against a test DB or
  with Prisma mocked) once a DB is available to test against.

### Explicitly deferred to later phases

- Company/branch scoping in the session (Phase 2 — the session structure
  should have a place for it, but company/branch records don't exist yet).
- Forgot/reset password, 2FA, account lockout — full auth
  hardening happens incrementally; note which pieces exist vs. deferred in
  `docs/PROJECT_STATE.md` as they're built.

### Do not

- Do not use NextAuth (see `docs/DECISIONS.md`).
- Do not store plaintext passwords under any circumstance.
- Do not build the full RBAC permission matrix from the spec at once —
  start with the minimum needed to protect Phase 1's own endpoints, and
  extend permission definitions as each module that needs them is built.
