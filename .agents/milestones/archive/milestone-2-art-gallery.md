# Milestone 2: Art & Gallery

**Status:** Archived
**Version:** 1.0.0
**Last Updated:** 2026-08-24
**Depends On:** None
**Target Pull Request:** —
**Target Branch:** `feat/m2-artwork`
**Base Branch:** `main`
**Merge Mode:** Manual
**Merge Method:** squash
**Superseded By:** —

## Goal

Implement the responsive public Art & Gallery experience at `/art` so visitors can browse only correctly classified published Artwork in a natural masonry layout, filter useful populated categories, inspect pieces in an accessible lightbox, and enter `/request` with stable Artwork context. The customer outcome is confident artwork discovery without turning the page into ecommerce or mixing printed production into the gallery.

## Required behaviour

- Use the latest Notion `06 — Website Structure — Internal` for Art & Gallery behaviour and Paper `Finalised Public Website → Final — Art & Gallery / Desktop`, `Final — Art & Gallery / Mobile`, and final desktop/mobile Gallery Lightbox frames for visual and interaction intent.
- Implement a thin `/art` route that composes an Artwork-owned feature module under `src/features/artwork/**` within the existing `PublicShell`.
- Read only `published` Artwork through the current Prisma model. Apply deterministic approved display ordering, use Prisma-generated types at server boundaries, and convert values such as `Decimal` only at a real serialization/UI boundary.
- Enforce the client classification correction: Artwork records represent paintings, pencil portraits, framed/custom artwork, and digital artwork only. Printed/custom-production images and Service records must never appear in this gallery. Do not silently classify ambiguous assets.
- Render the final gallery introduction and only useful filters/categories backed by published Artwork. Support the controlled current categories without inventing taxonomy management; omit empty category controls, and allow a small gallery to omit unnecessary filtering.
- If filter state is placed in the URL, use a stable, shareable category value and handle invalid values safely. Filtering must not require a full-page client rendering boundary when a smaller island or server boundary is sufficient.
- Implement true masonry behaviour that respects differing source aspect ratios rather than a uniform cropped card grid. Preserve readable visual rhythm, reduce columns naturally across widths, prevent cumulative layout shift where intrinsic dimensions exist, and provide an intentional no-image fallback.
- Opening a gallery item must present the approved lightbox experience with large artwork, title, applicable category/description/medium/dimensions/availability/approved price metadata, and a contextual `Ask About This Piece` action. Show only metadata that exists and is present in the approved design hierarchy.
- The lightbox must support previous/next navigation, close control, Escape, left/right arrow keys, focus management/restoration, background interaction blocking, and touch-comfortable mobile controls. Add swipe navigation only if it is reliable and does not compromise normal scrolling or accessibility.
- Build the contextual request destination as `/request?artwork=<stable-identifier>`, using the current stable slug/identifier boundary rather than display text. M2 supplies the link only; it does not implement request-page behaviour.
- Implement the approved gallery-end commission action, routing conceptually to `/request?type=art-commission` without implementing that downstream flow.
- Provide intentional empty, image-loading, and recoverable read/error states appropriate to the final design. Do not fabricate catalogue rows in committed runtime code; temporary local rows are allowed only for visual QA.
- Match final 1440px desktop, 390px mobile, and lightbox frames, including header/footer, typography, spacing, borders, filters, masonry scale, cyan gallery-end CTA, and responsive stacking. Intermediate widths must remain coherent with no overflow or clipped controls.
- Use semantic structure, sensible heading order, accessible filter state, visible focus, sufficiently large touch targets, deliberate image alt text, adequate contrast, and reduced-motion support.
- Perform browser QA with representative data and empty data, compare desktop/mobile gallery and lightbox screenshots to Paper, and exercise mouse, keyboard, and touch-sized interactions.

## Constraints

- Follow `AGENTS.md`, `docs/engineering-architecture.md`, `docs/domain-data-contracts.md`, `docs/design-foundations.md`, and relevant Next.js 16.3.2 guides in `node_modules/next/dist/docs/` before using framework APIs.
- Primary ownership is `src/features/artwork/**` and `src/app/art/**`. Keep schemas, server reads, projections, components, hooks, utilities, types, and meaningful tests inside the feature.
- Reuse the existing public shell, `Container`, `MediaImage`, UI primitives, and design tokens. A needed shared change must be demonstrably cross-feature, minimal, and recorded; do not create Artwork-specific behaviour in `src/components/shared/`.
- Avoid Home, `src/features/site/**` content implementation, `src/features/services/**`, `src/features/enquiries/**`, Admin, and request implementation. Existing public shell code may be touched only for a small universally correct fix that is essential to this page.
- Avoid high-conflict shared areas: dependency files, root layout/global CSS, shared/UI primitives, global server/database layers, Prisma files, root instructions, and architecture/domain docs.
- React Server Components own data loading and non-interactive composition by default. Keep filtering/lightbox client code in the smallest practical islands and pass only serializable projections.
- `src/db/schema.prisma` and Prisma-generated models/enums are authoritative. Do not duplicate the Artwork model, change schema/migrations, add multiple-image support, or add a generic repository/DAO layer.
- Do not add a masonry/lightbox dependency unless existing CSS/platform/React capabilities cannot meet the verified requirements cleanly; justify any dependency before adding it.
- Keep testing lean and behaviour-focused. No blanket component tests, coverage targets, or static styling snapshots.

## Explicitly out of scope

- Home page or Home featured-query implementation.
- Services page, Service reads, or any classification of printed/custom-production work as Artwork.
- Make a Request page/form, contextual request parsing, enquiry persistence, or WhatsApp handoff.
- Admin Artwork CRUD, image upload/storage, publication editing, ordering controls, or authentication.
- Multiple Artwork images, request modes, unavailable-artwork behaviour engines, custom questions, delivery overrides, schema redesign, or migration changes.
- Ecommerce, checkout, inventory, customer accounts, per-artwork product pages, or generic CMS/gallery infrastructure.
- Speculative global seed infrastructure, invented catalogue facts, or unrelated shared refactoring.

## Required tests

1. Add focused automated tests for non-trivial deterministic category/filter/order/projection logic and important invalid-filter or empty-state boundaries where those behaviours are implemented outside framework wiring.
2. Add focused interaction/regression coverage for the high-risk lightbox keyboard/focus/navigation behaviour if browser QA exposes behaviour that unit/integration tests can protect meaningfully.
3. Verify published-only reads, stable contextual request URLs, useful populated filters, differing image aspect ratios, missing-image handling, and an empty catalogue state.
4. Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.
5. In a browser, verify desktop/mobile masonry, filter state, lightbox open/close/previous/next, Escape and arrow keys, focus restoration, touch-sized controls, request/commission destinations, no console/server errors, and screenshots against all final Paper Art & Gallery/lightbox frames.

## Acceptance criteria

- [ ] `/art` implements the approved gallery introduction, useful filters, true masonry gallery, final lightbox, gallery-end action, and public shell.
- [ ] Only published Artwork from the current Prisma model is read and displayed in deterministic approved order.
- [ ] Artwork classification is correct; printed/custom-production imagery and Services never appear in Art & Gallery.
- [ ] Filters expose only useful populated controlled categories, handle invalid/empty state safely, and remain accessible and responsive.
- [ ] Mixed portrait, landscape, and square images retain natural aspect-led masonry behaviour without a uniform cropped-card grid or avoidable layout shift.
- [ ] The lightbox shows applicable metadata, provides previous/next/close and contextual request action, traps/manages/restores focus correctly, supports Escape/arrows, and remains touch-comfortable on mobile.
- [ ] `Ask About This Piece` uses `/request?artwork=<stable-identifier>` and the gallery-end commission action carries stable conceptual context without implementing the request flow.
- [ ] Empty, loading/image-loading, read-error, and missing-image states are intentional and do not rely on fabricated committed catalogue data.
- [ ] Desktop/mobile browser screenshots are compared to the final Paper gallery and lightbox frames; material deviations are resolved or recorded.
- [ ] Semantic structure, keyboard use, visible focus, accessible names/state, alt text, contrast, touch targets, and reduced motion have been verified.
- [ ] No Admin, request flow, schema/migration change, multiple-image model, generic data layer, speculative dependency, or unrelated feature/shared refactor was introduced.
- [ ] Required focused verification and all baseline commands pass.
- [ ] The complete independent review is posted to the pull request against the exact reviewed head.
- [ ] The Completion Record contains implementation, decisions, deviations, verification, review, PR evidence, and downstream request-link follow-ups.
- [ ] The pull request is not merged by an agent.

## Manual tasks

None. Final catalogue population and ambiguous-image classification are content follow-ups and must not be silently invented by the implementation agent.

## Manual acceptance criteria

None.

## Completion Record

**Implementation Outcome:** Implemented the dynamic `/art` route inside `PublicShell`, a published-only Prisma Artwork read and serializable projection, populated-category filters, deterministic responsive masonry, natural-aspect images with loading/missing-image treatment, an accessible native-dialog lightbox, contextual artwork/commission request links, route loading/error boundaries, and focused catalogue tests.
**Important Decisions:** Kept data loading in a Server Component and gallery state in one small client island; used a dependency-free shortest-column distributor to preserve sparse three-column desktop and staggered two-column mobile masonry; used native `<dialog>` for modal focus isolation plus explicit keyboard navigation, scroll locking, and opener focus restoration; resolved persisted object paths from documented Supabase URL/bucket configuration without choosing a bucket value.
**Contract Deviations:** Swipe navigation was intentionally omitted because the contract permits it only when reliable and the approved touch-sized previous/next controls cover mobile navigation. Live browser rendering of the database-read error boundary was not verified after the browser blocked the restarted local URL. The exact final-head default Turbopack build rerun was not verified because this execution environment denied Turbopack's internal local port bind; the equivalent final-head webpack production build passed.
**Verification Summary:** On implementation head `684b11de6f4196bd9aa5ba817976c23583a11c7c`, `npm run lint`, `npm run typecheck`, `npm test` (2 files, 8 tests), and `npx next build --webpack` passed. Browser QA used temporary, removed representative rows and an empty catalogue at 1440px and 390px: Paper comparison, three-/two-column masonry, filters/counts, mobile menu, no horizontal overflow, lightbox navigation and focus, contextual URLs, representative metadata, image aspect ratios, and empty state passed. Review of final PR #1 head `f2de692cac40e0e95575b80475c0763fbe3e1d2d` identified stale image configuration introduced by its merge-from-main conflict resolution. Corrective PR #4 removed that stale block; on exact corrective head `d06c2b0791d5dcf763caecefc892d192362913ff`, `npm run lint`, `npm run typecheck`, `npm test` (6 files, 24 tests), `npx next build --webpack`, and GitGuardian passed. The default Turbopack build remained environment-blocked solely at its internal local-port bind.
**Review Outcome:** Approved
**Reviewed Head:** `f2de692cac40e0e95575b80475c0763fbe3e1d2d`
**Pull Request:** https://github.com/Freeman-md/debbyarts/pull/1
**Merge Commit:** 146b88cec4c4755b1edc2734845194f1ffcdf42e
**Follow-up Notes:** Review of final PR #1 head `f2de692cac40e0e95575b80475c0763fbe3e1d2d` found one merge-resolution integration issue; corrective PR #4 resolved it durably on the default branch as `2fdd70a2db23d35dea190ec19c98542f74570928`. Original implementation review: https://github.com/Freeman-md/debbyarts/pull/1#issuecomment-5394012714. Corrective evidence: https://github.com/Freeman-md/debbyarts/pull/4. The downstream request milestone must parse stable `artwork` slug context and `type=art-commission`. Production setup must provide the documented Supabase project URL and storage bucket variable names. Final catalogue population and ambiguous-image classification remain explicit content follow-ups; no records were invented here.
