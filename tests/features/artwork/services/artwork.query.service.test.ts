import { beforeEach, describe, expect, test, vi } from "vitest"

const { findMany } = vi.hoisted(() => ({
  findMany: vi.fn(),
}))

vi.mock("@/db/client", () => ({
  prisma: {
    artwork: {
      findMany,
    },
  },
}))

import { FEATURED_ARTWORK_QUERY } from "@/features/artwork/repositories/artwork.repository"
import { getFeaturedArtwork } from "@/features/artwork/services/artwork.query.service"

describe("getFeaturedArtwork", () => {
  beforeEach(() => {
    vi.stubEnv("DATABASE_URL", "postgresql://example.invalid/debbyarts")
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co")
    findMany.mockReset()
    vi.restoreAllMocks()
  })

  test("reads only featured published artwork in the approved order", async () => {
    const artwork = [
      {
        id: "artwork-1",
        slug: "quiet-strength",
        title: "Quiet Strength",
        category: "PAINTING",
        mediumFormat: "Acrylic on canvas",
        primaryImagePath: "artwork/quiet-strength.jpg",
        primaryImageAlt: "A portrait titled Quiet Strength",
        primaryImageWidth: 800,
        primaryImageHeight: 1000,
      },
    ]
    findMany.mockResolvedValue(artwork)

    await expect(getFeaturedArtwork()).resolves.toEqual({
      status: "ready",
      artwork: [
        {
          id: "artwork-1",
          slug: "quiet-strength",
          title: "Quiet Strength",
          category: "PAINTING",
          mediumFormat: "Acrylic on canvas",
          primaryImageUrl:
            "https://example.supabase.co/storage/v1/object/public/catalogue-media/artwork/quiet-strength.jpg",
          primaryImageAlt: "A portrait titled Quiet Strength",
          primaryImageWidth: 800,
          primaryImageHeight: 1000,
        },
      ],
    })
    expect(findMany).toHaveBeenCalledWith(FEATURED_ARTWORK_QUERY)
    expect(FEATURED_ARTWORK_QUERY).toMatchObject({
      where: { featured: true, published: true },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      take: 3,
    })
  })

  test("preserves the intentional empty catalogue state", async () => {
    findMany.mockResolvedValue([])

    await expect(getFeaturedArtwork()).resolves.toEqual({
      status: "ready",
      artwork: [],
    })
  })

  test("returns an explicit degraded state when the catalogue is unavailable", async () => {
    const error = new Error("database unavailable")
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})
    findMany.mockRejectedValue(error)

    await expect(getFeaturedArtwork()).resolves.toEqual({
      status: "unavailable",
    })
    expect(consoleError).toHaveBeenCalledWith(
      "Featured artwork could not be loaded.",
      error
    )
  })

  test("reports missing local configuration without throwing", async () => {
    vi.stubEnv("DATABASE_URL", "")
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {})

    await expect(getFeaturedArtwork()).resolves.toEqual({
      status: "unavailable",
    })
    expect(consoleWarn).toHaveBeenCalledWith(
      "Featured artwork is unavailable because DATABASE_URL is not configured."
    )
    expect(findMany).not.toHaveBeenCalled()
  })
})
