# Debby Art & Prints

Next.js application for the Debby Art & Prints website.

## Getting Started

Use Node.js 22 or later. Create an ignored `.env` file from the documented
names, fill it with local values, then install dependencies and run the server:

```bash
cp .env.example .env
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

Read [docs/engineering-architecture.md](docs/engineering-architecture.md) before adding routes, features, or shared infrastructure. Read [docs/domain-data-contracts.md](docs/domain-data-contracts.md) before changing domain, request, persistence, storage, or admin-auth contracts. Read [docs/design-foundations.md](docs/design-foundations.md) before implementing UI.

## Checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Database

Prisma uses a pooled `DATABASE_URL` at runtime. `DIRECT_URL` is optional locally
(the CLI falls back to `DATABASE_URL`) and recommended for hosted migrations.

```bash
npm run db:validate
npm run db:generate
npm run db:migrate
npm run db:seed
```

The active schema and migration history live in `src/db/`. Do not use Supabase dashboard migrations for application tables.

`npm run db:deploy` applies pending Prisma migrations without seeding. Use `npm run db:setup` for a fresh non-destructive deployment followed by the curated catalogue seed. `npm run db:reset-local` is destructive and refuses non-local database hosts; it resets a local database, then seeds it. The seed uploads deterministic public Storage paths before one database transaction, so a partial failure leaves no broken database image references and a rerun recovers any already-uploaded objects.

For a new Supabase project, migration ownership, Auth/Storage configuration,
Vercel deployment, and account handover, read [docs/deployment.md](docs/deployment.md).
