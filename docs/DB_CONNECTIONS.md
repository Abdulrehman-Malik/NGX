# DB_CONNECTIONS

Overview of database connectivity for this project. This ties together
the primary (Postgres/Prisma) setup and the secondary SQL Server
portability scripts — see each linked doc for full detail.

## Primary: PostgreSQL (via Prisma) — what the application actually runs on

This is the only database the running app talks to.

- **Local setup:** `docker compose up -d` starts a Postgres container
  (see `docker-compose.yml`). Default credentials are in `.env.example`
  under `DATABASE_URL` — copy it to `.env` and adjust if needed.
- **Schema management:** `prisma/schema.prisma` is the single source of
  truth. Apply changes with `npx prisma migrate dev --name <description>`.
- **Connecting with a GUI:** `npx prisma studio` opens a browser-based data
  browser against whatever `DATABASE_URL` points to. Or use any Postgres
  client (pgAdmin, TablePlus, DBeaver) with the same connection details
  from `.env`.
- **Full step-by-step for a non-developer:** see `HOW_TO_RUN.txt` at the
  repo root.

## Secondary: SQL Server — manually maintained portability mirror

Not used by the running application. Exists because the original
architecture requirements call for the schema to stay portable beyond
Postgres-only features (see
`docs/Enterprise_Multi-Company_Multi-Branch_POS_and_ERP_Architecture.pdf`).

- Scripts: `db-scripts/sqlserver/*.sql`
- Connection instructions: `db-scripts/sqlserver/CONNECTION.md`
- Maintenance rules (keep in sync with Prisma schema changes):
  `db-scripts/README.md`

## If SQL Server support is ever added to the running application itself

That would be a real architectural change (Prisma would need a second
datasource/client, or a switch, plus a new `SQLSERVER_DATABASE_URL`-style
env var) — not something to do casually. If it happens, update this file,
`docs/ARCHITECTURE.md`, and `docs/DECISIONS.md` together, in the same
change.
