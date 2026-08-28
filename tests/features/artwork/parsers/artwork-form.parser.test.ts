import { describe, expect, it } from "vitest"

import {
  parseArtworkImageAlt,
  parseArtworkMutation,
  parseArtworkRequestOptions,
} from "@/features/artwork/parsers/artwork-form.parser"

function validArtworkForm() {
  const form = new FormData()
  form.set("title", "  Débby's Quiet Strength  ")
  form.set("description", "An original portrait.")
  form.set("category", "PENCIL_PORTRAIT")
  form.set("availability", "AVAILABLE")
  form.set("pricingMode", "STARTING_FROM")
  form.set("priceAmount", "85,000")
  form.set("displayOrder", "2")
  form.set("primaryImageAlt", "Pencil portrait of a woman")
  return form
}

describe("Artwork FormData parser", () => {
  it("decodes trimmed mutation fields and derives a normalized slug and price", () => {
    expect(
      parseArtworkMutation(validArtworkForm(), { hasImage: true })
    ).toMatchObject({
      description: "An original portrait.",
      displayOrder: 2,
      priceAmount: "85000.00",
      slug: "debby-s-quiet-strength",
      title: "Débby's Quiet Strength",
    })
  })

  it("clears disabled options and preserves ordered unique enabled options", () => {
    const disabled = new FormData()
    disabled.set("availableSizes", "A3")
    disabled.set("framingOptions", "Black frame")

    expect(parseArtworkRequestOptions(disabled)).toMatchObject({
      availableSizes: [],
      framingOptions: [],
    })

    const enabled = new FormData()
    enabled.set("availableSizesEnabled", "on")
    enabled.append("availableSizes", "A3, A2")
    enabled.append("availableSizes", "A3")
    enabled.set("framingEnabled", "on")
    enabled.append("framingOptions", "Black frame")
    enabled.append("framingOptions", "Natural wood")

    expect(parseArtworkRequestOptions(enabled)).toMatchObject({
      availableSizes: ["A3", "A2"],
      framingOptions: ["Black frame", "Natural wood"],
    })
  })

  it("returns a nullable, trimmed image description input", () => {
    const populated = new FormData()
    populated.set("altText", "  Close-up of the pencil work  ")

    expect(parseArtworkImageAlt(populated)).toBe(
      "Close-up of the pencil work"
    )
    expect(parseArtworkImageAlt(new FormData())).toBeNull()
  })
})
