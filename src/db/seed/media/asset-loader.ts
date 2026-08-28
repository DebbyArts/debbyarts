import { readFile } from "node:fs/promises"
import { relative, resolve, sep } from "node:path"

import { SeedError } from "@/db/seed/core/seed.error"
import { validateImageBuffer } from "@/shared/storage/image-validation"

type SeedImage = {
  path: string
  alt: string
  width: number
  height: number
}

type LoadedSeedImage = {
  buffer: Buffer
  contentType: "image/webp"
  height: number
  width: number
}

function resolveSeedAssetPath(path: string) {
  const seedRoot = resolve(process.cwd(), "images/seed")
  const resolved = resolve(process.cwd(), path)
  const relativePath = relative(seedRoot, resolved)

  if (
    !relativePath ||
    relativePath.startsWith(`..${sep}`) ||
    relativePath === ".." ||
    resolved === seedRoot
  ) {
    throw new SeedError("Seed assets must stay inside images/seed.")
  }

  return resolved
}

async function loadSeedImage(image: SeedImage): Promise<LoadedSeedImage> {
  const path = resolveSeedAssetPath(image.path)
  let buffer: Buffer

  try {
    buffer = await readFile(path)
  } catch {
    throw new SeedError(`Missing seed image: ${image.path}.`)
  }

  const validated = await validateImageBuffer(buffer)
  if (validated.contentType !== "image/webp") {
    throw new SeedError(`Seed image must be WebP: ${image.path}.`)
  }
  if (validated.width !== image.width || validated.height !== image.height) {
    throw new SeedError(
      `Seed image dimensions do not match the manifest: ${image.path}.`
    )
  }

  return {
    buffer: validated.buffer,
    contentType: validated.contentType,
    height: validated.height,
    width: validated.width,
  }
}

export {
  loadSeedImage,
  resolveSeedAssetPath,
  type SeedImage,
  type LoadedSeedImage,
}
