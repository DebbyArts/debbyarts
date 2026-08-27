import type { ArtworkCategory, PricingMode } from "@/db/generated/prisma/enums"
import type { ALL_ARTWORK } from "@/features/artwork/constants"

type ArtworkFilter = ArtworkCategory | typeof ALL_ARTWORK
type ArtworkAvailability = "AVAILABLE" | "MADE_TO_ORDER" | "SOLD" | "UNAVAILABLE"

type ArtworkProjection = {
  availability: ArtworkAvailability
  category: ArtworkCategory
  description: string
  displayedPieceDimensions: string | null
  imageAlt: string
  imageHeight: number | null
  imageSrc: string | null
  imageWidth: number | null
  mediumFormat: string | null
  priceAmount: string | null
  pricingMode: PricingMode
  slug: string
  title: string
}

type StorageConfiguration = { bucket?: string; projectUrl?: string }

export type {
  ArtworkAvailability,
  ArtworkCategory,
  ArtworkFilter,
  ArtworkProjection,
  PricingMode as ArtworkPricingMode,
  StorageConfiguration,
}
