import { describe, expect, it } from "vitest"

import { seedArtwork } from "@/db/seed/domains/artwork/artwork.seed-data"
import { validateArtworkSeedData } from "@/db/seed/domains/artwork/artwork-seed.validation"

describe("Artwork seed data", () => {
  it("matches the current catalogue and request contracts", () => {
    expect(() => validateArtworkSeedData(seedArtwork)).not.toThrow()
    expect(seedArtwork.every((item) => item.availability === "MADE_TO_ORDER")).toBe(
      true
    )
  })
})
