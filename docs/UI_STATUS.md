# UI_STATUS

Implemented screens/components and remaining UI work. Update whenever the
UI changes.

## Implemented

- `src/app/layout.tsx` — root layout, Tailwind wired up
- `src/app/page.tsx` — placeholder home page (points to project status docs)

## Design System

Not started. Will be built incrementally starting Phase 1 (login screen is
the first real UI): buttons, inputs, tables, modals, tabs, toasts, etc.,
per `docs/Enterprise_Multi-Company_Multi-Branch_POS_and_ERP_Architecture.pdf`
§94 (Design System). Build components as they're needed by a real screen,
not speculatively ahead of use.

## Pending (upcoming phases)

- Login screen (Phase 1)
- Admin shell: sidebar nav, top nav, breadcrumbs (Phase 1–2)
- Company/branch/user management screens (Phase 2)
- Master data screens: items, categories, brands, units, customers,
  suppliers (Phase 3)
- POS screen (Phase 5) — the most performance/UX-critical screen in the app
- Reports & dashboard (Phase 8)
