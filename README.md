# NGX — Enterprise POS & ERP

A multi-company, multi-branch Point of Sale and ERP system: sales,
inventory, purchasing, accounting, customers/suppliers, and reporting,
designed to be reusable across business types (retail, wholesale,
pharmacy, electronics, and more).

See [`CLAUDE.md`](./CLAUDE.md) for the full project context, architecture,
and current development status.

## Quick start

```bash
cp .env.example .env
docker compose up -d
npm install
npx prisma generate
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Status

Currently in Phase 0 (project foundation). See
[`docs/PROJECT_STATE.md`](./docs/PROJECT_STATE.md) for exactly what's done
and what's next.
