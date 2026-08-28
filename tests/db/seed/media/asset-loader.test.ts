import { describe, expect, it } from "vitest"

import { SeedError } from "@/db/seed/core/seed.error"
import { seedArtwork } from "@/db/seed/domains/artwork/artwork.seed-data"
import { seedServices } from "@/db/seed/domains/service/service.seed-data"
import { loadSeedImage, type SeedImage } from "@/db/seed/media/asset-loader"

describe("curated seed assets", () => {
  it("decodes every tracked manifest image at its declared dimensions", async () => {
    const images = [
      ...seedArtwork.flatMap((item) => [
        item.primaryImage,
        ...item.additionalImages,
      ]),
      ...seedServices.flatMap((item) =>
        item.primaryImage ? [item.primaryImage] : []
      ),
    ]

    const loaded = await Promise.all(images.map((image) => loadSeedImage(image)))

    expect(loaded).toHaveLength(18)
    expect(loaded.every((image) => image.contentType === "image/webp")).toBe(
      true
    )
  })

  it("fails before upload when a manifest asset is missing", async () => {
    const missing: SeedImage = {
      alt: "Missing seed image",
      height: 640,
      path: "images/seed/artwork/missing/cover.webp",
      width: 640,
    }

    await expect(loadSeedImage(missing)).rejects.toBeInstanceOf(SeedError)
  })
})
