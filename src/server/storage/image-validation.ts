import sharp from "sharp"

const MAX_IMAGE_BYTES = 8 * 1024 * 1024
const MIN_IMAGE_DIMENSION = 320
const MAX_IMAGE_DIMENSION = 8000

type ValidatedImage = {
  buffer: Buffer
  contentType: "image/jpeg" | "image/png" | "image/webp"
  extension: "jpg" | "png" | "webp"
  height: number
  width: number
}

class ImageValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ImageValidationError"
  }
}

async function validateImageBuffer(buffer: Buffer): Promise<ValidatedImage> {
  if (buffer.byteLength === 0) {
    throw new ImageValidationError("Choose an image to upload.")
  }

  if (buffer.byteLength > MAX_IMAGE_BYTES) {
    throw new ImageValidationError("Images must be 8 MB or smaller.")
  }

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

async function validateImageFile(file: File) {
  return validateImageBuffer(Buffer.from(await file.arrayBuffer()))
}

export {
  ImageValidationError,
  MAX_IMAGE_BYTES,
  MAX_IMAGE_DIMENSION,
  MIN_IMAGE_DIMENSION,
  validateImageBuffer,
  validateImageFile,
  type ValidatedImage,
}
