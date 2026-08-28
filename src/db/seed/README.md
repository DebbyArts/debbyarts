# Catalogue seed

`index.ts` is Prisma's minimal seed entry point. `reset-local.ts` is the guarded local reset entry point.

- `core/` runs the explicit Artwork-then-Service seed and owns the local database guard.
- `domains/` contains readable records for existing Prisma models, plus their preparation, persistence, and focused seed-authoring checks. It does not define models.
- `media/` loads tracked assets, records provenance, and handles deterministic Storage paths and uploads.

The runner validates Artwork, then Service, checks Artwork gallery safety, uploads deterministic media, and writes both domains in one transaction. To add a seeded model, create its domain folder with data, validation, and seeder modules, then add one explicit call in `core/seed-runner.ts`.

`npm run db:seed` uses `DATABASE_URL`. Because this catalogue seed uploads media, it also needs the documented Supabase URL, publishable key, and server-only secret key. `npm run db:reset-local` is destructive and accepts only loopback database targets; use it only for a disposable local database.
