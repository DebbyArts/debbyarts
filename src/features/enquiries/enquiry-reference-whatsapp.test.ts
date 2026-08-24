import { describe, expect, test } from "vitest"

import { generateEnquiryReference } from "@/features/enquiries/enquiry-reference"
import type { NormalizedEnquiryInput } from "@/features/enquiries/request-validation"
import {
  WHATSAPP_NUMBER,
  buildWhatsAppSummary,
  buildWhatsAppUrl,
} from "@/features/enquiries/whatsapp"

const enquiry: NormalizedEnquiryInput = {
  requestKind: "SERVICE",
  artworkId: null,
  serviceId: "service-1",
  itemNameSnapshot: "Custom clothing",
  itemSlugSnapshot: "custom-clothing",
  quantity: 12,
  sizeFormat: "Adult",
  framing: null,
  designReadiness: "FINISHED_DESIGN",
  colour: "Magenta",
  material: null,
  finish: "Matte",
  fulfilmentMethod: "DELIVERY",
  location: "Lagos",
  preferredDate: new Date("2026-09-01T00:00:00.000Z"),
  customerName: "Ada Okafor",
  phoneWhatsApp: "+2348141234567",
  email: "ada@example.com",
  customerNote: "Please confirm timing.",
}

describe("enquiry references", () => {
  test("generates a stable reference with supplied collision entropy", () => {
    expect(
      generateEnquiryReference(Uint8Array.from([0, 1, 2, 254, 255]))
    ).toBe("DAP-000102FEFF")
  })
})

describe("WhatsApp continuation", () => {
  test("constructs a contextual non-sensitive summary and encoded target URL", () => {
    const summary = buildWhatsAppSummary(
      enquiry,
      "DAP-20260824-ABC123",
      "https://debby.example/request"
    )
    const url = buildWhatsAppUrl(summary)

    expect(summary).toContain("Website: https://debby.example")
    expect(summary).toContain("Enquiry reference: DAP-20260824-ABC123")
    expect(summary).toContain("Selected item: Custom clothing")
    expect(summary).toContain("Quantity: 12")
    expect(summary).not.toContain(enquiry.phoneWhatsApp)
    expect(summary).not.toContain(enquiry.email as string)
    expect(summary).not.toContain(enquiry.customerName)
    expect(url).toBe(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(summary)}`)
  })
})
