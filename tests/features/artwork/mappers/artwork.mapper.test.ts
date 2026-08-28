import { afterEach, describe, expect, it, vi } from "vitest"

import { Prisma } from "@/db/generated/prisma/client"
import {
  mapToArtworkAdminListItem,
  mapToArtworkEditorValue,
  mapToArtworkProjection,
  mapToRequestArtworkOption,
  type PublishedArtworkRecord,
} from "@/features/artwork/mappers/artwork.mapper"

const publishedArtwork = {
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
} satisfies PublishedArtworkRecord

afterEach(() => vi.unstubAllEnvs())

describe("Artwork mappers", () => {
  it("projects persisted catalogue data and derives ready-to-render labels", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co")

    const projection = mapToArtworkProjection(publishedArtwork)
    const startingFrom = mapToArtworkProjection({
      ...publishedArtwork,
      priceAmount: new Prisma.Decimal("125000"),
      pricingMode: "STARTING_FROM",
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
    expect(projection.gallery.map((image) => image.id)).toEqual([
      "cover",
      "detail-1",
    ])
    expect(startingFrom.priceLabel).toMatch(/^From .*125,000/)
  })

  it("uses shared public Storage URLs across request and Admin projections", () => {
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
