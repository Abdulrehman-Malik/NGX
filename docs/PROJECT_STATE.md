# PROJECT STATE

Last updated: 2026-09-03 12:30
Current phase: Phase 1 — Authentication & Security (auth code) /
cross-cutting infra (db-scripts + onboarding docs)
Overall status: Phase 1 auth IN PROGRESS (unverified against a real DB);
db-scripts + onboarding docs DONE

## Completed

**Phase 0** (fully done — see `docs/CHANGELOG.md`): docs/ handoff system,
Next.js + TypeScript + Tailwind scaffold, Prisma datasource, Docker
Compose, toolchain verified except `prisma generate`/`next build`.

**Phase 1 auth (code complete, unverified against a real DB):** Prisma
auth models, `src/modules/auth/` (password, session tokens, lockout
policy, permissions, schemas, AuthService), login/logout/me API routes,
session cookie + current-user helpers, login UI + design-system
primitives, seed script, 15 passing unit tests.

**Cross-cutting infra (this session, done):**
- `db-scripts/sqlserver/` — manually maintained T-SQL mirror of the
  Phase 1 Prisma schema (`001_init_auth.sql`), a seed reference script
  (`002_seed_admin_reference.sql`), and connection instructions
  (`CONNECTION.md`). `db-scripts/README.md` documents the maintenance
  obligation (update in lockstep with `prisma/schema.prisma`).
- `docs/DB_CONNECTIONS.md` — overview tying together Postgres (primary)
  and SQL Server (portability mirror) connectivity.
- `HOW_TO_RUN.txt` — plain-language, non-developer step-by-step guide to
  running the app locally, at the repo root.
- `CLAUDE.md` and `README.md` updated to point to both.

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

- `db-scripts/README.md`, `db-scripts/sqlserver/{001_init_auth,002_seed_admin_reference}.sql`,
  `db-scripts/sqlserver/CONNECTION.md` (all new)
- `docs/DB_CONNECTIONS.md` (new)
- `HOW_TO_RUN.txt` (new, repo root)
- `CLAUDE.md`, `README.md` (updated to reference the above)
- `docs/DECISIONS.md`, `docs/PROJECT_STATE.md`, `docs/CHANGELOG.md`,
  `docs/TODO.md`, `docs/HANDOFF.md` (updated)

## Do NOT redo

- Do not re-debate the settled Phase 0 decisions (see prior entries in
  `docs/DECISIONS.md`).
- Do not rebuild the auth models/services/routes/UI listed above — they
  exist and are self-consistent. The only remaining work is **verification
  against a real database**, not re-implementation.
- Do not switch away from the super-admin bypass without updating
  `docs/DECISIONS.md` first — it's a deliberate, documented simplification.
- Do not recreate `db-scripts/sqlserver/001_init_auth.sql` or
  `HOW_TO_RUN.txt` — they exist. Do update the SQL Server script whenever
  `prisma/schema.prisma` changes (see `db-scripts/README.md`), and update
  `HOW_TO_RUN.txt` if setup steps change.

## Next session should start here

1. `git checkout -b module/auth` (or `git checkout module/auth` if it
   already exists) per `docs/GIT_WORKFLOW.md` for any further Phase 1 auth
   work — this session's auth work was committed directly to `main` before
   the branch policy was written; the `db-scripts`/onboarding work in this
   session used its own short-lived branch
   (`infra/db-scripts-and-onboarding`) per the "cross-cutting → branch
   anyway" guidance.
2. Run the Phase 1 "Exact next task" verification steps (see above).
3. Once verified, mark Phase 1 DONE and begin Phase 2 (Company/Branch/
   Warehouse) — see `docs/CURRENT_PHASE.md`, and remember to add a
   `db-scripts/sqlserver/002_...sql` companion script (renumber the
   existing seed reference script if needed) when Phase 2's Prisma models
   land, per `db-scripts/README.md`.
