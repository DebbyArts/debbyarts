---
name: feature-structure
description: Incrementally refactor or implement a feature or page using defined component and data-layer conventions while preserving unrelated architecture.
---

# Feature Structure

Apply only the rules defined here. Preserve everything else.

## Scope

- Already compliant: leave it unchanged.
- Partially compliant: complete only the missing parts.
- Conflicts with a rule below: refactor it.
- Outside these rules: leave it alone.
- Do not replace one compliant implementation with another equivalent implementation.
- Do not create empty folders or unused architectural layers.

## Feature organisation

- Keep a genuine feature or page composition component at the feature root when it owns composition.
- Keep feature-specific components in `components/`.
- Give each meaningful component its own file.
- Keep constants in `constants/index.ts`.
- Keep feature-specific application types in `types/index.ts`.
- Keep feature code inside its owning feature unless it is genuinely shared.

## Public feature boundary

- Each feature exposes its public API through an `index.ts` at the feature root.
- Export only the components, services, functions, and types intended for consumers outside the feature layer.
- External consumers such as `app/` import from `@/features/<feature>` instead of reaching into the feature's internal files.
- Feature-internal code imports its dependencies directly and does not use its own public entry point.
- Features must not import from other features, including through their public entry points.
- Move code genuinely shared by multiple features to the appropriate shared layer.
- Do not create wrapper files whose only purpose is re-exporting public items. Keep real composition components and export them through the feature's `index.ts`.

## Shared components

- Public shared layout components belong in `components/shared/public/`.
- Admin shared layout components belong in `components/shared/admin/`.
- Low-level reusable UI primitives belong in `components/ui/`.
- Reusable empty, error, and loading primitives belong in `components/ui/states/`.
- Do not promote feature-specific components into shared directories.

## Data responsibilities

Apply these rules only where the corresponding responsibility already exists or is required by the implementation:

- `repositories/` contains direct database or external data access.
- `mappers/` transforms persisted or external data into feature-specific projections.
- `services/` coordinates feature use cases using repositories, mappers, or other dependencies.
- Shared utilities belong in `shared/utils/` only when they are genuinely cross-feature.
- Persisted entity shapes should use generated ORM types.
- Create application types only for real projections, inputs, serialized boundaries, or UI state.

Do not introduce repositories, mappers, or services when the feature does not need them. Keep them as simple functions unless the existing implementation genuinely requires something more.

## Naming

- React component names use `PascalCase`.
- Repository files use `<name>.repository.ts`.
- Service files use `<name>.service.ts`.
- Mapper files use `<name>.mapper.ts`.
- Use lowercase filenames.
- Avoid unnecessary hyphenation. Use kebab-case only for genuine multiword names.

Examples:

```text
artwork.repository.ts
featured-artwork.repository.ts
artwork.service.ts
artwork.mapper.ts
featured-artwork.tsx → FeaturedArtwork
```

## Refactoring behaviour

- Inspect the target before changing it.
- Preserve behaviour, styling, responsiveness, motion, and public APIs.
- Update affected imports, exports, routes, and tests.
- Remove only files and exports made obsolete by the refactor.
- Leave unrelated factories, hooks, utilities, and patterns unchanged.
- Run the repository checks relevant to the changed code.
