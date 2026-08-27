import { describe, expect, it } from "vitest"

import {
  seedArtwork,
  seedServices,
} from "@/db/seed/content-manifest"
import {
  SeedManifestError,
  validateSeedManifest,
} from "@/db/seed/manifest-validation"

describe("curated seed manifest", () => {
  it("matches the current catalogue and request contracts", () => {
    expect(() => validateSeedManifest(seedArtwork, seedServices)).not.toThrow()
    expect(seedArtwork.every((item) => item.availability === "MADE_TO_ORDER")).toBe(
      true
    )
    expect(
      seedServices.every(
        (item) =>
          !item.requestDefaults.askSizeFormat ||
          item.requestDefaults.sizeFormatOptions.length > 0
      )
    ).toBe(true)
  })

  it("rejects request questions without confirmed owner options", () => {
    const invalidServices = structuredClone(seedServices)
    invalidServices[0].requestDefaults.askSizeFormat = true

    expect(() => validateSeedManifest(seedArtwork, invalidServices)).toThrow(
      SeedManifestError
    )
  })

  it("rejects published services that have no confirmed cover image", () => {
    const invalidServices = structuredClone(seedServices)
    invalidServices[0].published = true

    expect(() => validateSeedManifest(seedArtwork, invalidServices)).toThrow(
      "cannot be published without a confirmed cover image"
    )
  })
})
