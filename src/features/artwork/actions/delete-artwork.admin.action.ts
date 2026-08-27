"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { ARTWORK_REVALIDATION_PATHS } from "@/features/artwork/constants"
import { removeArtwork } from "@/features/artwork/services/artwork.service"
import { requireAdmin } from "@/server/auth/authorize"

async function deleteArtworkAction(artworkId: string) {
  const admin = await requireAdmin()
  const result = await removeArtwork(admin, artworkId)

  if (!result) redirect("/admin/artwork")

  ARTWORK_REVALIDATION_PATHS.forEach((path) => revalidatePath(path))
  const cleanup = result.cleanupPaths.join("|")
  redirect(
    cleanup
      ? `/admin/artwork?deleted=1&cleanup=${encodeURIComponent(cleanup)}`
      : "/admin/artwork?deleted=1"
  )
}

export { deleteArtworkAction }
