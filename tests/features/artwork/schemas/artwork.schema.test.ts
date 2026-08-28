import { describe, expect, it } from "vitest"

import {
  artworkImageAltSchema,
  artworkMutationSchema,
  artworkRequestOptionsSchema,
} from "@/features/artwork/schemas/artwork.schema"

function validMutationInput() {
  return {
    availability: "AVAILABLE",
    category: "PAINTING",
    description: "An original portrait.",
    displayedPieceDimensions: null,
    displayOrder: "0",
    featured: false,
    hasImage: true,
    mediumFormat: null,
    priceAmount: "",
    pricingMode: "NONE",
    primaryImageAlt: "Pencil portrait of a woman",
    published: false,
    slug: "quiet-strength",
    title: "Quiet Strength",
  }
}

describe("Artwork schemas", () => {
  it("enforces valid controlled values and publication image requirements", () => {
    expect(() =>
      artworkMutationSchema.parse({
        ...validMutationInput(),
        availability: "UNKNOWN",
      })
    ).toThrow("Choose a valid availability.")

    expect(() =>
      artworkMutationSchema.parse({
        ...validMutationInput(),
        hasImage: false,
        primaryImageAlt: null,
        published: true,
      })
    ).toThrow(
      "Published artwork requires a primary image and useful alt text."
    )
  })

  it("requires coherent positive pricing and bounded display order", () => {
    expect(() =>
      artworkMutationSchema.parse({
        ...validMutationInput(),
        priceAmount: "not a price",
        pricingMode: "EXACT",
      })
    ).toThrow("Enter a positive amount for the selected pricing mode.")

    expect(() =>
      artworkMutationSchema.parse({
        ...validMutationInput(),
        displayOrder: "10000",
      })
    ).toThrow("Display order must be a whole number from 0 to 9999.")
  })

  it("requires enabled option groups to contain bounded values", () => {
    expect(() =>
      artworkRequestOptionsSchema.parse({
        askQuantity: false,
        availableSizes: [],
        availableSizesEnabled: true,
        framingEnabled: false,
        framingOptions: [],
      })
    ).toThrow("Add at least one size option or turn size choices off.")

    expect(() =>
      artworkRequestOptionsSchema.parse({
        askQuantity: false,
        availableSizes: ["x".repeat(81)],
        availableSizesEnabled: true,
        framingEnabled: false,
        framingOptions: [],
      })
    ).toThrow(
      "Available sizes supports up to 20 unique entries of 80 characters each."
    )
  })

  it("limits image descriptions without requiring one for drafts", () => {
    expect(artworkImageAltSchema.parse(null)).toBeNull()
    expect(() => artworkImageAltSchema.parse("x".repeat(181))).toThrow(
      "Image alt text must be 180 characters or fewer."
    )
  })
})
