"use server"

import { revalidatePath } from "next/cache"

import { ARTWORK_REVALIDATION_PATHS } from "@/features/artwork/constants"
import {
  getArtworkForSave,
  saveArtwork,
} from "@/features/artwork/services/artwork.service"
import type { ArtworkActionState } from "@/features/artwork/types"
import {
  ArtworkValidationError,
  parseArtworkMutation,
} from "@/features/artwork/validation/artwork.validation"
import { requireAdmin } from "@/shared/auth/authorize"
import {
  ImageStorageError,
  ImageValidationError,
} from "@/shared/storage/image-storage"

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

async function saveArtworkAction(
  artworkId: string | null,
  _previousState: ArtworkActionState,
  formData: FormData
): Promise<ArtworkActionState> {
  const admin = await requireAdmin()
  const existing = artworkId ? await getArtworkForSave(artworkId) : null

  if (artworkId && !existing) {
    return { status: "error", message: "Artwork not found." }
  }

  const file = imageFile(formData)
  const removeImage = formData.get("removeImage") === "on"

  try {
    const data = parseArtworkMutation(formData, {
      hasImage: Boolean(file || (!removeImage && existing?.primaryImagePath)),
    })
    const result = await saveArtwork({
      admin,
      data,
      existing,
      file,
      removeImage,
    })

    if (result.warning) {
      if (result.status === "saved") {
        ARTWORK_REVALIDATION_PATHS.forEach((path) => revalidatePath(path))
      }
      return {
        createdId: result.createdId,
        status: "warning",
        message: result.warning,
      }
    }

    ARTWORK_REVALIDATION_PATHS.forEach((path) => revalidatePath(path))
    return {
      createdId: result.createdId,
      status: "success",
      message: "Artwork saved.",
    }
  } catch (error) {
    return actionError(error)
  }
}

export { saveArtworkAction }
