const SEED_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

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

export {
  assertSeedSlug,
  seedArtworkAdditionalStoragePathPrefix,
  seedArtworkAdditionalStoragePath,
  seedArtworkCoverStoragePath,
  seedServiceCoverStoragePath,
}
