import { describe, expect, it } from "vitest"

import { SeedError } from "@/db/seed/core/seed.error"
import { seedServices } from "@/db/seed/domains/service/service.seed-data"
import { validateServiceSeedData } from "@/db/seed/domains/service/service-seed.validation"

describe("Service seed data", () => {
  it("matches the current catalogue and request contracts", () => {
    expect(() => validateServiceSeedData(seedServices)).not.toThrow()
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

    expect(() => validateServiceSeedData(invalidServices)).toThrow(SeedError)
  })

  it("rejects published services that have no confirmed cover image", () => {
    const invalidServices = structuredClone(seedServices)
    invalidServices[0].published = true

    expect(() => validateServiceSeedData(invalidServices)).toThrow(
      "cannot be published without a confirmed cover image"
    )
  })
})
