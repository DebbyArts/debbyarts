import { describe, expect, it } from "vitest"

import {
  isSeedStoragePath,
  seedArtworkAdditionalStoragePath,
  seedArtworkCoverStoragePath,
  seedServiceCoverStoragePath,
} from "@/db/seed/storage-paths"

describe("seed Storage paths", () => {
  it("uses deterministic, public-bucket-safe paths", () => {
    expect(seedArtworkCoverStoragePath("leopard-painting")).toBe(
      "seed/artwork/leopard-painting/cover.webp"
    )
    expect(seedArtworkAdditionalStoragePath("leopard-painting", 1)).toBe(
      "seed/artwork/leopard-painting/additional-01.webp"
    )
    expect(seedServiceCoverStoragePath("customised-t-shirts")).toBe(
      "seed/service/customised-t-shirts/cover.webp"
    )
  })

  it("rejects traversal and paths outside the seed namespace", () => {
    expect(() => seedArtworkCoverStoragePath("../artwork")).toThrow()
    expect(() => seedArtworkAdditionalStoragePath("leopard-painting", 8)).toThrow()
    expect(isSeedStoragePath("owner-id/artwork/image.webp")).toBe(false)
    expect(isSeedStoragePath("seed/artwork/leopard/cover.webp", "service")).toBe(
      false
    )
  })
})
