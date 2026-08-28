import "server-only"

import { connection } from "next/server"

import {
  mapToArtworkAdminListItem,
  mapToArtworkEditorValue,
  mapToArtworkOptionsValue,
  mapToArtworkProjection,
  mapToFeaturedArtwork,
} from "@/features/artwork/mappers/artwork.mapper"
import {
  findAdminArtworks,
  findArtworkForEditor,
  findArtworkForOptions,
  findFeaturedArtwork,
  findPublishedArtworks,
} from "@/features/artwork/repositories/artwork.repository"
import type {
  ArtworkAdminListFilters,
  FeaturedArtworkResult,
} from "@/features/artwork/types"

async function getPublishedArtworks() {
  await connection()
  return (await findPublishedArtworks()).map(mapToArtworkProjection)
}

async function getFeaturedArtwork(): Promise<FeaturedArtworkResult> {
  if (!process.env.DATABASE_URL) {
    console.warn(
      "Featured artwork is unavailable because DATABASE_URL is not configured."
    )
    return { status: "unavailable" }
  }

  try {
    const artwork = await findFeaturedArtwork()

    return { status: "ready", artwork: artwork.map(mapToFeaturedArtwork) }
  } catch (error) {
    console.error("Featured artwork could not be loaded.", error)
    return { status: "unavailable" }
  }
}

async function getAdminArtworks(filters: ArtworkAdminListFilters) {
  await connection()
  return (await findAdminArtworks(filters)).map(mapToArtworkAdminListItem)
}

async function getArtworkEditor(id: string) {
  await connection()
  const artwork = await findArtworkForEditor(id)
  return artwork ? mapToArtworkEditorValue(artwork) : null
}

async function getArtworkOptions(id: string) {
  await connection()
  const artwork = await findArtworkForOptions(id)
  return artwork ? mapToArtworkOptionsValue(artwork) : null
}

export {
  getAdminArtworks,
  getArtworkEditor,
  getArtworkOptions,
  getFeaturedArtwork,
  getPublishedArtworks,
}
