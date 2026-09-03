# DECISIONS

Chronological log of important technical/business decisions and why they
were made. Append new entries at the bottom; do not rewrite history here —
if a decision is later reversed, add a new entry that supersedes it.

---

### 2026-09-03 — Backend: Next.js API routes, not a separate Node backend (for now)

**Decision:** Use Next.js Route Handlers for the API layer instead of
scaffolding a separate Node.js/Express service.

**Why:** One deployable unit, shared TypeScript types between frontend and
backend, less operational overhead while the project is in early phases.
The domain service layer underneath (`src/modules/*`) is written with no
Next.js imports, so it can be lifted into a standalone backend later without
rewriting business logic if scale ever requires it.

**Revisit if:** the API needs to be consumed by non-Next.js clients at scale
independent of the web app, or deployment/scaling requirements diverge
between frontend and API.

---

### 2026-09-03 — ORM: Prisma

**Decision:** Prisma over Drizzle or TypeORM.

**Why:** Best TypeScript type inference of the three, mature migration
tooling, and works across PostgreSQL/SQL Server/(Oracle via community
driver) — important because the spec explicitly requires the schema to stay
portable beyond Postgres-only features.

---

### 2026-09-03 — Auth: custom session-based auth, not NextAuth

**Decision:** Hand-rolled credentials auth: bcrypt-hashed passwords,
server-side session records, signed httpOnly session cookie.

**Why:** The system needs to embed company/branch/role/permission scope in
every authenticated request and enforce branch-level restrictions
server-side on every call. This is closer to an enterprise ERP session model
than NextAuth's typical provider-based flow, and a custom implementation
gives full control over that scope resolution without fighting a library's
assumptions.

---

### 2026-09-03 — Deployment target: local/Docker only for now

**Decision:** Docker Compose (Postgres container) + local `npm run dev` is
the only supported environment for now. No cloud infrastructure is being
built yet.

**Why:** User confirmed this is the current priority; cloud deployment
architecture is Phase 12 per the phase plan and premature infrastructure
work would be wasted effort if requirements change.

---

### 2026-09-03 — Demo/seed data: fully generic retail/wholesale

**Decision:** Seed data (Phase 3+) targets a generic retail/wholesale
business, not a specific vertical (pharmacy, electronics, etc.).

**Why:** User confirmed no specific vertical is required yet. Batch/expiry
(pharmacy) and serial/IMEI (electronics) tracking remain supported as
optional, configurable features per the architecture — just not the default
seed scenario.

---

### 2026-09-03 — ID strategy: `cuid()`

**Decision:** All Prisma model primary keys use `@default(cuid())` rather
than auto-increment integers or `uuid()`.

**Why:** Collision-resistant without a central sequence (useful once
multi-branch/offline scenarios exist), URL-safe, and shorter than a UUID.
Auto-increment integers were ruled out because they leak record counts and
are awkward once any kind of distributed/offline write path exists later.

---

### 2026-09-03 — Super-admin role bypasses granular permissions

**Decision:** `Role.isSuperAdmin: Boolean` — a user with a super-admin role
passes every `hasPermission()`/`requirePermission()` check automatically,
without needing individual `RolePermission` rows.

**Why:** The full permission catalog (spec §8) is built out module-by-module
as each module lands, over many phases. Without a bypass, there would be no
way to have a working administrator account until that entire catalog is
finished. This is a deliberate, temporary-by-design simplification, not a
long-term security model — it should be revisited once the permission
catalog is substantially complete, to decide whether the bypass stays as a
true "break-glass" role or is replaced by an explicit "grant all current
permissions" approach.

**Revisit when:** the permission catalog is largely built out (later
phases) — reassess whether an unconditional bypass is still appropriate.

---

### 2026-09-03 — Git workflow: one branch per module

**Decision:** Each module/phase of work is developed on its own branch
(`module/<name>`, e.g. `module/auth`, `module/companies-branches`,
`module/inventory`), merged to `main` only once that module's slice is
implemented, documented, and verified per `docs/CURRENT_PHASE.md`'s
"remaining before phase can be marked DONE" checklist.

**Why:** Keeps `main` always in a coherent, working state; makes it easy to
review one module's diff in isolation; and matches the Playbook's
phase-by-phase discipline at the git level, not just the docs level. Full
workflow detail in `docs/GIT_WORKFLOW.md`.

---

### 2026-09-03 — Legacy repo content archived, not deleted

**Decision:** The pre-existing standalone `login.html` and stray
`package-lock.json` (from before this project's scope was defined) were
moved to `docs/legacy/` rather than deleted.

**Why:** They predate the real application and have no place in the Next.js
structure, but deleting user-created files outright without a clear signal
felt presumptuous. They're preserved for reference and out of the way of
the real app.
