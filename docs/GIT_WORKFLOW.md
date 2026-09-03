# GIT WORKFLOW

This project uses **one branch per module** (roughly, one branch per phase
in `docs/CURRENT_PHASE.md`). Any agent or developer starting work on a new
module must follow this before writing code.

## Rule

**Never commit new module work directly to `main`.** Create a branch first.

```bash
git checkout main
git pull origin main
git checkout -b module/<module-name>
```

### Naming convention

`module/<short-name>`, matching the module/phase it implements:

| Phase | Branch name |
|---|---|
| Phase 1 — Authentication & Security | `module/auth` |
| Phase 2 — Company/Branch/Warehouse | `module/companies-branches` |
| Phase 3 — Master data | `module/master-data` |
| Phase 4 — Inventory engine | `module/inventory` |
| Phase 5 — POS & Sales | `module/sales-pos` |
| Phase 6 — Purchasing | `module/purchasing` |
| Phase 7 — Accounting | `module/accounting` |
| Phase 8 — Reports & dashboard | `module/reports` |
| Phase 9 — Approvals/audit/workflow | `module/workflow` |
| Phase 10 — Integrations & hardware | `module/integrations` |
| Phase 11 — Hardening & testing | `module/hardening` |
| Phase 12 — Deployment & operations | `module/deployment` |

If a module needs to be split into multiple sessions/sub-slices, keep
working on the **same branch** across those sessions (don't create a new
branch per session) — the branch maps to the module, not to a single
sitting. Use `docs/HANDOFF.md` to resume correctly on the right branch:

```bash
git checkout module/<module-name>
git pull origin module/<module-name>
```

## Workflow

1. `git checkout -b module/<name>` from an up-to-date `main`.
2. Do the module's work, committing incrementally with clear messages
   (see commit message convention below).
3. Update the relevant `docs/*.md` files as part of the same branch (state,
   changelog, test status, decisions) — documentation changes ship with the
   code they describe, not as an afterthought on `main`.
4. Before merging: confirm the module's "remaining before phase can be
   marked DONE" checklist in `docs/CURRENT_PHASE.md` is satisfied (tests
   passing, docs updated, etc).
5. Merge to `main` (fast-forward or merge commit — either is fine for a
   solo/small-team flow like this; don't force-push over `main`).
6. Delete the module branch once merged, unless it's still being actively
   extended.

## Commit message convention

```
<type>(<module>): <short summary>

<optional longer body>
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.

Examples:
- `feat(auth): add login/logout API routes and session resolution`
- `docs(auth): update PROJECT_STATE and TEST_STATUS for phase 1`
- `fix(inventory): correct stock balance calculation on transfer`

## What stays on `main` directly

Only true cross-cutting, non-module changes belong directly on `main`
without a module branch: this workflow doc itself, root config files that
apply repo-wide (e.g. `.gitignore`), and emergency fixes to something
already merged and broken. When in doubt, branch anyway — branching has no
real cost here.
