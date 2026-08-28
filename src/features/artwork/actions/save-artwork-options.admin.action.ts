"use server"

import { revalidatePath } from "next/cache"
import { ZodError } from "zod"

import { ARTWORK_REVALIDATION_PATHS } from "@/features/artwork/constants"
import { parseArtworkRequestOptions } from "@/features/artwork/parsers/artwork-form.parser"
import { saveArtworkOptions } from "@/features/artwork/services/artwork.mutation.service"
import type { ArtworkActionState } from "@/features/artwork/types"
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
        error instanceof ZodError
          ? (error.issues[0]?.message ?? "The request options are invalid.")
          : "The request options could not be saved.",
    }
  }
}

export { saveArtworkOptionsAction }
