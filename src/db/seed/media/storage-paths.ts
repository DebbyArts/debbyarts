type SeedStorageKind = "artwork" | "service"

const SEED_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const SEED_ARTWORK_PATH_PATTERN = /^seed\/artwork\/([a-z0-9]+(?:-[a-z0-9]+)*)\/(cover|additional-0[1-7])\.webp$/
const SEED_SERVICE_PATH_PATTERN = /^seed\/service\/([a-z0-9]+(?:-[a-z0-9]+)*)\/cover\.webp$/

function assertSeedSlug(slug: string) {
  if (!SEED_SLUG_PATTERN.test(slug)) {
    throw new Error("Seed slugs must be lowercase, hyphen-separated identifiers.")
  }
}

function seedArtworkCoverStoragePath(slug: string) {
  assertSeedSlug(slug)
  return `seed/artwork/${slug}/cover.webp`
}

function seedArtworkAdditionalStoragePath(slug: string, displayOrder: number) {
  assertSeedSlug(slug)
  if (!Number.isInteger(displayOrder) || displayOrder < 1 || displayOrder > 7) {
    throw new Error("Seed artwork additional-image order must be between 1 and 7.")
  }

  return `seed/artwork/${slug}/additional-${String(displayOrder).padStart(2, "0")}.webp`
}

function seedArtworkAdditionalStoragePathPrefix(slug: string) {
  assertSeedSlug(slug)
  return `seed/artwork/${slug}/additional-`
}

function seedServiceCoverStoragePath(slug: string) {
  assertSeedSlug(slug)
  return `seed/service/${slug}/cover.webp`
}

function isSeedStoragePath(path: string, kind?: SeedStorageKind) {
  if (kind === "artwork") return SEED_ARTWORK_PATH_PATTERN.test(path)
  if (kind === "service") return SEED_SERVICE_PATH_PATTERN.test(path)
  return (
    SEED_ARTWORK_PATH_PATTERN.test(path) || SEED_SERVICE_PATH_PATTERN.test(path)
  )
}

export {
  assertSeedSlug,
  isSeedStoragePath,
  seedArtworkAdditionalStoragePathPrefix,
  seedArtworkAdditionalStoragePath,
  seedArtworkCoverStoragePath,
  seedServiceCoverStoragePath,
  type SeedStorageKind,
}
