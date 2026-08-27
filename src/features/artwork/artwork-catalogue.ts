import {
  ALL_ARTWORK,
  ARTWORK_CATEGORY_ITEM_LABELS,
  ARTWORK_CATEGORY_LABELS,
  ARTWORK_CATEGORY_ORDER,
  AVAILABILITY_LABELS,
  COMMISSION_REQUEST_HREF,
  MINIMUM_FILTERABLE_ARTWORK_COUNT,
} from "@/features/artwork/constants"
import type {
  ArtworkAvailability,
  ArtworkCategory,
  ArtworkFilter,
  ArtworkProjection,
  StorageConfiguration,
} from "@/features/artwork/types"

function getArtworkCategoryLabel(category: ArtworkCategory) {
  return ARTWORK_CATEGORY_LABELS[category]
}

function getArtworkCategoryItemLabel(category: ArtworkCategory) {
  return ARTWORK_CATEGORY_ITEM_LABELS[category]
}

function getArtworkAvailabilityLabel(availability: ArtworkAvailability) {
  return AVAILABILITY_LABELS[availability]
}

function getUsefulArtworkCategories(artworks: ArtworkProjection[]) {
  if (artworks.length < MINIMUM_FILTERABLE_ARTWORK_COUNT) return []

  const populatedCategories = ARTWORK_CATEGORY_ORDER.filter((category) =>
    artworks.some((artwork) => artwork.category === category)
  )

  return populatedCategories.length > 1 ? populatedCategories : []
}

function filterArtworks(artworks: ArtworkProjection[], filter: ArtworkFilter | string) {
  if (filter === ALL_ARTWORK || !Object.hasOwn(ARTWORK_CATEGORY_LABELS, filter)) {
    return artworks
  }

  return artworks.filter((artwork) => artwork.category === filter)
}

function distributeArtworks(artworks: ArtworkProjection[], columnCount: number) {
  const safeColumnCount = Number.isFinite(columnCount)
    ? Math.max(1, Math.floor(columnCount))
    : 1
  const columns = Array.from({ length: safeColumnCount }, () => [] as ArtworkProjection[])
  const estimatedHeights = Array.from({ length: safeColumnCount }, () => 0)

  for (const artwork of artworks) {
    const minimumHeight = Math.min(...estimatedHeights)
    const columnIndex = estimatedHeights.findIndex((height) => height <= minimumHeight + 0.1)
    const imageRatio = artwork.imageWidth && artwork.imageHeight
      ? artwork.imageHeight / artwork.imageWidth
      : 1.25
    columns[columnIndex].push(artwork)
    estimatedHeights[columnIndex] += imageRatio + 0.2
  }

  return columns
}

function buildArtworkRequestHref(slug: string) {
  return `/request?artwork=${encodeURIComponent(slug)}`
}

function formatArtworkPrice(artwork: Pick<ArtworkProjection, "priceAmount" | "pricingMode">) {
  if (artwork.pricingMode === "NONE" || !artwork.priceAmount) return "Price on request"
  const amount = Number(artwork.priceAmount)
  if (!Number.isFinite(amount)) return "Price on request"
  const formattedAmount = new Intl.NumberFormat("en-NG", {
    style: "currency", currency: "NGN", minimumFractionDigits: 0, maximumFractionDigits: 2,
  }).format(amount)
  return artwork.pricingMode === "STARTING_FROM" ? `From ${formattedAmount}` : formattedAmount
}

function resolveArtworkImageSource(objectPath: string | null, storage: StorageConfiguration) {
  const trimmedPath = objectPath?.trim()
  if (!trimmedPath) return null
  if (trimmedPath.startsWith("/")) return trimmedPath
  if (/^[a-z][a-z\d+.-]*:\/\//i.test(trimmedPath)) return null
  const projectUrl = storage.projectUrl?.trim()
  const bucket = storage.bucket?.trim()
  if (!projectUrl || !bucket) return null
  try {
    const baseUrl = new URL(projectUrl)
    if (baseUrl.protocol !== "https:") return null
    const encodedObjectPath = trimmedPath.split("/").filter(Boolean).map(encodeURIComponent).join("/")
    return new URL(`/storage/v1/object/public/${encodeURIComponent(bucket)}/${encodedObjectPath}`, baseUrl).toString()
  } catch {
    return null
  }
}§

export {
  ALL_ARTWORK,
  COMMISSION_REQUEST_HREF,
  buildArtworkRequestHref,
  distributeArtworks,
  filterArtworks,
  formatArtworkPrice,
  getArtworkAvailabilityLabel,
  getArtworkCategoryItemLabel,
  getArtworkCategoryLabel,
  getUsefulArtworkCategories,
  resolveArtworkImageSource,
}
export type { ArtworkFilter, ArtworkProjection }
