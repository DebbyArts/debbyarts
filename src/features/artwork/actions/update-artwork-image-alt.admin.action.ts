"use server"

import { revalidatePath } from "next/cache"

import { ARTWORK_REVALIDATION_PATHS } from "@/features/artwork/constants"
import { updateArtworkImageDescription } from "@/features/artwork/services/artwork.service"
import type { ArtworkImageActionState } from "@/features/artwork/types"
import { parseArtworkImageAlt } from "@/features/artwork/validation/artwork.validation"
import { requireAdmin } from "@/shared/auth/authorize"

async function updateArtworkImageAltAction(
  artworkId: string,
  imageId: string,
  formData: FormData
): Promise<ArtworkImageActionState> {
  await requireAdmin()
  const updated = await updateArtworkImageDescription(artworkId, imageId, parseArtworkImageAlt(formData))
  if (!updated) throw new Error("Gallery image not found.")
  ARTWORK_REVALIDATION_PATHS.forEach((path) => revalidatePath(path))
  return { status: "success", message: "Image description saved." }
}

export { updateArtworkImageAltAction }
