import { ArtworkLoading } from "@/features/artwork/components/artwork-loading"
import { PublicShell } from "@/components/shared/public/public-shell"

export default function ArtLoading() {
  return (
    <PublicShell activePath="/art">
      <ArtworkLoading />
    </PublicShell>
  )
}
