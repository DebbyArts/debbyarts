import { spawn } from "node:child_process"

import { assertLocalDatabaseTargets } from "@/db/seed/local-database-guard"

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
  assertLocalDatabaseTargets({
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
  })
  await runPrisma(["migrate", "reset", "--force"])
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Local reset failed.")
  process.exitCode = 1
})
