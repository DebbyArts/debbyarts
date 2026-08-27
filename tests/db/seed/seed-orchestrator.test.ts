import { describe, expect, it, vi } from "vitest"

import {
  seedArtwork,
  seedServices,
} from "@/db/seed/content-manifest"
import { runSeed, type SeedDatabase } from "@/db/seed/seed-orchestrator"

function seedDependencies() {
  const artworkUpsert = vi.fn().mockResolvedValue({ id: "artwork-1" })
  const artworkImageCreateMany = vi.fn().mockResolvedValue({ count: 2 })
  const artworkImageDeleteMany = vi.fn().mockResolvedValue({ count: 0 })
  const serviceUpsert = vi.fn().mockResolvedValue({ id: "service-1" })
  const upload = vi.fn().mockResolvedValue(undefined)
  const transaction = {
    artwork: { upsert: artworkUpsert },
    artworkImage: {
      createMany: artworkImageCreateMany,
      deleteMany: artworkImageDeleteMany,
    },
    service: { upsert: serviceUpsert },
  }
  const artworkFindUnique = vi.fn().mockResolvedValue(null)
  const database: SeedDatabase = {
    artwork: { findUnique: artworkFindUnique },
    $transaction: (callback) => callback(transaction),
  }
  const loadImage = vi.fn(async (image) => ({
    buffer: Buffer.from(image.path),
    contentType: "image/webp" as const,
    height: image.height,
    width: image.width,
  }))

  return {
    artworkImageCreateMany,
    artworkImageDeleteMany,
    artworkFindUnique,
    artworkUpsert,
    database,
    loadImage,
    serviceUpsert,
    storage: { upload },
    upload,
  }
}

describe("catalogue seed orchestration", () => {
  const artwork = seedArtwork.slice(0, 1)
  const services = seedServices.filter(
    (service) => service.slug === "customised-t-shirts"
  )

  it("upserts fixed records and deterministic image paths on repeatable runs", async () => {
    const dependencies = seedDependencies()

    await runSeed({ ...dependencies, artwork, services })
    await runSeed({ ...dependencies, artwork, services })

    expect(dependencies.upload).toHaveBeenCalledWith(
      "seed/artwork/leopard-painting/cover.webp",
      expect.any(Buffer)
    )
    expect(dependencies.upload).toHaveBeenCalledWith(
      "seed/artwork/leopard-painting/additional-01.webp",
      expect.any(Buffer)
    )
    expect(dependencies.upload).toHaveBeenCalledWith(
      "seed/service/customised-t-shirts/cover.webp",
      expect.any(Buffer)
    )
    expect(dependencies.artworkUpsert).toHaveBeenCalledTimes(2)
    expect(dependencies.serviceUpsert).toHaveBeenCalledTimes(2)
    expect(dependencies.artworkImageDeleteMany).toHaveBeenCalledWith({
      where: {
        artworkId: "artwork-1",
        storagePath: {
          startsWith: "seed/artwork/leopard-painting/additional-",
        },
      },
    })
  })

  it("does not write database rows when any Storage upload fails", async () => {
    const dependencies = seedDependencies()
    dependencies.upload.mockRejectedValueOnce(new Error("Storage unavailable"))

    await expect(
      runSeed({ ...dependencies, artwork, services })
    ).rejects.toThrow("Storage unavailable")
    expect(dependencies.artworkUpsert).not.toHaveBeenCalled()
    expect(dependencies.serviceUpsert).not.toHaveBeenCalled()
  })

  it("stops before Storage uploads when an Admin image owns a curated display order", async () => {
    const dependencies = seedDependencies()
    dependencies.artworkFindUnique.mockResolvedValue({
      additionalImages: [
        {
          displayOrder: 1,
          storagePath: "admin-id/artwork/admin-image.webp",
        },
      ],
    })

    await expect(
      runSeed({ ...dependencies, artwork, services })
    ).rejects.toThrow("Move that image before rerunning the seed.")
    expect(dependencies.upload).not.toHaveBeenCalled()
    expect(dependencies.artworkUpsert).not.toHaveBeenCalled()
    expect(dependencies.artworkImageCreateMany).not.toHaveBeenCalled()
  })
})
