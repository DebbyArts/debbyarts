import { resolvePublicStorageObjectUrl } from "@/shared/utils/storage"
import type { HomeArtwork, HomeArtworkRecord } from "@/features/home/types"

function mapToHomeArtwork(artwork: HomeArtworkRecord): HomeArtwork {
  const { primaryImagePath, ...projection } = artwork

  return {
    ...projection,
    primaryImageUrl: resolvePublicStorageObjectUrl(primaryImagePath),
  }
}

export { mapToHomeArtwork }
