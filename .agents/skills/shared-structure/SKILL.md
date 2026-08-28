---
name: shared-structure
description: Create, promote, or reorganise shared source modules by capability while preserving feature ownership, dependency direction, and server/client boundaries.
---

# Shared Structure

Apply these rules when changing `src/shared/` or promoting code into it. Preserve unrelated architecture.

## Inspect first

- Inspect the candidate code, its consumers, existing shared equivalents, tests, and runtime boundaries.
- Identify the capability that owns the code.
- Confirm that the code is genuinely used across features. Possible future reuse is insufficient.
- Leave already-compliant code unchanged.

## Ownership

- Feature-specific code remains inside its owning feature.
- Shared code must represent proven cross-feature infrastructure, contracts, or utilities.
- Cross-feature workflows must have a clear owning feature or route-composition boundary.
- Do not place application workflows in `shared` merely to avoid an explicit ownership decision.

## Organisation

Organise shared code by capability:

```text
shared/
  auth/
  storage/
  supabase/
  utils/
```

Create only capabilities the project currently needs.

- Co-locate capability-specific configuration, constants, contracts, clients, validation, and errors with that capability.
- Avoid loose modules at the `shared/` root.
- Avoid global `config/`, `constants/`, or `types/` dumping grounds.
- Do not re-export one capability's configuration through an unrelated capability.
- Do not create barrel files unless they establish a deliberate external boundary.

## Shared utilities

Use `shared/utils/` only for generic, pure leaf utilities.

A shared utility should not:

- contain domain behaviour;
- read environment variables;
- perform database, network, filesystem, or Storage operations;
- import a feature;
- coordinate an application workflow.

Move a utility into a capability folder when it depends on that capability's configuration or behaviour.

## Dependency direction

- Features may depend on shared capabilities.
- Shared runtime code must not import feature implementations.
- Shared runtime code must not import seed or test implementation.
- Seed and test infrastructure may consume stable shared runtime contracts where appropriate.
- Do not hide feature-to-feature dependencies behind a shared facade.
- Preserve explicit `server-only` boundaries and prevent server modules from entering Client Component bundles.

## Refactoring

- Preserve behaviour and public contracts.
- Update every affected import, export, test, mock, and documentation reference.
- Search for stale paths before deleting replaced files.
- Remove empty technical-category directories made obsolete by capability ownership.
- Do not combine cohesive modules into giant files merely to reduce file count.
- Do not introduce registries, managers, providers, generic shared frameworks, or new dependencies without a current requirement.

## Verification

- Run targeted tests for moved capabilities.
- Run type checking and linting.
- Run broader tests and a production build when appropriate.
- Review the final dependency direction and ensure no shared module imports feature or seed implementation.
