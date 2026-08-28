# Engineering Architecture

Record the project's actual structure and boundaries here. Keep this document practical and update it when ownership changes materially.

## Source layout

Recommended starting shape for a domain-oriented web application:

```text
src/
  app/                 # routes, layouts, metadata, boundaries, composition
  components/
    <page>/            # page-specific presentation without domain ownership
    ui/                # low-level UI primitives
    shared/            # proven cross-feature application UI
  features/
    <domain>/          # domain-owned UI, actions, data access, and behaviour
  shared/              # proven cross-feature capabilities and leaf utilities
  db/                  # database client, schema/migrations, and seeds
tests/                 # mirrors source ownership outside production code
```

Use natural domain names; do not force every feature folder to be singular or plural for cosmetic symmetry. Do not create empty layers before they are needed.

## Ownership

- Feature-specific code stays with its domain until real reuse proves otherwise.
- A page that composes existing domains is not automatically a feature.
- Routes own framework composition, not substantial business behaviour.
- Shared code is organised by capability and must not hide feature workflows.
- Database infrastructure is shared; domain queries and behaviour remain feature-owned.
- Persisted entity types come from the configured schema/ORM. Separate types require a real boundary.

## Dependency direction

```text
routes/pages -> feature public APIs and page components
features     -> their own internals and shared capabilities
shared       -> no feature implementations
database     -> no feature workflows
```

Features do not import other features. Cross-domain composition belongs at a route/application boundary; genuinely shared behaviour belongs in an appropriate shared capability.

## Public boundaries

Each feature may expose a deliberate root entry point containing only external consumers' required components, services, functions, and types. Feature internals import their concrete modules directly rather than importing their own public entry point.

## UI and runtime boundaries

Record the framework's server/client rules here. For React server-capable frameworks, default to server rendering and keep interactive client islands narrow. Do not move server-only dependencies into client bundles.

Shared UI follows local first → prove reuse → promote intentionally. Prefer existing primitives and tokens before adding parallel controls or styling systems.

## Testing

Tests live in the root `tests/` tree and mirror source ownership. Protect regressions, critical domain rules, meaningful edge cases, and a small number of important integrations. Do not optimise for coverage percentages or test static wiring by default.

## Project decisions

Record only decisions that future work must know:

- Framework/runtime: `[decision]`
- Database and migration authority: `[decision]`
- Authentication: `[decision]`
- File/object storage: `[decision]`
- Styling/design system: `[decision]`
- Import aliases and naming exceptions: `[decision]`
