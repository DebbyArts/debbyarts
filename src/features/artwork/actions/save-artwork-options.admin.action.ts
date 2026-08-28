"use server"

import { revalidatePath } from "next/cache"

import { ARTWORK_REVALIDATION_PATHS } from "@/features/artwork/constants"
import { saveArtworkOptions } from "@/features/artwork/services/artwork.service"
import type { ArtworkActionState } from "@/features/artwork/types"
import {
  ArtworkValidationError,
  parseArtworkRequestOptions,
} from "@/features/artwork/validation/artwork.validation"
import { requireAdmin } from "@/shared/auth/authorize"

async function saveArtworkOptionsAction(
  artworkId: string,
  _previousState: ArtworkActionState,
  formData: FormData
): Promise<ArtworkActionState> {
  await requireAdmin()

  try {
    const data = parseArtworkRequestOptions(formData)
    await saveArtworkOptions(artworkId, data)
    ARTWORK_REVALIDATION_PATHS.forEach((path) => revalidatePath(path))
    return { status: "success", message: "Request options saved." }
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof ArtworkValidationError
          ? error.message
          : "The request options could not be saved.",
    }
  }
}

export { saveArtworkOptionsAction }
