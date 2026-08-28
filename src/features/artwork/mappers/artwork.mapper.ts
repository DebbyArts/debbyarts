import type { Prisma } from "@/db/generated/prisma/client"
import {
  ARTWORK_CATEGORY_ITEM_LABELS,
  ARTWORK_CATEGORY_LABELS,
  AVAILABILITY_LABELS,
} from "@/features/artwork/constants"
import {
  ADMIN_ARTWORK_LIST_SELECT,
  ARTWORK_EDITOR_SELECT,
  ARTWORK_OPTIONS_SELECT,
  PUBLISHED_ARTWORK_QUERY,
} from "@/features/artwork/repositories/artwork.queries"
import type {
  ArtworkAdminListItem,
  ArtworkEditorValue,
  ArtworkOptionsValue,
  ArtworkProjection,
  FeaturedArtwork,
  FeaturedArtworkRecord,
} from "@/features/artwork/types"
import { formatNgn } from "@/shared/utils/format-ngn"
import { resolvePublicStorageObjectUrl } from "@/shared/storage/public-url"

type PublishedArtworkRecord = Prisma.ArtworkGetPayload<{
  select: typeof PUBLISHED_ARTWORK_QUERY.select
}>
type AdminArtworkListRecord = Prisma.ArtworkGetPayload<{
  select: typeof ADMIN_ARTWORK_LIST_SELECT
}>
type ArtworkEditorRecord = Prisma.ArtworkGetPayload<{
  select: typeof ARTWORK_EDITOR_SELECT
}>
type ArtworkOptionsRecord = Prisma.ArtworkGetPayload<{
  select: typeof ARTWORK_OPTIONS_SELECT
}>

function deriveArtworkPriceLabel(
  artwork: Pick<ArtworkProjection, "priceAmount" | "pricingMode">
) {
  if (artwork.pricingMode === "NONE" || !artwork.priceAmount) {
    return "Price on request"
  }

  const amount = Number(artwork.priceAmount)

  if (!Number.isFinite(amount)) return "Price on request"

  const formattedAmount = formatNgn(amount)

  return artwork.pricingMode === "STARTING_FROM"
    ? `From ${formattedAmount}`
    : formattedAmount
}

function mapToArtworkProjection(artwork: PublishedArtworkRecord): ArtworkProjection {
  const projection = {
    slug: artwork.slug, title: artwork.title, description: artwork.description,
    category: artwork.category, mediumFormat: artwork.mediumFormat,
    displayedPieceDimensions: artwork.displayedPieceDimensions,
    availability: artwork.availability,
    categoryLabel: ARTWORK_CATEGORY_LABELS[artwork.category],
    categoryItemLabel: ARTWORK_CATEGORY_ITEM_LABELS[artwork.category],
    availabilityLabel: AVAILABILITY_LABELS[artwork.availability],
    imageSrc: resolvePublicStorageObjectUrl(artwork.primaryImagePath),
    imageAlt: artwork.primaryImageAlt?.trim() || `${artwork.title}, an artwork by Debby Art & Prints`,
    imageWidth: artwork.primaryImageWidth, imageHeight: artwork.primaryImageHeight,
    pricingMode: artwork.pricingMode, priceAmount: artwork.priceAmount?.toString() ?? null,
    requestHref: `/request?artwork=${encodeURIComponent(artwork.slug)}`,
    gallery: [
      {
        id: "cover",
        src: resolvePublicStorageObjectUrl(artwork.primaryImagePath),
        alt:
          artwork.primaryImageAlt?.trim() ||
          `${artwork.title}, an artwork by Debby Art & Prints`,
        width: artwork.primaryImageWidth,
        height: artwork.primaryImageHeight,
      },
      ...artwork.additionalImages.map((image) => ({
        id: image.id,
        src: resolvePublicStorageObjectUrl(image.storagePath),
        alt:
          image.altText?.trim() ||
          `${artwork.title}, additional artwork image`,
        width: image.width,
        height: image.height,
      })),
    ],
  }

  return { ...projection, priceLabel: deriveArtworkPriceLabel(projection) }
}

function mapToArtworkAdminListItem(
  artwork: AdminArtworkListRecord
): ArtworkAdminListItem {
  return {
    id: artwork.id,
    title: artwork.title,
    category: artwork.category,
    availability: artwork.availability,
    imageUrl: resolvePublicStorageObjectUrl(artwork.primaryImagePath),
    primaryImageAlt: artwork.primaryImageAlt,
    published: artwork.published,
    featured: artwork.featured,
    displayOrder: artwork.displayOrder,
  }
}

function mapToArtworkEditorValue(
  artwork: ArtworkEditorRecord
): ArtworkEditorValue {
  return {
    id: artwork.id,
    title: artwork.title,
    description: artwork.description,
    category: artwork.category,
    mediumFormat: artwork.mediumFormat,
    displayedPieceDimensions: artwork.displayedPieceDimensions,
    availability: artwork.availability,
    imageUrl: resolvePublicStorageObjectUrl(artwork.primaryImagePath),
    primaryImagePath: artwork.primaryImagePath,
    primaryImageAlt: artwork.primaryImageAlt,
    pricingMode: artwork.pricingMode,
    priceAmount: artwork.priceAmount?.toString() ?? null,
    published: artwork.published,
    featured: artwork.featured,
    displayOrder: artwork.displayOrder,
    additionalImages: artwork.additionalImages.map((image) => ({
      id: image.id,
      storagePath: image.storagePath,
      altText: image.altText,
      width: image.width,
      height: image.height,
      imageUrl: resolvePublicStorageObjectUrl(image.storagePath),
    })),
  }
}

function mapToArtworkOptionsValue(
  artwork: ArtworkOptionsRecord
): ArtworkOptionsValue {
  return artwork
}

function mapToFeaturedArtwork(
  artwork: FeaturedArtworkRecord
): FeaturedArtwork {
  const { primaryImagePath, ...projection } = artwork

  return {
    ...projection,
    primaryImageUrl: resolvePublicStorageObjectUrl(primaryImagePath),
  }
}

export {
  mapToArtworkProjection,
  mapToArtworkAdminListItem,
  mapToArtworkEditorValue,
  mapToArtworkOptionsValue,
  type PublishedArtworkRecord,
  mapToFeaturedArtwork,
}
