# PROJECT STATE

Last updated: 2026-09-03 07:00
Current phase: Phase 0 — Foundation & Architecture
Overall status: IN PROGRESS (near complete)

## Completed

- Read and internalized both source specs (moved into `docs/` for
  reference): the master requirements PDF and the phase handoff playbook.
- Presented architecture proposal (tech stack, module boundaries, DB
  strategy, multi-company/branch isolation model, accounting/inventory
  engine design, folder structure, roadmap, risks) and got sign-off on the
  open decisions (Next.js API routes, generic retail/wholesale demo,
  local/Docker deployment target).
- Set up full `docs/` handoff system described in the Playbook.
- Archived pre-existing repo content (`login.html`, stray
  `package-lock.json`) to `docs/legacy/` — superseded by the real app.
- Scaffolded Next.js 14 (App Router) + TypeScript + Tailwind project.
- Added Prisma with PostgreSQL datasource (no models yet).
- Added `docker-compose.yml` for local Postgres.
- Added `.env.example`.
- Added Vitest test runner + one smoke test.
- Verified toolchain: `npm install`, `tsc --noEmit`, `next lint`, `vitest
  run` all pass. `next build` and `prisma generate` cannot fully complete
  in the current build sandbox because it can't reach Prisma's binary CDN
  (`binaries.prisma.sh`) — expected to work normally on a machine with full
  internet access. See `docs/TEST_STATUS.md` for exact detail.

## Currently working on

- Nothing in progress — Phase 0 verification is the last remaining item.

## Exact next task

- Run `npm install && npx prisma generate && npm run build` on a machine
  with normal internet access to confirm the one sandbox-only failure
  resolves, then mark Phase 0 fully DONE in this file.
- After that: begin Phase 1 — Authentication & Security (users, roles,
  permissions foundation, login screen, session management).

## Last completed task

- Toolchain verification (typecheck/lint/tests passing; build blocked only
  by sandbox network restriction on Prisma binaries).

## Known blockers

- None that block real development. The Prisma binary fetch failure is a
  property of this specific sandboxed tool environment, not the project —
  confirm it's a non-issue once running locally.

## Important recent decisions

- See `docs/DECISIONS.md` (Next.js API routes over separate backend,
  Prisma, custom session auth over NextAuth, local/Docker deployment,
  generic seed data, legacy files archived not deleted).

## Verification

- Build: FAIL (sandbox-only — Prisma engine binary blocked by network
  allowlist; not a code issue)
- Typecheck: PASS
- Lint: PASS
- Tests: PASS (1/1 smoke test)
- DB migrations: NOT YET APPLICABLE (no models yet; DB itself not started
  in this sandbox — no Docker available here either)

## Files changed in last session

- `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.ts`,
  `postcss.config.js`, `.eslintrc.json`, `.gitignore`, `.env.example`,
  `docker-compose.yml`, `vitest.config.ts`
- `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`,
  `src/app/api/health/route.ts`, `src/lib/db.ts`
- `prisma/schema.prisma`
- `tests/unit/smoke.test.ts`
- `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`, `docs/DB_SCHEMA.md`,
  `docs/API_STATUS.md`, `docs/UI_STATUS.md`, `docs/PROJECT_STATE.md`,
  `docs/CURRENT_PHASE.md`, `docs/CHANGELOG.md`, `docs/TEST_STATUS.md`,
  `docs/TODO.md`, `docs/HANDOFF.md`
- Moved: `login.html` → `docs/legacy/login.html`,
  `package-lock.json` → `docs/legacy/old-package-lock.json`,
  both spec source documents → `docs/`

## Do NOT redo

- Do not re-debate Next.js-API-routes-vs-separate-backend, Prisma-vs-other
  ORM, or NextAuth-vs-custom-auth — these are settled in
  `docs/DECISIONS.md`. Revisit only if a documented reason emerges.
- Do not re-scaffold the Next.js project or re-run the architecture
  presentation/approval step — it's done.

## Next session should start here

- Confirm `npm run build` and `npx prisma generate` succeed outside this
  sandbox (normal internet access). Mark Phase 0 DONE.
- Start Phase 1: design `users`/`roles`/`permissions`/`sessions` Prisma
  models, migration, password hashing service, login API route, login UI
  screen, session middleware. See `docs/CURRENT_PHASE.md`.
