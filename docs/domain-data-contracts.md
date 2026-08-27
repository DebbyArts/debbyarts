# Domain and Data Contracts

This document defines the simplified V1 domain and persistence model for Debby Art & Prints. The latest Website Structure governs product behaviour; the approved Paper V1 Simplification frames govern the Admin configuration surface.

## Source of truth and ownership

- `src/db/schema.prisma` is the source of truth for persisted Artwork, Service, Enquiry, and their enums.
- Prisma-generated entity and enum types live in the ignored `src/db/generated/prisma/` directory. Regenerate them after schema changes with `npm run db:generate`.
- Feature server code may import entity types and Prisma payload/select utilities from `@/db/generated/prisma/client`.
- Client Components must not import the server client. Browser-safe enum values may be imported from `@/db/generated/prisma/enums`; create a separate projection only when a real serialization or data-exposure boundary requires it.
- Do not manually recreate a full Prisma row as an application interface.

Feature behaviour and queries remain feature-owned. `src/db/client.ts` provides the single shared Prisma client instance; it is not a repository, service, or DAO layer.

## Artwork

Artwork is one public catalogue record with:

- a unique slug, title, description, controlled category, optional combined medium/format, and optional displayed-piece dimensions;
- availability: `AVAILABLE`, `MADE_TO_ORDER`, `SOLD`, or `UNAVAILABLE`;
- one optional primary/cover-image object path plus alt text and intrinsic dimensions;
- up to seven ordered additional images, each with its own immutable Storage path, alt text, and intrinsic dimensions; the public gallery is therefore capped at eight images including the cover;
- shared pricing mode and optional amount;
- `published`, `featured`, display order, and timestamps.

Draft means `published = false`; there is no publication state machine. Publishing validation must require the content and image fields needed by the public site.

Artwork request configuration is deliberately direct:

- `availableSizes: String[]`
- `framingEnabled: Boolean`
- `framingOptions: String[]`
- `askQuantity: Boolean`

There are no request modes, unavailable-item request rules, delivery overrides, additional images, or dynamic questions.

## Service

Service is one public catalogue record with:

- a unique slug, name, description, and controlled group;
- one optional primary-image object path plus alt text and intrinsic dimensions;
- the shared pricing mode and optional amount;
- `published`, display order, and timestamps.

Service groups are fixed V1 product values:

- `PERSONALISED_PRODUCTS`
- `PRINT_EVENT_MATERIALS`
- `BRANDING_SIGNAGE`

Service has no featured flag.

Service request configuration contains six fixed questions:

- `askQuantity`
- `askSizeFormat` plus `sizeFormatOptions: String[]`
- `askDesignReadiness`
- `askColour`
- `askMaterial` plus `materialOptions: String[]`
- `askFinish`

Only the size/format and material questions have owner-configured text options. Design Readiness uses the fixed labels in `src/features/services/design-readiness.ts`. Quantity is a number, not a preset list. Colour and finish collect the customer's relevant value without owner-built option sets.

## Enquiry

An Enquiry is saved before WhatsApp handoff and receives a unique reference. A failed save must not open WhatsApp.

Each Enquiry stores:

- status: `NEW`, `CONTACTED`, or `RESOLVED`;
- request kind: `ARTWORK` or `SERVICE`;
- the relevant optional Artwork or Service relation, using `SetNull` on catalogue deletion;
- item name and slug snapshots so history remains understandable after deletion;
- predictable request answers: quantity, size/format, framing, Design Readiness, colour, material, and finish;
- optional delivery/pickup method, location, and preferred date collected by the normal request flow;
- customer name, normalized WhatsApp phone, optional email, and optional note;
- optional deterministic WhatsApp summary and handoff timestamp;
- created and updated timestamps.

The initial migration enforces positive quantities, relation/request-kind coherence, and Artwork-versus-Service answer scope. There is no request-mode column, JSON answer bag, question table, or dynamic answer engine.

## Shared product concepts

### Pricing

`PricingMode` is shared by Artwork and Service:

- `NONE` — presentation derives “Price on request” and no amount is stored;
- `EXACT` — presentation derives the formatted amount;
- `STARTING_FROM` — presentation derives “From” plus the formatted amount.

Amounts use PostgreSQL `Decimal(12,2)`. Currency is fixed to NGN in V1, so it is application configuration rather than a repeated database field. Migration checks require a positive amount for `EXACT` and `STARTING_FROM`, and no amount for `NONE`.

### Categories

Artwork categories are a controlled Prisma enum because they drive public filtering and do not need owner-managed CRUD:

- `PAINTING`
- `PENCIL_PORTRAIT`
- `FRAMED_CUSTOM_ARTWORK`
- `DIGITAL_ARTWORK`

### Delivery and timing

Delivery/pickup, location, and preferred date belong to the shared request process. Catalogue records do not configure or override them.

## Database and migrations

The application uses Prisma ORM 7 with PostgreSQL hosted in a client-owned Supabase project:

- Prisma owns application tables, migrations, generated types, and data access.
- Supabase provides hosted PostgreSQL, Storage, and Auth. It is not a second application migration authority.
- `DATABASE_URL` is the pooled runtime connection used by `src/db/client.ts`.
- `DIRECT_URL` is the direct or session-pooled connection used by Prisma CLI migrations. It is optional locally because the CLI falls back to `DATABASE_URL`, but recommended for hosted migrations.
- The initial migration lives in `src/db/migrations/`. It was verified against a disposable local PostgreSQL 16 database and has not been applied to a shared or production database.

The application tables are in PostgreSQL's `public` schema with RLS enabled and no Data API policies. Prisma's server-side database role is the only application data path; keep the Supabase Data API disabled or ungranted for these tables. Future schema changes must be made in Prisma and committed as Prisma migrations.

## Image storage

Use the `catalogue-media` public Supabase Storage bucket for public Artwork and Service images. The Supabase infrastructure migration creates this repository-owned invariant; it is not an environment setting. Artwork keeps its immutable primary/cover object path directly on the catalogue row and stores any additional gallery images in its feature-owned relational table. Every object has alt text and intrinsic dimensions. Signed URLs are not persisted.

An eventual replace flow should upload and validate the new object, update the catalogue record, then delete the old unreferenced object. Upload, replace, and delete remain authenticated Admin operations. `ArtworkImage` is the only additional-image relation; there is no generic media framework or duplicate storage-metadata table.

## Admin authentication

The existing decision remains unchanged:

- Supabase Auth email OTP/magic link;
- only Deborah's normalized configured email is authorized;
- user creation is disabled for sign-in;
- SSR cookie session;
- protected `/admin` routes and every mutation repeat server-side allowlist checks;
- local email is viewed through the Supabase local stack's Mailpit;
- production uses client-owned SMTP.

No roles, customer accounts, or permissions framework is required.

## Intentional tradeoffs

- PostgreSQL text arrays are the simplest ordered representation for the four owner-managed option lists. Separate option tables would add lifecycle and query complexity with no V1 benefit.
- Direct Enquiry answer columns make the bounded request model obvious and queryable. Adding a future question requires a deliberate schema change rather than silently turning the product into a form builder.
- Item snapshots duplicate only the minimal historical label/slug needed after a catalogue record is removed; they are not duplicate domain models.
- Prisma `Decimal` values must be converted at a real server-to-client boundary. Do not introduce public projection types before a feature needs one.

## Remaining production decisions

- Confirm final category labels and seeded catalogue content.
- Approve enquiry retention/privacy wording.
- Select the client-owned Supabase region/plan and production SMTP provider.
