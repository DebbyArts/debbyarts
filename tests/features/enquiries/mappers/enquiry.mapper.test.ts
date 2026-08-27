import { afterEach, describe, expect, test, vi } from "vitest"

import {
  mapToEnquiryDetail,
  type EnquiryDetailRecord,
} from "@/features/enquiries/mappers/enquiry.mapper"

afterEach(() => {
  vi.unstubAllEnvs()
})

function detailRecord(
  overrides: Partial<EnquiryDetailRecord> = {}
): EnquiryDetailRecord {
  return {
    id: "enquiry-1",
    reference: "DAP-DETAIL123",
    status: "CONTACTED",
    requestKind: "ARTWORK",
    itemNameSnapshot: "Original portrait",
    quantity: 2,
    sizeFormat: "A3",
    framing: "Black",
    designReadiness: null,
    colour: null,
    material: null,
    finish: null,
    fulfilmentMethod: "DELIVERY",
    location: "Lagos",
    preferredDate: new Date("2026-09-01T12:00:00.000Z"),
    customerName: "Ada Okafor",
    phoneWhatsApp: "+2348141234567",
    email: "ada@example.com",
    customerNote: "Please confirm timing.",
    createdAt: new Date("2026-08-27T12:00:00.000Z"),
    updatedAt: new Date("2026-08-27T12:00:02.000Z"),
    artwork: {
      id: "artwork-1",
      title: "Family portrait",
      primaryImagePath: "owner/artwork/family.webp",
      primaryImageAlt: "Family portrait in charcoal",
    },
    service: null,
    ...overrides,
  }
}

describe("enquiry detail mapper", () => {
  test("creates the ready-to-render projection for a linked artwork", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://project.supabase.co")
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET", "public-assets")

    const result = mapToEnquiryDetail(detailRecord())

    expect(result).toMatchObject({
      statusTone: "contacted",
      requestKindLabel: "Artwork",
      statusChangedLabel: expect.not.stringMatching(/^Not yet$/),
      linkedRecord: {
        name: "Family portrait",
        href: "/admin/artwork/artwork-1",
        imageAlt: "Family portrait in charcoal",
        imageUrl:
          "https://project.supabase.co/storage/v1/object/public/public-assets/owner/artwork/family.webp",
        hasLinkedRecord: true,
        sourceLabel: "Linked record",
      },
      requestDetails: {
        quantity: 2,
        sizeFormat: "A3",
        framing: "Black",
      },
      delivery: {
        fulfilmentMethodLabel: "Delivery",
        location: "Lagos",
      },
    })
    expect(result.receivedLabel).toContain("Aug 2026")
    expect(result.delivery.preferredDateLabel).toContain("Sept 2026")
  })

  test("retains the submission snapshot when the linked record was deleted", () => {
    const result = mapToEnquiryDetail(
      detailRecord({ artwork: null, service: null })
    )

    expect(result.linkedRecord).toEqual({
      name: "Original portrait",
      href: null,
      imageUrl: null,
      imageAlt: "",
      hasLinkedRecord: false,
      sourceLabel: "Saved snapshot",
    })
  })
})
