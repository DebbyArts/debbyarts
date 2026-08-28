import { FeaturedArtwork } from "@/components/home/FeaturedArtwork"
import { FinalRequestCta } from "@/components/home/FinalRequestCta"
import { Hero } from "@/components/home/Hero"
import { OfferRoutes } from "@/components/home/OfferRoutes"
import { OrderingEssentials } from "@/components/home/OrderingEssentials"
import { RequestProcess } from "@/components/home/RequestProcess"
import { PublicShell } from "@/components/shared/public/public-shell"
import { getFeaturedArtwork } from "@/features/artwork"

export const dynamic = "force-dynamic"

export default async function Home() {
  const featuredArtwork = await getFeaturedArtwork()

  return (
    <PublicShell activePath="/">
      <Hero />
      <FeaturedArtwork result={featuredArtwork} />
      <OfferRoutes />
      <RequestProcess />
      <OrderingEssentials />
      <FinalRequestCta />
    </PublicShell>
  )
}
