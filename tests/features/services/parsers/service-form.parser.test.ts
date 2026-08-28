import { describe, expect, it } from "vitest"

import {
  parseServiceMutation,
  parseServiceRequestOptions,
} from "@/features/services/parsers/service-form.parser"

function validServiceForm() {
  const form = new FormData()
  form.set("name", "  Custom Clothing  ")
  form.set("description", "  Personalised clothing production.  ")
  form.set("group", "PERSONALISED_PRODUCTS")
  form.set("pricingMode", "EXACT")
  form.set("priceAmount", "25,000")
  form.set("displayOrder", "1")
  return form
}

describe("Service FormData parser", () => {
  it("decodes trimmed mutation fields and derives a normalized slug and price", () => {
    expect(
      parseServiceMutation(validServiceForm(), { hasImage: false })
    ).toMatchObject({
      description: "Personalised clothing production.",
      displayOrder: 1,
      name: "Custom Clothing",
      priceAmount: "25000.00",
      slug: "custom-clothing",
    })
  })

  it("clears the price when pricing is disabled", () => {
    const form = validServiceForm()
    form.set("pricingMode", "NONE")

    expect(parseServiceMutation(form, { hasImage: false }).priceAmount).toBeNull()
  })

  it("clears disabled options and preserves ordered unique enabled options", () => {
    const disabled = new FormData()
    disabled.set("sizeFormatOptions", "A4")
    disabled.set("materialOptions", "Cotton")

    expect(parseServiceRequestOptions(disabled)).toMatchObject({
      materialOptions: [],
      sizeFormatOptions: [],
    })

    const enabled = new FormData()
    enabled.set("askSizeFormat", "on")
    enabled.append("sizeFormatOptions", "A4, A3")
    enabled.append("sizeFormatOptions", "A4")
    enabled.set("askMaterial", "on")
    enabled.append("materialOptions", "Cotton")
    enabled.append("materialOptions", "Polyester")

    expect(parseServiceRequestOptions(enabled)).toMatchObject({
      materialOptions: ["Cotton", "Polyester"],
      sizeFormatOptions: ["A4", "A3"],
    })
  })
})
