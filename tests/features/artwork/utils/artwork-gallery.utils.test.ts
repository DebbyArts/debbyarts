import { describe, expect, test, vi } from "vitest"

import {
  ALL_ARTWORK,
} from "@/features/artwork/constants"
import {
  getArtworkPriceLabel,
  mapToArtworkAdminListItem,
  mapToArtworkEditorValue,
  mapToArtworkProjection,
  mapToRequestArtworkOption,
} from "@/features/artwork/mappers/artwork.mapper"
import { PUBLISHED_ARTWORK_QUERY } from "@/features/artwork/repositories/artwork.repository"
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
  test("the public query is published-only with stable display ordering", () => {
    expect(PUBLISHED_ARTWORK_QUERY.where).toEqual({ published: true })
    expect(PUBLISHED_ARTWORK_QUERY.orderBy).toEqual([
      { displayOrder: "asc" },
      { createdAt: "asc" },
      { id: "asc" },
    ])
    expect(PUBLISHED_ARTWORK_QUERY.select.additionalImages).toMatchObject({
      orderBy: { displayOrder: "asc" },
    })
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

  test("formats the approved pricing modes without inventing an amount", () => {
    expect(getArtworkPriceLabel({ pricingMode: "NONE", priceAmount: null })).toBe(
      "Price on request"
    )
    expect(
      getArtworkPriceLabel({ pricingMode: "STARTING_FROM", priceAmount: "125000" })
    ).toContain("From")
  })

  test("maps persisted artwork into fields ready for the gallery", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co")

    const projection = mapToArtworkProjection({
      slug: "blue-horse",
      title: "Blue Horse",
      description: "A blue horse study.",
      category: "PAINTING",
      mediumFormat: null,
      displayedPieceDimensions: null,
      availability: "AVAILABLE",
      primaryImagePath: "artwork/blue horse.jpg",
      primaryImageAlt: null,
      primaryImageWidth: 800,
      primaryImageHeight: 1200,
      pricingMode: "NONE",
      priceAmount: null,
      additionalImages: [
        {
          id: "detail-1",
          storagePath: "artwork/blue-horse-detail.jpg",
          altText: "Detail of the blue horse study",
          width: 900,
          height: 600,
        },
      ],
    })

    expect(projection).toMatchObject({
      categoryLabel: "Paintings",
      categoryItemLabel: "Painting",
      availabilityLabel: "Available",
      imageSrc:
        "https://example.supabase.co/storage/v1/object/public/catalogue-media/artwork/blue%20horse.jpg",
      imageAlt: "Blue Horse, an artwork by Debby Art & Prints",
      priceLabel: "Price on request",
      requestHref: "/request?artwork=blue-horse",
    })
    expect(projection.gallery.map((image) => image.id)).toEqual(["cover", "detail-1"])
  })

  test("uses the shared public-storage URL for request and Admin artwork projections", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://localhost:54321")
    const expectedUrl =
      "http://localhost:54321/storage/v1/object/public/catalogue-media/artwork/blue%20horse.jpg"

    expect(
      mapToRequestArtworkOption({
        id: "artwork-1",
        slug: "blue-horse",
        title: "Blue Horse",
        category: "PAINTING",
        primaryImagePath: "artwork/blue horse.jpg",
        primaryImageAlt: "Blue horse study",
        availableSizes: [],
        framingEnabled: false,
        framingOptions: [],
        askQuantity: false,
      }).imageSrc
    ).toBe(expectedUrl)

    expect(
      mapToArtworkAdminListItem({
        id: "artwork-1",
        title: "Blue Horse",
        category: "PAINTING",
        availability: "AVAILABLE",
        primaryImagePath: "artwork/blue horse.jpg",
        primaryImageAlt: "Blue horse study",
        published: true,
        featured: false,
        displayOrder: 0,
      }).imageUrl
    ).toBe(expectedUrl)

    expect(
      mapToArtworkEditorValue({
        id: "artwork-1",
        title: "Blue Horse",
        description: "A blue horse study.",
        category: "PAINTING",
        mediumFormat: null,
        displayedPieceDimensions: null,
        availability: "AVAILABLE",
        primaryImagePath: "artwork/blue horse.jpg",
        primaryImageAlt: "Blue horse study",
        pricingMode: "NONE",
        priceAmount: null,
        published: true,
        featured: false,
        displayOrder: 0,
        additionalImages: [],
      }).imageUrl
    ).toBe(expectedUrl)
  })
})
