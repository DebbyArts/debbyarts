# Milestone 3: Services

**Status:** Archived
**Version:** 1.0.0
**Last Updated:** 2026-08-24
**Depends On:** None
**Target Pull Request:** —
**Target Branch:** `feat/m3-services`
**Base Branch:** `main`
**Merge Mode:** Manual
**Merge Method:** squash
**Superseded By:** —

## Goal

Implement the responsive public Services experience at `/services` so visitors can understand Debby Art & Prints' correctly classified non-gallery work, navigate the three approved service groups, see clear pricing presentation and useful request-preparation guidance, and enter `/request` with stable Service context. The page must remain a service-discovery experience rather than ecommerce or a generic catalogue framework.

## Required behaviour

- Use the latest Notion `06 — Website Structure — Internal` for Services behaviour and Paper `Finalised Public Website → Final — Services / Desktop` plus `Final — Services / Mobile` for production visual intent.
- Implement a thin `/services` route that composes a Services-owned feature module under `src/features/services/**` within the existing `PublicShell`.
- Read only `published` Service records through the current Prisma model, ordered deterministically by the approved group/display-order rules. Use Prisma-generated types and convert `Decimal` only at a real server-to-client/presentation boundary.
- Preserve the fixed V1 Service groups and customer-facing order: Personalised Products, Print & Event Materials, and Branding & Signage. Provide accessible in-page navigation/anchors for populated groups; do not create separate service pages or owner-managed taxonomy.
- Enforce the client image-classification correction: printed products and custom-production imagery belong here; confirmed paintings, portraits, and gallery artwork belong in Art & Gallery. Do not silently classify ambiguous assets or use service imagery as artwork.
- Implement the final Services introduction, service-group navigation, published Service listing/presentation, Before You Request guidance, final Services CTA, and existing public Header/Footer.
- Each Service presentation must show its approved name, description, primary image/fallback, group, and pricing state. Derive presentation exactly from `PricingMode`: `NONE` means price on request/no amount; `EXACT` shows the formatted NGN amount; `STARTING_FROM` shows `From` plus the formatted NGN amount. Never invent an amount or store/display an amount for `NONE`.
- Surface concise option cues only when supported by the fixed Service configuration and final design. The current model supports ask quantity; ask size/format with text options; fixed application-defined Design Readiness; ask colour; ask material; and ask finish. Do not expose internal Admin labels as customer copy.
- Route contextual service actions to `/request?service=<stable-identifier>` using the current stable slug/identifier rather than display text. M3 supplies links only and does not implement request-page parsing or form behaviour.
- The `Before You Request` section may explain useful customer-facing details represented in Paper/approved copy, but must not imply per-Service deadline/delivery overrides or configurable questions that the V1 model removed.
- Provide intentional empty, image-loading, and recoverable read/error states appropriate to the design. Empty groups should not create dead navigation. Temporary local rows are allowed for visual QA only; committed runtime behaviour must not depend on speculative seed infrastructure or invented business facts.
- Match the final 1440px desktop and 390px mobile compositions: header/hero, group rail, varied service rows/cards, pale cyan preparation section, yellow final CTA, footer, typography, borders, imagery, and responsive stacking. Intermediate widths must remain coherent without overflow or clipped actions.
- Use semantic sections/headings, accessible in-page navigation, visible focus, sufficiently large touch targets, deliberate image alt text, adequate contrast, and reduced-motion support.
- Perform browser QA with representative published data and empty data, verify every contextual destination and group anchor, and compare desktop/mobile screenshots against Paper.

## Constraints

- Follow `AGENTS.md`, `docs/engineering-architecture.md`, `docs/domain-data-contracts.md`, `docs/design-foundations.md`, and relevant Next.js 16.3.2 guides in `node_modules/next/dist/docs/` before using framework APIs.
- Primary ownership is `src/features/services/**` and `src/app/services/**`. Keep Service server reads, projections, components, schemas, hooks, utilities, types, and meaningful tests inside the feature.
- Preserve and extend `src/features/services/design-readiness.ts` as the single application-defined fixed Design Readiness labels if the public page needs those labels. Do not add owner-configurable values or duplicate the enum/model.
- Reuse the existing public shell, `Container`, `MediaImage`, UI primitives, and design tokens. A necessary shared change must be minimal, demonstrably reusable, and recorded; do not move Service-specific presentation into `src/components/shared/`.
- Avoid Home, Artwork, `src/features/enquiries/**`, Admin, auth/storage, and Make a Request implementation. Existing public shell code may be touched only for a small universally correct fix essential to this page.
- Avoid high-conflict shared areas: dependency files, root layout/global CSS, shared/UI primitives, global server/database layers, Prisma files, root instructions, and architecture/domain docs.
- React Server Components own data reads and non-interactive composition by default. Use narrow client islands only for genuine interaction such as enhanced group navigation if platform behaviour is insufficient.
- `src/db/schema.prisma` and Prisma-generated models/enums are authoritative. Do not duplicate Service rows, change schema/migrations, add Service Featured, add quantity presets, or introduce a generic repository/DAO layer.
- Do not add a dependency when existing framework, CSS, browser, and current project capabilities can implement the verified page cleanly.
- Keep tests lean and behaviour-focused. No blanket component tests, coverage targets, or static styling snapshots.

## Explicitly out of scope

- Home page or Home service-summary implementation.
- Art & Gallery, Artwork reads/lightbox, or classification of printed/custom-production work as Artwork.
- Make a Request form, contextual request parsing, enquiry persistence, WhatsApp handoff, or `src/features/enquiries/**` implementation.
- Admin Service CRUD, image upload/storage, publication/order editing, request-option editing, or authentication.
- Service Featured, quantity presets, configurable Design Readiness choices, per-Service Needed By/delivery overrides, custom questions, multiple images, schema redesign, or migrations.
- Ecommerce, checkout, inventory, customer accounts, separate public pages for every service, or generic CMS/catalogue infrastructure.
- Speculative global seed architecture, invented service facts/prices, or unrelated shared refactoring.

## Required tests

1. Add focused automated coverage for non-trivial deterministic Service grouping/order/projection and `PricingMode` presentation, including `NONE`, `EXACT`, and `STARTING_FROM`, where these behaviours are implemented outside trivial rendering.
2. Verify published-only reads, stable contextual request URLs, fixed group order, empty-group/empty-catalogue behaviour, missing images, and invalid/incomplete persisted pricing data handling without masking defects.
3. Add a regression test only if implementation uncovers a meaningful navigation, pricing, or classification failure worth protecting.
4. Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.
5. In a browser, verify desktop/mobile service-group navigation, varied service layouts, pricing copy, option cues, contextual request links, empty/error states, keyboard focus/order, touch targets, no console/server errors, and screenshot fidelity against both final Paper Services frames.

## Acceptance criteria

- [ ] `/services` implements the approved introduction, group navigation, published Service listing, Before You Request section, final CTA, and public shell.
- [ ] Only published Services from the current Prisma model are displayed in deterministic approved group/display order.
- [ ] The three fixed groups are correctly labelled/ordered, empty groups create no dead navigation, and no owner-managed taxonomy or separate service pages were added.
- [ ] Printed/custom-production imagery remains in Services and confirmed gallery artwork is not misclassified as Service content.
- [ ] Service name, description, image/fallback, group, and `NONE`/`EXACT`/`STARTING_FROM` NGN pricing presentation are correct and do not invent values.
- [ ] Customer-facing option cues stay within the six fixed V1 Service questions and do not expose removed configuration concepts or internal Admin language.
- [ ] Contextual actions use `/request?service=<stable-identifier>` without implementing or coupling to the downstream request form.
- [ ] Empty, image-loading, read-error, missing-image, and no-public-price states are intentional and do not rely on fabricated committed catalogue data.
- [ ] Desktop/mobile browser screenshots are compared with the final Paper Services frames; material deviations are resolved or recorded.
- [ ] Semantic structure, in-page navigation, keyboard use, visible focus, accessible names, alt text, contrast, touch targets, and reduced motion have been verified.
- [ ] No Home/Artwork/request/Admin implementation, schema change, Service Featured, presets, generic data layer, speculative dependency, or unrelated shared refactor was introduced.
- [ ] Required focused verification and all baseline commands pass.
- [ ] The complete independent review is posted to the pull request against the exact reviewed head.
- [ ] The Completion Record contains implementation, decisions, deviations, verification, review, PR evidence, and downstream request-link follow-ups.
- [ ] The pull request is not merged by an agent.

## Manual tasks

None. Final service population, approved public prices, operational copy, and ambiguous-image classification are content follow-ups and must not be silently invented.

## Manual acceptance criteria

None.

## Completion Record

**Implementation Outcome:** Implemented the responsive public `/services` experience in the existing public shell. The route reads published Prisma Service records, projects the fixed V1 groups/pricing/options into deterministic presentation data, provides contextual request links, and includes intentional loading, empty, image-fallback, and recoverable-error states.
**Important Decisions:** Kept the route and data boundary server-first, using `connection()` plus a lazy Prisma import so the dynamic route can build without a live database. Kept ordering, pricing validation, fixed option cues, image resolution, and request URL generation in the Services feature. Persisted Supabase object paths remain unchanged and resolve through the server-only, non-secret `PUBLIC_MEDIA_BASE_URL` configuration; invalid or incomplete image data uses the designed fallback. Shared changes were limited to universally correct 44px mobile header/footer hit targets.
**Contract Deviations:** No material product or scope deviation. The representative desktop/mobile, empty, and forced-error browser QA used temporary local fixtures that were removed before commit, so it is not durable exact-head browser evidence. The mobile representative page is longer than the static Paper sample because approved pricing and configured option cues remain visible. After the original approval, resolving the GitHub merge conflict created final PR head `80806003f039fb4b0fac6d161abfb1c7bedd26d5` with stale unused image-configuration code in `next.config.ts`; merged corrective PR #4 removed exactly those 13 lines before archival.
**Verification Summary:** Before merge, `npm run lint`, `npm run typecheck`, `npm test` (2 files, 9 tests), `git diff --check`, and the webpack production build passed for the Services implementation; browser QA covered 1440px and 390px representative data, empty data, forced read errors, anchors, contextual destinations, focus, touch targets, alt handling, reduced motion, overflow, and Paper comparison. After corrective PR #4, isolated verification of current `main` at `ee884351eb153d4a34db2482fa7abf5f3469f06f` passed Prisma generation, Next type generation, lint, typecheck, 6 test files/24 tests, diff check, and both default Turbopack and webpack production builds; `/services` remains dynamic/server-rendered. GitGuardian passed on PRs #3 and #4.
**Review Outcome:** Approved
**Reviewed Head:** `80806003f039fb4b0fac6d161abfb1c7bedd26d5`
**Pull Request:** https://github.com/Freeman-md/debbyarts/pull/3
**Merge Commit:** e9e79be1e9ab38d5729c70946f2d3f0da177e1e5
**Follow-up Notes:** Independent corrective-chain review approved archival with blocker 0, high 0, medium 0, and low 0: https://github.com/Freeman-md/debbyarts/pull/3#issuecomment-5395579857. Corrective PR #4 (`d06c2b0791d5dcf763caecefc892d192362913ff`, merged as `2fdd70a2db23d35dea190ec19c98542f74570928`) removed the stale `next.config.ts` conflict-resolution code; Services files are byte-for-byte unchanged from PR #3 final head to current `main`. Before deployment, configure `PUBLIC_MEDIA_BASE_URL` with the approved public Supabase Storage URL including the fixed bucket. Populate only approved Service content/prices and resolve ambiguous image classification through the content process. A downstream milestone owns parsing `/request?service=<stable-slug>` and request-form behaviour.
