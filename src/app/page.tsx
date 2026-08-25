import { PublicShell } from "@/components/shared/public/public-shell"
import { getFeaturedArtwork, HomePage } from "@/features/home"

export const dynamic = "force-dynamic"

export default async function Home() {
  const featuredArtwork = await getFeaturedArtwork()

  return (
    <PublicShell activePath="/">
      <HomePage featuredArtwork={featuredArtwork} />
    </PublicShell>
  )
}
