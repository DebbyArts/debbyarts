"use server"

import { revalidatePath } from "next/cache"

import { ARTWORK_REVALIDATION_PATHS } from "@/features/artwork/constants"
import { addArtworkImage } from "@/features/artwork/services/artwork.service"
import type { ArtworkImageActionState } from "@/features/artwork/types"
import { parseArtworkImageAlt } from "@/features/artwork/validation/artwork.validation"
import { requireAdmin } from "@/shared/auth/authorize"

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
    return {
      status: "error",
      message: error instanceof Error ? error.message : "The gallery image could not be saved.",
    }
  }
}

export { addArtworkImageAction }
