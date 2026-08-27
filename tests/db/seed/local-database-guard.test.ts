import { describe, expect, test } from "vitest"

import { assertLocalDatabaseTargets } from "@/db/seed/local-database-guard"

describe("local database reset guard", () => {
  test("accepts PostgreSQL targets on local loopback hosts", () => {
    expect(() =>
      assertLocalDatabaseTargets({
        DATABASE_URL: "postgresql://localhost:5432/debbyarts",
        DIRECT_URL: "postgres://127.0.0.1:5432/debbyarts",
      })
    ).not.toThrow()
  })

  test("rejects missing, remote, and non-PostgreSQL targets before reset", () => {
    expect(() => assertLocalDatabaseTargets({})).toThrow(
      "DATABASE_URL is required"
    )
    expect(() =>
      assertLocalDatabaseTargets({
        DATABASE_URL: "postgresql://db.example.com/debbyarts",
      })
    ).toThrow("only permits localhost")
    expect(() =>
      assertLocalDatabaseTargets({
        DATABASE_URL: "https://localhost/debbyarts",
      })
    ).toThrow("valid PostgreSQL URL")
  })
})
