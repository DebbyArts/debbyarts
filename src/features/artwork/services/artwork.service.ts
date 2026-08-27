import "server-only"

import { connection } from "next/server"

import {
  mapToArtworkProjection,
  mapToRequestArtworkOption,
} from "@/features/artwork/mappers/artwork.mapper"
import {
  findPublishedArtworks,
  findPublishedRequestArtwork,
  findPublishedRequestArtworks,
} from "@/features/artwork/repositories/artwork.repository"

async function getPublishedArtworks() {
  await connection()
  return (await findPublishedArtworks()).map(mapToArtworkProjection)
}

async function getPublishedRequestArtworks() {
  await connection()
  return (await findPublishedRequestArtworks()).map(mapToRequestArtworkOption)
}

async function getPublishedRequestArtwork(slug: string) {
  const artwork = await findPublishedRequestArtwork(slug)
  return artwork ? mapToRequestArtworkOption(artwork) : null
}

export {
  getPublishedArtworks,
  getPublishedRequestArtwork,
  getPublishedRequestArtworks,
}
