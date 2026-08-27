import { SeedManifestError } from "@/db/seed/manifest-validation"
import { isSeedStoragePath } from "@/db/seed/storage-paths"
import { validateImageBuffer } from "@/server/storage/image-validation"
import { createStorageAdminClient } from "@/server/storage/storage-admin"
import { CATALOGUE_MEDIA_BUCKET } from "@/shared/constants/storage"

async function uploadSeedCatalogueImage(path: string, buffer: Buffer) {
  if (!isSeedStoragePath(path)) {
    throw new SeedManifestError("Refusing to upload to an unmanaged seed path.")
  }

  const image = await validateImageBuffer(buffer)
  if (image.contentType !== "image/webp") {
    throw new SeedManifestError("Seed catalogue images must be WebP files.")
  }

  const { error } = await createStorageAdminClient().storage
    .from(CATALOGUE_MEDIA_BUCKET)
    .upload(path, image.buffer, {
      cacheControl: "31536000",
      contentType: image.contentType,
      upsert: true,
    })

  if (error) {
    throw new SeedManifestError(
      "The public catalogue Storage bucket is unavailable. Apply the Storage migration before seeding."
    )
  }
}

export { uploadSeedCatalogueImage }
