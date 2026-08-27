import { spawn } from "node:child_process"

function assertLocalDatabaseUrl(value: string, name: string) {
  let hostname: string
  try {
    hostname = new URL(value).hostname
  } catch {
    throw new Error(`${name} must be a valid PostgreSQL URL.`)
  }

  if (!["localhost", "127.0.0.1", "::1"].includes(hostname)) {
    throw new Error("db:reset-local only permits localhost database targets.")
  }
}

function assertLocalDatabaseTargets() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required because the seed uses it.")
  }
  assertLocalDatabaseUrl(databaseUrl, "DATABASE_URL")

  if (process.env.DIRECT_URL) {
    assertLocalDatabaseUrl(process.env.DIRECT_URL, "DIRECT_URL")
  }
}

function runPrisma(args: string[]) {
  const command = process.platform === "win32" ? "npx.cmd" : "npx"
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, ["prisma", ...args], { stdio: "inherit" })
    child.once("error", reject)
    child.once("exit", (code) => {
      if (code === 0) resolve()
      else reject(new Error(`Prisma ${args.join(" ")} failed.`))
    })
  })
}

async function main() {
  assertLocalDatabaseTargets()
  await runPrisma(["migrate", "reset", "--force"])
  await runPrisma(["db", "seed"])
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Local reset failed.")
  process.exitCode = 1
})
