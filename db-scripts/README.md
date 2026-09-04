# db-scripts

Hand-maintained SQL scripts for database engines other than the one the
application actually runs on day to day.

## Why this exists

The primary, live schema for this application is **PostgreSQL, managed
through Prisma** (`prisma/schema.prisma` + `prisma migrate`). That is the
only schema the running app talks to — nothing in this directory is
executed automatically by the application, by Prisma, or by any build
step.

The original architecture requirements (see
`docs/Enterprise_Multi-Company_Multi-Branch_POS_and_ERP_Architecture.pdf`)
call for the data model to stay portable beyond Postgres-only features, so
that migrating to SQL Server or Oracle later doesn't require redesigning
the domain model. `db-scripts/sqlserver/` is a **manually maintained T-SQL
mirror** of the Prisma schema, kept in sync by hand, for teams that need to
evaluate, test against, or eventually deploy on SQL Server.

## Structure

```
db-scripts/
  sqlserver/
    CONNECTION.md          <- how to connect to / run scripts against SQL Server
    001_init_auth.sql       <- mirrors the Phase 1 Prisma migration (auth tables)
    002_...                 <- one file per phase, added as phases land
```

## Maintenance rule

**Every time `prisma/schema.prisma` changes, the corresponding
`db-scripts/sqlserver/NNN_*.sql` file must be added or updated in the same
commit/PR.** Do not let these drift apart — an out-of-sync SQL Server
script is worse than none, because it will look authoritative and be
wrong.

Naming convention: `NNN_<short-description>.sql`, numbered sequentially
and named after the phase/module it corresponds to, matching the Prisma
migration name where practical (e.g. Prisma migration `init_auth` →
`db-scripts/sqlserver/001_init_auth.sql`).

## Script index

| File | Corresponds to | Prisma migration | Status |
|---|---|---|---|
| `sqlserver/001_init_auth.sql` | Phase 1 — Authentication (`User`, `Role`, `Permission`, `RolePermission`, `UserRole`, `Session`) | `init_auth` (not yet run against Postgres either — see `docs/TEST_STATUS.md`) | Written, **never executed against a real SQL Server instance** |
| `sqlserver/002_seed_admin_reference.sql` | Mirrors `prisma/seed.ts` | n/a (seed, not migration) | Written; requires manually pasting in a real bcrypt hash before use — see file header |

## What these scripts are not

- Not an alternate live backend for the current app — the app's `DATABASE_URL`
  and Prisma client are Postgres-only right now (see `docs/DECISIONS.md`).
- Not auto-generated from Prisma — Prisma doesn't support multi-provider
  schema output, so translation is manual. Double-check types/constraints
  against `prisma/schema.prisma` whenever either changes.
- Not tested/CI-verified — there is currently no automated check that these
  two schemas match. Treat this as a documentation/portability artifact,
  and verify manually before relying on it for a real SQL Server
  deployment.
