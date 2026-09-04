# CLAUDE HANDOFF

You are continuing an existing enterprise POS/ERP project.

DO NOT restart, redesign, or reread the entire repository.

## Current phase

Phase 1 — Authentication & Security (code complete, **unverified against a
real database**)

## Git workflow — read this before writing any code

**Read `docs/GIT_WORKFLOW.md`.** Going forward, module work happens on
`module/<name>` branches, never directly on `main`. Run `git branch -a`
first — if `module/auth` already exists, check it out and continue there;
otherwise create it before doing any further Phase 1 work.

## Ongoing obligation: keep db-scripts/sqlserver in sync

Any change to `prisma/schema.prisma` must be mirrored in
`db-scripts/sqlserver/NNN_*.sql` in the same commit — see
`db-scripts/README.md`. Phase 2 will need a new `002_*.sql` (the seed
reference script currently occupies that number — renumber it).

## Exact continuation point

All Phase 1 code is written and internally consistent (typecheck, lint,
and 15 unit tests all pass), but it has **never been run against a live
Postgres instance** — the environment it was built in had no Docker and
couldn't reach Prisma's binary CDN. This is the only thing standing between
"code written" and "phase done."

## Completed in the previous session

- Prisma auth models (`User`, `Role`, `Permission`, `RolePermission`,
  `UserRole`, `Session`), `cuid()` IDs.
- `src/modules/auth/`: password hashing, session tokens, lockout policy,
  permission checks (with super-admin bypass), Zod schemas, `AuthService`.
- `/api/auth/login`, `/api/auth/logout`, `/api/auth/me` routes.
- Session cookie + current-user resolution helpers.
- Login screen + first design-system primitives (Button/Input/FormField).
- Home page shows signed-in state; logout button.
- `prisma/seed.ts` (super-admin role + admin user).
- 15 passing unit tests (pure-function only — no DB dependency).
- `docs/GIT_WORKFLOW.md` added (one branch per module).

## Work remaining in this phase

In order:

1. On a machine with real internet + Docker: `docker compose up -d`,
   `cp .env.example .env` (fill in values), `npm install`,
   `npx prisma generate`, `npx prisma migrate dev --name init_auth`.
2. `npm run db:seed` — confirm the admin user is created (credentials are
   printed to the console; override via `SEED_ADMIN_*` env vars).
3. Re-run `npx tsc --noEmit` — the previous pass was against an
   ungenerated Prisma client stub (see `docs/TEST_STATUS.md` caveat);
   treat this run as the real check and fix anything it surfaces.
4. `npm run dev`, manually verify: `/login` → sign in with seeded admin →
   redirected to `/` showing "Signed in as System Administrator" → click
   Log out → redirected to `/login`.
5. Add integration tests for `auth-service.ts` (login/logout/
   resolveSession) now that a DB is available.
6. Triage `npm audit` (1 critical, 6 high, 3 moderate as of last check —
   carried over from Phase 0, still not done).
7. Update `docs/PROJECT_STATE.md` and `docs/CURRENT_PHASE.md` marking
   Phase 1 DONE.

## Next action

Start at step 1 above. If everything through step 6 passes, mark Phase 1
done and begin Phase 2 (Company/Branch/Warehouse) on a new
`module/companies-branches` branch — see `docs/CURRENT_PHASE.md` (will
need a new Phase 2 section written, following the same pattern as Phase
1's).

## Relevant files

- `docs/PROJECT_STATE.md`, `docs/CURRENT_PHASE.md`, `docs/TEST_STATUS.md`
- `docs/GIT_WORKFLOW.md`
- `prisma/schema.prisma`, `prisma/seed.ts`
- `src/modules/auth/`

## Database state

- Latest migration: **none has actually been run** — `prisma/schema.prisma`
  has the Phase 1 models defined but they've never been applied to a real
  database. Do not assume a `init_auth` migration file exists yet; you
  need to create it with `prisma migrate dev --name init_auth`.
- Seed status: `prisma/seed.ts` exists but has never been executed
  successfully (no DB to run it against yet).

## Verification status

- Typecheck: PASS (weak signal — see caveat above)
- Lint: PASS
- Unit tests: PASS (15/15, pure-function only)
- Build: FAIL (same root cause — Prisma client never generated in that
  sandbox)
- Integration/E2E: NOT RUN

## Important decisions

See `docs/DECISIONS.md` — in addition to Phase 0's decisions: `cuid()` IDs,
super-admin permission bypass (temporary, revisit once permission catalog
is built out), one-branch-per-module git workflow.

## Constraints

- Preserve existing APIs unless a documented breaking change is approved.
- Do not change database semantics casually.
- Do not duplicate business logic.
- Enforce authorization server-side.
- Financial and inventory transactions must be atomic.
- Do not delete posted financial transactions; use reversal/cancellation
  workflows.
- Never store plaintext passwords or raw session tokens at rest.
