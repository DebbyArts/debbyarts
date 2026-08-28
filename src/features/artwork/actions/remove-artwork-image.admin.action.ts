"use server"

import { revalidatePath } from "next/cache"

import { ARTWORK_REVALIDATION_PATHS } from "@/features/artwork/constants"
import { removeArtworkImage } from "@/features/artwork/services/artwork.mutation.service"
import type { ArtworkImageActionState } from "@/features/artwork/types"
import { requireAdmin } from "@/shared/auth/authorize"

async function removeArtworkImageAction(
  artworkId: string,
  imageId: string
): Promise<ArtworkImageActionState> {
  const admin = await requireAdmin()
  const result = await removeArtworkImage(admin, artworkId, imageId)
  if (result.status === "not-found") throw new Error("Gallery image not found.")
  ARTWORK_REVALIDATION_PATHS.forEach((path) => revalidatePath(path))
  return result.status === "cleanup-needed"
    ? { status: "warning", message: result.message }
    : { status: "success", message: "Gallery image removed." }
}

export { removeArtworkImageAction }
