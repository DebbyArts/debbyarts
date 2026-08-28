import "server-only"

import { connection } from "next/server"

import {
  mapToArtworkAdminListItem,
  mapToArtworkEditorValue,
  mapToArtworkOptionsValue,
  mapToArtworkProjection,
} from "@/features/artwork/mappers/artwork.mapper"
import {
  findAdminArtworks,
  findArtworkForEditor,
  findArtworkForOptions,
  findPublishedArtworks,
} from "@/features/artwork/repositories/artwork.repository"
import type { ArtworkAdminListFilters } from "@/features/artwork/types"

async function getPublishedArtworks() {
  await connection()
  return (await findPublishedArtworks()).map(mapToArtworkProjection)
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
  getPublishedArtworks,
}
