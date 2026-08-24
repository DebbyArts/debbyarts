import { HomePage } from "@/features/site/components/home-page"
import { PublicShell } from "@/features/site/components/public-shell"
import { getFeaturedArtwork } from "@/features/site/server/get-featured-artwork"

export const dynamic = "force-dynamic"

export default async function Home() {
  const featuredArtwork = await getFeaturedArtwork()

  return (
    <PublicShell activePath="/">
      <HomePage featuredArtwork={featuredArtwork} />
    </PublicShell>
  )
}
