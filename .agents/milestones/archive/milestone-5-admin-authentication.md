# Milestone 5: Admin + Authentication

**Status:** Archived
**Version:** 1.0.0
**Last Updated:** 2026-08-24
**Depends On:** Milestone 4: Make a Request — merged into `main` and synced; final simplified Admin and infrastructure prerequisites confirmed
**Target Pull Request:** —
**Target Branch:** `feat/m5-admin-auth`
**Base Branch:** `main`
**Merge Mode:** Manual
**Merge Method:** squash
**Superseded By:** —

## Goal

After M4 is merged/synced and this worktree is refreshed and deliberately activated, implement the complete secure owner-only Admin product: passwordless Supabase authentication for one configured Admin email, the approved responsive Admin shell, Artwork and Service content CRUD with one primary image and fixed V1 request options, and saved Enquiry list/detail/status workflows. The outcome is routine owner self-service without a generic CMS, role system, or redesigned domain model.

## Required behaviour

- Keep this contract `Frozen` and do not implement it until M4 is merged into `main`, `Sync After Merge` is complete, and `fmw worktree refresh --path /Users/freemancodz/Projects/debbyarts-worktrees/m5-admin-auth` has refreshed this worktree.
- Before activation, explicitly confirm Paper `Design Workspace → Admin Panel → V1 Simplification` is accepted/promoted as the current final Admin implementation reference. The older Paper page `Final Admin Panel` is stale for configuration behaviour. If the source remains ambiguous, stop and request a design-source decision.
- Before activation, confirm Supabase remains the client-owned PostgreSQL, Storage, and Auth provider; document the fixed public Storage bucket name, production region/plan, production SMTP provider, authorized Admin-email configuration, Site URL/redirect URLs, and development email flow without exposing secret values.
- At activation, review current Supabase changelog and official Auth SSR/passwordless/Storage/security documentation, inspect installed/runtime versions and current Next.js 16.3.2 guides, resolve any relevant breaking changes, change only the local contract status to `Active`, then run `fmw milestone validate` and `fmw run preflight`. Do not begin unless both pass.
- Use `docs/domain-data-contracts.md` and `src/db/schema.prisma` as the behavioural/persistence source. Where old Notion/Paper Admin material conflicts, the V1 Simplification and current fixed Prisma model win: no request modes, multiple images, custom questions, featured Services, quantity presets, configurable Design Readiness values, or per-record delivery/timing overrides.

### Authentication and authorization

- Implement Supabase Auth passwordless email Magic Link and/or email OTP using the currently approved production/development approach. Use current supported SSR cookie/session utilities and Next.js conventions after reading the installed docs; do not reproduce outdated middleware/auth-helper patterns from memory.
- Allow sign-in only for one normalized Admin email configured through a server-side environment variable. Do not hardcode the address, expose it in client bundles, or use public registration.
- Ensure passwordless requests use `shouldCreateUser: false` or the current equivalent so unknown emails cannot register. The one allowed Auth user is provisioned deliberately through the owner-controlled Supabase project.
- Implement the required login/request-sent/OTP-or-callback/error/sign-out states with the minimum coherent Maker's Studio UI. If no final Paper login frame exists, compose existing tokens/primitives and Admin visual language without redesigning the product.
- Configure and validate only allowed callback/redirect destinations. Prevent open redirects, unsafe `next` parameters, token leakage, and verbose authentication errors that disclose whether an email is authorized.
- Protect every `/admin` route on the server and redirect unauthenticated/unauthorized users safely. Do not trust a client-side email check, cookie contents, `getSession()` user objects, or user-editable metadata as authorization proof; use the current Supabase-recommended verified claims/user method and then compare the normalized configured email server-side.
- Repeat the same verified authorization check inside every Admin mutation, upload, replace, delete, publication/status action, and sensitive read. Route protection alone is insufficient.
- Provide secure sign-out and appropriate session refresh/expiry handling. Do not cache authenticated responses in a way that can leak one user's session/content to another.
- Never expose a Supabase secret/service-role key to client code. Use only current publishable values in browser-safe configuration and server-only credentials only where genuinely required.

### Data-access and Admin shell

- Keep application-table reads/writes in Prisma on the server. Supabase hosts PostgreSQL, but its Data API is not a second application data path; keep the existing application tables inaccessible to `anon`/`authenticated` Data API roles and do not add parallel Supabase table queries.
- Implement the approved `AdminShell` with Artwork, Services, and Enquiries navigation, active section, owner account/sign-out action, final desktop sidebar, and representative mobile section switcher/navigation.
- Admin routes/pages are Server Components by default. Use narrow client islands for forms, upload controls, confirmation/dialog interaction, optimistic UI only where correct, and other genuine browser state.
- Reuse existing `AdminShell`, `MediaImage`, state/feedback components, `ConfirmationDialog`, UI primitives, and design tokens. Keep feature-specific list/editor/form/status behaviour inside its owning feature; do not create a generic Admin/CMS framework.

### Artwork Admin

- Implement Artwork list, search/filter only as approved, add, edit, publish/unpublish, featured, display order, availability, pricing, primary image upload/replace/remove, request-options editing, delete confirmation, and intentional empty/loading/error/save/success states.
- Artwork create/edit uses the exact current fields and controlled enums from Prisma. Validate required publication content/image fields server-side, unique normalized slug, intrinsic image metadata, coherent `PricingMode`/amount, and any other existing database constraints before publication.
- Artwork request options are only `availableSizes`, `framingEnabled`, `framingOptions`, and `askQuantity`. Framing options are meaningful only when framing is enabled. Quantity is one positive number in the public flow, never an owner-configured preset list.
- Preserve the client classification rule visibly: confirmed artwork/portraits belong in Artwork; printed clothing, plaques, branding, and other production imagery belong in Services. Do not infer an ambiguous image's classification.
- No multiple images, request modes, unavailable-behaviour engine, custom questions, delivery overrides, or schema redesign.

### Services Admin

- Implement Service list, search/filter only as approved, add, edit, publish/unpublish, display order, pricing, primary image upload/replace/remove, request-options editing, delete confirmation, and intentional empty/loading/error/save/success states.
- Service create/edit uses the exact current Prisma fields and fixed groups. Validate publication fields/image, unique normalized slug, intrinsic image metadata, coherent `PricingMode`/amount, and database constraints server-side.
- Service request options are only: ask quantity; ask size/format plus `sizeFormatOptions`; ask Design Readiness; ask colour; ask material; and ask finish. Design Readiness choices come from the application-defined fixed values; only size/format has owner-managed option text.
- No Service Featured, quantity presets, configurable Design Readiness choices, Needed By toggle, per-Service delivery override, custom questions, multiple images, or generic form builder.

### Enquiries Admin

- Implement Enquiry list, approved search/filter/sort/pagination where needed, simple `NEW`/`CONTACTED`/`RESOLVED` states, Artwork and Service Enquiry detail, linked entity context with snapshot fallback after deletion, WhatsApp continuation, status updates, and empty/loading/error states.
- Group detail content as Request Details, Delivery & Timing, and Contact Information. Render only fixed applicable fields and preserve the customer-facing enquiry reference and submission time.
- Search/filter only as approved and justified by the final simplified frames (reference/name/phone, status, request kind, newest-first are represented). Do not add analytics dashboards, CRM pipelines, automated sequences, internal notes, manual Enquiry creation, or arbitrary saved views.
- Status mutation and WhatsApp continuation require server-verified owner authorization. WhatsApp uses the saved contact/context safely and must not expose extra personal data in logs or URLs beyond what the continuation requires.

### Storage

- Use one approved public Supabase Storage bucket for primary Artwork and Service images. Persist one immutable object path plus alt text and intrinsic width/height on the catalogue record; derive public rendering URLs from configuration and do not persist signed URLs.
- Implement upload, replace, and remove as authenticated owner-only operations with server-side authorization repeated at the action boundary. Validate file type using content, maximum size, decodability, image dimensions, and accepted formats; use collision-resistant immutable paths that separate Artwork/Service ownership.
- A safe replace flow uploads/validates the new object, updates the Prisma record, then deletes the old unreferenced object. If the database update fails, clean up the new object where safe; if old-object deletion fails after a successful record update, report/record actionable cleanup rather than rolling the database back to a broken reference or hiding the failure.
- A delete/remove flow must not delete a path still referenced by another record and must leave database/storage state observable on partial failure. Never accept arbitrary user-supplied bucket/object paths for deletion.
- Configure Storage access narrowly. If authenticated-browser operations/upsert are used, ensure required Storage policies/permissions are complete and owner-specific; if server-side privileged operations are used, keep credentials server-only and still enforce verified owner authorization. Do not weaken application-table RLS/Data API posture to make Storage work.

### Responsive, accessibility, and verification

- Match the confirmed V1 Simplified desktop/mobile list/editor/request-options/enquiry frames and existing Admin foundations, including compact density, navigation, table/card transformations, form grouping, feedback banners, confirmation states, and destructive actions.
- Admin desktop is primary but representative mobile layouts must remain usable: navigation is reachable, forms fit, tables transform intentionally, actions remain accessible, and no critical workflow requires hover or an oversized viewport.
- Use semantic forms/tables/lists, associated labels/descriptions/errors, fieldsets/legends, explicit status text, accessible dialog focus, keyboard-operable controls, visible focus, sufficient contrast/touch targets, alt text guidance, and reduced-motion support.
- Perform browser/security QA for allowed/unknown/unauthenticated/expired sessions, deep links, every mutation's authorization, upload validation/partial failures, CRUD states, Enquiry status, desktop/mobile frames, and no secret/PII leakage in browser/server logs.

## Constraints

- Follow `AGENTS.md`, `docs/engineering-architecture.md`, `docs/domain-data-contracts.md`, `docs/design-foundations.md`, relevant Next.js 16.3.2 installed guides, current Supabase changelog, and official Supabase Auth SSR/passwordless/Storage/security docs at execution time.
- Primary ownership is `src/app/admin/**`; feature-owned Admin areas inside `src/features/artwork/**`, `src/features/services/**`, and `src/features/enquiries/**`; and only genuinely shared auth/storage infrastructure in `src/server/` or the established equivalent.
- Use existing architecture rather than a parallel Admin application, repository/DAO layer, generic CRUD framework, permissions framework, or CMS abstraction.
- `src/db/schema.prisma` and Prisma-generated types/enums are authoritative. Schema/migration changes require an approved amendment unless a small verified defect prevents the approved V1; do not silently redesign models.
- Add current, pinned Supabase client/SSR dependencies only if not already present and justified by official docs; commit the lockfile and verify compatibility with the repository's Node/Next runtime. Do not add broad provider SDKs or wrappers speculatively.
- Never read secret environment files. Update `.env.example` only with documented variable names and safe comments when configuration changes; never include values. Do not log tokens, cookies, secret keys, connection strings, customer contact data, or raw upload contents.
- Keep feature-specific validation, mutations, forms, components, and tests feature-owned. Promote only proven cross-feature auth/storage primitives and reuse existing equivalents first.
- Errors must be explicit, actionable, and observable. Do not add silent auth, upload, storage, CRUD, or status fallbacks that make failure look successful.
- Keep tests focused on security-sensitive authorization, deterministic domain validation, persistence/storage consistency, and critical owner flows. No blanket component tests, coverage targets, or static styling snapshots.

## Explicitly out of scope

- Public Home, Art & Gallery, Services, or Make a Request redesign/refactor beyond the smallest integration needed for Admin-managed data to render correctly.
- Customer accounts, public registration, passwords, social login, multiple Admins, roles/permissions, invitations UI, account management, or a generic identity platform.
- Ecommerce, payments, inventory, order management/tracking, analytics dashboard, CRM pipeline, automated messages/sequences, or manual Enquiry creation.
- Generic CMS/page builder, arbitrary taxonomy management, dynamic form builder, AI questions, JSON answer engine, request modes, multiple catalogue images, Service Featured, presets, or delivery overrides.
- Supabase Data API access for application tables, a second migration authority, direct client-side Prisma/database access, or broad RLS policy redesign.
- Production provider/account purchasing, content population, sending real customer messages, or unrelated architecture/design-system refactoring.

## Required tests

1. Add focused security tests for unauthenticated access, authenticated wrong-email rejection, normalized allowed-email acceptance, verified server identity, disabled sign-up, safe redirects/callbacks, session expiry/sign-out, and repeated authorization on every mutation/upload/status action.
2. Add focused domain/mutation tests for Artwork/Service create/edit/publish/unpublish/delete, slug/pricing/publication validation, fixed request-option rules, classification boundaries where deterministic, and Enquiry status transitions/snapshot fallback.
3. Add focused Storage tests for file validation, immutable path generation, authorization, upload success, failed DB update cleanup, replace ordering, referenced-path protection, delete/cleanup failure observability, and no arbitrary-path deletion.
4. Add a small number of high-value integration/browser flows for login-to-protected-Admin, one Artwork CRUD/image/request-options journey, one Service CRUD/image/request-options journey, and Enquiry detail/status where the test environment supports them reliably. Do not build a broad test framework solely for coverage.
5. Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`; run applicable Prisma validation and current Supabase security/advisor checks when the configured environment supports them.
6. In a browser, verify allowed/unknown/unauthenticated sessions, deep links, sign-out, desktop/mobile Admin shell, CRUD/loading/error/empty/save/delete states, image upload/replace/remove, Enquiry list/detail/status/WhatsApp continuation, keyboard/accessibility, no console/server errors, and screenshots against confirmed simplified Paper frames.

## Acceptance criteria

- [ ] Before implementation, M4 is proven merged/synced, this worktree is refreshed, simplified Admin frames and infrastructure prerequisites are confirmed, status becomes `Active`, and validation/preflight pass.
- [ ] Current Supabase changelog/docs and installed Next.js guides are reviewed; relevant runtime/API changes are reflected without outdated auth helpers or guessed conventions.
- [ ] Passwordless Supabase login supports only the configured normalized Admin email, does not create unknown users, protects every Admin route server-side, and repeats verified authorization for every sensitive operation.
- [ ] Sessions/callbacks/redirects/sign-out are secure, no client/session/user-metadata shortcut is trusted for authorization, and no secret/service-role key reaches the browser.
- [ ] Application-table access remains server-side Prisma only; no parallel Supabase Data API path or schema/migration authority is introduced.
- [ ] The approved responsive Admin shell provides Artwork, Services, Enquiries, active navigation, owner action, and usable desktop/mobile behaviour.
- [ ] Artwork Admin implements the complete approved single-image CRUD/publication/order/availability/pricing/featured/fixed-request-options workflow and classification guidance.
- [ ] Services Admin implements the complete approved single-image CRUD/publication/order/pricing/fixed-six-request-options workflow without Featured, presets, configurable Design Readiness, or removed settings.
- [ ] Enquiries Admin implements approved list/search/filter/sort, grouped Artwork/Service detail, snapshot fallback, status transitions, and authorized WhatsApp continuation without CRM/analytics scope.
- [ ] Storage upload/replace/remove validates images, uses immutable safe paths, preserves observable DB/object consistency on partial failures, and cannot delete arbitrary or referenced objects.
- [ ] Loading, empty, validation, save, success, error, confirmation, and destructive states are explicit and faithful to the confirmed simplified desktop/mobile Paper frames.
- [ ] Semantic forms/tables/navigation, keyboard/dialog/focus behaviour, labels/errors/status, touch targets, contrast, alt guidance, and reduced motion have been verified.
- [ ] No schema redesign, generic Admin/CMS/auth/permissions framework, dynamic questions, ecommerce, analytics, or unrelated public/shared refactor was introduced.
- [ ] Required focused security/domain/storage/integration verification and all baseline commands pass, or credential-dependent gaps are stated exactly.
- [ ] The complete independent review is posted to the pull request against the exact reviewed head and includes security/auth/storage scrutiny.
- [ ] The Completion Record contains implementation, security decisions, deviations, verification, review, PR evidence, provider/manual setup, and follow-ups.
- [ ] The pull request is not merged by an agent.

## Manual tasks

1. Confirm/provision the client-owned Supabase project, region/plan, one authorized Auth user, fixed public Storage bucket, allowed Site/redirect URLs, and production SMTP provider. Keep all credentials and secret values outside chat, Git, logs, and the contract.
2. Supply the documented runtime/migration/Supabase configuration through the normal secret-management flow and apply the existing Prisma migration to the intended development/production databases at the approved release stage.
3. Confirm the final login email wording/template and verify receipt through local Mailpit in development and client-owned SMTP in production.

## Manual acceptance criteria

- [ ] The owner can receive the approved passwordless email, sign in as the sole allowed Admin, and sign out in the intended environment.
- [ ] An unknown email cannot register or access Admin, and direct protected-route access is rejected.
- [ ] A representative uploaded image is publicly rendered from the approved bucket, while unauthorized upload/delete attempts fail.

## Completion Record

**Implementation Outcome:** Complete on `feat/m5-admin-auth`. Implemented sole-owner passwordless Supabase authentication; server-protected responsive Admin routes; fixed V1 Artwork and Service catalogue management; Enquiry list/detail/status and privacy-safe, user-initiated WhatsApp continuation; and single-image Supabase Storage workflows with explicit consistency states.
**Important Decisions:** Verified Supabase claims plus the normalized server-only `SUPABASE_ADMIN_EMAIL` are the authorization authority, and every sensitive read/action repeats that check. Application tables remain Prisma-only. Browser identities have no Storage write policies; Storage mutations use `SUPABASE_SECRET_KEY` only in a server-only client reached after `requireAdmin`, retain owner-scoped immutable paths, force full Sharp decoding, and surface an owner-validated orphan path after partial cleanup failure. WhatsApp opens only the saved number and does not place enquiry or customer context into a URL or prefilled message.
**Contract Deviations:** None. Credential-dependent authenticated browser journeys remain manual verification rather than a product-scope deviation because the local project has no provisioned Auth user or runtime Supabase/Admin configuration.
**Verification Summary:** `npm run lint`, `npm run typecheck`, `npm test` (23 files, 88 tests), `npm run db:validate`, `npm run build`, and `git diff --check` passed at the reviewed head. The corrected local Storage migration applied successfully; the public bucket retains its 8 MiB JPEG/PNG/WebP limits, authenticated Storage write-policy count is zero, and a simulated non-owner authenticated insert was denied by RLS. GitGuardian passed. Missing-configuration deep links and desktop/390 px login states were browser-checked with no fresh runtime errors and zero WCAG A/AA violations. Authenticated CRUD/upload/status/email journeys remain pending manual configuration.
**Review Outcome:** Approved
**Reviewed Head:** `cbdbf52cac9329c52d611737f41426d3c4d388b7`
**Pull Request:** https://github.com/Freeman-md/debbyarts/pull/6
**Merge Commit:** 6dc80e37531f71b65473bbafb7e1e9c3dca0d3a1
**Follow-up Notes:** Before manual squash merge/release, provision the sole Auth user and configure the documented database, public Supabase, server-only Storage secret, Admin email, bucket, and public media URL values through normal secret management. Confirm production region/plan, SMTP, Site/redirect URLs, and email template; apply intended-environment migrations/advisor checks; then run authenticated end-to-end login/sign-out, wrong-user/direct-Storage denial, Artwork/Service CRUD and image lifecycle, Enquiry status/WhatsApp, mobile, keyboard, accessibility, console/log, and final visual QA. `npm audit --omit=dev` still reports the pre-existing `deepmerge-ts` advisory through Prisma config; the offered forced fix is an unrelated breaking Prisma 6.12 downgrade and was not applied.
