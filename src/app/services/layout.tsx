import type { ReactNode } from "react"

import { PublicShell } from "@/components/shared/public/public-shell"

function ServicesLayout({ children }: { children: ReactNode }) {
  return <PublicShell activePath="/services">{children}</PublicShell>
}

export default ServicesLayout
