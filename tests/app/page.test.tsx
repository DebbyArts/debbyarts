import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, test, vi } from "vitest"

const { getFeaturedArtwork } = vi.hoisted(() => ({
  getFeaturedArtwork: vi.fn(),
}))

vi.mock("@/features/artwork/services/artwork.query.service", () => ({
  getFeaturedArtwork,
}))

import Home from "@/app/page"

describe("Home route", () => {
  beforeEach(() => {
    getFeaturedArtwork.mockReset()
  })

  test("composes a populated featured-artwork result", async () => {
    getFeaturedArtwork.mockResolvedValue({
      status: "ready",
      artwork: [
        {
          id: "artwork-1",
          slug: "quiet-strength",
          title: "Quiet Strength",
          category: "PAINTING",
          mediumFormat: "Acrylic on canvas",
          primaryImageUrl:
            "https://example.supabase.co/storage/v1/object/public/catalogue/artwork/quiet-strength.jpg",
          primaryImageAlt: "A portrait titled Quiet Strength",
          primaryImageWidth: 800,
          primaryImageHeight: 1000,
        },
      ],
    })

    render(await Home())

    expect(getFeaturedArtwork).toHaveBeenCalledOnce()
    expect(
      screen.getByRole("heading", { name: "Quiet Strength" })
    ).toBeDefined()
    expect(
      screen.getByAltText("A portrait titled Quiet Strength")
    ).toBeDefined()
  })

  test("composes the intentional empty catalogue result", async () => {
    getFeaturedArtwork.mockResolvedValue({ status: "ready", artwork: [] })

    render(await Home())

    expect(getFeaturedArtwork).toHaveBeenCalledOnce()
    expect(screen.getByText("THE GALLERY IS BEING PREPARED.")).toBeDefined()
    expect(
      screen.queryByText("FEATURED ARTWORK IS TEMPORARILY UNAVAILABLE.")
    ).toBeNull()
  })
})
