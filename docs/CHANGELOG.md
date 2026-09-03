# CHANGELOG

Chronological implementation record. Append entries; do not rewrite
history.

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
