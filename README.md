# Debby Art & Prints

Next.js application for the Debby Art & Prints website.

## Getting Started

Install dependencies and run the development server:

```bash
npm install
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

Copy the documented variable names from `.env.example` into your local secret environment file. Prisma uses a pooled `DATABASE_URL` at runtime and `DIRECT_URL` for migrations.

```bash
npm run db:validate
npm run db:generate
npm run db:migrate
npm run db:seed
```

The active schema and migration history live in `src/db/`. Do not use Supabase dashboard migrations for application tables.

`npm run db:deploy` applies pending Prisma migrations without seeding. Use `npm run db:setup` for a fresh non-destructive deployment followed by the curated catalogue seed. `npm run db:reset-local` is destructive and refuses non-local database hosts; it resets a local database, then seeds it. The seed uploads deterministic public Storage paths before one database transaction, so a partial failure leaves no broken database image references and a rerun recovers any already-uploaded objects.
