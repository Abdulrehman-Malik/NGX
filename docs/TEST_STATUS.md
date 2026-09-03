# TEST_STATUS

Build/test/migration status and known failures. Update every implementation
session.

## Last checked: 2026-09-03

| Check | Result | Notes |
|---|---|---|
| `npm install` | PASS | 440 packages installed. 10 audit findings (3 moderate, 6 high, 1 critical) reported by npm — **not yet triaged**, see Known Issues below. |
| `npx tsc --noEmit` | PASS | |
| `npx next lint` | PASS | No warnings or errors |
| `npx vitest run` | PASS | 1/1 test (smoke test only so far) |
| `npx prisma generate` | **FAIL (environment-specific)** | Fails fetching `schema-engine`/`libquery_engine` binaries from `binaries.prisma.sh` — this sandbox's network allowlist doesn't include that domain. Not expected to fail on a normal machine with full internet access. **Must be re-verified outside this sandbox before Phase 0 is marked fully done.** |
| `npx next build` | **FAIL (downstream of above)** | Build compiles and type-checks successfully; fails only at "Collecting page data" for `/api/health` because `@prisma/client` never finished generating. Same root cause as above — not a code defect. |
| DB migrations | NOT RUN | No Prisma models exist yet (Phase 0 has no business schema by design). No local Postgres instance available in this sandbox (no Docker) to test `docker-compose.yml` itself. |

## Known Issues

- **npm audit: 10 vulnerabilities (1 critical, 6 high, 3 moderate)** in
  transitive dependencies — not yet reviewed. Run `npm audit` for detail
  and triage before this goes anywhere near production. Do not blindly run
  `npm audit fix --force` without checking for breaking changes first.
- **Prisma binary fetch** — re-verify `npx prisma generate` and
  `npm run build` on a normal machine/CI runner with unrestricted internet
  access. If it fails there too, that's a real bug to investigate (unlikely
  — this is a known sandbox network restriction, not a project issue).
- **`docker-compose.yml` untested** — was written but never actually run
  (no Docker available in the sandbox this was built in). Verify
  `docker compose up -d` brings up Postgres cleanly and the app can connect
  via `DATABASE_URL` before relying on it.
