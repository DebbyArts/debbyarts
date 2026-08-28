# Project Workflow

This document records how work moves from source material to a verified repository change. Replace the bracketed project decisions before implementation begins.

## Sources of truth

Record the actual sources and links used by this project:

1. Latest approved client correction: `[location]`
2. Product behaviour and scope: `[location]`
3. Final public visual reference: `[location]`
4. Final Admin/internal visual reference: `[location]`
5. Architecture and domain documents in this repository
6. Current implementation
7. Older exploratory material, for context only

When sources conflict, the higher current authority wins. Product specifications govern behaviour; approved visual references govern presentation. Record meaningful conflict resolutions in the relevant repository document.

## Decision discipline

Distinguish between an open decision and an execution request.

- When a product, workflow, or architecture decision is still open, test the actual need, current evidence, simplest viable solution, existing alternatives, maintenance burden, failure modes, and fastest useful experiment. Prefer manual validation → evidence → repeatability → automation → scale.
- When the user has clearly requested an implementation, fix, or refactor, execute it without repeatedly reopening the decision. Flag only material correctness, security, destructive, compatibility, or serious regression risks, and prefer the smallest sensible correction.
- Do not build a platform when a feature will do, a framework when a function will do, or a shared abstraction before repeated behaviour proves its shape.

## Delivery stages

1. **Inspect** — read the request, repository rules, relevant source material, existing code, tests, and current status.
2. **Decide** — confirm scope, ownership, contracts, dependencies, and what explicitly must not be built.
3. **Implement** — make the smallest coherent change within the established boundary.
4. **Verify** — run targeted checks first, then the broader checks justified by risk. Visually inspect UI at representative widths and states where relevant.
5. **Review** — inspect the complete diff for accidental changes, stale paths, duplicated logic, dead code, security issues, and scope creep.
6. **Record** — update durable documentation only when a contract or operating decision changed, then commit coherent completed work.

Architecture and contracts should be locked before feature work depends on assumptions. Do not use architecture work as permission to implement future product scope.

## Working modes

### Ordinary work

Small, explicitly delegated tasks may run directly on the configured branch when authorized. They do not automatically invoke a milestone workflow.

Configured ordinary branch: `[for example: main]`

### Delegated work

Use clear ownership and isolated scopes. Disjoint work may run concurrently; overlapping or shared-area work must be sequenced. Each agent inspects the live repository, preserves other work, verifies its scope, and commits only its own coherent changes.

### Milestone-backed work

Milestone execution is opt-in. Configure its exact trigger here: `[for example: Run Active Milestone]`.

Only that explicit trigger activates branch/worktree, acceptance, review, pull-request, or merge procedures. Keep milestone contracts and dependency state outside this general workflow document.

## High-conflict areas

Maintain the project-specific list here. Typical examples include route composition, shared UI, shared infrastructure, database schema/migrations, package manifests, global styles, and repository instructions.

Agents must check for an existing equivalent, minimise changes in these areas, and serialize work when ownership overlaps.

## Documentation

- Documents describe current truth and durable decisions, not a transcript of how the project evolved.
- Update the smallest relevant document when ownership, a public contract, source precedence, setup, or operational behaviour changes.
- Remove stale claims instead of appending contradictory history.
- Keep unresolved material decisions explicit and keep secrets out of documentation.
- Avoid large handbooks that merely narrate self-explanatory code.

## Verification baseline

Record the real commands supported by the repository:

```text
lint:       [command]
typecheck:  [command]
tests:      [command]
build:      [command]
```

Add database validation, browser QA, accessibility checks, or provider-specific checks only when the work requires them. Never claim a check passed unless it ran successfully.

## Completion

A task is complete when its requested behaviour exists, relevant checks pass, the diff is intentional, obsolete code is removed where safe, documentation matches reality, coherent commits exist when authorized, and genuine blockers are reported plainly.
