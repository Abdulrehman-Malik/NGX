# DB_SCHEMA

Current tables, relationships, indexes, and posting rules. Update whenever
`prisma/schema.prisma` changes. This should always match the actual schema
file — if they disagree, the schema file wins (see `docs/HANDOFF.md`
priority-of-truth rule).

## Current State (Phase 1, in progress)

Auth models are defined in `prisma/schema.prisma` (Prisma model names shown
— actual table names follow Prisma's default mapping unless `@@map` is
added later):

- **`User`** — `username`, `email` (both unique), `passwordHash`,
  `fullName`, `isActive`, `failedLoginAttempts`, `lockedUntil`,
  `lastLoginAt`, standard audit columns, `deletedAt` (soft delete).
  Company/branch scoping intentionally **not** added yet — Phase 2.
- **`Role`** — `code` (unique), `name`, `description`, `isSuperAdmin`
  (bypasses permission checks — see `docs/DECISIONS.md`).
- **`Permission`** — `code` (unique, e.g. `sales.invoice.create`),
  `module`, `action`, `description`. Empty catalog for now; filled in
  module-by-module.
- **`RolePermission`** — join table, `@@unique([roleId, permissionId])`.
- **`UserRole`** — join table, `@@unique([userId, roleId])`.
- **`Session`** — `tokenHash` (unique, SHA-256 of the opaque cookie token —
  raw token is never stored), `expiresAt`, `revokedAt`, `ipAddress`,
  `userAgent`.

**⚠️ This schema has never been applied to a real database.** No
`prisma migrate dev` has been run (no Postgres/Docker in the environment it
was written in). Treat it as unverified until a migration has actually run
successfully — see `docs/TEST_STATUS.md`.

ID strategy: `cuid()` on every model (see `docs/DECISIONS.md`).

## Planned Table Groups (introduced phase-by-phase)

These will be documented here in detail as each phase lands — this is a
preview of scope from the master requirements, not a finalized schema.

- **Phase 2 — Org:** `companies`, `branches`, `warehouses`, `user_branches`
- **Phase 3 — Master data:** `items`, `item_barcodes`, `item_prices`,
  `categories`, `brands`, `units`, `customers`, `suppliers`,
  `customer_prices`, `tax_codes`
- **Phase 4 — Inventory:** `inventory_transactions`, `stock_balances`,
  `stock_transfers`, `stock_transfer_lines`, `batches`, `serial_numbers`
- **Phase 5 — Sales/POS:** `sales`, `sale_lines`, `sale_payments`,
  `sales_returns`
- **Phase 6 — Purchasing:** `purchase_orders`, `purchases`,
  `purchase_lines`, `purchase_returns`
- **Phase 7 — Accounting:** `chart_of_accounts`, `journal_entries`,
  `journal_lines`, `cash_registers`, `cash_sessions`, `payments`,
  `receipts`, `expenses`
- **Phase 9 — Platform/workflow:** `audit_logs`, `document_sequences`,
  `system_settings`

## Conventions (apply to every table from Phase 1 onward)

- Primary keys: `id` (`cuid()`, decided in Phase 1 — see
  `docs/DECISIONS.md`).
- Every transactional table: `companyId`, `branchId` (+ `warehouseId` where
  relevant).
- Audit columns: `createdAt`, `createdBy`, `updatedAt`, `updatedBy`.
- Soft delete (`deletedAt`) for master data (customers, suppliers, products,
  categories, users) — never for posted financial transactions.
- Financial/inventory transactions are immutable once posted; corrections
  use reversal/cancellation records, never in-place edits or hard deletes.
- Indexes planned for: barcode search, SKU search, invoice number, customer,
  supplier, branch, company, date ranges, inventory transaction lookups —
  added as each relevant table is created, not retrofitted later.
