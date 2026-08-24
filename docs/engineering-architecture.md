# Engineering Architecture

This document defines the structure and conventions for Debby Art & Prints. Keep it practical: feature code stays local, shared layers stay small, and architecture is added only when current requirements justify it.

## Source layout

```text
src/
  app/                 # Next.js routes, layouts, metadata, boundaries, composition
  components/
    ui/                # Low-level shadcn/base UI primitives
    shared/            # Proven cross-feature application UI
  features/
    site/              # Public-site shell and Home domain/UI
    artwork/           # Art & Gallery public/admin domain
    services/          # Services public/admin domain
    enquiries/         # Make a Request and Enquiries admin domain
  lib/                 # Framework-agnostic/general utilities
  server/              # Cross-feature server infrastructure
  db/                  # Shared database/Prisma infrastructure
  types/               # Genuinely cross-domain types only
  test/                # Cross-cutting test infrastructure and the temporary smoke test
```

The reserved empty directories establish ownership; they do not imply that every feature needs the same internal structure.

## Ownership and sharing

**Feature-specific code stays inside its feature until there is a demonstrated reason to share it.** A feature may own its components, server logic, schemas, hooks, utilities, types, and tests.

A feature can evolve toward this shape as real needs appear:

```text
features/artwork/
  components/
  server/
  schemas/
  hooks/
  lib/
  types.ts
  index.ts
```

Do not create these folders pre-emptively. Use `index.ts` only when it defines a deliberate module boundary; avoid barrel files that hide dependencies or create cycles.

Shared UI follows **local first → prove reuse → promote intentionally**:

- `src/components/ui/` owns low-level shadcn/base primitives.
- `src/components/shared/` owns application-level UI that is genuinely used across features.
- A possible future use is not enough reason to promote a component.
- Before adding shared code, check for an equivalent and prefer reusing or extending it.
- Never place feature-specific behaviour in a global shared module.

## App Router and React boundaries

`src/app/` primarily contains routes, layouts, metadata, route-level loading/error boundaries, and composition of feature modules. Route files should be thin: for example, `app/art/page.tsx` should compose the Artwork feature rather than contain the feature implementation.

React Server Components are the default for pages, layouts, and non-interactive UI. Add `"use client"` only for browser APIs, local interactive state, event handlers, client hooks, or interactive third-party libraries.

Keep client boundaries narrow:

```text
Server Component page/layout
  -> small interactive Client Component island
```

Do not turn a page into a Client Component because one child is interactive. Client Components must not be async, and values passed from Server to Client Components must be serializable.

## Server, database, types, and schemas

- Feature-specific server logic belongs in `src/features/<feature>/server/` when needed.
- `src/server/` is reserved for cross-feature infrastructure such as authentication helpers, storage, mail/integration clients, and general server utilities.
- Do not create a giant global server layer containing domain behaviour.
- `src/db/` is reserved for shared database infrastructure: the client, schema/migration integration, and seed infrastructure.
- Prisma is the selected application ORM, but it is not installed or configured yet. The locked domain and persistence proposition is documented in `docs/domain-data-contracts.md`; active schema and migration setup belongs to the dedicated database step.
- Keep feature-specific database behaviour close to its owning feature while using the shared database infrastructure.
- Domain types and runtime schemas stay with their domain. Use `src/types/` only for genuinely cross-domain contracts; do not create global dumping-ground `types` or `schemas` folders.

## Imports and module boundaries

- Use `@/*` for imports from `src`, for example `@/features/artwork/...`.
- Short relative imports are acceptable within one tightly local feature when clearer.
- Avoid deep cross-directory relative imports and circular dependencies.
- Export a feature through `index.ts` only when consumers need a deliberate public boundary.

## Naming

| Item | Convention | Examples |
| --- | --- | --- |
| React component files | kebab-case | `artwork-card.tsx`, `request-progress.tsx` |
| Utility/module files | kebab-case | `format-price.ts`, `request-context.ts` |
| Tests | subject plus `.test` | `artwork-card.test.tsx`, `format-price.test.ts` |
| Components, types, classes | PascalCase | `ArtworkCard`, `EnquiryStatus` |
| Functions and variables | camelCase | `formatPrice`, `requestContext` |
| True constants | UPPER_SNAKE_CASE | `MAX_UPLOAD_SIZE` |
| Routes and folders | kebab-case | `make-a-request` |

Use descriptive, purpose-specific names. Avoid vague names such as `utils2.ts`, `helpers.ts`, `common.ts`, or `misc.ts`.

## Components and styling

Create a component when it owns a coherent visual unit or behaviour, improves readability materially, needs independent testing, or establishes a real feature boundary. Prefer small composable components, but do not fragment trivial markup into dozens of files.

Use Tailwind CSS, shadcn/ui primitives where useful, and CSS variables/design tokens when the approved Paper visual system is translated. Do not add arbitrary design tokens or page-specific CSS architecture ahead of that work.

## Product and design sources of truth

Paper Design is the current visual source of truth for implemented UI.

- **Public UI:** use `Finalised Public Website` for production-facing screens.
- **Admin UI:** use the clearly labelled `Final Admin Implementation Reference` inside the Design Workspace.
- The wider Design Workspace may supply supporting design-system, interaction-state, UX, and implementation notes.
- If exploratory material differs from a finalised implementation reference, the finalised reference wins.
- If behaviour conflicts with the latest Notion Website Structure, Notion governs product behaviour while Paper governs visual intent.
- Do not silently invent missing design decisions.

Before implementing a feature, future agents should inspect its approved Paper screen through the available Paper design/code tooling. Paper tooling does not require repository configuration at this stage.

## Testing

Keep the suite deliberately small. Do not add tests for every component, route, utility, or framework wiring change, and do not optimise for a coverage percentage.

Add tests when they protect clear long-term value:

- a regression for a bug that occurred;
- critical business/domain logic where silent breakage is costly;
- complex deterministic behaviour with meaningful edge cases;
- a small number of high-value integration or end-to-end flows later.

The current smoke test may remain as infrastructure verification until real behaviour is worth protecting. Run the checks relevant to each change and report anything that could not be verified.

## Git and parallel work

There are two working modes:

1. **Ordinary work:** small, explicitly delegated tasks may be performed directly on `main` when instructed. They do not automatically use the milestone workflow.
2. **Milestone-backed work:** only the explicit command `Run Active Milestone` invokes the future global workflow for branches, acceptance criteria, reviews, checks, commits, push, pull request, and merge boundaries. Do not implement that workflow in this repository.

Parallel agents need explicit feature ownership, such as Artwork, Services, or Enquiries. They should primarily modify `src/features/<feature>/` and coordinate any cross-feature change.

These are higher-conflict shared areas:

```text
src/app/
src/components/shared/
src/components/ui/
src/lib/
src/server/
src/db/
package.json
```

Before changing a shared area, check for an existing equivalent, confirm the concern is genuinely cross-feature, and make the smallest coherent change possible.
