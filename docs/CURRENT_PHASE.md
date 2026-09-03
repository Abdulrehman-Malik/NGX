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

## Phase 1 — Authentication & Security (next phase, not started)

**Goal (per `docs/Enterprise_Multi-Company_Multi-Branch_POS_and_ERP_Architecture.pdf`
§6–§8 and the Playbook's phase plan):** Login, sessions, password security,
users, roles, permissions foundation.

### Planned work

1. Prisma models: `User`, `Role`, `Permission`, `RolePermission`,
   `UserRole`, `Session`. Record ID strategy (cuid vs uuid) in
   `docs/DECISIONS.md` when chosen.
2. Migration + `prisma db seed` with at least one admin user (bcrypt-hashed
   password) for local testing.
3. `src/modules/auth`: password hashing service, session creation/
   validation service, login/logout logic — framework-agnostic, callable
   from API routes.
4. `POST /api/auth/login`, `POST /api/auth/logout` route handlers (Zod
   validation, rate limiting consideration noted even if not implemented
   yet).
5. Session middleware: resolves the authenticated user + role +
   permissions from the session cookie on every request.
6. Login UI screen (first real screen in the design system — establish
   button/input/form primitives here since everything else builds on them).
7. Basic RBAC check helper used by API routes (`requirePermission(...)`),
   even before companies/branches exist (Phase 2) — permission checks
   should not need branch scope to function structurally.
8. Tests: password hashing, login success/failure, session validation,
   unauthorized access rejected.

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
