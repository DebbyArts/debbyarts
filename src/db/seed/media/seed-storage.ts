import { SeedError } from "@/db/seed/core/seed.error"
import { validateImageBuffer } from "@/shared/storage/image-validation"
import { CATALOGUE_MEDIA_BUCKET } from "@/shared/storage/constants"
import { isSeedStoragePath } from "@/shared/storage/seed-path-policy"
import { createStorageAdminClient } from "@/shared/storage/storage-admin"

async function uploadSeedCatalogueImage(path: string, buffer: Buffer) {
  if (!isSeedStoragePath(path)) {
    throw new SeedError("Refusing to upload to an unmanaged seed path.")
  }

  const image = await validateImageBuffer(buffer)
  if (image.contentType !== "image/webp") {
    throw new SeedError("Seed catalogue images must be WebP files.")
  }

  const { error } = await createStorageAdminClient().storage
    .from(CATALOGUE_MEDIA_BUCKET)
    .upload(path, image.buffer, {
      cacheControl: "31536000",
      contentType: image.contentType,
      upsert: true,
    })

  if (error) {
    throw new SeedError(
      "The public catalogue Storage bucket is unavailable. Apply the Storage migration before seeding."
    )
  }
}

export { uploadSeedCatalogueImage }
