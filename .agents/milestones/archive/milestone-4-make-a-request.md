# Milestone 4: Make a Request

**Status:** Archived
**Version:** 1.0.0
**Last Updated:** 2026-08-24
**Depends On:** Milestone 1: Home, Milestone 2: Art & Gallery, and Milestone 3: Services — all merged into `main` and synced
**Target Pull Request:** https://github.com/Freeman-md/debbyarts/pull/5
**Target Branch:** `feat/m4-request`
**Base Branch:** `main`
**Merge Mode:** Manual
**Merge Method:** squash
**Superseded By:** —

## Goal

After M1–M3 are merged, synced, and this worktree is refreshed and activated, implement the central responsive customer request flow at `/request`. The flow must preserve known Artwork or Service context, ask only the fixed applicable V1 fields, validate and save a structured Enquiry before any WhatsApp handoff, preserve answers on failure, and give the customer a reliable reference and contextual continuation path.

## Required behaviour

- Keep this contract `Frozen` and do not implement it until M1, M2, and M3 are merged into `main`, each `Sync After Merge` is complete, and `fmw worktree refresh --path /Users/freemancodz/Projects/debbyarts-worktrees/m4-request` has refreshed this worktree. Then verify the merged public/domain boundaries, change only the local status to `Active`, run `fmw milestone validate` and `fmw run preflight`, and begin only if both pass.
- Use the latest Notion `06 — Website Structure — Internal` for the centralised saved-enquiry journey and Paper `Finalised Public Website` final Make a Request desktop/mobile, default flow, contextual Artwork/Service, submitting, success, retry, and mobile success/retry frames for visual/state intent.
- Where older Notion/Paper states conflict with the simplified V1 data contract, the current `docs/domain-data-contracts.md` and `src/db/schema.prisma` win for supported fields: there are no request modes, dynamic questions, JSON answers, per-record delivery overrides, or form-builder behaviour. In particular, the older Paper exact/similar/custom Artwork intent choices are not persisted/configured request modes; preserve the approved visual language while rendering only supported fixed fields and legitimate broad request entry where required.
- Implement a thin `/request` route that composes Enquiries-owned server/client boundaries under `src/features/enquiries/**` within the existing `PublicShell`.
- Support the default conceptual stages: Interest; Specific Artwork or Service; Request Details/Specifications; Delivery & Timing; Contact Information. Present one focused stage at a time, retain answers when moving backward/forward, show understandable progress, and avoid exposing internal configuration language.
- Default Interest offers Art & Gallery or Services. Specific-item selection reads only relevant published Artwork or Service records from their merged feature/domain boundaries or minimal stable public interfaces; do not take ownership of their internals.
- If the approved broad/custom choice is retained, map it deterministically to `RequestKind.ARTWORK` or `RequestKind.SERVICE` with no entity relation and explicit stable item snapshot values. Ask only shared fixed fields and optional note that make sense; do not create a request-mode column, generic question engine, or fake catalogue record.
- Parse `/request?artwork=<stable-identifier>` and `/request?service=<stable-identifier>` server-side. Validate that the identifier resolves to the correct published record. Known context skips Interest and Specific Item, shows a compact context summary, and begins at the supported details stage. Invalid, unpublished, deleted, conflicting, or duplicate context parameters must fail safely with a clear recovery path rather than trusting client data.
- Support the gallery commission link context (conceptually `/request?type=art-commission`) as a broad Artwork request without a linked Artwork record or persisted request-mode abstraction. Do not encode customer answers or personal data in URLs.
- For a selected Artwork, render only configured fixed fields: available size from `availableSizes` when non-empty; framing only when `framingEnabled` and only from `framingOptions`; quantity only when `askQuantity`. Omit irrelevant fields and reject submitted values not allowed by the current record configuration.
- For a selected Service, render only enabled fixed fields: positive numeric quantity; size/format from `sizeFormatOptions`; application-defined Design Readiness values from `src/features/services/design-readiness.ts`; colour; material; and finish. Only size/format uses owner-configured choice values. Reject fields/options not enabled by the current Service configuration.
- Delivery & Timing uses only the approved shared fixed fields: delivery/pickup where applicable, location, and optional preferred date/timing. Catalogue records do not override these fields. Do not invent public turnaround promises or per-Service Needed By settings.
- Contact Information requires customer name and normalized phone/WhatsApp, with optional email and optional note. Provide accessible, field-adjacent validation; do not rely on client validation as the authority.
- On submit, re-read and validate authoritative Artwork/Service configuration server-side, normalize input, enforce request-kind/entity/answer scope, and persist one Enquiry through Prisma before constructing/enabling WhatsApp continuation. Generate a collision-resistant stable customer-facing reference and store fixed structured answer columns plus minimal item name/slug snapshots.
- Prevent accidental duplicate submissions where practical, keep the submit action idempotent enough for normal retry/double-click behaviour, and surface explicit errors close to their cause. Do not hide persistence failures behind a WhatsApp fallback.
- If persistence fails, remain on the request flow, preserve all answers/context, show the approved retry state, and never open or redirect to WhatsApp. Retrying must not require re-entering completed answers.
- After successful persistence, show the approved success state with the enquiry reference and an explicit `Continue on WhatsApp` action. Build a contextual prewritten message for the confirmed number `+234 814 178 0805`, including website origin, reference, request kind, selected/snapshot item, and concise useful request details without unnecessary personal data.
- The saved Enquiry remains authoritative even if the WhatsApp action is never completed. Record handoff initiation only if it is reliable within the current schema and does not create broad click analytics or cause success to depend on a secondary write.
- Implement submitting, validation, retry/failure, success, invalid-context, empty selection, and catalogue-record-disappeared states represented or required by the final journey. Maintain answers across recoverable failures.
- Match final 1440px desktop and 390px mobile layouts, contextual summaries, progress treatments, form surfaces, selected choices, buttons, feedback states, Header/Footer, and responsive single-column behaviour. Intermediate widths must remain coherent without clipped fields, overflow, or hidden progress.
- Use semantic forms/fieldsets/legends, correctly associated labels/descriptions/errors, logical focus movement, accessible progress/current-step announcements, visible focus, adequate contrast/touch targets, keyboard operation, and reduced-motion support.
- Perform browser QA for default, Artwork-context, Service-context, broad art commission, validation, submitting, saved success, failed save/retry, invalid context, back/forward answer preservation, desktop/mobile layouts, and WhatsApp URL content without sending a real customer message.

## Constraints

- Follow `AGENTS.md`, `docs/engineering-architecture.md`, `docs/domain-data-contracts.md`, `docs/design-foundations.md`, and relevant Next.js 16.3.2 guides in `node_modules/next/dist/docs/` before using framework APIs, forms, server actions, caching, or request APIs.
- Primary ownership is `src/features/enquiries/**` and `src/app/request/**`. Keep request UI state, server validation, persistence, reference/message logic, projections, utilities, and meaningful tests feature-owned.
- Consume merged Artwork/Services public or domain boundaries without moving their behaviour into Enquiries or modifying their feature directories except for the smallest explicitly justified integration export. Do not duplicate their models or configuration rules.
- Reuse the existing `PublicShell`, `Container`, `MediaImage`, `SelectableOption`, field/UI primitives, feedback states, and design tokens. Do not create a generic form engine, wizard framework, repository/DAO layer, or duplicate shared component set.
- React Server Components are the default for route/context loading. Keep the interactive multi-step form in the smallest practical client island; keep authoritative validation and persistence server-side. Pass only serializable, intentionally exposed projections to the client.
- `src/db/schema.prisma` and Prisma-generated types/enums are authoritative. Schema or migration change requires an approved amendment unless a small verified defect makes approved V1 impossible; do not silently alter it.
- Do not introduce request modes, unavailable-artwork behaviour, additional images, featured Services, quantity presets, owner-configurable Design Readiness, per-record delivery/timing overrides, JSON answers, custom questions, AI questions, or a generic answer engine.
- Cross-feature/shared infrastructure changes must be minimal, necessary, and recorded. Avoid unrelated dependency, layout/global CSS, shared/UI primitive, global server/database, instruction, and architecture/domain-doc changes.
- Never log or expose contact details, customer notes, tokens, connection strings, or secret configuration. Do not read secret environment files; use documented variable names and existing configuration patterns.
- Keep tests focused on high-risk deterministic request, validation, persistence, retry, reference, and WhatsApp behaviour. No blanket component tests, coverage targets, or static styling snapshots.

## Explicitly out of scope

- Home, Art & Gallery, or Services implementation beyond the smallest merged integration boundary needed by `/request`.
- Admin Enquiry list/detail/status, Artwork/Service CRUD, authentication, storage/image upload, or owner workflows.
- Generic dynamic questions, form builder, AI-generated questions, JSON answer bags, request modes, owner-configured Design Readiness, presets, or catalogue delivery overrides.
- Prisma model redesign or migration changes without an approved amendment.
- WhatsApp message sending/automation, CRM workflows, notifications, email sequences, analytics, ecommerce, checkout, payments, inventory, customer accounts, or order tracking.
- Real production data entry, invented public operational/privacy wording, or unrelated refactoring.

## Required tests

1. Add focused deterministic tests for context parsing/validation, step compression, enabled-field derivation, server-side answer validation, request-kind/entity/answer scoping, phone/email/date normalization, reference generation, and WhatsApp summary/URL construction.
2. Add focused persistence/service tests for successful Enquiry creation, invalid/tampered configuration values, deleted/unpublished context, duplicate-submit protection where implemented, failed-save answer preservation, and the rule that WhatsApp is never enabled/opened before a successful save.
3. Add a small high-value integration/browser flow for default and contextual submission if the repository test stack can support it reliably without building broad test infrastructure. Otherwise document and perform equivalent browser/database verification.
4. Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.
5. In a browser, verify default, Artwork-context, Service-context, art-commission, validation, back/forward preservation, submitting, success, persistence failure/retry, invalid context, desktop/mobile accessibility, no console/server errors, and screenshot fidelity against all final Paper request states. Inspect generated WhatsApp URLs/messages without sending a real message.

## Acceptance criteria

- [ ] Before implementation, M1–M3 are proven merged/synced, this worktree is refreshed, status is deliberately changed to `Active`, and milestone validation/preflight pass.
- [ ] `/request` implements the central five-stage default journey and compressed contextual Artwork/Service journeys with answers preserved across navigation.
- [ ] URL context is server-validated, invalid/unpublished/conflicting context fails safely, and customer answers/contact data never appear in the URL.
- [ ] Artwork and Service detail fields are rendered and server-validated only from the fixed current configuration; removed request-mode/form-builder concepts are absent.
- [ ] Broad art commission/custom entry is represented without a linked entity or request-mode abstraction and remains coherent with the current Enquiry schema.
- [ ] Shared delivery/timing and contact fields use the approved fixed model, accessible validation, normalization, and no per-record overrides.
- [ ] A server-validated Enquiry with stable reference, entity/snapshot context, and fixed structured answers is persisted before WhatsApp continuation is possible.
- [ ] Failed persistence preserves all answers/context, shows the approved retry state, creates no false success, and never redirects/opens WhatsApp.
- [ ] Successful persistence shows the saved reference and builds a concise contextual message for `+234 814 178 0805` without unnecessary personal data.
- [ ] Duplicate-submit, tampered-value, missing/deleted context, and invalid-answer boundaries are handled explicitly rather than silently falling back.
- [ ] Default/contextual/submitting/success/retry desktop/mobile screenshots are compared with final Paper; material deviations are resolved or recorded.
- [ ] Semantic form structure, labels/descriptions/errors, progress announcements, keyboard/focus behaviour, touch targets, contrast, and reduced motion have been verified.
- [ ] No Admin/auth/storage, schema change, generic form engine, dynamic questions, ecommerce, analytics, or unrelated feature/shared refactor was introduced.
- [ ] Required focused verification and all baseline commands pass.
- [ ] The complete independent review is posted to the pull request against the exact reviewed head.
- [ ] The Completion Record contains implementation, decisions, deviations, verification, review, PR evidence, and M5 integration follow-ups.
- [ ] The pull request is not merged by an agent.

## Manual tasks

1. If a development/test PostgreSQL database is not already configured through the project's normal secret-management flow, provide the documented `DATABASE_URL` and `DIRECT_URL` outside chat and apply the existing committed migration before live persistence verification. Do not put secret values in the repository, contract, logs, or pull request.

## Manual acceptance criteria

- [ ] If live external WhatsApp behaviour cannot be safely automated, confirm the generated action opens the intended chat with the expected non-sensitive reference/context and do not send a test message to a real customer.

## Completion Record

**Implementation Outcome:** Implemented the responsive central `/request` journey with five default stages and three-stage Artwork, Service, and art-commission contexts. Published catalogue context is loaded through minimal feature-owned projections, re-read authoritatively at submit, normalized and persisted as one structured Enquiry before a stable reference and optional WhatsApp continuation are returned. Validation, submitting, saved-success, retry, invalid-context, empty-selection, and disappeared-record states are included, with answers retained across navigation and recoverable failures.
**Important Decisions:** Kept the implementation on the existing fixed Enquiry schema with no request modes, JSON answers, dynamic form engine, migration, or dependency change. Broad requests use null entity relations plus explicit stable snapshots. Exact matching submissions within ten minutes reuse the saved reference to protect normal retry/double-click behaviour. References use 40 bits of random entropy in a compact `DAP-XXXXXXXXXX` format. WhatsApp messages include origin, reference, request kind, selected/snapshot item, and useful request details while excluding customer name, phone, and email. Handoff initiation is not recorded because the current schema cannot do that reliably without making success depend on a secondary write.
**Contract Deviations:** No implementation-scope deviations. The workflow-owned contract remained Frozen during execution. Paper layout/state intent was followed with the current domain contract taking precedence over older request-mode concepts, as required.
**Verification Summary:** `fmw milestone validate` and `fmw run preflight --fetch` passed after refreshing the worktree onto merged M1–M3. `npm run lint`, `npm run typecheck`, `npm test` (11 files / 46 tests), `npm run build`, and `git diff --check origin/main...HEAD` pass. Browser and disposable PostgreSQL QA covered default, Artwork, Service, art-commission, validation, back/forward retention, visible submitting, successful persistence, forced persistence failure and retry, invalid context, disappeared-context handling, 1440px desktop, 390px mobile, no overflow/console errors, and generated WhatsApp content without sending a message. Desktop/mobile and feedback states were compared against the final Paper references; the final semantics-only review fix did not materially change layout.
**Review Outcome:** Approved
**Reviewed Head:** fb25bf61d075ee8cf4bb03f60d7af0dca2c578ab
**Pull Request:** https://github.com/Freeman-md/debbyarts/pull/5
**Merge Commit:** 23f5a604cb829f92998bc7477a77b72cae2d5fb0
**Follow-up Notes:** Cycle 1 reviewed `d53344b3f5d6b826c4caded334e585e1a79d43cb` and requested changes for accessible required/error associations, broad-note error routing, and retry-preservation coverage; all findings were resolved in `fb25bf6`. Independent cycle 2 approved the exact current head with zero findings; the complete review is posted at https://github.com/Freeman-md/debbyarts/pull/5#issuecomment-5396799498. Manual acceptance remains: safely confirm that the generated WhatsApp action opens `+234 814 178 0805` with the expected non-sensitive context, without sending a test message. Deployment still requires the documented database variables through the normal secret-management flow. M5 Admin Enquiries should consume the existing Enquiry schema, reference, structured fixed fields, snapshots, and WhatsApp summary rather than widening this public request contract without an approved amendment. Manual squash merge was required; the agent did not merge the PR.
