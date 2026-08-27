import "server-only"

import { randomUUID } from "node:crypto"
import { createClient } from "@supabase/supabase-js"
import sharp from "sharp"

import type { VerifiedAdmin } from "@/server/auth/authorize"
import { getSupabaseStorageAdminConfig } from "@/server/auth/config"

const STORAGE_BUCKET = "catalogue-media"
const MAX_IMAGE_BYTES = 8 * 1024 * 1024
const MIN_IMAGE_DIMENSION = 320
const MAX_IMAGE_DIMENSION = 8000

type CatalogueImageKind = "artwork" | "service"

type ValidatedImage = {
  buffer: Buffer
  contentType: "image/jpeg" | "image/png" | "image/webp"
  extension: "jpg" | "png" | "webp"
  height: number
  width: number
}

type StoredImage = Omit<ValidatedImage, "buffer"> & {
  path: string
}

class ImageValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ImageValidationError"
  }
}

class ImageStorageError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ImageStorageError"
  }
}

function getStorageBucket() {
  const configured = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET

  if (configured !== STORAGE_BUCKET) {
    throw new ImageStorageError(
      `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET must be ${STORAGE_BUCKET}.`
    )
  }

  return STORAGE_BUCKET
}

function createStorageAdminClient() {
  const { secretKey, url } = getSupabaseStorageAdminConfig()

  return createClient(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  })
}

async function validateImageFile(file: File): Promise<ValidatedImage> {
  if (file.size === 0) {
    throw new ImageValidationError("Choose an image to upload.")
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new ImageValidationError("Images must be 8 MB or smaller.")
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  let metadata: Awaited<ReturnType<ReturnType<typeof sharp>["metadata"]>>
  let decoder: ReturnType<typeof sharp>

  try {
    decoder = sharp(buffer, {
      animated: false,
      failOn: "error",
      limitInputPixels: MAX_IMAGE_DIMENSION * MAX_IMAGE_DIMENSION,
    })
    metadata = await decoder.metadata()
  } catch {
    throw new ImageValidationError(
      "The upload is not a decodable JPEG, PNG or WebP image."
    )
  }

  const formatMap = {
    jpeg: { contentType: "image/jpeg", extension: "jpg" },
    png: { contentType: "image/png", extension: "png" },
    webp: { contentType: "image/webp", extension: "webp" },
  } as const
  const format = metadata.format as keyof typeof formatMap
  const resolvedFormat = formatMap[format]

  if (!resolvedFormat || !metadata.width || !metadata.height) {
    throw new ImageValidationError(
      "Only decodable JPEG, PNG and WebP images are accepted."
    )
  }

  if (metadata.pages && metadata.pages > 1) {
    throw new ImageValidationError("Animated or multi-page images are not accepted.")
  }

  if (
    metadata.width < MIN_IMAGE_DIMENSION ||
    metadata.height < MIN_IMAGE_DIMENSION ||
    metadata.width > MAX_IMAGE_DIMENSION ||
    metadata.height > MAX_IMAGE_DIMENSION
  ) {
    throw new ImageValidationError(
      `Images must be between ${MIN_IMAGE_DIMENSION}px and ${MAX_IMAGE_DIMENSION}px on each side.`
    )
  }

  try {
    await decoder.clone().raw().toBuffer()
  } catch {
    throw new ImageValidationError(
      "The upload is not a fully decodable JPEG, PNG or WebP image."
    )
  }

  return {
    buffer,
    ...resolvedFormat,
    height: metadata.height,
    width: metadata.width,
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

  if (!path.startsWith(expectedPrefix) || !safePattern.test(path)) {
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
