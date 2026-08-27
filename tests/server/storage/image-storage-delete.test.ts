import { beforeEach, describe, expect, it, vi } from "vitest"
import sharp from "sharp"

const artworkFindFirst = vi.fn()
const artworkImageFindFirst = vi.fn()
const serviceFindFirst = vi.fn()
const remove = vi.fn()
const upload = vi.fn()

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    storage: { from: vi.fn(() => ({ remove, upload })) },
  })),
}))

vi.mock("@/db/client", () => ({
  prisma: {
    artwork: { findFirst: artworkFindFirst },
    artworkImage: { findFirst: artworkImageFindFirst },
    service: { findFirst: serviceFindFirst },
  },
}))

import {
  deleteCatalogueImage,
  ImageStorageError,
  uploadCatalogueImage,
} from "@/server/storage/image-storage"

describe("catalogue image deletion", () => {
  const admin = {
    id: "abc-123",
    email: "owner@example.com",
  }

  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co")
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET", "catalogue-media")
    vi.stubEnv("SUPABASE_SECRET_KEY", "test-secret")
    artworkFindFirst.mockReset()
    artworkImageFindFirst.mockReset()
    serviceFindFirst.mockReset()
    remove.mockReset()
    upload.mockReset()
    artworkFindFirst.mockResolvedValue(null)
    artworkImageFindFirst.mockResolvedValue(null)
    serviceFindFirst.mockResolvedValue(null)
    remove.mockResolvedValue({
      data: [{ name: "abc-123/artwork/123e4567-e89b-12d3-a456-426614174000.jpg" }],
      error: null,
    })
    upload.mockResolvedValue({ data: { path: "stored" }, error: null })
  })

  it("refuses to delete a path still referenced by a catalogue record", async () => {
    artworkFindFirst.mockResolvedValue({ id: "art-1" })
    await expect(
      deleteCatalogueImage(
        admin as never,
        "artwork",
        "abc-123/artwork/123e4567-e89b-12d3-a456-426614174000.jpg"
      )
    ).rejects.toBeInstanceOf(ImageStorageError)
    expect(remove).not.toHaveBeenCalled()
  })

  it("refuses to delete a path still referenced by an additional artwork image", async () => {
    artworkImageFindFirst.mockResolvedValue({ id: "art-image-1" })

    await expect(
      deleteCatalogueImage(
        admin as never,
        "artwork",
        "abc-123/artwork/123e4567-e89b-12d3-a456-426614174000.jpg"
      )
    ).rejects.toBeInstanceOf(ImageStorageError)
    expect(remove).not.toHaveBeenCalled()
  })

  it("deletes only after both reference checks are clear", async () => {
    const path = "abc-123/artwork/123e4567-e89b-12d3-a456-426614174000.jpg"
    await deleteCatalogueImage(admin as never, "artwork", path)
    expect(artworkFindFirst).toHaveBeenCalledWith({
      where: { primaryImagePath: path },
      select: { id: true },
    })
    expect(artworkImageFindFirst).toHaveBeenCalledWith({
      where: { storagePath: path },
      select: { id: true },
    })
    expect(serviceFindFirst).toHaveBeenCalled()
    expect(remove).toHaveBeenCalledWith([path])
  })

  it("allows owner-authorized cleanup of an unreferenced deterministic seed object", async () => {
    const path = "seed/artwork/leopard-painting/cover.webp"
    remove.mockResolvedValue({ data: [{ name: path }], error: null })

    await deleteCatalogueImage(admin as never, "artwork", path)

    expect(remove).toHaveBeenCalledWith([path])
  })

  it("reports a Storage cleanup failure after reference checks are clear", async () => {
    const path = "abc-123/artwork/123e4567-e89b-12d3-a456-426614174000.jpg"
    remove.mockResolvedValue({
      data: [],
      error: new Error("storage unavailable"),
    })

    await expect(
      deleteCatalogueImage(admin as never, "artwork", path)
    ).rejects.toThrow(
      "The database change succeeded, but the old image still needs Storage cleanup."
    )
  })

  it("fully validates and uploads through the server-only privileged client", async () => {
    const buffer = await sharp({
      create: { width: 640, height: 480, channels: 3, background: "#cf2e78" },
    })
      .png()
      .toBuffer()

    const stored = await uploadCatalogueImage(
      admin as never,
      "artwork",
      new File([buffer], "artwork.png", { type: "image/png" })
    )

    expect(stored.path).toMatch(/^abc-123\/artwork\/[0-9a-f-]+\.png$/)
    expect(upload).toHaveBeenCalledWith(
      stored.path,
      expect.any(Buffer),
      {
        cacheControl: "31536000",
        contentType: "image/png",
        upsert: false,
      }
    )
  })
})
