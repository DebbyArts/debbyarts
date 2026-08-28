import {
  ALL_ARTWORK,
  ARTWORK_CATEGORY_LABELS,
  ARTWORK_CATEGORY_ORDER,
  MINIMUM_FILTERABLE_ARTWORK_COUNT,
} from "@/features/artwork/constants"
import type {
  ArtworkFilter,
  ArtworkProjection,
} from "@/features/artwork/types"

function getFilterableArtworkCategories(artworks: ArtworkProjection[]) {
  if (artworks.length < MINIMUM_FILTERABLE_ARTWORK_COUNT) return []

  const populatedCategories = ARTWORK_CATEGORY_ORDER.filter((category) =>
    artworks.some((artwork) => artwork.category === category)
  )

  return populatedCategories.length > 1 ? populatedCategories : []
}

function filterArtworks(
  artworks: ArtworkProjection[],
  filter: ArtworkFilter | string
) {
  if (filter === ALL_ARTWORK || !Object.hasOwn(ARTWORK_CATEGORY_LABELS, filter)) {
    return artworks
  }

  return artworks.filter((artwork) => artwork.category === filter)
}

function distributeArtworks(artworks: ArtworkProjection[], columnCount: number) {
  const safeColumnCount = Number.isFinite(columnCount)
    ? Math.max(1, Math.floor(columnCount))
    : 1
  const columns = Array.from(
    { length: safeColumnCount },
    () => [] as ArtworkProjection[]
  )
  const estimatedHeights = Array.from({ length: safeColumnCount }, () => 0)

  for (const artwork of artworks) {
    const minimumHeight = Math.min(...estimatedHeights)
    const columnIndex = estimatedHeights.findIndex(
      (height) => height <= minimumHeight + 0.1
    )
    const imageRatio =
      artwork.imageWidth && artwork.imageHeight
        ? artwork.imageHeight / artwork.imageWidth
        : 1.25

    columns[columnIndex].push(artwork)
    estimatedHeights[columnIndex] += imageRatio + 0.2
  }

  return columns
}

export { distributeArtworks, filterArtworks, getFilterableArtworkCategories }
