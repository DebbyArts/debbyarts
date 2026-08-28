type SeedStorageKind = "artwork" | "service"

const SEED_ARTWORK_PATH_PATTERN =
  /^seed\/artwork\/([a-z0-9]+(?:-[a-z0-9]+)*)\/(cover|additional-0[1-7])\.webp$/
const SEED_SERVICE_PATH_PATTERN =
  /^seed\/service\/([a-z0-9]+(?:-[a-z0-9]+)*)\/cover\.webp$/

function isSeedStoragePath(path: string, kind?: SeedStorageKind) {
  if (kind === "artwork") return SEED_ARTWORK_PATH_PATTERN.test(path)
  if (kind === "service") return SEED_SERVICE_PATH_PATTERN.test(path)

  return (
    SEED_ARTWORK_PATH_PATTERN.test(path) || SEED_SERVICE_PATH_PATTERN.test(path)
  )
}

export { isSeedStoragePath, type SeedStorageKind }
