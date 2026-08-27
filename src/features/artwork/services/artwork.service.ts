import "server-only"

import { connection } from "next/server"

import {
  mapToArtworkAdminListItem,
  mapToArtworkEditorValue,
  mapToArtworkOptionsValue,
  mapToArtworkProjection,
  mapToRequestArtworkOption,
} from "@/features/artwork/mappers/artwork.mapper"
import {
  findPublishedArtworks,
  findPublishedRequestArtwork,
  findPublishedRequestArtworks,
} from "@/features/artwork/repositories/artwork.repository"
import {
  findAdminArtworks,
  findArtworkForEditor,
  findArtworkForOptions,
} from "@/features/artwork/repositories/artwork-admin.repository"
import type { ArtworkAdminListFilters } from "@/features/artwork/types"

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
  getPublishedRequestArtwork,
  getPublishedRequestArtworks,
}
