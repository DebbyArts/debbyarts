# Environment and deployment

## Runtime and local development

Use Node.js 22 or later. This matches the current Supabase client requirement;
Next.js 16 itself has a lower minimum. Install the lockfile, create an ignored
`.env` file from the names in `.env.example`, add local values, then run:

```bash
npm ci
npm run db:validate
npm run db:generate
npm run dev
```

Next.js and Prisma both read `.env`. A local `.env.local` can override Next.js
values, but Prisma commands need the same variables in `.env` or their process
environment.

`DATABASE_URL` is required by the running application. `DIRECT_URL` is optional
for local development because `prisma.config.ts` falls back to `DATABASE_URL`;
use a direct or session-pooled connection for hosted migration commands.

## Variable ownership

| Concern | Values to set |
| --- | --- |
| Database | `DATABASE_URL`; `DIRECT_URL` for hosted Prisma migrations |
| Supabase Auth and public Storage | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` |
| Server-only Storage mutations | `SUPABASE_SECRET_KEY` |
| Admin authorization | `SUPABASE_ADMIN_EMAIL` for the single provisioned owner |
| App URL and production | No application URL variable is read. Configure Supabase Auth Site URL and `/auth/confirm` Redirect URLs for the actual local, preview (if used), and production domains. |

`catalogue-media` is fixed in `src/shared/storage/constants.ts` and created by
the Supabase infrastructure migration. Do not add a bucket environment variable
or create a bucket manually. Never expose `SUPABASE_SECRET_KEY` to the browser.

## Create and link a Supabase project

Create the client-owned Supabase project in the dashboard, then configure Auth
before sending any magic link:

1. Provision the one owner Auth user whose normalized email will be used for `SUPABASE_ADMIN_EMAIL`; sign-in intentionally uses `shouldCreateUser: false`.
2. Enable the email magic-link flow, set the production Site URL, and add exact `/auth/confirm` redirect URLs for local and production. Add preview redirects only when preview Admin sign-in is needed.
3. Configure client-owned production SMTP and retain the default Data API denial for application tables. The repository's migrations enable RLS without public-table policies.
4. Add the project URL, publishable key, server-only secret key, and PostgreSQL connection values to the appropriate local or hosting environment. Keep them out of the repository.

Authenticate and link from a developer machine. These commands intentionally do
not run as part of this repository. If this is the first Supabase CLI use in a
checkout, initialise it first and commit the generated non-secret
`supabase/config.toml` with any future Supabase configuration change:

```bash
supabase init
supabase login
supabase link --project-ref <client-project-ref>
```

Apply the two migration authorities in order, once each:

```bash
# Supabase Auth/Storage infrastructure only: supabase/migrations/
supabase db push --dry-run
supabase db push

# Application tables and Prisma migration history only: src/db/migrations/
npm run db:deploy

# Curated public objects and catalogue records
npm run db:seed
```

Do not use Prisma to create Storage/Auth objects, and do not use Supabase
dashboard or CLI migrations for application tables. Do not run `npm run
db:migrate` against a hosted environment; it is the local development command.
`npm run db:reset-local` is intentionally destructive and rejects every
non-loopback database target before Prisma runs.

## Vercel preview and production

No Vercel CLI package is committed because deployment is an operator concern,
not a runtime dependency. Install the current Vercel CLI (or invoke it through
your preferred package runner), authenticate to the client account, and link the
repository only on that operator's machine:

```bash
vercel login
vercel link
```

Set the variables from the table above in Vercel's Development, Preview, and
Production environments as applicable. `DIRECT_URL` belongs in the protected
migration environment; the deployed app only needs `DATABASE_URL` plus its
Supabase and Admin settings. Environment changes apply to future deployments,
so redeploy after changing them.

Create a preview, verify its public and Admin flows, then create a production
deployment:

```bash
vercel
vercel --prod
```

The Vercel project association is local `.vercel` state and remains ignored.
This repository contains no project IDs, account IDs, or deployment secrets.

## Client-account handover

The source repository and migrations move unchanged. The client signs into their
own Supabase and Vercel accounts, creates/links their projects, configures Auth
and SMTP, supplies their environment values, applies the migrations above, and
seeds the catalogue. No code change, data export, or developer-account binding
is required. Retire the developer's provider access only after the client-owned
preview and production flows have been verified.
