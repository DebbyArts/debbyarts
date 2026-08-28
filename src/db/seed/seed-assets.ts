import { readFile } from "node:fs/promises"
import { relative, resolve, sep } from "node:path"

import type { SeedImage } from "@/db/seed/content-manifest"
import { SeedManifestError } from "@/db/seed/manifest-validation"
import { validateImageBuffer } from "@/shared/storage/image-validation"

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
    throw new SeedManifestError("Seed assets must stay inside images/seed.")
  }

  return resolved
}

async function loadSeedImage(image: SeedImage): Promise<LoadedSeedImage> {
  const path = resolveSeedAssetPath(image.path)
  let buffer: Buffer

  try {
    buffer = await readFile(path)
  } catch {
    throw new SeedManifestError(`Missing seed image: ${image.path}.`)
  }

  const validated = await validateImageBuffer(buffer)
  if (validated.contentType !== "image/webp") {
    throw new SeedManifestError(`Seed image must be WebP: ${image.path}.`)
  }
  if (validated.width !== image.width || validated.height !== image.height) {
    throw new SeedManifestError(
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
  type LoadedSeedImage,
}
