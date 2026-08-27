import { ArtworkGallery } from "@/features/artwork/components/ArtworkGallery"
import { getPublishedArtworks } from "@/features/artwork/services/artwork.service"

async function ArtworkPage() {
  const artworks = await getPublishedArtworks()

  return <ArtworkGallery artworks={artworks} />
}

export { ArtworkPage }
