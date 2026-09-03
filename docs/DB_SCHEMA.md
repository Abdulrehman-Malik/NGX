# DB_SCHEMA

Current tables, relationships, indexes, and posting rules. Update whenever
`prisma/schema.prisma` changes. This should always match the actual schema
file — if they disagree, the schema file wins (see `docs/HANDOFF.md`
priority-of-truth rule).

## Current State (Phase 0)

No business tables exist yet. `prisma/schema.prisma` contains only the
`datasource`/`generator` configuration, pointed at PostgreSQL via
`DATABASE_URL`.

## Planned Table Groups (introduced phase-by-phase)

These will be documented here in detail as each phase lands — this is a
preview of scope from the master requirements, not a finalized schema.

- **Phase 1 — Auth:** `users`, `roles`, `permissions`, `role_permissions`,
  `user_roles`, `sessions`
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

- Primary keys: `id` (cuid or uuid, TBD in Phase 1 — record the choice here
  once made).
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
