# ARCHITECTURE

Stable architecture reference. Update only when the architecture itself
changes (not on every feature). See `docs/DECISIONS.md` for the reasoning
behind individual choices, and
`docs/Enterprise_Multi-Company_Multi-Branch_POS_and_ERP_Architecture.pdf`
for the full original requirements.

## System Diagram

```
Browser (POS Terminal UI | Back-Office/Admin UI)
        │ HTTPS
Next.js (App Router) — Frontend
        │
API Layer (Next.js Route Handlers)
  Auth middleware → Authorization middleware → Zod validation → Service call
        │
Domain Service Layer
  AccountingPostingService · InventoryService · PricingService
  SalesService · PurchaseService · CustomerService · ...
        │
Data Access Layer — Prisma Client
        │
PostgreSQL (primary; schema kept portable to SQL Server/Oracle)
```

## Technology Decisions

| Layer | Choice |
|---|---|
| Frontend | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS + internal design system components |
| Backend | Next.js Route Handlers (API routes), service layer kept framework-agnostic for future extraction |
| ORM | Prisma |
| Database | PostgreSQL (local via Docker for now) |
| Auth | Custom credentials + hashed passwords (bcrypt) + server-side sessions in DB, session cookie httpOnly/signed. No NextAuth — needed full control over embedding company/branch/role/permission scope. |
| Validation | Zod |
| Testing | Vitest (unit/integration), Playwright (E2E, added when POS UI exists) |

See `docs/DECISIONS.md` for the reasoning behind each of these.

## Module Boundaries

```
auth → companies → branches → warehouses → users/roles/permissions
                         │
   ┌─────────────────────┼─────────────────────┐
   ▼                     ▼                     ▼
master-data      inventory-engine      accounting-engine
   │                     │                     │
   └─────────┬───────────┴──────────┬──────────┘
             ▼                      ▼
          sales/POS             purchasing
             │                      │
             └──────────┬───────────┘
                        ▼
              reports & dashboard
                        │
                        ▼
       workflow / approvals / audit / settings
```

Rule: a module never writes directly into another module's tables. Sales
never touches `stock_balances` directly — it calls `InventoryService.sale()`.
Every domain service that posts financial impact goes through
`AccountingPostingService`.

## Multi-Company / Multi-Branch Data Isolation

- Master data (items, customers, suppliers, etc.) is **shared**, not
  duplicated per branch. Branch-specific pricing/stock live in their own
  scoped tables.
- Every transactional table carries `companyId` + `branchId` (+ `warehouseId`
  where relevant).
- A `ScopeContext` (companyId, accessible branchIds, permissions) is resolved
  server-side from the session on every request and passed into every
  service call. Services must not run without it.
- Frontend hiding of UI elements is UX only — every mutating server action
  re-checks permission and scope. Never trust the client.

## Inventory Principle

Stock is never "just a number." `InventoryService` writes an immutable
`inventory_transactions` row for every movement, then updates the
`stock_balances` cache in the same DB transaction. Current stock must always
be explainable by replaying the transaction history for that item/branch.

## Accounting Principle

All financial postings go through `AccountingPostingService`, which builds
journal lines from a structured request and asserts
`SUM(debits) == SUM(credits)` before commit, in the same DB transaction as
the originating document (sale, purchase, payment, etc.).

## Folder Structure

```
/docs                     ← this handoff/playbook system
/prisma                   ← schema.prisma, migrations, seed.ts
/src
  /app                    ← Next.js routes (pages + API route handlers)
  /modules                ← domain modules (auth, companies, sales, ...)
  /components             ← shared design-system UI components
  /lib                    ← cross-cutting: db client, scope-context, errors
  /types
  /hooks
  /config
/tests
  /unit /integration /e2e
```

## Deployment (current target)

Local development via Docker Compose (Postgres container) + `npm run dev`.
Cloud/production deployment architecture is deferred to Phase 12 per
`docs/CURRENT_PHASE.md`'s phase plan; do not build cloud-specific
infrastructure prematurely.
