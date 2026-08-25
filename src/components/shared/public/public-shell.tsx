import type { ReactNode } from "react"

import { PublicFooter } from "@/components/shared/public/public-footer"
import { PublicHeader } from "@/components/shared/public/public-header"
import type { PublicPath } from "@/components/shared/public/navigation"

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
