import { resolvePublicStorageObjectUrl } from "@/shared/storage/public-url"
import type { HomeArtwork, HomeArtworkRecord } from "@/features/home/types"

function mapToHomeArtwork(artwork: HomeArtworkRecord): HomeArtwork {
  const { primaryImagePath, ...projection } = artwork

  return {
    ...projection,
    primaryImageUrl: resolvePublicStorageObjectUrl(primaryImagePath),
  }
}

export { mapToHomeArtwork }
