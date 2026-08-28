import { describe, expect, test } from "vitest"

import { ALL_ARTWORK } from "@/features/artwork/constants"
import type { ArtworkProjection } from "@/features/artwork/types"
import {
  distributeArtworks,
  filterArtworks,
  getUsefulArtworkCategories,
} from "@/features/artwork/utils/artwork-gallery.utils"

function artwork(
  slug: string,
  category: ArtworkProjection["category"]
): ArtworkProjection {
  return {
    slug,
    title: slug,
    description: "",
    category,
    mediumFormat: null,
    displayedPieceDimensions: null,
    availability: "AVAILABLE",
    gallery: [],
    imageSrc: null,
    imageAlt: `${slug} artwork`,
    imageWidth: null,
    imageHeight: null,
    pricingMode: "NONE",
    priceAmount: null,
    categoryLabel: "Paintings",
    categoryItemLabel: "Painting",
    availabilityLabel: "Available",
    priceLabel: "Price on request",
    requestHref: `/request?artwork=${slug}`,
  }
}

describe("artwork catalogue rules", () => {
  test("only exposes useful populated filters for a sufficiently sized gallery", () => {
    const artworks = [
      artwork("one", "PAINTING"),
      artwork("two", "FRAMED_CUSTOM_ARTWORK"),
      artwork("three", "PAINTING"),
      artwork("four", "FRAMED_CUSTOM_ARTWORK"),
    ]

    expect(getUsefulArtworkCategories(artworks)).toEqual([
      "PAINTING",
      "FRAMED_CUSTOM_ARTWORK",
    ])
    expect(getUsefulArtworkCategories(artworks.slice(0, 3))).toEqual([])
  })

  test("filters known categories and treats invalid filter state as all artwork", () => {
    const artworks = [
      artwork("one", "PAINTING"),
      artwork("two", "DIGITAL_ARTWORK"),
    ]

    expect(filterArtworks(artworks, "PAINTING")).toEqual([artworks[0]])
    expect(filterArtworks(artworks, ALL_ARTWORK)).toBe(artworks)
    expect(filterArtworks(artworks, "NOT_A_CATEGORY")).toBe(artworks)
    expect(filterArtworks(artworks, "constructor")).toBe(artworks)
  })

  test("distributes sparse mixed-aspect artwork across every masonry column", () => {
    const artworks = [
      { ...artwork("portrait", "PAINTING"), imageWidth: 3, imageHeight: 5 },
      { ...artwork("landscape", "PAINTING"), imageWidth: 5, imageHeight: 3 },
      { ...artwork("square", "DIGITAL_ARTWORK"), imageWidth: 1, imageHeight: 1 },
      { ...artwork("framed", "FRAMED_CUSTOM_ARTWORK"), imageWidth: 3, imageHeight: 4 },
    ]

    const columns = distributeArtworks(artworks, 3)

    expect(columns).toHaveLength(3)
    expect(columns.every((column) => column.length > 0)).toBe(true)
    expect(columns.flat()).toHaveLength(artworks.length)
    expect(distributeArtworks(artworks, 1)[0]).toEqual(artworks)
  })

})
