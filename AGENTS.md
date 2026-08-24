# Debby Art & Prints agent rules

- Read `docs/engineering-architecture.md` before changing project structure or shared areas.
- Inspect existing code and patterns before adding files. Keep changes small and feature-owned.
- Keep feature-specific UI, server logic, schemas, hooks, utilities, types, and tests in `src/features/<feature>/` until reuse is demonstrated.
- Use `src/components/ui/` for low-level shadcn/base primitives and `src/components/shared/` only for proven cross-feature application UI.
- Keep `src/app/` focused on routes, layouts, metadata, boundaries, and feature composition. Use React Server Components by default and small Client Component islands only where interactivity requires them.
- Treat Paper Design final implementation references as the visual source of truth. The latest Notion Website Structure governs product behaviour; do not invent missing decisions.
- Run the checks relevant to the change, including lint, type checking, tests, and a production build when appropriate. Add tests only where they protect meaningful behaviour.
- Ordinary work may occur on `main` only when explicitly instructed. Do not invoke or reproduce the milestone workflow unless the user says `Run Active Milestone`.
- Parallel agents should stay inside their assigned feature. Changes to shared areas must be minimal, intentional, and checked for existing equivalents first.
- Never inspect secret environment files or expose credentials. Use `.env.example` and documented variable names only.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
