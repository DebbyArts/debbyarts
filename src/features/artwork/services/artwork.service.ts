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
  createArtworkImage,
  deleteArtwork,
  deleteArtworkImage,
  findAdminArtworks,
  findArtworkById,
  findArtworkForEditor,
  findArtworkForOptions,
  findArtworkImagePath,
  findArtworkImage,
  findArtworkImageCount,
  findPublishedArtworks,
  findPublishedRequestArtwork,
  findPublishedRequestArtworks,
  updateArtwork,
  updateArtworkImageAlt,
  moveArtworkImage as moveArtworkImageRecord,
} from "@/features/artwork/repositories/artwork.repository"
import { MAX_ARTWORK_GALLERY_IMAGE_COUNT } from "@/features/artwork/constants"
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
  if (
    file &&
    !existing?.primaryImagePath &&
    (existing?.additionalImages.length ?? 0) >= MAX_ARTWORK_GALLERY_IMAGE_COUNT
  ) {
    throw new Error(
      `An artwork can have at most ${MAX_ARTWORK_GALLERY_IMAGE_COUNT} gallery images.`
    )
  }
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

  const storagePaths = [
    artwork.primaryImagePath,
    ...artwork.additionalImages.map((image) => image.storagePath),
  ].filter((path): path is string => Boolean(path))
  const cleanupPaths: string[] = []

  for (const path of storagePaths) {
    try {
      await deleteCatalogueImage(admin, "artwork", path)
    } catch {
      cleanupPaths.push(path)
    }
  }

  return { cleanupPaths }
}

async function addArtworkImage(
  admin: VerifiedAdmin,
  artworkId: string,
  file: File,
  altText: string | null
) {
  const artwork = await findArtworkById(artworkId)
  if (!artwork) return { status: "not-found" as const }
  if (!artwork.primaryImagePath) {
    throw new Error("Add a primary cover image before adding gallery images.")
  }

  const imageCount = await findArtworkImageCount(artworkId)
  const totalImages = imageCount + 1
  if (totalImages >= MAX_ARTWORK_GALLERY_IMAGE_COUNT) {
    throw new Error(
      `An artwork can have at most ${MAX_ARTWORK_GALLERY_IMAGE_COUNT} gallery images.`
    )
  }

  const uploaded = await uploadCatalogueImage(admin, "artwork", file)
  try {
    await createArtworkImage({
      artwork: { connect: { id: artworkId } },
      storagePath: uploaded.path,
      altText,
      width: uploaded.width,
      height: uploaded.height,
      displayOrder: imageCount,
    })
  } catch (error) {
    try {
      await deleteCatalogueImage(admin, "artwork", uploaded.path)
    } catch {
      throw new Error(
        "The gallery image was uploaded, but its database record failed and needs manual Storage cleanup."
      )
    }
    throw error
  }

  return { status: "saved" as const }
}

async function updateArtworkImageDescription(
  artworkId: string,
  imageId: string,
  altText: string | null
) {
  const result = await updateArtworkImageAlt(artworkId, imageId, altText)
  return result.count > 0
}

async function removeArtworkImage(
  admin: VerifiedAdmin,
  artworkId: string,
  imageId: string
) {
  const image = await findArtworkImage(artworkId, imageId)
  if (!image) return { status: "not-found" as const }

  await deleteArtworkImage(artworkId, imageId)
  try {
    await deleteCatalogueImage(admin, "artwork", image.storagePath)
    return { status: "removed" as const }
  } catch (error) {
    return {
      status: "cleanup-needed" as const,
      message:
        error instanceof Error
          ? error.message
          : `Image removed, but ${image.storagePath} needs Storage cleanup.`,
    }
  }
}

async function moveArtworkImage(
  artworkId: string,
  imageId: string,
  direction: "up" | "down"
) {
  return moveArtworkImageRecord(artworkId, imageId, direction)
}

export {
  getAdminArtworks,
  addArtworkImage,
  getArtworkEditor,
  getArtworkForSave,
  getArtworkOptions,
  getPublishedArtworks,
  getPublishedRequestArtwork,
  getPublishedRequestArtworks,
  removeArtwork,
  removeArtworkImage,
  saveArtwork,
  saveArtworkOptions,
  unpublishArtwork,
  updateArtworkImageDescription,
  moveArtworkImage,
}
