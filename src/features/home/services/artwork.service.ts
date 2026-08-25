import { mapToHomeArtwork } from "@/features/home/mappers/artwork.mapper"
import { findFeaturedArtwork } from "@/features/home/repositories/featured-artwork.repository"
import type { FeaturedArtworkResult } from "@/features/home/types"

async function getFeaturedArtwork(): Promise<FeaturedArtworkResult> {
  if (!process.env.DATABASE_URL) {
    console.warn(
      "Featured artwork is unavailable because DATABASE_URL is not configured."
    )
    return { status: "unavailable" }
  }

  try {
    const artwork = await findFeaturedArtwork()

    return { status: "ready", artwork: artwork.map(mapToHomeArtwork) }
  } catch (error) {
    console.error("Featured artwork could not be loaded.", error)
    return { status: "unavailable" }
  }
}

export { getFeaturedArtwork }
