import type { HomePageProps } from "@/features/home/types"

import { FeaturedArtwork } from "./components/featured-artwork"
import { FinalRequestCta } from "./components/final-request-cta"
import { Hero } from "./components/hero"
import { OfferRoutes } from "./components/offer-routes"
import { OrderingEssentials } from "./components/ordering-essentials"
import { RequestProcess } from "./components/request-process"

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
