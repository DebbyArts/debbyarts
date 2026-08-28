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

- Keep feature-specific components in `components/`.
- Give each meaningful component its own file.
- Keep constants in `constants/index.ts`.
- Keep feature-specific application types in `types/index.ts`.
- Keep feature code inside its owning feature unless it is genuinely shared.

## Page composition

- A route or page that primarily composes existing domain features is not automatically a feature.
- Keep page-specific presentation components in `components/<page>/` when they have no independent domain ownership.
- Keep repositories, services, mappers, schemas, and domain types with the domain feature that owns the data or behaviour used by the page.
- Route files may compose page-specific components and the public APIs of multiple features.
- Do not retain a page-level composition wrapper when the route can express the same composition clearly.
- Keep single-consumer page content or constants local to the component that owns them. Move domain constants into the owning feature and expose them through that feature's public entry point only when an external consumer needs them.

## Domain surfaces

- Organise features by domain, not by public or Admin surface.
- Keep public and Admin code for the same domain inside the owning feature.
- Keep genuinely Admin-specific feature components in `components/admin/`.
- Do not use a feature-root `admin/` directory as a general bucket for actions, validation, state, data access, or domain logic.
- Repositories, services, mappers, parsers, schemas, constants, and types remain feature-owned and should serve every relevant surface.
- Do not duplicate or split those modules solely because one consumer is an Admin screen.
- Split an oversized module only by a cohesive responsibility such as read/write or catalogue/editor behaviour, not merely public/Admin usage.
- Keep cross-domain Admin composition in `app/admin/` and shared Admin layout UI in `components/shared/admin/`; do not create an umbrella Admin feature for domain CRUD.

## Actions, parsers, and schemas

- Keep feature actions in `actions/`, with one exported action per file.
- Name public or front-facing action files `<action>.action.ts`.
- Name Admin action files `<action>.admin.action.ts`; place `.admin` immediately before `.action.ts`.
- Treat actions as delivery adapters: authenticate where required, parse input, invoke the owning feature's service, and handle framework concerns such as revalidation or redirects.
- When the feature already has repositories and services, actions should not bypass them or duplicate their data-access and use-case responsibilities.
- Keep feature-owned Zod schemas in `schemas/`, using `<subject>.schema.ts`.
- Do not maintain parallel `validation/` and `schemas/` implementations for the same input.
- Keep transport parsers in `parsers/`; FormData parsers use `<feature>-form.parser.ts`.
- Parsers decode external input, call the relevant schema, and return typed application input. They do not derive presentation labels, formatted values, image URLs, or destination URLs.
- Use Zod errors for invalid submitted input. Add a custom error class only for an error category materially different from schema validation.
- Schemas validate external input without querying database, Storage, authentication, or existing-record state.
- Mutation services load required state and coordinate state-aware rules. When the resulting pure domain validation is substantial and cohesive, it may be extracted into a focused validator that receives the already-loaded state.
- Keep immutable initial action states in `constants/index.ts` and their state types in `types/index.ts`.

Examples:

```text
actions/submit-enquiry.action.ts
actions/save-artwork.admin.action.ts
parsers/artwork-form.parser.ts
schemas/artwork.schema.ts
```

## Domain validators

- Use `validators/<subject>.validator.ts` only for substantial domain validation that does not belong in an input schema and becomes clearer outside a service.
- Validators are pure: they receive normalized input and any already-loaded records, return validated domain values or throw a focused domain error, and perform no database, Storage, authentication, network, or framework work.
- Services remain responsible for loading state, invoking validators, and coordinating the overall operation.
- Keep small single-use validation helpers private inside their owning validator or service rather than creating generic utility files.
- Do not duplicate the same rule in schemas and validators, and do not create a validator folder merely for structural symmetry.

## Constants

- Treat immutable option lists, labels, lookup maps, ordering values, route values, and fixed configuration as constants.
- Feature-owned constants belong in `constants/index.ts`. Do not keep constant-only files at the feature root.
- Place a constant with the feature that owns and consumes the behaviour, not automatically with the feature where it currently lives.
- Constants genuinely used by multiple features belong in `shared/constants/`; features must not import constants from one another.
- Do not place functions, mutable state, or runtime-derived values in constants modules.

## Public feature boundary

- Each feature exposes its public API through an `index.ts` at the feature root.
- Export only the components, services, functions, and types intended for consumers outside the feature layer.
- External consumers such as `app/` import from `@/features/<feature>` instead of reaching into the feature's internal files.
- Feature-internal code imports its dependencies directly and does not use its own public entry point.
- Features must not import from other features, including through their public entry points.
- Move code genuinely shared by multiple features to the appropriate shared layer.
- Do not create wrapper files whose purpose can be handled by the feature's public `index.ts` and the external consumer.

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
- Begin with one `repositories/<feature>.repository.ts` when its reads and writes remain cohesive and understandable.
- When that repository becomes genuinely oversized or mixes distinct read and write responsibilities, replace it with `repositories/<feature>.query.repository.ts` and `repositories/<feature>.mutation.repository.ts`.
- Do not retain a catch-all `<feature>.repository.ts` alongside query and mutation repositories. Use either the single repository or the split pair.
- Query repositories own direct reads even when a mutation service needs those reads to validate or resolve existing state. Mutation repositories own direct writes.
- Keep raw ORM query definitions next to the repository that consumes them. Create `<feature>.queries.ts` only when definitions are genuinely shared by multiple repositories or mappers, or form a deliberate generated-payload boundary.
- Split repositories by data-access responsibility, not by page, public/Admin surface, or individual use case.
- Repositories perform data access and should not contain presentation mapping or domain workflow validation.
- Use services consistently; do not add a parallel `usecases/` layer.
- When a feature has both read and write responsibilities, use `services/<feature>.query.service.ts` and `services/<feature>.mutation.service.ts`.
- Query services coordinate repositories and mappers for reads. Mutation services coordinate state changes, external infrastructure, rollback, cleanup, and state-dependent rules.
- Do not create one service file per function. Create only the query or mutation service the feature needs, and split further only around a demonstrated cohesive responsibility.
- Shared utilities belong in `shared/utils/` only when they are genuinely cross-feature.
- Persisted entity shapes should use generated ORM types.
- Create application types only for real projections, inputs, serialized boundaries, or UI state.

Do not introduce repositories, mappers, or services when the feature does not need them. Keep them as simple functions unless the existing implementation genuinely requires something more.

## Feature utilities and projections

- Keep feature-specific pure utilities in `utils/`.
- Utilities serving one component use `utils/<component>.utils.ts`.
- Use the component's lowercase filename without its extension.

Example:

```text
components/ArtworkGallery.tsx
utils/artwork-gallery.utils.ts
```

- Do not create catch-all modules such as `helpers.ts`, `utils.ts`, or `<feature>-catalogue.ts` for unrelated responsibilities.
- Import constants and types directly from `constants/` and `types/`. Do not re-export them through utility files.
- Mappers should derive ready-to-render projection fields from persisted or external data, including labels, formatted values, and destination URLs where appropriate.
- Parsers transform incoming external input into validated application input; mappers transform persisted or external records into application projections.
- Keep feature-specific presentation decisions in the owning mapper. Extract only genuinely reused scalar formatting to `shared/utils/`.
- Components should consume those derived projection fields instead of repeating presentation logic.
- Move a utility to `shared/utils/` only when multiple features genuinely use it.
- Export a utility through the feature's root `index.ts` only when it is intentionally part of the feature's external API.

## Naming

- React component names and component filenames use `PascalCase`.
- Repository files use `<name>.repository.ts`.
- Query and mutation service files use `<feature>.query.service.ts` and `<feature>.mutation.service.ts` when both responsibilities exist.
- A single repository file uses `<feature>.repository.ts`; a justified split uses `<feature>.query.repository.ts` and `<feature>.mutation.repository.ts`.
- Shared raw query-definition files use `<feature>.queries.ts` only under the conditions defined above.
- Mapper files use `<name>.mapper.ts`.
- Form parser files use `<feature>-form.parser.ts`.
- Schema files use `<subject>.schema.ts`.
- Domain validator files use `<subject>.validator.ts`.
- Non-component filenames use lowercase.
- Avoid unnecessary hyphenation. Use kebab-case only for genuine multiword non-component names.

Examples:

```text
artwork.repository.ts
enquiry.query.repository.ts
enquiry.mutation.repository.ts
enquiry.queries.ts
artwork.query.service.ts
artwork.mutation.service.ts
artwork.mapper.ts
artwork-form.parser.ts
artwork.schema.ts
FeaturedArtwork.tsx → FeaturedArtwork
```

## Shared infrastructure

- Use `shared/utils/cn.ts` as the canonical class-name utility.
- Keep cross-feature infrastructure under `shared/<concern>/` and genuinely cross-feature contracts under `shared/types/`.
- A module under `shared/` is not automatically browser-safe. Server-only shared modules retain explicit `server-only` boundaries and must not be imported by Client Components.
- Do not recreate competing global `lib/`, `server/`, or `types/` dumping grounds.

## Refactoring behaviour

- Inspect the target before changing it.
- Preserve behaviour, styling, responsiveness, motion, and public APIs.
- Update affected imports, exports, routes, and tests.
- Remove only files and exports made obsolete by the refactor.
- Leave unrelated factories, hooks, utilities, and patterns unchanged.
- Run the repository checks relevant to the changed code.
