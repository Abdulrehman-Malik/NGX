# CLAUDE.md

This file is the entry point for any AI agent (Claude, Claude Code, or
otherwise) picking up work on this repository.

## Read these first, in this order

1. `docs/PROJECT_STATE.md` — current phase, what's done, exact next task
2. `docs/HANDOFF.md` — compact continuation prompt for a new session
3. `docs/ARCHITECTURE.md` — stable architecture reference
4. `docs/DECISIONS.md` — why key technical choices were made
5. `docs/GIT_WORKFLOW.md` — **branch per module, required before writing
   any code** — never commit new module work straight to `main`
6. `docs/DB_CONNECTIONS.md` — database connectivity overview (Postgres
   primary + SQL Server portability mirror in `db-scripts/`)
7. `HOW_TO_RUN.txt` — plain-language, non-developer step-by-step guide to
   running the app locally (point non-technical people here)

**Do not restart the project or redesign completed work.** If code/
migrations and documentation disagree, code wins — fix the docs, don't
rewrite the code to match stale docs.

## What this project is

NGX is an enterprise multi-company, multi-branch POS (Point of Sale) and
ERP system: sales, inventory, purchasing, accounting, customers/suppliers,
and reporting, designed to be reusable across different business types
(retail, wholesale, pharmacy, electronics, etc.) rather than built for one
specific business.

Full original requirements: `docs/Enterprise_Multi-Company_Multi-Branch_POS_and_ERP_Architecture.pdf`
Multi-session development process: `docs/Claude_POS_Phase_Handoff_Playbook.docx`

## Tech stack

Next.js 14 (App Router) + TypeScript + Tailwind CSS, Prisma + PostgreSQL,
custom session-based auth. Full reasoning in `docs/ARCHITECTURE.md` and
`docs/DECISIONS.md`.

## How to run locally

```bash
cp .env.example .env          # fill in real values
docker compose up -d          # starts local Postgres
npm install
npx prisma generate
npm run dev                   # http://localhost:3000
```

## Development process for this repo

This project follows a strict phase-by-phase handoff process (see
`docs/Claude_POS_Phase_Handoff_Playbook.docx` for the full rationale):

- Work proceeds one phase at a time per `docs/CURRENT_PHASE.md`.
- Every session updates `docs/PROJECT_STATE.md`, `docs/CHANGELOG.md`, and
  `docs/TEST_STATUS.md` before ending.
- `docs/HANDOFF.md` always contains a ready-to-paste continuation prompt
  for the next session/account.
- Critical invariants (double-entry accounting, server-side authorization,
  atomic transactions, immutable posted records) are non-negotiable — see
  `docs/ARCHITECTURE.md`.

## Legacy content

`docs/legacy/` contains a standalone `login.html` and a stray
`package-lock.json` created before this project's real scope was defined.
They're archived for reference only and are not part of the active app.
