# API_STATUS

Implemented endpoints, their contracts, and what's pending. Update whenever
an API route is added or changed.

## Implemented

| Method | Path | Purpose | Auth required |
|---|---|---|---|
| GET | `/api/health` | Process + DB connectivity check | No |

## Pending (upcoming phases)

- `POST /api/auth/login`
- `POST /api/auth/logout`
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
