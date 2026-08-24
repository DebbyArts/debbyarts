import { ArtworkGallery } from "@/features/artwork/components/artwork-gallery"
import { getPublishedArtworks } from "@/features/artwork/server/get-published-artworks"

async function ArtworkPage() {
  const artworks = await getPublishedArtworks()

  return <ArtworkGallery artworks={artworks} />
}

export { ArtworkPage }
