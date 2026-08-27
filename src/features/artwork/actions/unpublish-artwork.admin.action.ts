"use server"

import { revalidatePath } from "next/cache"

import { ARTWORK_REVALIDATION_PATHS } from "@/features/artwork/constants"
import { unpublishArtwork } from "@/features/artwork/services/artwork.service"
import { requireAdmin } from "@/server/auth/authorize"

async function unpublishArtworkAction(artworkId: string) {
  await requireAdmin()
  await unpublishArtwork(artworkId)
  ARTWORK_REVALIDATION_PATHS.forEach((path) => revalidatePath(path))
}

export { unpublishArtworkAction }
