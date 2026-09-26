import type { Metadata } from "next"

import { ArtworkPage } from "@/features/artwork"
import { PublicShell } from "@/components/shared/public/public-shell"
import { createPageMetadata } from "../site-metadata"

export const metadata: Metadata = createPageMetadata({
  title: "Art & Gallery",
  description:
    "Browse original paintings, portraits, framed pieces and digital artwork by Debby Art & Prints.",
  path: "/art",
})

export default function ArtRoute() {
  return (
    <PublicShell activePath="/art">
      <ArtworkPage />
    </PublicShell>
  )
}
