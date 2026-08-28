import { describe, expect, it } from "vitest"

import { isSeedStoragePath } from "@/shared/storage/seed-path-policy"

describe("seed Storage path policy", () => {
  it("recognises only supported seed-owned catalogue paths", () => {
    expect(isSeedStoragePath("seed/artwork/leopard/cover.webp")).toBe(true)
    expect(
      isSeedStoragePath("seed/artwork/leopard/additional-07.webp", "artwork")
    ).toBe(true)
    expect(isSeedStoragePath("seed/service/t-shirts/cover.webp", "service")).toBe(
      true
    )
  })

  it("rejects Admin paths and cross-kind seed paths", () => {
    expect(isSeedStoragePath("owner-id/artwork/image.webp")).toBe(false)
    expect(isSeedStoragePath("seed/artwork/leopard/cover.webp", "service")).toBe(
      false
    )
  })
})
