import type { Prisma } from "@/db/generated/prisma/client"
import {
  getArtworkCategoryItemLabel,
  resolveArtworkImageSource,
  type ArtworkProjection,
} from "@/features/artwork/artwork-catalogue"
import type { RequestArtworkOption } from "@/types/request-catalogue"
import {
  PUBLISHED_ARTWORK_QUERY,
  REQUEST_ARTWORK_SELECT,
} from "@/features/artwork/repositories/artwork.repository"

type PublishedArtworkRecord = Prisma.ArtworkGetPayload<{
  select: typeof PUBLISHED_ARTWORK_QUERY.select
}>
type RequestArtworkRecord = Prisma.ArtworkGetPayload<{
  select: typeof REQUEST_ARTWORK_SELECT
}>

function mapToArtworkProjection(artwork: PublishedArtworkRecord): ArtworkProjection {
  return {
    slug: artwork.slug, title: artwork.title, description: artwork.description,
    category: artwork.category, mediumFormat: artwork.mediumFormat,
    displayedPieceDimensions: artwork.displayedPieceDimensions,
    availability: artwork.availability,
    imageSrc: resolveArtworkImageSource(artwork.primaryImagePath, {
      projectUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      bucket: process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET,
    }),
    imageAlt: artwork.primaryImageAlt?.trim() || `${artwork.title}, an artwork by Debby Art & Prints`,
    imageWidth: artwork.primaryImageWidth, imageHeight: artwork.primaryImageHeight,
    pricingMode: artwork.pricingMode, priceAmount: artwork.priceAmount?.toString() ?? null,
  }
}

function mapToRequestArtworkOption(artwork: RequestArtworkRecord): RequestArtworkOption {
  return {
    id: artwork.id, slug: artwork.slug, title: artwork.title,
    categoryLabel: getArtworkCategoryItemLabel(artwork.category),
    imageSrc: resolveArtworkImageSource(artwork.primaryImagePath, {
      projectUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      bucket: process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET,
    }),
    imageAlt: artwork.primaryImageAlt?.trim() || `${artwork.title}, an artwork by Debby Art & Prints`,
    availableSizes: artwork.availableSizes, framingEnabled: artwork.framingEnabled,
    framingOptions: artwork.framingOptions, askQuantity: artwork.askQuantity,
  }
}

export {
  mapToArtworkProjection,
  mapToRequestArtworkOption,
  type PublishedArtworkRecord,
  type RequestArtworkRecord,
}
