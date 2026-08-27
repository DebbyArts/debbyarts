import "dotenv/config"

import { defineConfig } from "prisma/config"

const migrationDatabaseUrl =
  process.env.DIRECT_URL || process.env.DATABASE_URL

export default defineConfig({
  schema: "src/db/schema.prisma",
  migrations: {
    path: "src/db/migrations",
    seed: "tsx src/db/seed/index.ts",
  },
  ...(migrationDatabaseUrl
    ? { datasource: { url: migrationDatabaseUrl } }
    : {}),
})
