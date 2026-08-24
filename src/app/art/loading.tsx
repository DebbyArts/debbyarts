import { ArtworkLoading } from "@/features/artwork/components/artwork-loading"
import { PublicShell } from "@/features/site/components/public-shell"

export default function ArtLoading() {
  return (
    <PublicShell activePath="/art">
      <ArtworkLoading />
    </PublicShell>
  )
}
