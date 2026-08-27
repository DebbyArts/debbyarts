import "server-only"

import {
  getPublishedRequestArtwork,
  getPublishedRequestArtworks,
} from "@/features/artwork"
import {
  getPublishedRequestService,
  getPublishedRequestServices,
} from "@/features/services"

async function getPublishedRequestCatalogue() {
  const [artworks, services] = await Promise.all([
    getPublishedRequestArtworks(),
    getPublishedRequestServices(),
  ])

  return { artworks, services }
}

export {
  getPublishedRequestArtwork,
  getPublishedRequestCatalogue,
  getPublishedRequestService,
}
