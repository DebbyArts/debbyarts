import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
  headers: vi.fn(),
  submitEnquiry: vi.fn(),
}))

vi.mock("next/headers", () => ({ headers: mocks.headers }))
vi.mock(
  "@/features/enquiries/services/enquiry.mutation.service",
  async (importOriginal) => ({
    ...(await importOriginal<
      typeof import("@/features/enquiries/services/enquiry.mutation.service")
    >()),
    submitEnquiry: mocks.submitEnquiry,
  })
)

import { submitEnquiryAction } from "@/features/enquiries/actions/submit-enquiry.action"
import { INITIAL_ENQUIRY_ACTION_STATE } from "@/features/enquiries/constants"
import { EnquiryFieldError } from "@/features/enquiries/errors/enquiry-field.error"

function validForm() {
  const form = new FormData()
  form.set("broadRequest", "true")
  form.set("contextMode", "art-commission")
  form.set("requestKind", "ARTWORK")
  form.set("fulfilmentMethod", "PICKUP")
  form.set("customerName", " Ada Okafor ")
  form.set("phoneWhatsApp", "0814 123 4567")
  return form
}

describe("Enquiry submission action boundary", () => {
  beforeEach(() => {
    Object.values(mocks).forEach((mock) => mock.mockReset())
    mocks.headers.mockResolvedValue(
      new Headers({ origin: "https://debby.example" })
    )
    mocks.submitEnquiry.mockResolvedValue({
      duplicate: false,
      reference: "DAP-ACTION123",
      whatsappSummary: "summary",
      whatsappUrl: "https://wa.me/2348141780805?text=summary",
    })
  })

  it("parses and normalizes input before returning the existing success shape", async () => {
    const result = await submitEnquiryAction(
      INITIAL_ENQUIRY_ACTION_STATE,
      validForm()
    )

    expect(mocks.submitEnquiry).toHaveBeenCalledWith(
      expect.objectContaining({
        customerName: "Ada Okafor",
        phoneWhatsApp: "+2348141234567",
        requestKind: "ARTWORK",
      }),
      "https://debby.example"
    )
    expect(result).toEqual({
      duplicate: false,
      reference: "DAP-ACTION123",
      status: "success",
      whatsappUrl: "https://wa.me/2348141780805?text=summary",
    })
  })

  it("maps expected Zod failures to structured field errors without calling the service", async () => {
    const form = validForm()
    form.set("phoneWhatsApp", "not-a-number")
    form.set("email", "invalid-email")

    const result = await submitEnquiryAction(
      INITIAL_ENQUIRY_ACTION_STATE,
      form
    )

    expect(result).toEqual({
      fieldErrors: {
        email: "Enter a valid email address.",
        phoneWhatsApp: "Enter a valid phone or WhatsApp number.",
      },
      message: "Please correct the highlighted request details.",
      status: "validation",
    })
    expect(mocks.submitEnquiry).not.toHaveBeenCalled()
  })

  it("preserves stateful catalogue field errors from the mutation service", async () => {
    mocks.submitEnquiry.mockRejectedValue(
      new EnquiryFieldError({
        itemSlug: "Choose a specific item or a broad request.",
      })
    )

    const result = await submitEnquiryAction(
      INITIAL_ENQUIRY_ACTION_STATE,
      validForm()
    )

    expect(result).toEqual({
      fieldErrors: {
        itemSlug: "Choose a specific item or a broad request.",
      },
      message: "Please correct the highlighted request details.",
      status: "validation",
    })
  })
})
