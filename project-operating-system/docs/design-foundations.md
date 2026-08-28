# Design Foundations

This document connects approved design sources to reusable implementation rules. Final screens remain authoritative for the screen being implemented.

## Approved sources

| Concern | Authoritative source | Notes |
| --- | --- | --- |
| Product behaviour | `[link/location]` | Latest approved structure and flows |
| Public UI | `[link/location]` | Final implementation reference |
| Admin/internal UI | `[link/location]` | Final implementation reference |
| Exploratory workspace | `[link/location]` | Supporting tokens, states, and notes only |

Latest approved client corrections override older material. Final references override exploratory frames. Product sources govern behaviour; visual sources govern presentation. Escalate material gaps instead of silently inventing them.

## Foundations to record

- Typography and font loading
- Colour tokens and semantic use
- Spacing, radius, border, and elevation rules
- Responsive containers, breakpoints, and gutters
- Shared primitives and application-level shared components
- Hover, focus, pressed, loading, empty, error, and destructive states
- Motion language and reduced-motion behaviour
- Image treatment and aspect-ratio rules
- Accessibility requirements

Record implemented tokens and primitives, not speculative design systems.

## Design handoff checklist

Before implementation:

- inspect the approved screen and relevant states;
- identify reusable foundations already present;
- distinguish product behaviour from visual treatment;
- note desktop/mobile differences and content assumptions;
- confirm any material ambiguity.

After implementation:

- compare representative desktop and mobile sizes with the approved reference;
- verify realistic content, overflow, loading, empty, error, and interactive states where applicable;
- verify keyboard use, focus, accessible names, contrast, touch targets, and reduced motion;
- update this document only when a reusable foundation changed.
