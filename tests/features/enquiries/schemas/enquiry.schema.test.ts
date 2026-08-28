import { describe, expect, it } from "vitest"

import {
  createEnquiryPreferredDateSchema,
  createEnquirySubmissionSchema,
  enquiryEmailSchema,
  enquiryPhoneSchema,
} from "@/features/enquiries/schemas/enquiry.schema"
import type { RequestDraft } from "@/features/enquiries/types"

const NOW = new Date("2026-08-24T12:00:00.000Z")

function validDraft(overrides: Partial<RequestDraft> = {}): RequestDraft {
  return {
    broadRequest: false,
    colour: "Magenta",
    contextMode: "service",
    customerName: "  Ada   Okafor ",
    customerNote: "Please confirm timing.",
    designReadiness: "FINISHED_DESIGN",
    email: " ADA@EXAMPLE.COM ",
    finish: "Matte",
    framing: "",
    fulfilmentMethod: "DELIVERY",
    itemSlug: "custom-clothing",
    location: " Lagos ",
    material: "Cotton",
    phoneWhatsApp: "0814 123 4567",
    preferredDate: "2026-09-01",
    quantity: "12",
    requestKind: "SERVICE",
    sizeFormat: "Adult",
    ...overrides,
  }
}

describe("Enquiry schemas", () => {
  it("normalizes transport-independent contact, date, quantity, and text fields", () => {
    const result = createEnquirySubmissionSchema(NOW).parse(validDraft())

    expect(result).toMatchObject({
      customerName: "Ada Okafor",
      email: "ada@example.com",
      location: "Lagos",
      phoneWhatsApp: "+2348141234567",
      quantity: 12,
    })
    expect(result.preferredDate?.toISOString()).toBe(
      "2026-09-01T00:00:00.000Z"
    )
  })

  it("accepts supported phone formats and an empty optional email", () => {
    expect(enquiryPhoneSchema.parse("+44 7700 900123")).toBe(
      "+447700900123"
    )
    expect(enquiryEmailSchema.parse("  ")).toBeNull()
  })

  it("rejects invalid contact and controlled values with field messages", () => {
    expect(() => enquiryPhoneSchema.parse("not-a-number")).toThrow(
      "Enter a valid phone or WhatsApp number."
    )
    expect(() => enquiryEmailSchema.parse("ada@example")).toThrow(
      "Enter a valid email address."
    )
    expect(() =>
      createEnquirySubmissionSchema(NOW).parse(
        validDraft({ fulfilmentMethod: "UNKNOWN" })
      )
    ).toThrow("Choose delivery or pickup.")
  })

  it("accepts current or future dates and rejects past or impossible dates", () => {
    const schema = createEnquiryPreferredDateSchema(NOW)

    expect(schema.parse("2026-08-24")?.toISOString()).toBe(
      "2026-08-24T00:00:00.000Z"
    )
    expect(schema.parse("")).toBeNull()
    expect(() => schema.parse("2026-08-23")).toThrow(
      "Choose today or a future date."
    )
    expect(() => schema.parse("2026-02-31")).toThrow(
      "Choose today or a future date."
    )
  })

  it("enforces delivery location and note limits without catalogue knowledge", () => {
    expect(() =>
      createEnquirySubmissionSchema(NOW).parse(validDraft({ location: "" }))
    ).toThrow("Enter the delivery area, city, or state.")

    expect(() =>
      createEnquirySubmissionSchema(NOW).parse(
        validDraft({ customerNote: "x".repeat(2_001) })
      )
    ).toThrow("Keep the note under 2,000 characters.")
  })
})
