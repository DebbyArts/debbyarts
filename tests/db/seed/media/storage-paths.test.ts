import { describe, expect, it } from "vitest"

import {
  seedArtworkAdditionalStoragePath,
  seedArtworkCoverStoragePath,
  seedServiceCoverStoragePath,
} from "@/db/seed/media/storage-paths"

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

  it("rejects traversal and invalid additional-image order", () => {
    expect(() => seedArtworkCoverStoragePath("../artwork")).toThrow()
    expect(() => seedArtworkAdditionalStoragePath("leopard-painting", 8)).toThrow()
  })
})
