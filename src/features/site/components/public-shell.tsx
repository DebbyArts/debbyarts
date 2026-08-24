import type { ReactNode } from "react"

import { PublicFooter } from "@/features/site/components/public-footer"
import { PublicHeader } from "@/features/site/components/public-header"
import type { PublicPath } from "@/features/site/navigation"

type PublicShellProps = {
  activePath: PublicPath
  children: ReactNode
}

function PublicShell({ activePath, children }: PublicShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader activePath={activePath} />
      <main className="flex-1">{children}</main>
      <PublicFooter activePath={activePath} />
    </div>
  )
}

export { PublicShell, type PublicShellProps }
