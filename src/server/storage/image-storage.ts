import "server-only"

import { randomUUID } from "node:crypto"

import { isSeedStoragePath } from "@/db/seed/storage-paths"
import type { VerifiedAdmin } from "@/server/auth/authorize"
import {
  ImageValidationError,
  MAX_IMAGE_BYTES,
  MAX_IMAGE_DIMENSION,
  MIN_IMAGE_DIMENSION,
  validateImageFile,
  type ValidatedImage,
} from "@/server/storage/image-validation"
import {
  createStorageAdminClient,
  getStorageBucket,
  STORAGE_BUCKET,
} from "@/server/storage/storage-admin"

type CatalogueImageKind = "artwork" | "service"

type StoredImage = Omit<ValidatedImage, "buffer"> & {
  path: string
}

class ImageStorageError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ImageStorageError"
  }
}

function immutableImagePath(
  adminId: string,
  kind: CatalogueImageKind,
  extension: ValidatedImage["extension"]
) {
  return `${adminId}/${kind}/${randomUUID()}.${extension}`
}

function assertOwnedImagePath(
  path: string,
  adminId: string,
  kind: CatalogueImageKind
) {
  const expectedPrefix = `${adminId}/${kind}/`
  const safePattern = /^[0-9a-f-]+\/(artwork|service)\/[0-9a-f-]+\.(jpg|png|webp)$/

  if (
    (!path.startsWith(expectedPrefix) || !safePattern.test(path)) &&
    !isSeedStoragePath(path, kind)
  ) {
    throw new ImageStorageError("Refusing to operate on an unowned image path.")
  }
}

async function uploadCatalogueImage(
  admin: VerifiedAdmin,
  kind: CatalogueImageKind,
  file: File
): Promise<StoredImage> {
  const image = await validateImageFile(file)
  const path = immutableImagePath(admin.id, kind, image.extension)
  const { error } = await createStorageAdminClient().storage
    .from(getStorageBucket())
    .upload(path, image.buffer, {
      cacheControl: "31536000",
      contentType: image.contentType,
      upsert: false,
    })

  if (error) {
    throw new ImageStorageError("The image could not be uploaded.")
  }

  return {
    contentType: image.contentType,
    extension: image.extension,
    height: image.height,
    path,
    width: image.width,
  }
}

async function deleteCatalogueImage(
  admin: VerifiedAdmin,
  kind: CatalogueImageKind,
  path: string
) {
  assertOwnedImagePath(path, admin.id, kind)
  const { prisma } = await import("@/db/client")
  const [artworkReference, artworkImageReference, serviceReference] = await Promise.all([
    prisma.artwork.findFirst({
      where: { primaryImagePath: path },
      select: { id: true },
    }),
    prisma.artworkImage.findFirst({
      where: { storagePath: path },
      select: { id: true },
    }),
    prisma.service.findFirst({
      where: { primaryImagePath: path },
      select: { id: true },
    }),
  ])

  if (artworkReference || artworkImageReference || serviceReference) {
    throw new ImageStorageError(
      "Refusing to delete an image path that is still referenced by a catalogue record."
    )
  }

  const { data, error } = await createStorageAdminClient().storage
    .from(getStorageBucket())
    .remove([path])

  if (error || !data.some((object) => object.name === path)) {
    throw new ImageStorageError(
      "The database change succeeded, but the old image still needs Storage cleanup."
    )
  }
}

export {
  ImageStorageError,
  ImageValidationError,
  MAX_IMAGE_BYTES,
  MAX_IMAGE_DIMENSION,
  MIN_IMAGE_DIMENSION,
  STORAGE_BUCKET,
  assertOwnedImagePath,
  deleteCatalogueImage,
  immutableImagePath,
  uploadCatalogueImage,
  validateImageFile,
  type CatalogueImageKind,
  type StoredImage,
  type ValidatedImage,
}
