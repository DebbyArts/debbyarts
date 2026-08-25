import type { Metadata } from "next"

import { ArtworkPage } from "@/features/artwork/artwork-page"
import { PublicShell } from "@/components/shared/public/public-shell"

export const metadata: Metadata = {
  title: "Art & Gallery | Debby Art & Prints",
  description:
    "Browse original paintings, portraits, framed pieces and digital artwork by Debby Art & Prints.",
}

export default function ArtRoute() {
  return (
    <PublicShell activePath="/art">
      <ArtworkPage />
    </PublicShell>
  )
}
