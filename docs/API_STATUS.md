# API_STATUS

Implemented endpoints, their contracts, and what's pending. Update whenever
an API route is added or changed.

## Implemented

| Method | Path | Purpose | Auth required | Verified against live DB? |
|---|---|---|---|---|
| GET | `/api/health` | Process + DB connectivity check | No | No (see docs/TEST_STATUS.md) |
| POST | `/api/auth/login` | Authenticate, set session cookie | No | No |
| POST | `/api/auth/logout` | Revoke session, clear cookie | No (no-op if not logged in) | No |
| GET | `/api/auth/me` | Current user profile or `null` | No (returns null if unauthenticated) | No |

None of the auth endpoints have been exercised against a real running
Postgres instance yet — code is written and type/lint-clean, but end-to-end
behavior is unverified. This is the top item in `docs/TODO.md`.

## Pending (upcoming phases)

- `GET/POST /api/users`
- `GET/POST /api/companies`
- `GET/POST /api/branches`
- `GET/POST /api/sales`, `/api/sales/:id/void`, `/api/sales/:id/return`
- `GET/POST /api/inventory`, `/api/inventory/adjustment`, `/api/inventory/transfer`
- `GET/POST /api/customers`, `/api/customers/:id/ledger`
- `GET /api/reports/sales`, `/api/reports/inventory`, `/api/reports/profit-loss`

Full endpoint list mirrors `docs/Enterprise_Multi-Company_Multi-Branch_POS_and_ERP_Architecture.pdf`
§47 (API Design). Endpoints are added here as they're implemented, not
pre-declared in bulk.
