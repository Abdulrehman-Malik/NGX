# PROJECT STATE

Last updated: 2026-09-03 11:15
Current phase: Phase 1 — Authentication & Security
Overall status: IN PROGRESS (code complete, unverified against a real DB)

## Completed

**Phase 0** (fully done — see `docs/CHANGELOG.md` for detail): docs/
handoff system, Next.js + TypeScript + Tailwind scaffold, Prisma datasource,
Docker Compose, toolchain verified except `prisma generate`/`next build`
(blocked only by this build sandbox's network allowlist).

**Phase 1 (this session):**
- Prisma auth models: `User`, `Role`, `Permission`, `RolePermission`,
  `UserRole`, `Session`. ID strategy: `cuid()`.
- `src/modules/auth/`: `password.ts`, `session-token.ts`,
  `lockout-policy.ts`, `permissions.ts`, `schemas.ts`, `auth-service.ts`
  (login/logout/resolveSession).
- API routes: `POST /api/auth/login`, `POST /api/auth/logout`,
  `GET /api/auth/me`.
- `src/lib/session-cookie.ts`, `src/lib/current-user.ts` — session
  resolution for server components/route handlers.
- Login UI (`src/app/login/page.tsx`) + design-system primitives
  (`Button`, `Input`, `Label`/`FormField`).
- Home page updated to show signed-in state + logout button.
- `prisma/seed.ts` — creates one super-admin role + admin user.
- 15 passing unit tests (password hashing, lockout policy, permission
  checks) — all pure-function tests, no DB required.
- Added `docs/GIT_WORKFLOW.md` — one branch per module, going forward.

## Currently working on

Nothing in progress. Phase 1 code is written and self-consistent
(typecheck + lint + unit tests pass), but **has never touched a real
database** — this environment has no Docker/Postgres and can't reach
Prisma's binary CDN (see `docs/TEST_STATUS.md`). This is the single most
important thing to verify next.

## Exact next task

On a machine with normal internet + Docker access:
1. `docker compose up -d`
2. `cp .env.example .env` (fill in real `DATABASE_URL`/`SESSION_SECRET`)
3. `npm install && npx prisma generate`
4. `npx prisma migrate dev --name init_auth`
5. `npm run db:seed`
6. `npx tsc --noEmit` again (the earlier pass was against an ungenerated
   Prisma client stub — treat this second run as the real signal)
7. `npm run dev`, manually test: visit `/login`, sign in with the seeded
   admin credentials (printed by the seed script), confirm redirect to `/`
   shows "Signed in as System Administrator", click Log out, confirm
   redirect back to `/login`.
8. If all of the above passes, mark Phase 1 DONE in this file and
   `docs/CURRENT_PHASE.md`, then start Phase 2 (Company/Branch/Warehouse).

## Last completed task

Wrote and self-verified (typecheck/lint/unit-tests) the full Phase 1 auth
code path: models, services, API routes, session handling, login UI,
seed script.

## Known blockers

- No live database available to test against in the environment this was
  built in (no Docker, and Prisma's binary CDN isn't reachable from this
  sandbox). Not a project defect — see `docs/TEST_STATUS.md`. Must be
  resolved by running the "Exact next task" steps above on a normal
  machine before Phase 1 can be considered done.

## Important recent decisions

See `docs/DECISIONS.md`: `cuid()` ID strategy, super-admin permission
bypass (temporary, revisit once the permission catalog is built out), and
the new one-branch-per-module git workflow (`docs/GIT_WORKFLOW.md`).

## Verification

- Typecheck: PASS, but **weak signal** — Prisma client types are
  ungenerated (see caveat in `docs/TEST_STATUS.md`); must re-run after
  `prisma generate` succeeds.
- Lint: PASS
- Unit tests: PASS (15/15 — password, lockout, permissions, smoke)
- Integration/E2E of the actual login flow: NOT RUN (no DB available)
- `npm audit`: 10 findings (1 critical, 6 high, 3 moderate), still
  untriaged — carried over from Phase 0, see `docs/TODO.md`

## Files changed in last session

- `prisma/schema.prisma` (auth models added), `prisma/seed.ts`
- `src/modules/auth/{password,session-token,lockout-policy,permissions,schemas,auth-service}.ts`
- `src/lib/{session-cookie,current-user}.ts`
- `src/app/api/auth/{login,logout,me}/route.ts`
- `src/app/login/page.tsx`, `src/app/page.tsx` (rewritten),
  `src/components/logout-button.tsx`
- `src/components/ui/{button,input,form-field}.tsx`
- `tests/unit/{password,lockout-policy,permissions}.test.ts`
- `package.json` (added `prisma.seed` config)
- `docs/GIT_WORKFLOW.md` (new)
- `docs/{PROJECT_STATE,CURRENT_PHASE,CHANGELOG,TEST_STATUS,TODO,DECISIONS,DB_SCHEMA,API_STATUS,UI_STATUS,HANDOFF}.md`
  (updated), `CLAUDE.md` (updated)

## Do NOT redo

- Do not re-debate the settled Phase 0 decisions (see prior entries in
  `docs/DECISIONS.md`).
- Do not rebuild the auth models/services/routes/UI listed above — they
  exist and are self-consistent. The only remaining work is **verification
  against a real database**, not re-implementation.
- Do not switch away from the super-admin bypass without updating
  `docs/DECISIONS.md` first — it's a deliberate, documented simplification.

## Next session should start here

1. `git checkout -b module/auth` (or `git checkout module/auth` if it
   already exists) per `docs/GIT_WORKFLOW.md` — **this session's Phase 1
   work was committed directly; going forward, module work belongs on its
   own branch.**
2. Run the "Exact next task" verification steps above.
3. Once verified, mark Phase 1 DONE and begin Phase 2 (Company/Branch/
   Warehouse) — see `docs/CURRENT_PHASE.md` for scope, and open a new
   `module/companies-branches` branch for it.
