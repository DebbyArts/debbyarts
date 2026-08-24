import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"

import { HomePage } from "@/features/site/components/home-page"

describe("HomePage featured artwork states", () => {
  test("shows the intentional empty catalogue state", () => {
    render(
      <HomePage featuredArtwork={{ status: "ready", artwork: [] }} />
    )

    expect(
      screen.getByText("THE GALLERY IS BEING PREPARED.")
    ).toBeDefined()
    expect(
      screen.queryByText("FEATURED ARTWORK IS TEMPORARILY UNAVAILABLE.")
    ).toBeNull()
  })

  test("renders a published artwork projection without fixture copy", () => {
    render(
      <HomePage
        featuredArtwork={{
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
        }}
      />
    )

    expect(
      screen.getByRole("heading", { name: "Quiet Strength" })
    ).toBeDefined()
    expect(
      screen.getByAltText("A portrait titled Quiet Strength")
    ).toBeDefined()
    expect(screen.getByText("Acrylic on canvas")).toBeDefined()
  })
})
