# CLAUDE HANDOFF

You are continuing an existing enterprise POS/ERP project.

DO NOT restart, redesign, or reread the entire repository.

## Current phase

Phase 0 — Foundation & Architecture (near complete, one verification step
remaining)

## Exact continuation point

Repository is scaffolded (Next.js + TypeScript + Tailwind + Prisma +
Docker Compose), toolchain verified except `prisma generate`/`next build`,
which failed only due to a sandboxed environment's network allowlist
blocking Prisma's binary CDN — needs one confirmation run on a normal
machine, then Phase 1 (auth) begins.

## Completed in the previous session

- Read both source specs, presented architecture, got approval on open
  decisions (Next.js API routes, generic seed data, local/Docker
  deployment).
- Built the full `docs/` handoff system.
- Scaffolded the Next.js app, Prisma datasource (no models yet), Docker
  Compose for Postgres, `.env.example`, Vitest with a passing smoke test.
- Archived pre-existing repo content (`login.html`, stray lockfile) to
  `docs/legacy/`.

## Work remaining in this phase

- Confirm `npx prisma generate` and `npm run build` succeed with normal
  internet access.
- Confirm `docker compose up -d` works and `/api/health` reports
  `db: "ok"` once `.env` is configured.
- Mark Phase 0 DONE in `docs/PROJECT_STATE.md`.

## Next action

Run the Phase 0 verification steps above. If they pass, immediately begin
Phase 1: create the `User`/`Role`/`Permission`/`Session` Prisma models and
migration (see `docs/CURRENT_PHASE.md` for the full Phase 1 task list —
start with just the models + migration as one coherent increment).

## Relevant files

- `docs/PROJECT_STATE.md`, `docs/CURRENT_PHASE.md`, `docs/TEST_STATUS.md`
- `prisma/schema.prisma`
- `package.json`

## Database state

- Latest migration: none (no models yet)
- Pending migration: Phase 1 auth models, not yet written
- Seed status: no seed script exists yet (`prisma/seed.ts` referenced in
  `package.json` but not created)

## Verification status

- Build: FAIL (sandbox network restriction only, see `docs/TEST_STATUS.md`)
- Typecheck: PASS
- Tests: PASS (1/1, smoke test only)
- Known failures: `prisma generate`/`next build` in sandboxed environments
  without access to `binaries.prisma.sh`

## Important decisions

See `docs/DECISIONS.md` — Next.js API routes (not separate backend),
Prisma, custom session auth (not NextAuth), local/Docker deployment,
generic retail/wholesale seed data.

## Constraints

- Preserve existing APIs unless a documented breaking change is approved.
- Do not change database semantics casually.
- Do not duplicate business logic.
- Enforce authorization server-side.
- Financial and inventory transactions must be atomic.
- Do not delete posted financial transactions; use reversal/cancellation
  workflows.
