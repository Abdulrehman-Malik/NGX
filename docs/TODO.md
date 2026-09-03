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

Code written; **nothing has been run against a real database yet**. In
priority order:

- [ ] Run `npx prisma generate` + `npx prisma migrate dev --name init_auth`
      on a machine with real internet/DB access.
- [ ] Re-run `npx tsc --noEmit` after that succeeds (current pass is
      against an ungenerated client stub — see `docs/TEST_STATUS.md`).
- [ ] Run `npm run db:seed`, confirm the admin user is created.
- [ ] Manually test login → home (shows signed-in state) → logout in a
      browser.
- [ ] Add integration tests for `auth-service.ts` (login/logout/
      resolveSession) once a DB is available.
- [ ] Triage `npm audit` findings (see Immediate section above — carried
      over, still not done).
- [ ] Mark Phase 1 DONE in `docs/PROJECT_STATE.md` and
      `docs/CURRENT_PHASE.md` once the above is verified.

Already done this phase: Prisma models (User/Role/Permission/
RolePermission/UserRole/Session), password hashing, session tokens,
lockout policy, permission checks, login/logout/me API routes, session
cookie helpers, login UI + design-system primitives (Button/Input/
FormField), seed script, 15 passing unit tests. Full detail in
`docs/CURRENT_PHASE.md`.

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
