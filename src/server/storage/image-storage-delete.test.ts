import { beforeEach, describe, expect, it, vi } from "vitest"

const artworkFindFirst = vi.fn()
const serviceFindFirst = vi.fn()

vi.mock("@/db/client", () => ({
  prisma: {
    artwork: { findFirst: artworkFindFirst },
    service: { findFirst: serviceFindFirst },
  },
}))

import {
  deleteCatalogueImage,
  ImageStorageError,
} from "@/server/storage/image-storage"

describe("catalogue image deletion", () => {
  const remove = vi.fn()
  const admin = {
    id: "abc-123",
    email: "owner@example.com",
    supabase: {
      storage: {
        from: vi.fn(() => ({ remove })),
      },
    },
  }

  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET", "catalogue-media")
    artworkFindFirst.mockReset()
    serviceFindFirst.mockReset()
    remove.mockReset()
    artworkFindFirst.mockResolvedValue(null)
    serviceFindFirst.mockResolvedValue(null)
    remove.mockResolvedValue({
      data: [{ name: "abc-123/artwork/123e4567-e89b-12d3-a456-426614174000.jpg" }],
      error: null,
    })
  })

  it("refuses to delete a path still referenced by either catalogue table", async () => {
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

  it("deletes only after both reference checks are clear", async () => {
    const path = "abc-123/artwork/123e4567-e89b-12d3-a456-426614174000.jpg"
    await deleteCatalogueImage(admin as never, "artwork", path)
    expect(artworkFindFirst).toHaveBeenCalledWith({
      where: { primaryImagePath: path },
      select: { id: true },
    })
    expect(serviceFindFirst).toHaveBeenCalled()
    expect(remove).toHaveBeenCalledWith([path])
  })
})
