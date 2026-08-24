import type { NormalizedEnquiryInput } from "@/features/enquiries/request-validation"

const WHATSAPP_NUMBER = "2348141780805"

const DESIGN_READINESS_LABELS = {
  FINISHED_DESIGN: "Finished design ready",
  NEEDS_DESIGN_HELP: "Needs design help",
  NOT_SURE: "Not sure about design",
} as const

function normalizeWebsiteOrigin(value: string | null | undefined) {
  if (!value) return "Debby Art & Prints website"

  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.origin
      : "Debby Art & Prints website"
  } catch {
    return "Debby Art & Prints website"
  }
}

function buildWhatsAppSummary(
  enquiry: NormalizedEnquiryInput,
  reference: string,
  websiteOrigin: string | null | undefined
) {
  const details: string[] = []

  if (enquiry.quantity) details.push(`Quantity: ${enquiry.quantity}`)
  if (enquiry.sizeFormat) details.push(`Size / format: ${enquiry.sizeFormat}`)
  if (enquiry.framing) details.push(`Framing: ${enquiry.framing}`)
  if (enquiry.designReadiness) {
    details.push(
      `Design readiness: ${DESIGN_READINESS_LABELS[enquiry.designReadiness]}`
    )
  }
  if (enquiry.colour) details.push(`Colour: ${enquiry.colour}`)
  if (enquiry.material) details.push(`Material: ${enquiry.material}`)
  if (enquiry.finish) details.push(`Finish: ${enquiry.finish}`)
  details.push(
    `Fulfilment: ${enquiry.fulfilmentMethod === "DELIVERY" ? "Delivery" : "Pickup"}`
  )
  if (enquiry.location) details.push(`Location: ${enquiry.location}`)
  if (enquiry.preferredDate) {
    details.push(
      `Preferred date: ${enquiry.preferredDate.toISOString().slice(0, 10)}`
    )
  }
  if (enquiry.customerNote) {
    const note = enquiry.customerNote.slice(0, 240)
    details.push(`Note: ${note}${enquiry.customerNote.length > 240 ? "…" : ""}`)
  }

  return [
    "Hello Debby Art & Prints, I submitted a request through your website.",
    `Website: ${normalizeWebsiteOrigin(websiteOrigin)}`,
    `Enquiry reference: ${reference}`,
    `Request type: ${enquiry.requestKind === "ARTWORK" ? "Artwork" : "Service"}`,
    `Selected item: ${enquiry.itemNameSnapshot}`,
    "",
    ...details,
  ].join("\n")
}

function buildWhatsAppUrl(summary: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(summary)}`
}

export {
  WHATSAPP_NUMBER,
  buildWhatsAppSummary,
  buildWhatsAppUrl,
  normalizeWebsiteOrigin,
}
