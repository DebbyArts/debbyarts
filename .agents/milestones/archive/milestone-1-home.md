# Milestone 1: Home

**Status:** Archived
**Version:** 1.0.0
**Last Updated:** 2026-08-24
**Depends On:** None
**Target Pull Request:** #2
**Target Branch:** `feat/m1-home`
**Base Branch:** `main`
**Merge Mode:** Manual
**Merge Method:** squash
**Superseded By:** —

## Goal

Implement the approved responsive Home page at `/` so visitors can understand Debby Art & Prints, see correctly classified artwork and service examples, learn the request process and ordering essentials, and reach Art & Gallery, Services, or Make a Request through clear contextual actions. The result must faithfully translate the final Paper desktop/mobile frames without depending on unmerged M2 or M3 code.

## Required behaviour

- Use the latest Notion `06 — Website Structure — Internal` for Home behaviour and Paper `Finalised Public Website → Final — Home / Desktop` plus `Final — Home / Mobile` for production visual intent.
- Compose the existing `PublicShell`, public header/footer/navigation, `Container`, `MediaImage`, UI primitives, and coded design tokens; do not create parallel shared foundations.
- Implement the final approved Home sections represented in Paper: Hero, Featured Artwork, What Debby Art & Prints Creates, How Requests Work, Ordering & Delivery Essentials, final Make a Request CTA, and the existing public Footer. Add a concise FAQ only if the current final Paper frame contains it; the reviewed final frames do not currently include one.
- Preserve the final navigation and CTA destinations: `/art`, `/services`, and `/request`. The Hero educates first and exposes the approved Browse Art & Gallery and Explore Services paths rather than a generic WhatsApp action.
- Keep artwork and service-production imagery semantically separate. Confirmed artwork/portraits may appear in art-led positions; printed/custom-production items belong only in service contexts. Do not silently classify ambiguous assets.
- Read featured, published Artwork through the current Prisma model using page-owned or `src/features/site/` server-safe code consistent with the existing architecture. Order results by the approved featured/display-order rules and provide an intentional empty-data state.
- Do not import or modify unmerged M2/M3 feature implementations. If Home needs service records, use a Home-owned minimal published Service read rather than taking ownership of `src/features/services/**` or creating a global repository/DAO layer.
- Temporary local/fixture data may be used for visual QA, but committed runtime behaviour must not depend on speculative seed infrastructure or invented business content.
- Render real confirmed content when available and avoid inventing prices, turnaround promises, delivery claims, testimonials, or business facts. Preserve the confirmed `Lagos + nationwide` and request-process messaging represented in the final design.
- Match the final 1440px desktop and 390px mobile compositions, including deliberate asymmetry, artwork aspect treatment, responsive stacking, section rhythm, typography, accents, borders, and CTA hierarchy. Intermediate widths must remain coherent without horizontal overflow or clipped content.
- Use semantic landmarks and heading order. All interactive elements require accessible names, visible keyboard focus, sufficient contrast, and appropriate touch targets. Images need deliberate alt text; decorative imagery must be hidden from assistive technology. Respect reduced-motion preferences.
- Perform browser QA against both final Paper frames, including screenshots at representative desktop/mobile widths and checks for navigation, empty state, responsive layout, accessibility, and runtime errors.

## Constraints

- Follow `AGENTS.md`, `docs/engineering-architecture.md`, `docs/domain-data-contracts.md`, `docs/design-foundations.md`, and the Next.js 16.3.2 guides in `node_modules/next/dist/docs/` relevant to any API used.
- Primary ownership is `src/features/site/**` and `src/app/page.tsx`. Keep the route thin and keep Home-specific UI, queries, projections, types, and tests feature-owned.
- Existing public shell files may be adjusted only when final Home fidelity genuinely requires a small shared public-site correction that remains valid for all public pages. Record any such change clearly in the pull request and Completion Record.
- Avoid high-conflict shared areas: `package.json`, `package-lock.json`, `src/app/layout.tsx`, `src/app/globals.css`, `src/components/ui/`, `src/components/shared/`, `src/server/`, `src/db/`, Prisma files, root instructions, and architecture/domain docs. A necessary shared change must be minimal and must reuse an existing equivalent first.
- React Server Components are the default. Use narrow Client Component islands only for actual interaction or browser APIs; do not make the page client-rendered because one child is interactive.
- `src/db/schema.prisma` and Prisma-generated types remain authoritative. Do not duplicate persisted models, change the schema/migration, add a repository abstraction, or introduce a new production dependency.
- Implement the smallest complete page. Do not over-abstract, create speculative variants, add generic content systems, or refactor unrelated code.
- Tests remain lean and behaviour-focused. No coverage targets, blanket component tests, or static styling snapshots.

## Explicitly out of scope

- Art & Gallery page or `src/features/artwork/**` implementation.
- Services page or `src/features/services/**` implementation.
- Make a Request form, enquiry persistence, WhatsApp handoff behaviour, or `src/features/enquiries/**` implementation.
- Admin, authentication, Artwork/Service CRUD, image upload/storage management, or customer accounts.
- Prisma schema or migration changes, generic repository/DAO layers, seed architecture, ecommerce, payments, or analytics.
- Invented final catalogue content, pricing, turnaround, delivery/pickup, privacy, or retention decisions.
- Unrelated shared-layer refactors or design-system changes.

## Required tests

1. Add focused automated coverage only for non-trivial Home-owned deterministic behaviour introduced by the implementation, such as ordering/projection logic or a regression discovered during work. Do not test static markup merely for existing.
2. Verify the Home route with published records and with an empty catalogue state without depending on M2/M3 branch code.
3. Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.
4. Run the relevant page in a browser and verify navigation, keyboard focus/order, accessible names/alt treatment, reduced-motion behaviour, responsive layout, console/server errors, and screenshot fidelity at representative 1440px and 390px viewports against Paper.

## Acceptance criteria

- [ ] `/` implements the final approved Home sections and customer journey from the latest Notion structure and final Paper desktop/mobile frames.
- [ ] Existing public Header, Footer, shell, tokens, and primitives are reused without a competing shared implementation.
- [ ] Hero, Featured Artwork, offer routes, request-process introduction, ordering/delivery essentials, and final request CTA have the correct content hierarchy and destinations.
- [ ] Artwork and printed/custom-production imagery remain correctly classified, and no ambiguous or invented content is presented as fact.
- [ ] Featured published Artwork reads use the current Prisma model, approved ordering, and an intentional empty state without importing M2/M3 implementation.
- [ ] The page is faithful and usable at desktop, mobile, and intermediate widths with no horizontal overflow, clipping, broken imagery, or inaccessible interaction.
- [ ] Semantic structure, heading order, keyboard access, visible focus, accessible names, alt text, touch targets, contrast, and reduced motion have been verified.
- [ ] No Prisma change, new dependency, generic data layer, speculative seed system, or unrelated feature/shared refactor was introduced.
- [ ] Required focused verification and all baseline commands pass.
- [ ] Browser screenshots are compared with both final Paper Home frames and material deviations are resolved or recorded.
- [ ] The complete independent review is posted to the pull request against the exact reviewed head.
- [ ] The Completion Record contains implementation, decisions, deviations, verification, review, PR evidence, and follow-ups.
- [ ] The pull request is not merged by an agent.

## Manual tasks

None. Missing final business content must be surfaced as a follow-up rather than invented or made a hidden implementation dependency.

## Manual acceptance criteria

None.

## Completion Record

**Implementation Outcome:** Implemented and review-corrected at `c694542214d3563d29711d3886d35dd066583c19`; cycle-2 independent review approves the exact head.
**Important Decisions:** Home remains a Server Component route composed through the existing `PublicShell`; feature-owned code reads up to three featured/published Artwork records with explicit ready, empty, and unavailable states; persisted public-bucket object paths are projected server-side using documented non-secret Supabase URL/bucket configuration; final Paper assets remain local; shared Header/Footer edits are limited to mobile touch-target corrections.
**Contract Deviations:** Live populated Supabase database/storage behavior was not available for direct integration verification; automated query/projection and route-composition coverage verifies the implementation boundary. The authoritative Paper hero source is only 150×200 and therefore remains visibly upscaled at its approved 480×640 frame; no higher-resolution approved source exists in the reviewed project, so this is recorded as a non-blocking client-content follow-up rather than replaced with invented imagery.
**Verification Summary:** Cycle-2 independent rerun: `npm run lint`, `npm run typecheck`, `npm test` (4 files/9 tests), `npm run build`, and `git diff --check main...c694542` all passed. GitGuardian passed. The frozen contract, prior review/disposition, exact correction diff, Next.js 16.3.2 Image/environment guidance, Paper/Notion sources, image dimensions, saved 1440px/390px screenshots, PR state, checks, and review threads were inspected. M1-R001 through M1-R004 are resolved.
**Review Outcome:** Approved
**Review Evidence:** Cycle-2 independent review approved the exact reviewed head with no current-head findings: https://github.com/Freeman-md/debbyarts/pull/2#issuecomment-5394218769. The automated hero-resolution thread was dispositioned as an upstream approved-asset limitation and resolved without changing the reviewed head.
**Reviewed Head:** `c694542214d3563d29711d3886d35dd066583c19`
**Pull Request:** https://github.com/Freeman-md/debbyarts/pull/2
**Merge Commit:** f5e1a00241a3aa0c6f825e0eaf6c4e9a88b50b52
**Follow-up Notes:** Replace the hero file later when the client supplies a higher-resolution approved export. The implementation is ready for human review and manual merge; manual merge mode remains in force.
