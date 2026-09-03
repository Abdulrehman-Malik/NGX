# UI_STATUS

Implemented screens/components and remaining UI work. Update whenever the
UI changes.

## Implemented

- `src/app/layout.tsx` — root layout, Tailwind wired up
- `src/app/page.tsx` — home page; shows signed-in state (name + logout
  button) or a sign-in link, server-rendered via `getCurrentUser()`
- `src/app/login/page.tsx` — login screen (client component, calls
  `/api/auth/login`)
- `src/components/logout-button.tsx` — logout action, calls
  `/api/auth/logout`

## Design System (started, minimal)

- `src/components/ui/button.tsx` — `Button` (primary/secondary/danger
  variants, loading state)
- `src/components/ui/input.tsx` — `Input` (error state styling)
- `src/components/ui/form-field.tsx` — `Label`, `FormField` wrapper

Built only as needed by the login screen so far, per
`docs/Enterprise_Multi-Company_Multi-Branch_POS_and_ERP_Architecture.pdf`
§94 (Design System) — extend with tables, modals, tabs, toasts, etc. as
each subsequent screen actually needs them, not ahead of use.

**Not yet visually/manually verified in a browser** — no running DB in the
environment this was built in. Verify the login → home → logout flow
manually once Postgres is available (see `docs/TODO.md`).

## Pending (upcoming phases)

- Admin shell: sidebar nav, top nav, breadcrumbs (Phase 1–2)
- Company/branch/user management screens (Phase 2)
- Master data screens: items, categories, brands, units, customers,
  suppliers (Phase 3)
- POS screen (Phase 5) — the most performance/UX-critical screen in the app
- Reports & dashboard (Phase 8)
