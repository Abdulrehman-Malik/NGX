# TODO

Prioritized backlog. Update whenever work is added or completed.

## Immediate (closes Phase 0)

- [ ] Re-verify `npx prisma generate` and `npm run build` on a machine with
      normal internet access.
- [ ] Verify `docker compose up -d` brings up Postgres and the app can
      connect (`DATABASE_URL` in `.env` pointed at it, `/api/health`
      returns `db: "ok"`).
- [ ] Triage `npm audit` findings (1 critical, 6 high, 3 moderate as of
      2026-09-03) before proceeding much further.

## Phase 1 — Authentication & Security

- [ ] `User`, `Role`, `Permission`, `RolePermission`, `UserRole`, `Session`
      Prisma models + migration.
- [ ] Password hashing service (bcrypt).
- [ ] Login/logout services + API routes.
- [ ] Session middleware resolving user/role/permissions per request.
- [ ] Login UI screen + first design-system primitives (button, input,
      form, error state).
- [ ] `requirePermission()` helper for API routes.
- [ ] Seed at least one admin user for local testing.
- [ ] Unit tests: hashing, login success/failure, session validation.

## Backlog (not yet scheduled — full detail in the master requirements PDF)

- Phase 2: Company/Branch/Warehouse + user scope
- Phase 3: Master data (items, categories, brands, units, customers,
  suppliers, tax, price levels)
- Phase 4: Inventory engine (ledger, balances, transfers, reorder, batch/
  serial architecture)
- Phase 5: POS & Sales (barcode, pricing engine, discount engine, payments,
  invoices, returns)
- Phase 6: Purchasing
- Phase 7: Accounting (chart of accounts, journal engine, GL, AR/AP,
  automatic postings)
- Phase 8: Reports & dashboard
- Phase 9: Approvals, audit trail, document sequences, fiscal periods
- Phase 10: Integrations & hardware abstractions
- Phase 11: Hardening & testing (concurrency, performance, security)
- Phase 12: Deployment & operations
