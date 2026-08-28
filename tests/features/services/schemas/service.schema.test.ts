import { describe, expect, it } from "vitest"

import {
  serviceMutationSchema,
  serviceRequestOptionsSchema,
} from "@/features/services/schemas/service.schema"

function validMutationInput() {
  return {
    description: "Personalised clothing production.",
    displayOrder: "1",
    group: "PERSONALISED_PRODUCTS",
    hasImage: true,
    name: "Custom Clothing",
    priceAmount: "",
    pricingMode: "NONE",
    primaryImageAlt: "A printed custom shirt",
    published: false,
    slug: "custom-clothing",
  }
}

function validOptionsInput() {
  return {
    askColour: false,
    askDesignReadiness: false,
    askFinish: false,
    askMaterial: false,
    askQuantity: false,
    askSizeFormat: false,
    materialOptions: [],
    sizeFormatOptions: [],
  }
}

describe("Service schemas", () => {
  it("enforces valid controlled values and publication image requirements", () => {
    expect(() =>
      serviceMutationSchema.parse({
        ...validMutationInput(),
        group: "UNKNOWN",
      })
    ).toThrow("Choose a valid service group.")

    expect(() =>
      serviceMutationSchema.parse({
        ...validMutationInput(),
        hasImage: false,
        primaryImageAlt: null,
        published: true,
      })
    ).toThrow(
      "Published services require a primary image and useful alt text."
    )
  })

  it("requires coherent positive pricing and bounded display order", () => {
    expect(() =>
      serviceMutationSchema.parse({
        ...validMutationInput(),
        priceAmount: "not a price",
        pricingMode: "EXACT",
      })
    ).toThrow("Enter a positive amount for the selected pricing mode.")

    expect(() =>
      serviceMutationSchema.parse({
        ...validMutationInput(),
        displayOrder: "10000",
      })
    ).toThrow("Display order must be a whole number from 0 to 9999.")
  })

  it("requires enabled option groups to contain bounded values", () => {
    expect(() =>
      serviceRequestOptionsSchema.parse({
        ...validOptionsInput(),
        askSizeFormat: true,
      })
    ).toThrow("Add at least one size / format option or turn that question off.")

    expect(() =>
      serviceRequestOptionsSchema.parse({
        ...validOptionsInput(),
        askMaterial: true,
        materialOptions: ["x".repeat(81)],
      })
    ).toThrow(
      "Material options supports up to 20 unique entries of 80 characters each."
    )
  })
})
