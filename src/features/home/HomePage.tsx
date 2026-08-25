import type { HomePageProps } from "@/features/home/types"

import { FeaturedArtwork } from "./components/FeaturedArtwork"
import { FinalRequestCta } from "./components/FinalRequestCta"
import { Hero } from "./components/Hero"
import { OfferRoutes } from "./components/OfferRoutes"
import { OrderingEssentials } from "./components/OrderingEssentials"
import { RequestProcess } from "./components/RequestProcess"

function HomePage({ featuredArtwork }: HomePageProps) {
  return (
    <>
      <Hero />
      <FeaturedArtwork result={featuredArtwork} />
      <OfferRoutes />
      <RequestProcess />
      <OrderingEssentials />
      <FinalRequestCta />
    </>
  )
}

export { HomePage, type HomePageProps }
