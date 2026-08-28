---
name: database-seeding
description: Create, extend, or reorganise database seed infrastructure using existing persisted models, deterministic data, optional media handling, and safe repeatable execution.
---

# Database Seeding

Apply only the rules relevant to the requested seed work. Preserve unrelated database, domain, and deployment architecture.

## Inspect first

- Inspect the existing database schema, seed configuration, scripts, migrations, seed files, tests, tracked assets, and example environment files before changing anything.
- Treat the existing ORM or database schema as the source of truth. Seed code populates existing persisted models; it does not define duplicate models.
- Do not change the database schema unless the user explicitly requests it.
- Preserve existing seed content and behaviour unless the task requires changing them.
- Never inspect secret environment files or expose credentials.

## Structure

Keep the seed root limited to entry points and concise documentation:

```text
seed/
  README.md
  index.ts
  reset-local.ts
  core/
  domains/
  media/
```

Create only the files and directories the project actually needs.

### Core

Use `core/` for shared execution concerns such as explicit execution order, transaction orchestration, seed-specific errors, and local-database safety guards. Do not place domain records or media-specific behaviour there.

### Domains

Organise seed content around an existing persisted domain:

```text
domains/<domain>/
  <domain>.seed-data.ts
  <domain>.seeder.ts
  <domain>-seed.validation.ts
```

- `<domain>.seed-data.ts` contains readable, deterministic seed records.
- `<domain>.seeder.ts` prepares and persists those records through the existing ORM models.
- `<domain>-seed.validation.ts` contains seed-authoring checks only when they provide clearer failures than database constraints. Omit it when it adds no value.
- A domain directory corresponds to an existing persisted model or cohesive data domain; it does not define a new database model.
- Adding a seeded domain should normally require its domain directory and one explicit call from the seed runner.
- Keep types close to their owning module. Do not create a root seed `types.ts` dumping ground.

### Media

Use `media/` only when seed data includes files or externally stored assets. It may own asset loading, Storage uploads, stable seed-owned paths, and asset provenance. A project that seeds only database records should not need this directory.

## Execution and safety

- Keep the configured seed entry point minimal and keep domain execution order explicit, especially where relations exist.
- Prefer stable identifiers, unique keys, deterministic values, and deterministic ordering.
- Seeds should be safe to run repeatedly.
- Never delete unrelated user-created or Admin-created records.
- Cleanup may affect only records or storage paths clearly owned by the seed process.
- Do not reset, truncate, or reseed a shared or production database without explicit authorization.
- Do not introduce registries, plugin systems, generic seeder frameworks, factories, or dependency containers.

## Validation

Seed validation may catch authored-data mistakes such as duplicate seed identifiers, conflicting display order, invalid field combinations, missing asset declarations, or unsafe seed-owned paths.

Do not manually recreate the complete ORM schema. Let the ORM and database enforce their own types, relations, and constraints.

## Documentation

Keep a concise seed `README.md` explaining directory responsibilities, execution order, how to add another seeded domain, required non-secret configuration, optional media support, and safe reset/seed commands.

## Verification

- Update affected imports, scripts, configuration, documentation, and meaningful tests.
- Validate or generate ORM artifacts when relevant.
- Run seed-specific checks without mutating shared or production data.
- When explicitly authorized against a disposable local database, verify both a fresh seed and a repeated seed.
- Run the repository checks relevant to the change.
- Remove obsolete seed files only after every responsibility has moved and no stale reference remains.
