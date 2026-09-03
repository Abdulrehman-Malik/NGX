# TEST_STATUS

Build/test/migration status and known failures. Update every implementation
session.

## Last checked: 2026-09-03 (Phase 1 — auth foundation)

| Check | Result | Notes |
|---|---|---|
| `npm install` | PASS | 440 packages installed. 10 audit findings (3 moderate, 6 high, 1 critical) reported by npm — **not yet triaged**, see Known Issues below. |
| `npx vitest run` | PASS | 15/15 tests (password hashing, lockout policy, permission checks, smoke) |
| `npx tsc --noEmit` | PASS* | *Caveat below — weaker than normal until Prisma client is generated |
| `npx next lint` | PASS | No warnings or errors |
| `npx prisma generate` | **FAIL (environment-specific)** | Fails fetching `schema-engine`/`libquery_engine` binaries from `binaries.prisma.sh` — this sandbox's network allowlist doesn't include that domain. Not expected to fail on a normal machine with full internet access. **Must be re-verified outside this sandbox.** |
| `npx next build` | **FAIL (downstream of above)** | Same root cause — `@prisma/client` never finished generating, so any page importing `prisma` fails at "Collecting page data". Not a code defect. |
| DB migrations | NOT RUN | No local Postgres/Docker available in this sandbox; no `prisma migrate dev` has been run against a real database yet. **The auth schema in `prisma/schema.prisma` has never actually been applied to or verified against a real Postgres instance.** |

### ⚠️ Important caveat: Prisma types are unverified

Because `prisma generate` has never succeeded in this environment,
`@prisma/client` has no generated model types — `tsc --noEmit` is passing
against a loosely-typed (effectively `any`-ish) `PrismaClient` stub, not the
real generated types for `User`, `Session`, `Role`, etc. This means:

- Field name typos, wrong relation names, or incorrect `include`/`select`
  shapes in `src/modules/auth/auth-service.ts` or elsewhere **would not
  currently be caught by typecheck**.
- The next session (ideally with real internet access) **must** run
  `npx prisma generate` and then `npx tsc --noEmit` again, and treat the
  *second* typecheck as the real verification — not this one.
- Do not treat "PASS" above as proof the Prisma queries are correct; treat
  it as proof the surrounding TypeScript (non-Prisma-dependent code) is
  syntactically sound.

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
