import { describe, expect, it } from "vitest"

import {
  ArtworkValidationError,
  parseArtworkMutation,
  parseArtworkRequestOptions,
  slugify,
} from "@/features/artwork/validation/artwork.validation"

function validArtworkForm() {
  const form = new FormData()
  form.set("title", "  Quiet Strength  ")
  form.set("description", "An original portrait.")
  form.set("category", "PENCIL_PORTRAIT")
  form.set("availability", "AVAILABLE")
  form.set("pricingMode", "STARTING_FROM")
  form.set("priceAmount", "85,000")
  form.set("displayOrder", "2")
  form.set("primaryImageAlt", "Pencil portrait of a woman")
  return form
}

describe("Artwork Admin validation", () => {
  it("derives a stable slug and coherent price", () => {
    const result = parseArtworkMutation(validArtworkForm(), { hasImage: true })
    expect(result.slug).toBe("quiet-strength")
    expect(result.priceAmount).toBe("85000.00")
    expect(slugify("Débby's Horse Study")).toBe("debby-s-horse-study")
  })

  it("blocks publication without a complete accessible image", () => {
    const form = validArtworkForm()
    form.set("published", "on")
    expect(() => parseArtworkMutation(form, { hasImage: false })).toThrow(
      ArtworkValidationError
    )
  })

  it("clears framing options when framing is disabled", () => {
    const form = new FormData()
    form.set("framingOptions", "Black frame\nNatural wood")
    const result = parseArtworkRequestOptions(form)
    expect(result.framingOptions).toEqual([])
  })

  it("accepts ordered repeated option fields", () => {
    const form = new FormData()
    form.append("availableSizes", "A3")
    form.append("availableSizes", "A2")
    form.set("framingEnabled", "on")
    form.append("framingOptions", "Black frame")
    form.append("framingOptions", "Natural wood")

    expect(parseArtworkRequestOptions(form)).toMatchObject({
      availableSizes: ["A3", "A2"],
      framingOptions: ["Black frame", "Natural wood"],
    })
  })
})
