# CHANGELOG

Chronological implementation record. Append entries; do not rewrite
history.

## 2026-09-03 — Phase 1: Authentication foundation (code complete, unverified against a live DB)

- Added Prisma auth models: `User`, `Role`, `Permission`,
  `RolePermission`, `UserRole`, `Session`. ID strategy: `cuid()`.
- Added `src/modules/auth/`: password hashing (bcrypt), opaque session
  tokens (SHA-256 hashed at rest), account lockout policy (5 failed
  attempts → 15 minute lock), permission checks with a super-admin bypass,
  Zod input schemas, and the `AuthService` tying it together
  (login/logout/resolveSession).
- Added `POST /api/auth/login`, `POST /api/auth/logout`,
  `GET /api/auth/me` route handlers.
- Added `src/lib/session-cookie.ts` and `src/lib/current-user.ts` for
  resolving the authenticated user server-side.
- Added the first design-system primitives (`Button`, `Input`,
  `Label`/`FormField`) and the login screen (`src/app/login/page.tsx`).
- Updated the home page to show signed-in state and a logout action,
  as an end-to-end smoke check of the whole flow.
- Added `prisma/seed.ts` seeding one super-admin role + admin user.
- Added 15 passing unit tests covering password hashing, lockout policy,
  and permission checks (all pure-function, no DB required).
- Added `docs/GIT_WORKFLOW.md`: one branch per module going forward
  (`module/<name>`), documented in `docs/DECISIONS.md`.
- **Not yet done:** running this against a real Postgres instance —
  no Docker/DB available in the environment this was written in. See
  `docs/TEST_STATUS.md` and `docs/TODO.md` for the exact verification
  steps still required before Phase 1 can be marked done.

## 2026-09-03 — Phase 0: Foundation scaffolded

- Archived pre-existing standalone `login.html` and stray
  `package-lock.json` to `docs/legacy/` (predate this project's actual
  scope).
- Moved both source specification documents into `docs/`.
- Created the full `docs/` handoff/playbook system (`PROJECT_STATE.md`,
  `CURRENT_PHASE.md`, `ARCHITECTURE.md`, `DECISIONS.md`, `CHANGELOG.md`,
  `TEST_STATUS.md`, `TODO.md`, `HANDOFF.md`, `DB_SCHEMA.md`,
  `API_STATUS.md`, `UI_STATUS.md`).
- Scaffolded Next.js 14 (App Router) + TypeScript + Tailwind CSS.
- Added Prisma with a PostgreSQL datasource (no models yet — intentional,
  models begin in Phase 1).
- Added a Prisma client singleton (`src/lib/db.ts`) to avoid dev-mode
  connection-pool exhaustion.
- Added `/api/health` route as a basic app + DB connectivity check.
- Added `docker-compose.yml` for local PostgreSQL.
- Added `.env.example` with `DATABASE_URL` and `SESSION_SECRET`
  placeholders.
- Added Vitest with a passing smoke test.
- Verified: `npm install`, `tsc --noEmit`, `next lint`, `vitest run` all
  pass. `next build`/`prisma generate` blocked in this specific sandbox by
  a network allowlist that doesn't include Prisma's binary CDN — expected
  to work normally elsewhere (see `docs/TEST_STATUS.md`).
