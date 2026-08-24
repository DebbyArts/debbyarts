# Design Foundations

This document records the shared visual system translated from the approved Debby Art & Prints Paper file. It defines reusable foundations only; final screens remain the authority when a page is implemented.

## Paper sources reviewed

- [Finalised Public Website](https://app.paper.design/file/01M0PQ3DWC0N44Y66V1JY6N6WJ/2-0): final desktop/mobile public screens and request states.
- [Final Admin Implementation Reference](https://app.paper.design/file/01M0PQ3DWC0N44Y66V1JY6N6WJ/3-0): final owner-facing density, fields, feedback, and destructive states.
- [Design Workspace](https://app.paper.design/file/01M0PQ3DWC0N44Y66V1JY6N6WJ/1-0): core tokens, interaction states, reusable patterns, and implementation notes.

If an exploratory specimen differs from a final screen, the final screen wins.

## Typography

Fonts load once in the root layout through `next/font`:

- **Archivo Black 400** is the display face for headings.
- **Manrope 200–800** is the body, label, navigation, and control face.

The coded hierarchy uses `.type-display`, `.type-h1`, `.type-h2`, `.type-h3`, `.type-body-lg`, `.type-body`, and `.type-label`. Display utilities use the approved compact mobile sizes and move to the Paper desktop scale at `64rem`.

| Style | Desktop size / line height | Core treatment |
| --- | --- | --- |
| Display | 96 / 90px | Archivo Black, -0.04em |
| H1 | 72 / 72px | Archivo Black, -0.04em |
| H2 | 52 / 54px | Archivo Black, -0.04em |
| H3 | 36 / 40px | Archivo Black, -0.03em |
| Body large | 20 / 30px | Manrope 400 |
| Body | 16 / 26px | Manrope 400 |
| Label | 12 / 16px | Manrope 800, uppercase, 0.08em |

Use smaller final-screen values only where Paper explicitly shows them; do not create new global type styles for one-off copy.

## Semantic colours

Use semantic Tailwind classes such as `bg-background`, `text-foreground`, `bg-primary`, `border-border`, and `ring-ring`. Do not repeat Paper hex values in components.

| Role | Value | Paper role |
| --- | --- | --- |
| Background | `#F5F0E6` | Workshop paper |
| Foreground / border | `#1F1E1B` | Registration ink |
| Card / popover | `#FFFFFF` | Canvas white |
| Muted surface | `#DCEFF2` | Quiet cyan surface |
| Muted text | `#625C54` | Secondary copy |
| Primary | `#CF2E78` | Screen magenta action |
| Primary hover / active | `#B72165` / `#98194F` | Approved action states |
| Focus / selected / warning | `#F2C84B` | Maker yellow |
| Info | `#269DB8` | Studio cyan |
| Success | `#2F7D54` | Admin success |
| Destructive | `#B3261E` | Admin destructive |

Final admin feedback extends these roles with exact quiet surfaces and borders: success `#E7F2EA / #BFD8C8`, destructive `#FBE6E3 / #DCA7A2`, and warning `#FFF4D0 / #E7C85D`. No dark theme is defined because Paper does not provide one.

## Spacing and density

Use Tailwind's existing `4px` rhythm. Paper's recurring values map directly to `1, 2, 3, 4, 6, 8, 12, 16, 20, 30` (4–120px).

- Public sections generally use `py-20` on mobile and grow toward `py-30` on desktop.
- Public content groups commonly use 24–32px gaps.
- Form groups use 16–24px gaps.
- Admin sections use a compact 32–48px rhythm with 20–28px internal gaps.
- Default admin controls are 48px; public primary actions may use the 52px `lg` button size.

Do not add a spacing token when the Tailwind scale already matches Paper.

## Radius, borders, and elevation

- `radius-xs`: 4px for compact internal items.
- `radius-sm`: 8px for controls and buttons.
- `radius-md`: 16px for larger panels/dialog surfaces.
- `radius-lg`: 28px for rare expressive public surfaces.
- `radius-pill`: 999px for pills, radios, and switches.

The system is deliberately flat. Standard controls use a 1px ink border; selectable cards and validation emphasis use 2px; keyboard focus uses a visible 3px Maker Yellow ring. Prefer borders and surface shifts over generic shadows. Floating select content uses a subtle border without ornamental elevation.

## Responsive container

`Container` in `src/components/shared/container.tsx` is the single page-content convention. Its outer shell caps at 1440px, producing the approved 1280px content width with desktop gutters.

Gutters are:

- 20px by default, matching the 390px final mobile screens;
- 32px from 768px;
- 64px from 1024px;
- 80px from 1440px.

For full-width Paper surfaces, make the section full width and place `Container` inside it. Do not add a second competing container abstraction.

## Controls and states

The foundational shadcn primitives are Button, Input, Textarea, Label, Select, Checkbox, Radio Group, and Switch.

- Default controls use white surfaces, ink borders, and 48px height.
- Hover uses a 150–220ms ease-out surface change; primary actions rise 2px.
- Pressed actions move down 1px and use the approved active magenta.
- Focus uses a 3px yellow ring; form controls also shift their border to Studio Cyan.
- Disabled controls use the approved neutral fill and border, retain readable text, and cannot receive pointer interaction.
- Selected checkboxes/switches use magenta. Selected radios use an ink field with a yellow centre.
- Invalid controls require `aria-invalid="true"`, a 2px destructive border, and visible text guidance near the field.
- Loading buttons use native disabled behaviour plus `aria-busy="true"`; feature code owns the loading label or indicator.
- Motion-reduction preferences remove translation/scale while retaining colour and border state changes.

Every control needs an accessible name. Use `Label` with matching `htmlFor`/`id`, make grouped choices use a visible group label, and do not communicate status through colour alone.

## shadcn usage

- Keep primitives in `src/components/ui/` and modify them at the source when the shared Paper language changes.
- Use token-based classes instead of feature-specific colours in primitives.
- Prefer the existing primitive before creating a parallel raw control.
- Add Dialog or other shadcn components only when a real feature needs them.
- Feature-specific cards, request fields, route content, and shell variations stay in their owning feature until reuse is proven.

## Shared application primitives

The proven public shell lives in `src/features/site/`: `PublicHeader`, `PublicFooter`, `PublicShell`, and the small interactive mobile menu. It owns only the known `/`, `/art`, `/services`, and `/request` destinations. Public page content remains feature-owned.

Cross-domain application primitives live in `src/components/shared/`:

- `AdminShell` provides the final desktop sidebar and mobile section switcher. Feature routes pass the active section and content; authentication supplies the optional account action.
- `MediaImage` standardises responsive `next/image` rendering, required `sizes`, deliberate alt text, aspect-ratio ownership, and a no-source fallback without hiding feature-specific image decisions.
- `SelectableOption` is the domain-neutral radio selection surface used by the approved request patterns.
- `EmptyState`, `LoadingState`, `ErrorState`, and `FeedbackBanner` implement the compact, recoverable feedback treatments shown in the final Admin reference.
- `ConfirmationDialog` composes the Paper-styled Alert Dialog foundation for consequential actions without containing delete, unpublish, or other domain behaviour.

Low-level `Field` composition and the existing Input, Textarea, Select, Checkbox, Switch, and Radio Group controls remain in `src/components/ui/`. A field should use a matching label/control ID, connect supporting/error copy through `aria-describedby`, set `aria-invalid` when an error exists, and keep validation logic in the owning feature.

Do not add Artwork cards, Service cards, enquiry rows, schemas, request-mode logic, or CRUD behaviour to this shared layer. If a feature needs a visual variation only once, keep it local until a second real use proves promotion.
