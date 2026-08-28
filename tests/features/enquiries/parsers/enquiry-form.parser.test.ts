import { describe, expect, it } from "vitest"

import {
  parseEnquiryForm,
  requestDraftFromFormData,
} from "@/features/enquiries/parsers/enquiry-form.parser"

const NOW = new Date("2026-08-24T12:00:00.000Z")

function validForm() {
  const form = new FormData()
  form.set("broadRequest", "false")
  form.set("contextMode", "service")
  form.set("requestKind", "SERVICE")
  form.set("itemSlug", " custom-clothing ")
  form.set("quantity", "12")
  form.set("sizeFormat", " Adult ")
  form.set("designReadiness", "FINISHED_DESIGN")
  form.set("colour", " Magenta ")
  form.set("material", "Cotton")
  form.set("finish", "Matte")
  form.set("fulfilmentMethod", "DELIVERY")
  form.set("location", " Lagos ")
  form.set("preferredDate", "2026-09-01")
  form.set("customerName", "  Ada   Okafor ")
  form.set("phoneWhatsApp", "0814 123 4567")
  form.set("email", " ADA@EXAMPLE.COM ")
  form.set("customerNote", " Please confirm timing. ")
  return form
}

describe("Enquiry FormData parser", () => {
  it("decodes FormData and returns the typed normalized submission input", () => {
    expect(parseEnquiryForm(validForm(), NOW)).toMatchObject({
      contextMode: "service",
      customerName: "Ada Okafor",
      email: "ada@example.com",
      itemSlug: "custom-clothing",
      location: "Lagos",
      phoneWhatsApp: "+2348141234567",
      quantity: 12,
      sizeFormat: "Adult",
    })
  })

  it("defaults an unrecognized transport context without hiding invalid domain fields", () => {
    const form = validForm()
    form.set("contextMode", "unknown")
    form.set("requestKind", "unknown")

    expect(requestDraftFromFormData(form).contextMode).toBe("default")
    expect(() => parseEnquiryForm(form, NOW)).toThrow(
      "Choose Art & Gallery or Services."
    )
  })

  it("treats non-string FormData entries as empty text", () => {
    const form = validForm()
    form.set("email", new File(["ignored"], "email.txt"))

    expect(parseEnquiryForm(form, NOW).email).toBeNull()
  })
})
