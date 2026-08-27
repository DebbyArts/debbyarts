import { describe, expect, test } from "vitest"

import type {
  RequestArtworkOption,
  RequestDraft,
  RequestAuthority,
  RequestServiceOption,
} from "@/features/enquiries/types"
import {
  RequestValidationError,
  normalizeEmail,
  normalizePhone,
  normalizePreferredDate,
  validateEnquiryInput,
} from "@/features/enquiries/validation/request.validation"

const NOW = new Date("2026-08-24T12:00:00.000Z")

function draft(overrides: Partial<RequestDraft> = {}): RequestDraft {
  return {
    broadRequest: false,
    contextMode: "service",
    requestKind: "SERVICE",
    itemSlug: "custom-clothing",
    quantity: "12",
    sizeFormat: "Adult",
    framing: "",
    designReadiness: "FINISHED_DESIGN",
    colour: "Magenta",
    material: "",
    finish: "Matte",
    fulfilmentMethod: "DELIVERY",
    location: "Lagos",
    preferredDate: "2026-09-01",
    customerName: "  Ada   Okafor ",
    phoneWhatsApp: "0814 123 4567",
    email: " ADA@EXAMPLE.COM ",
    customerNote: "Please confirm timing.",
    ...overrides,
  }
}

const service: RequestServiceOption = {
  id: "service-1",
  slug: "custom-clothing",
  name: "Custom clothing",
  groupLabel: "Personalised Products",
  imageSrc: null,
  imageAlt: "Custom clothing",
  askQuantity: true,
  askSizeFormat: true,
  sizeFormatOptions: ["Adult", "Child"],
  askDesignReadiness: true,
  askColour: true,
  askMaterial: false,
  askFinish: true,
}

const serviceAuthority: RequestAuthority = {
  kind: "SERVICE",
  id: service.id,
  name: service.name,
  slug: service.slug,
  record: service,
}

const artwork: RequestArtworkOption = {
  id: "artwork-1",
  slug: "horses",
  title: "Horses",
  categoryLabel: "Painting",
  imageSrc: null,
  imageAlt: "Horses",
  availableSizes: ["A3"],
  framingEnabled: true,
  framingOptions: ["Black"],
  askQuantity: true,
}

describe("contact and date normalization", () => {
  test("normalizes Nigerian and international phone formats", () => {
    expect(normalizePhone("0814 123 4567")).toBe("+2348141234567")
    expect(normalizePhone("+44 7700 900123")).toBe("+447700900123")
    expect(normalizePhone("not-a-number")).toBeNull()
  })

  test("normalizes optional email and rejects invalid values", () => {
    expect(normalizeEmail(" ADA@EXAMPLE.COM ")).toBe("ada@example.com")
    expect(normalizeEmail("  ")).toBeNull()
    expect(normalizeEmail("ada@example")).toBeUndefined()
  })

  test("accepts real current/future dates and rejects past or invalid dates", () => {
    expect(normalizePreferredDate("2026-08-24", NOW)?.toISOString()).toBe(
      "2026-08-24T00:00:00.000Z"
    )
    expect(normalizePreferredDate("2026-08-23", NOW)).toBeUndefined()
    expect(normalizePreferredDate("2026-02-31", NOW)).toBeUndefined()
    expect(normalizePreferredDate("", NOW)).toBeNull()
  })
})

describe("authoritative request validation", () => {
  test("normalizes a valid configured Service request", () => {
    const result = validateEnquiryInput(draft(), serviceAuthority, NOW)

    expect(result).toMatchObject({
      requestKind: "SERVICE",
      serviceId: "service-1",
      artworkId: null,
      quantity: 12,
      sizeFormat: "Adult",
      designReadiness: "FINISHED_DESIGN",
      colour: "Magenta",
      material: null,
      finish: "Matte",
      customerName: "Ada Okafor",
      phoneWhatsApp: "+2348141234567",
      email: "ada@example.com",
    })
  })

  test("rejects tampered and disabled Service answers", () => {
    expect(() =>
      validateEnquiryInput(
        draft({ sizeFormat: "Unconfigured", material: "Cotton", framing: "Black" }),
        serviceAuthority,
        NOW
      )
    ).toThrow(RequestValidationError)

    try {
      validateEnquiryInput(
        draft({ sizeFormat: "Unconfigured", material: "Cotton", framing: "Black" }),
        serviceAuthority,
        NOW
      )
    } catch (error) {
      expect((error as RequestValidationError).fieldErrors).toMatchObject({
        sizeFormat: expect.any(String),
        material: expect.any(String),
        framing: expect.any(String),
      })
    }
  })

  test("enforces Artwork-only option scope", () => {
    const authority: RequestAuthority = {
      kind: "ARTWORK",
      id: artwork.id,
      name: artwork.title,
      slug: artwork.slug,
      record: artwork,
    }
    const result = validateEnquiryInput(
      draft({
        contextMode: "artwork",
        requestKind: "ARTWORK",
        itemSlug: "horses",
        quantity: "1",
        sizeFormat: "A3",
        framing: "Black",
        designReadiness: "",
        colour: "",
        finish: "",
      }),
      authority,
      NOW
    )

    expect(result).toMatchObject({
      requestKind: "ARTWORK",
      artworkId: "artwork-1",
      serviceId: null,
      sizeFormat: "A3",
      framing: "Black",
      designReadiness: null,
    })
  })

  test("broad requests reject forged structured answers", () => {
    const authority: RequestAuthority = {
      kind: "ARTWORK",
      id: null,
      name: "Custom art commission",
      slug: "art-commission",
      record: null,
    }

    expect(() =>
      validateEnquiryInput(
        draft({
          broadRequest: true,
          contextMode: "art-commission",
          requestKind: "ARTWORK",
          itemSlug: "",
          quantity: "10",
          sizeFormat: "A3",
          designReadiness: "",
          colour: "",
          finish: "",
        }),
        authority,
        NOW
      )
    ).toThrow(RequestValidationError)
  })
})
