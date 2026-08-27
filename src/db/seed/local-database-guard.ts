type DatabaseEnvironment = {
  DATABASE_URL?: string
  DIRECT_URL?: string
}

function assertLocalDatabaseUrl(value: string, name: string) {
  let url: URL

  try {
    url = new URL(value)
  } catch {
    throw new Error(`${name} must be a valid PostgreSQL URL.`)
  }

  if (!["postgres:", "postgresql:"].includes(url.protocol)) {
    throw new Error(`${name} must be a valid PostgreSQL URL.`)
  }

  if (!["localhost", "127.0.0.1", "::1"].includes(url.hostname)) {
    throw new Error("db:reset-local only permits localhost database targets.")
  }
}

function assertLocalDatabaseTargets(environment: DatabaseEnvironment) {
  const databaseUrl = environment.DATABASE_URL
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required because the seed uses it.")
  }
  assertLocalDatabaseUrl(databaseUrl, "DATABASE_URL")

  if (environment.DIRECT_URL) {
    assertLocalDatabaseUrl(environment.DIRECT_URL, "DIRECT_URL")
  }
}

export { assertLocalDatabaseTargets }
