"use server"

import { revalidatePath } from "next/cache"
import { ZodError } from "zod"

import { ARTWORK_REVALIDATION_PATHS } from "@/features/artwork/constants"
import { parseArtworkImageAlt } from "@/features/artwork/parsers/artwork-form.parser"
import { updateArtworkImageDescription } from "@/features/artwork/services/artwork.mutation.service"
import type { ArtworkImageActionState } from "@/features/artwork/types"
import { requireAdmin } from "@/shared/auth/authorize"

async function updateArtworkImageAltAction(
  artworkId: string,
  imageId: string,
  formData: FormData
): Promise<ArtworkImageActionState> {
  await requireAdmin()

  try {
    const altText = parseArtworkImageAlt(formData)
    const updated = await updateArtworkImageDescription(
      artworkId,
      imageId,
      altText
    )
    if (!updated) throw new Error("Gallery image not found.")
    ARTWORK_REVALIDATION_PATHS.forEach((path) => revalidatePath(path))
    return { status: "success", message: "Image description saved." }
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof ZodError
          ? (error.issues[0]?.message ?? "The image description is invalid.")
          : "The image description could not be saved.",
    }
  }
}

export { updateArtworkImageAltAction }
