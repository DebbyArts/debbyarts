# Project Operating System

This directory is a portable set of repository instructions, skills, and documentation templates. It captures a way of working, not application code or client-specific decisions.

## Install

Copy the contents of this directory into the root of a new repository. If that repository already has an `AGENTS.md` or `.agents/skills/`, merge deliberately rather than overwriting project-specific instructions.

Then customise only these documents:

1. `docs/project-workflow.md` — sources of truth, working modes, checks, and delivery boundaries.
2. `docs/engineering-architecture.md` — actual source layout and technology boundaries.
3. `docs/domain-data-contracts.md` — persisted domains, invariants, integrations, and unresolved decisions.
4. `docs/design-foundations.md` — approved design sources, precedence, tokens, states, and responsive rules.

Remove a skill only when the target project cannot use that capability. Do not duplicate skill contents inside `AGENTS.md`; keep `AGENTS.md` as the routing layer.

## Included skills

- `feature-structure` — incremental feature and page structure rules.
- `shared-structure` — promotion and organisation of genuinely shared code.
- `database-seeding` — deterministic, model-owned seed infrastructure.
- `design-to-development` — approved-design inspection and implementation workflow.
- `work-orchestration` — safe delegation, ownership, sequencing, and handoff.
- `coherent-commits` — small, reversible, non-overlapping commits.

## Operating principle

Inspect first. Decide the smallest correct boundary. Change only what the applicable rule covers. Preserve compliant and unrelated code. Verify the result, commit it coherently, and keep durable decisions in the repository rather than relying on chat history.
