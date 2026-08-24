import { describe, expect, test } from "vitest"

import {
  ALL_ARTWORK,
  buildArtworkRequestHref,
  distributeArtworks,
  filterArtworks,
  formatArtworkPrice,
  getUsefulArtworkCategories,
  resolveArtworkImageSource,
  type ArtworkProjection,
} from "@/features/artwork/artwork-catalogue"
import { PUBLISHED_ARTWORK_QUERY } from "@/features/artwork/server/get-published-artworks"

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
    imageSrc: null,
    imageAlt: `${slug} artwork`,
    imageWidth: null,
    imageHeight: null,
    pricingMode: "NONE",
    priceAmount: null,
  }
}

describe("artwork catalogue rules", () => {
  test("the public query is published-only with stable display ordering", () => {
    expect(PUBLISHED_ARTWORK_QUERY.where).toEqual({ published: true })
    expect(PUBLISHED_ARTWORK_QUERY.orderBy).toEqual([
      { displayOrder: "asc" },
      { createdAt: "asc" },
      { id: "asc" },
    ])
  })

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

  test("builds stable encoded request destinations", () => {
    expect(buildArtworkRequestHref("blue horse/2026")).toBe(
      "/request?artwork=blue%20horse%2F2026"
    )
  })

  test("formats the approved pricing modes without inventing an amount", () => {
    expect(formatArtworkPrice({ pricingMode: "NONE", priceAmount: null })).toBe(
      "Price on request"
    )
    expect(
      formatArtworkPrice({ pricingMode: "STARTING_FROM", priceAmount: "125000" })
    ).toContain("From")
  })

  test("resolves configured public object paths and rejects incomplete storage config", () => {
    expect(
      resolveArtworkImageSource("artwork/horse study.jpg", {
        projectUrl: "https://example.supabase.co",
        bucket: "catalogue",
      })
    ).toBe(
      "https://example.supabase.co/storage/v1/object/public/catalogue/artwork/horse%20study.jpg"
    )
    expect(resolveArtworkImageSource("artwork/horse.jpg", {})).toBeNull()
    expect(
      resolveArtworkImageSource("https://untrusted.example/horse.jpg", {
        projectUrl: "https://example.supabase.co",
        bucket: "catalogue",
      })
    ).toBeNull()
    expect(resolveArtworkImageSource(null, {})).toBeNull()
  })
})
