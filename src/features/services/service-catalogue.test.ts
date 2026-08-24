import { Prisma } from "@/db/generated/prisma/client"
import { PricingMode, ServiceGroup } from "@/db/generated/prisma/enums"
import {
  deriveOptionCues,
  derivePricingPresentation,
  getServiceRequestHref,
  projectServiceGroups,
  resolveImageSource,
} from "@/features/services/service-catalogue"
import {
  PUBLISHED_SERVICES_QUERY,
  type PublishedServiceRecord,
} from "@/features/services/service-query"
import { describe, expect, test } from "vitest"

function serviceRecord(
  overrides: Partial<PublishedServiceRecord> = {}
): PublishedServiceRecord {
  return {
    id: "service-1",
    slug: "custom-clothing",
    name: "Custom Clothing",
    description: "Made-to-order clothing.",
    group: ServiceGroup.PERSONALISED_PRODUCTS,
    primaryImagePath: null,
    primaryImageAlt: null,
    pricingMode: PricingMode.NONE,
    priceAmount: null,
    published: true,
    displayOrder: 0,
    askQuantity: false,
    askSizeFormat: false,
    sizeFormatOptions: [],
    askDesignReadiness: false,
    askColour: false,
    askMaterial: false,
    askFinish: false,
    ...overrides,
  }
}

describe("published Services query", () => {
  test("reads published rows only with deterministic database ordering", () => {
    expect(PUBLISHED_SERVICES_QUERY.where).toEqual({ published: true })
    expect(PUBLISHED_SERVICES_QUERY.orderBy).toEqual([
      { displayOrder: "asc" },
      { name: "asc" },
      { slug: "asc" },
    ])
  })
})

describe("Service catalogue projection", () => {
  test("uses fixed group order, display order, and omits empty groups", () => {
    const groups = projectServiceGroups([
      serviceRecord({
        id: "branding",
        slug: "signage",
        name: "Signage",
        group: ServiceGroup.BRANDING_SIGNAGE,
      }),
      serviceRecord({
        id: "print-later",
        slug: "flyers",
        name: "Flyers",
        group: ServiceGroup.PRINT_EVENT_MATERIALS,
        displayOrder: 4,
      }),
      serviceRecord({
        id: "print-first",
        slug: "award-plaques",
        name: "Award Plaques",
        group: ServiceGroup.PRINT_EVENT_MATERIALS,
        displayOrder: 1,
      }),
    ])

    expect(groups.map((group) => group.label)).toEqual([
      "Print & Event Materials",
      "Branding & Signage",
    ])
    expect(groups[0]?.services.map((service) => service.slug)).toEqual([
      "award-plaques",
      "flyers",
    ])
  })

  test("projects every approved pricing mode", () => {
    expect(
      derivePricingPresentation(serviceRecord({ pricingMode: PricingMode.NONE }))
    ).toEqual({ mode: PricingMode.NONE, label: "Price on request" })

    expect(
      derivePricingPresentation(
        serviceRecord({
          pricingMode: PricingMode.EXACT,
          priceAmount: new Prisma.Decimal("25000"),
        })
      )
    ).toEqual({ mode: PricingMode.EXACT, label: "₦25,000" })

    expect(
      derivePricingPresentation(
        serviceRecord({
          pricingMode: PricingMode.STARTING_FROM,
          priceAmount: new Prisma.Decimal("12500.50"),
        })
      )
    ).toEqual({
      mode: PricingMode.STARTING_FROM,
      label: "From ₦12,500.5",
    })
  })

  test("rejects invalid persisted pricing instead of inventing a value", () => {
    expect(() =>
      derivePricingPresentation(
        serviceRecord({
          pricingMode: PricingMode.NONE,
          priceAmount: new Prisma.Decimal("1"),
        })
      )
    ).toThrow(/invalid persisted pricing data/)

    expect(() =>
      derivePricingPresentation(
        serviceRecord({ pricingMode: PricingMode.EXACT, priceAmount: null })
      )
    ).toThrow(/invalid persisted pricing data/)

    expect(() =>
      derivePricingPresentation(
        serviceRecord({
          pricingMode: PricingMode.STARTING_FROM,
          priceAmount: new Prisma.Decimal("0"),
        })
      )
    ).toThrow(/invalid persisted pricing data/)
  })

  test("uses only the six fixed request-option cues", () => {
    const cues = deriveOptionCues(
      serviceRecord({
        askQuantity: true,
        askSizeFormat: true,
        sizeFormatOptions: ["A4", "A3"],
        askDesignReadiness: true,
        askColour: true,
        askMaterial: true,
        askFinish: true,
      })
    )

    expect(cues).toEqual([
      "Quantity",
      "Size / format",
      "Design readiness",
      "Colour",
      "Material",
      "Finish",
    ])
  })

  test("builds stable encoded request URLs", () => {
    expect(getServiceRequestHref("mugs & prints")).toBe(
      "/request?service=mugs%20%26%20prints"
    )
  })

  test("uses an intentional fallback for missing or unusable images", () => {
    expect(resolveImageSource(null)).toBeUndefined()
    expect(resolveImageSource("service/object-path.jpg")).toBeUndefined()
    expect(resolveImageSource("/services/example.jpg")).toBe(
      "/services/example.jpg"
    )
    expect(resolveImageSource("https://images.example.com/service.jpg")).toBe(
      "https://images.example.com/service.jpg"
    )

    const groups = projectServiceGroups([
      serviceRecord({ primaryImagePath: "/services/example.jpg" }),
    ])

    expect(groups[0]?.services[0]?.imageSrc).toBeUndefined()
    expect(groups[0]?.services[0]?.imageAlt).toBe(
      "Image unavailable for Custom Clothing"
    )
  })

  test("renders an intentional empty catalogue without dead groups", () => {
    expect(projectServiceGroups([])).toEqual([])
  })
})
