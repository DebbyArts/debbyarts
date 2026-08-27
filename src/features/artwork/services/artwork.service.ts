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
  createArtwork,
  deleteArtwork,
  findAdminArtworks,
  findArtworkById,
  findArtworkForEditor,
  findArtworkForOptions,
  findArtworkImagePath,
  findPublishedArtworks,
  findPublishedRequestArtwork,
  findPublishedRequestArtworks,
  updateArtwork,
} from "@/features/artwork/repositories/artwork.repository"
import type {
  ArtworkAdminListFilters,
  ArtworkMutationInput,
  ArtworkRequestOptionsInput,
} from "@/features/artwork/types"
import type { VerifiedAdmin } from "@/server/auth/authorize"
import {
  deleteCatalogueImage,
  uploadCatalogueImage,
} from "@/server/storage/image-storage"

type ArtworkSaveInput = {
  admin: VerifiedAdmin
  data: ArtworkMutationInput
  existing: NonNullable<Awaited<ReturnType<typeof findArtworkById>>> | null
  file: File | null
  removeImage: boolean
}

type ArtworkSaveResult =
  | { createdId?: string; status: "saved"; warning?: string }
  | { createdId?: never; status: "not-saved"; warning: string }

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

async function getArtworkForSave(id: string) {
  return findArtworkById(id)
}

async function saveArtwork({
  admin,
  data,
  existing,
  file,
  removeImage,
}: ArtworkSaveInput): Promise<ArtworkSaveResult> {
  const uploaded = file
    ? await uploadCatalogueImage(admin, "artwork", file)
    : null
  const imageData = uploaded
    ? {
        primaryImageHeight: uploaded.height,
        primaryImagePath: uploaded.path,
        primaryImageWidth: uploaded.width,
      }
    : removeImage
      ? {
          primaryImageHeight: null,
          primaryImagePath: null,
          primaryImageWidth: null,
        }
      : {}

  let createdId: string | undefined

  try {
    if (existing) {
      await updateArtwork(existing.id, { ...data, ...imageData })
    } else {
      const createdArtwork = await createArtwork({ ...data, ...imageData })
      createdId = createdArtwork.id
    }
  } catch (error) {
    if (uploaded) {
      try {
        await deleteCatalogueImage(admin, "artwork", uploaded.path)
      } catch {
        return {
          status: "not-saved",
          warning:
            "The database save failed and the new image needs manual Storage cleanup.",
        }
      }
    }
    throw error
  }

  const oldPath = existing?.primaryImagePath
  if (oldPath && (uploaded || removeImage)) {
    try {
      await deleteCatalogueImage(admin, "artwork", oldPath)
    } catch (error) {
      return {
        createdId,
        status: "saved",
        warning:
          error instanceof Error
            ? error.message
            : "Artwork saved, but the old image needs Storage cleanup.",
      }
    }
  }

  return { createdId, status: "saved" }
}

async function saveArtworkOptions(
  artworkId: string,
  data: ArtworkRequestOptionsInput
) {
  return updateArtwork(artworkId, data)
}

async function unpublishArtwork(artworkId: string) {
  return updateArtwork(artworkId, { published: false })
}

async function removeArtwork(admin: VerifiedAdmin, artworkId: string) {
  const artwork = await findArtworkImagePath(artworkId)
  if (!artwork) return null

  await deleteArtwork(artworkId)

  if (!artwork.primaryImagePath) return { cleanupPath: null }

  try {
    await deleteCatalogueImage(admin, "artwork", artwork.primaryImagePath)
    return { cleanupPath: null }
  } catch {
    return { cleanupPath: artwork.primaryImagePath }
  }
}

export {
  getAdminArtworks,
  getArtworkEditor,
  getArtworkForSave,
  getArtworkOptions,
  getPublishedArtworks,
  getPublishedRequestArtwork,
  getPublishedRequestArtworks,
  removeArtwork,
  saveArtwork,
  saveArtworkOptions,
  unpublishArtwork,
}
