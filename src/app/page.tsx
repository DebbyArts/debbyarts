import { HomePage } from "@/features/home/home-page"
import { PublicShell } from "@/components/shared/public/public-shell"
import { getFeaturedArtwork } from "@/features/home/services/artwork.service"

export const dynamic = "force-dynamic"

export default async function Home() {
  const featuredArtwork = await getFeaturedArtwork()

  return (
    <PublicShell activePath="/">
      <HomePage featuredArtwork={featuredArtwork} />
    </PublicShell>
  )
}
