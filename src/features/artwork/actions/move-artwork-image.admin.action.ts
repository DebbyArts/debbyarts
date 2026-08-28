"use server"

import { revalidatePath } from "next/cache"

import { ARTWORK_REVALIDATION_PATHS } from "@/features/artwork/constants"
import { moveArtworkImage } from "@/features/artwork/services/artwork.mutation.service"
import type { ArtworkImageActionState } from "@/features/artwork/types"
import { requireAdmin } from "@/shared/auth/authorize"

async function moveArtworkImageAction(
  artworkId: string,
  imageId: string,
  direction: "up" | "down"
): Promise<ArtworkImageActionState> {
  await requireAdmin()
  if (direction !== "up" && direction !== "down") {
    throw new Error("Invalid gallery image direction.")
  }
  const moved = await moveArtworkImage(artworkId, imageId, direction)
  if (moved) ARTWORK_REVALIDATION_PATHS.forEach((path) => revalidatePath(path))
  return moved
    ? { status: "success", message: "Gallery image order updated." }
    : { status: "warning", message: "That gallery image could not be moved." }
}

export { moveArtworkImageAction }
