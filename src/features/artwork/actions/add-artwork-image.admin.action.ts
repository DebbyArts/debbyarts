"use server"

import { revalidatePath } from "next/cache"
import { ZodError } from "zod"

import { ARTWORK_REVALIDATION_PATHS } from "@/features/artwork/constants"
import { parseArtworkImageAlt } from "@/features/artwork/parsers/artwork-form.parser"
import {
  addArtworkImage,
  ArtworkMutationError,
} from "@/features/artwork/services/artwork.mutation.service"
import type { ArtworkImageActionState } from "@/features/artwork/types"
import { requireAdmin } from "@/shared/auth/authorize"
import {
  ImageStorageError,
  ImageValidationError,
} from "@/shared/storage/image-storage"

async function addArtworkImageAction(
  artworkId: string,
  _previousState: ArtworkImageActionState,
  formData: FormData
): Promise<ArtworkImageActionState> {
  const admin = await requireAdmin()
  const image = formData.get("image")
  if (!(image instanceof File) || image.size === 0) {
    return { status: "error", message: "Choose an image to upload." }
  }

  try {
    const result = await addArtworkImage(
      admin,
      artworkId,
      image,
      parseArtworkImageAlt(formData)
    )
    if (result.status === "not-found") {
      return { status: "error", message: "Artwork not found." }
    }
    ARTWORK_REVALIDATION_PATHS.forEach((path) => revalidatePath(path))
    return { status: "success", message: "Gallery image added." }
  } catch (error) {
    const message =
      error instanceof ZodError
        ? (error.issues[0]?.message ?? "The image description is invalid.")
        : error instanceof ArtworkMutationError ||
            error instanceof ImageValidationError ||
            error instanceof ImageStorageError
          ? error.message
          : "The gallery image could not be saved."

    return {
      status: "error",
      message,
    }
  }
}

export { addArtworkImageAction }
