"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import {
  ArtworkValidationError,
  parseArtworkMutation,
  parseArtworkRequestOptions,
} from "@/features/artwork/admin/artwork-validation"
import {
  createArtwork,
  deleteArtwork,
  findArtworkById,
  findArtworkImagePath,
  updateArtwork,
} from "@/features/artwork/repositories/artwork-admin.repository"
import { requireAdmin } from "@/server/auth/authorize"
import {
  deleteCatalogueImage,
  ImageStorageError,
  ImageValidationError,
  uploadCatalogueImage,
} from "@/server/storage/image-storage"
import type { ArtworkActionState } from "@/features/artwork/admin/state"

function imageFile(formData: FormData) {
  const value = formData.get("primaryImage")
  return value instanceof File && value.size > 0 ? value : null
}

function actionError(error: unknown): ArtworkActionState {
  if (
    error instanceof ArtworkValidationError ||
    error instanceof ImageValidationError ||
    error instanceof ImageStorageError
  ) {
    return { status: "error", message: error.message }
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  ) {
    return {
      status: "error",
      message: "Another artwork already uses this title-derived slug.",
    }
  }

  return {
    status: "error",
    message: "The artwork could not be saved. No hidden fallback was applied.",
  }
}

function revalidateArtwork() {
  revalidatePath("/admin/artwork")
  revalidatePath("/art")
  revalidatePath("/")
  revalidatePath("/request")
}

async function saveArtworkAction(
  artworkId: string | null,
  _previousState: ArtworkActionState,
  formData: FormData
): Promise<ArtworkActionState> {
  const admin = await requireAdmin()
  const existing = artworkId
    ? await findArtworkById(artworkId)
    : null

  if (artworkId && !existing) {
    return { status: "error", message: "Artwork not found." }
  }

  const file = imageFile(formData)
  const removeImage = formData.get("removeImage") === "on"
  let uploadedPath: string | null = null

  try {
    const input = parseArtworkMutation(formData, {
      hasImage: Boolean(file || (!removeImage && existing?.primaryImagePath)),
    })
    const uploaded = file
      ? await uploadCatalogueImage(admin, "artwork", file)
      : null
    uploadedPath = uploaded?.path ?? null
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

    try {
      if (existing) {
        await updateArtwork(existing.id, { ...input, ...imageData })
      } else {
        await createArtwork({ ...input, ...imageData })
      }
    } catch (error) {
      if (uploadedPath) {
        try {
          await deleteCatalogueImage(admin, "artwork", uploadedPath)
        } catch {
          return {
            status: "warning",
            message:
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
        revalidateArtwork()
        return {
          status: "warning",
          message:
            error instanceof Error
              ? error.message
              : "Artwork saved, but the old image needs Storage cleanup.",
        }
      }
    }

    revalidateArtwork()
    return { status: "success", message: "Artwork saved." }
  } catch (error) {
    return actionError(error)
  }
}

async function saveArtworkOptionsAction(
  artworkId: string,
  _previousState: ArtworkActionState,
  formData: FormData
): Promise<ArtworkActionState> {
  await requireAdmin()

  try {
    const data = parseArtworkRequestOptions(formData)
    await updateArtwork(artworkId, data)
    revalidateArtwork()
    return { status: "success", message: "Request options saved." }
  } catch (error) {
    return actionError(error)
  }
}

async function unpublishArtworkAction(artworkId: string) {
  await requireAdmin()
  await updateArtwork(artworkId, { published: false })
  revalidateArtwork()
}

async function deleteArtworkAction(artworkId: string) {
  const admin = await requireAdmin()
  const artwork = await findArtworkImagePath(artworkId)
  if (!artwork) redirect("/admin/artwork")

  await deleteArtwork(artworkId)
  let cleanupPath: string | null = null
  if (artwork.primaryImagePath) {
    try {
      await deleteCatalogueImage(admin, "artwork", artwork.primaryImagePath)
    } catch {
      cleanupPath = artwork.primaryImagePath
    }
  }
  revalidateArtwork()
  redirect(
    cleanupPath
      ? `/admin/artwork?deleted=1&cleanup=${encodeURIComponent(cleanupPath)}`
      : "/admin/artwork?deleted=1"
  )
}

export {
  deleteArtworkAction,
  saveArtworkAction,
  saveArtworkOptionsAction,
  unpublishArtworkAction,
}
