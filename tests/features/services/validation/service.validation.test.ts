import { describe, expect, it } from "vitest"

import {
  parseServiceMutation,
  parseServiceRequestOptions,
  ServiceValidationError,
} from "@/features/services/validation/service.validation"

function validServiceForm() {
  const form = new FormData()
  form.set("name", "Custom Clothing")
  form.set("description", "Personalised clothing production.")
  form.set("group", "PERSONALISED_PRODUCTS")
  form.set("pricingMode", "NONE")
  form.set("displayOrder", "1")
  return form
}

describe("Service Admin validation", () => {
  it("uses only the fixed schema fields and clears the no-price amount", () => {
    const result = parseServiceMutation(validServiceForm(), { hasImage: false })
    expect(result.slug).toBe("custom-clothing")
    expect(result.priceAmount).toBeNull()
    expect(result).not.toHaveProperty("featured")
  })

  it("requires options when size / format is enabled", () => {
    const form = new FormData()
    form.set("askSizeFormat", "on")
    expect(() => parseServiceRequestOptions(form)).toThrow(
      ServiceValidationError
    )
  })

  it("requires material options when material is enabled", () => {
    const form = new FormData()
    form.set("askMaterial", "on")

    expect(() => parseServiceRequestOptions(form)).toThrow(
      ServiceValidationError
    )
  })

  it("accepts ordered repeated size / format fields and deduplicates values", () => {
    const form = new FormData()
    form.set("askSizeFormat", "on")
    form.append("sizeFormatOptions", "A4")
    form.append("sizeFormatOptions", "A4")
    form.append("sizeFormatOptions", "Landscape")
    expect(parseServiceRequestOptions(form).sizeFormatOptions).toEqual([
      "A4",
      "Landscape",
    ])
  })

  it("accepts ordered repeated material fields", () => {
    const form = new FormData()
    form.set("askMaterial", "on")
    form.append("materialOptions", "Cotton")
    form.append("materialOptions", "Polyester")

    expect(parseServiceRequestOptions(form).materialOptions).toEqual([
      "Cotton",
      "Polyester",
    ])
  })
})
