import { REQUEST_CONTEXT_MODES } from "@/features/enquiries/constants"
import { createEnquirySubmissionSchema } from "@/features/enquiries/schemas/enquiry.schema"
import type {
  ParsedEnquiryInput,
  RequestContextMode,
  RequestDraft,
} from "@/features/enquiries/types"

function formValue(formData: FormData, field: string) {
  const value = formData.get(field)
  return typeof value === "string" ? value : ""
}

function requestDraftFromFormData(formData: FormData): RequestDraft {
  const contextModeValue = formValue(formData, "contextMode")
  const contextMode: RequestContextMode = REQUEST_CONTEXT_MODES.includes(
    contextModeValue as RequestContextMode
  )
    ? (contextModeValue as RequestContextMode)
    : "default"

  return {
    broadRequest: formValue(formData, "broadRequest") === "true",
    colour: formValue(formData, "colour"),
    contextMode,
    customerName: formValue(formData, "customerName"),
    customerNote: formValue(formData, "customerNote"),
    designReadiness: formValue(formData, "designReadiness"),
    email: formValue(formData, "email"),
    finish: formValue(formData, "finish"),
    framing: formValue(formData, "framing"),
    fulfilmentMethod: formValue(formData, "fulfilmentMethod"),
    itemSlug: formValue(formData, "itemSlug"),
    location: formValue(formData, "location"),
    material: formValue(formData, "material"),
    phoneWhatsApp: formValue(formData, "phoneWhatsApp"),
    preferredDate: formValue(formData, "preferredDate"),
    quantity: formValue(formData, "quantity"),
    requestKind: formValue(formData, "requestKind") as RequestDraft["requestKind"],
    sizeFormat: formValue(formData, "sizeFormat"),
  }
}

function parseEnquiryForm(
  formData: FormData,
  now = new Date()
): ParsedEnquiryInput {
  return createEnquirySubmissionSchema(now).parse(
    requestDraftFromFormData(formData)
  )
}

export { parseEnquiryForm, requestDraftFromFormData }
