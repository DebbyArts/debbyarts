import type { Prisma } from "@/db/generated/prisma/client"
import {
  ARTWORK_CATEGORY_ITEM_LABELS,
  ARTWORK_CATEGORY_LABELS,
  AVAILABILITY_LABELS,
} from "@/features/artwork/constants"
import type { RequestArtworkOption } from "@/shared/types/request-catalogue"
import {
  ADMIN_ARTWORK_LIST_SELECT,
  ARTWORK_EDITOR_SELECT,
  ARTWORK_OPTIONS_SELECT,
  PUBLISHED_ARTWORK_QUERY,
  REQUEST_ARTWORK_SELECT,
} from "@/features/artwork/repositories/artwork.repository"
import type {
  ArtworkAdminListItem,
  ArtworkEditorValue,
  ArtworkOptionsValue,
  ArtworkProjection,
} from "@/features/artwork/types"
import { resolvePublicStorageObjectUrl } from "@/shared/utils/storage"

type PublishedArtworkRecord = Prisma.ArtworkGetPayload<{
  select: typeof PUBLISHED_ARTWORK_QUERY.select
}>
type RequestArtworkRecord = Prisma.ArtworkGetPayload<{
  select: typeof REQUEST_ARTWORK_SELECT
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

function getArtworkPriceLabel(
  artwork: Pick<ArtworkProjection, "priceAmount" | "pricingMode">
) {
  if (artwork.pricingMode === "NONE" || !artwork.priceAmount) {
    return "Price on request"
  }

  const amount = Number(artwork.priceAmount)

  if (!Number.isFinite(amount)) return "Price on request"

  const formattedAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)

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

  return { ...projection, priceLabel: getArtworkPriceLabel(projection) }
}

function mapToRequestArtworkOption(artwork: RequestArtworkRecord): RequestArtworkOption {
  return {
    id: artwork.id, slug: artwork.slug, title: artwork.title,
    categoryLabel: ARTWORK_CATEGORY_ITEM_LABELS[artwork.category],
    imageSrc: resolvePublicStorageObjectUrl(artwork.primaryImagePath),
    imageAlt: artwork.primaryImageAlt?.trim() || `${artwork.title}, an artwork by Debby Art & Prints`,
    availableSizes: artwork.availableSizes, framingEnabled: artwork.framingEnabled,
    framingOptions: artwork.framingOptions, askQuantity: artwork.askQuantity,
  }
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

export {
  mapToArtworkProjection,
  mapToArtworkAdminListItem,
  mapToArtworkEditorValue,
  mapToArtworkOptionsValue,
  mapToRequestArtworkOption,
  getArtworkPriceLabel,
  type PublishedArtworkRecord,
  type RequestArtworkRecord,
}
