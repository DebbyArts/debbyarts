# Parallel Milestone Execution Plan

This document is the durable execution map for the five Debby Art & Prints milestone worktrees. The worktree-local `.agents/milestones/active.md` files are the executable contracts; this file does not duplicate them.

## Base and repository

- Foundation base commit: `715f62f03d8669b4819ce067a2c940b6da698e5c`
- Worktree base: the `main` commit that adds this execution plan
- Base branch: `main`
- GitHub repository: https://github.com/Freeman-md/debbyarts
- Workflow: Freeman Codex Workflows `1.0.1`
- Merge method: `squash`
- GitHub capability note: repository auto-merge is disabled, so all five contracts use `Merge Mode: Manual`. No repository setting or protection rule is changed.

## Dependency graph and execution waves

```text
M1 Home composition ───┐
                       │
M2 Art & Gallery ──────┼──→ M4 Make a Request ───→ M5 Admin + Authentication
                       │
M3 Services ───────────┘
```

- Wave 1: M1, M2, and M3 may run independently in parallel.
- Wave 2: M4 may run only after M1, M2, and M3 are merged into `main`, each post-merge sync is complete, and the M4 worktree is refreshed.
- Wave 3: M5 may run only after M4 is merged into `main`, its post-merge sync is complete, and the M5 worktree is refreshed.
- An open pull request does not satisfy a dependency. The dependency must be merged and synced.

## Milestone map

| Milestone | Status | Merge mode | Branch | Worktree | Dependencies |
| --- | --- | --- | --- | --- | --- |
| Milestone 1: Home | Active | Manual | `feat/m1-home` | `/Users/freemancodz/Projects/debbyarts-worktrees/m1-home` | None |
| Milestone 2: Art & Gallery | Active | Manual | `feat/m2-artwork` | `/Users/freemancodz/Projects/debbyarts-worktrees/m2-artwork` | None |
| Milestone 3: Services | Active | Manual | `feat/m3-services` | `/Users/freemancodz/Projects/debbyarts-worktrees/m3-services` | None |
| Milestone 4: Make a Request | Frozen | Manual | `feat/m4-request` | `/Users/freemancodz/Projects/debbyarts-worktrees/m4-request` | M1, M2, and M3 merged and synced |
| Milestone 5: Admin + Authentication | Frozen | Manual | `feat/m5-admin-auth` | `/Users/freemancodz/Projects/debbyarts-worktrees/m5-admin-auth` | M4 merged and synced; Admin/source and infrastructure confirmations below |

Each contract lives at `<worktree>/.agents/milestones/active.md`. It is ignored, untracked, and isolated to that worktree.

## Sources of truth

Use this priority when sources conflict:

1. Latest approved client correction.
2. Latest Notion Website Structure for product behaviour.
3. Paper `Finalised Public Website` for public visual intent.
4. Paper `Design Workspace → Admin Panel → V1 Simplification` for Admin visual intent.
5. Current repository architecture and domain documentation.
6. Current implementation.
7. Older project artifacts as supporting history only.

Reviewed sources:

- Notion project: [Debby Art & Prints](https://app.notion.com/p/3bcb505dc8528165bc2ec8c8cd214c53)
- Notion: [03 — Website Brief — Internal](https://app.notion.com/p/3bfb505dc85281efa776e721e5d35799)
- Notion: [06 — Website Structure — Internal](https://app.notion.com/p/3c0b505dc8528135ac15e4b3122a5d79)
- Paper public source: [Finalised Public Website](https://app.paper.design/file/01M0PQ3DWC0N44Y66V1JY6N6WJ/2-0)
- Paper Admin source: [Design Workspace — V1 Simplification](https://app.paper.design/file/01M0PQ3DWC0N44Y66V1JY6N6WJ/1-0)
- Repository: `AGENTS.md`
- Repository: `docs/engineering-architecture.md`
- Repository: `docs/domain-data-contracts.md`
- Repository: `docs/design-foundations.md`
- Persistence source: `src/db/schema.prisma` and its committed migration

The client correction is mandatory: confirmed artwork/portraits belong in Art & Gallery; printed and custom-production images belong in Services; ambiguous imagery must be classified before publication.

### Resolved source conflicts

- The current Notion Website Structure still describes earlier optional additional images, request modes, per-record overrides, featured Services, presets, and extra structured questions. The later approved Paper V1 Simplification plus the reconciled domain contract and Prisma schema intentionally remove these abstractions. No milestone may reintroduce them.
- Paper page `2-0` is still named `Public Website Extension — Pending`, but its own index and production frames are labelled `FINALISED PUBLIC WEBSITE` and `Final — ...`; those final frames are the public implementation reference.
- Paper page `3-0` (`Final Admin Panel`) predates the V1 Simplification and is stale for configuration behaviour. M5 must use the simplified frames on page `1-0` only after their final-reference status is explicitly confirmed at activation.

## Simplified V1 contract

- Artwork configuration is limited to available sizes, framing enabled/options, and ask quantity.
- Service configuration is limited to ask quantity; ask size/format with text options; fixed application-defined Design Readiness; ask colour; ask material; and ask finish.
- Enquiries store fixed structured fields. There is no generic question/answer engine or form-builder architecture.
- Prisma-generated models remain authoritative for persisted entities.
- Schema changes require an approved milestone amendment.

## Ownership and conflict plan

| Milestone | Primary ownership | Must avoid |
| --- | --- | --- |
| M1 Home composition | `src/components/home/**`, `src/app/page.tsx` | `features/artwork`, `features/services`, request/Admin implementation |
| M2 Art & Gallery | `src/features/artwork/**`, `src/app/art/**` | Home, Services, Admin, request implementation |
| M3 Services | `src/features/services/**`, `src/app/services/**` | Home, Artwork, Admin, request implementation |
| M4 Make a Request | `src/features/enquiries/**`, `src/app/request/**` | Ownership of Artwork/Services internals, Admin/auth/storage |
| M5 Admin + Authentication | `src/app/admin/**`; feature-owned Admin areas; minimal shared auth/storage infrastructure | Generic CMS/Admin framework, domain redesign, unrelated public-page refactors |

High-conflict areas are:

```text
package.json
package-lock.json
src/app/layout.tsx
src/app/globals.css
src/components/ui/
src/components/shared/
src/shared/
src/db/
src/db/schema.prisma
prisma.config.ts
AGENTS.md
docs/engineering-architecture.md
docs/domain-data-contracts.md
```

M1–M3 must avoid these areas unless a change is essential. Any allowed shared change must reuse existing equivalents, remain minimal, contain no feature-specific behaviour, add no speculative dependency, and be called out in the pull request and Completion Record. Route files remain thin, Server Components are the default, and client islands stay narrow.

## Verification policy

All milestones use lean, value-based tests. Tests are required for meaningful deterministic behaviour, high-risk persistence/auth rules, critical integration flows, or regressions—not for static styling, snapshots, blanket component coverage, or coverage targets.

The normal baseline is:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Visual milestones also require browser QA at representative desktop/mobile widths and comparison with their approved Paper frames. Accessibility checks cover semantic structure, keyboard use, visible focus, accessible names, touch targets, reduced motion, and status/error communication that does not rely on colour alone.

## Activation procedures

### M4 — after M1, M2, and M3

Confirm all three pull requests are merged into `main` and all three `Sync After Merge` runs are complete. Then:

```bash
fmw worktree refresh --path /Users/freemancodz/Projects/debbyarts-worktrees/m4-request
cd /Users/freemancodz/Projects/debbyarts-worktrees/m4-request
codex
```

In that Codex session, ask the milestone-authoring workflow to verify the dependencies, change only the local contract status from `Frozen` to `Active`, and validate it. Then run:

```bash
fmw milestone validate
fmw run preflight
```

Only after both checks pass should the user send `Run Active Milestone`.

### M5 — after M4

Confirm the M4 pull request is merged into `main` and `Sync After Merge` is complete. Then:

```bash
fmw worktree refresh --path /Users/freemancodz/Projects/debbyarts-worktrees/m5-admin-auth
cd /Users/freemancodz/Projects/debbyarts-worktrees/m5-admin-auth
codex
```

Before activating M5, confirm:

1. Paper `Design Workspace → Admin Panel → V1 Simplification` is explicitly accepted/promoted as the current final Admin implementation reference.
2. Supabase remains the approved PostgreSQL, Storage, and passwordless Auth provider.
3. The fixed public Storage bucket name, client-owned Supabase production region/plan, production SMTP provider, and authorized Admin email configuration are documented without exposing secret values.

Then ask the milestone-authoring workflow to change only the local contract status from `Frozen` to `Active` and validate it. Run `fmw milestone validate` and `fmw run preflight`, then send `Run Active Milestone` only if both pass.

## Ready-now launch instructions

Open three separate terminal/Codex sessions:

```bash
cd /Users/freemancodz/Projects/debbyarts-worktrees/m1-home
codex
```

```bash
cd /Users/freemancodz/Projects/debbyarts-worktrees/m2-artwork
codex
```

```bash
cd /Users/freemancodz/Projects/debbyarts-worktrees/m3-services
codex
```

Send exactly `Run Active Milestone` in each session. Do not launch M4 or M5 yet.

## Current blockers

- M1–M3: no provisioning blocker.
- M4: frozen until M1–M3 are merged, synced, and the worktree is refreshed.
- M5: frozen until M4 is merged/synced, the worktree is refreshed, the V1 Simplification is confirmed as final, and the remaining non-secret Supabase/SMTP/Storage decisions are documented.
- Content decisions still needed during implementation/handoff include final seeded artwork/service content and approved pricing, public turnaround/delivery/pickup wording, enquiry privacy/retention wording, and ambiguous image classification. Milestones must not invent these values.

## Durable completion state

Each runtime session must keep its Completion Record current with implementation outcomes, material decisions, deviations, verification, independent review, pull-request/merge evidence, and follow-ups. After merge, `Sync After Merge` archives the completed contract. Repository state, pull requests, and tracked archives—not chat history—are the durable record.
