"use server"

import { headers } from "next/headers"

import {
  RequestContextUnavailableError,
} from "@/features/enquiries/create-enquiry"
import type {
  EnquiryActionState,
  RequestContextMode,
  RequestDraft,
} from "@/features/enquiries/request-types"
import { RequestValidationError } from "@/features/enquiries/request-validation"
import { persistEnquiry } from "@/features/enquiries/server/persist-enquiry"

function formValue(formData: FormData, field: string) {
  const value = formData.get(field)
  return typeof value === "string" ? value : ""
}

function requestDraftFromFormData(formData: FormData): RequestDraft {
  const contextModeValue = formValue(formData, "contextMode")
  const contextMode: RequestContextMode = [
    "default",
    "art-commission",
    "artwork",
    "service",
  ].includes(contextModeValue)
    ? (contextModeValue as RequestContextMode)
    : "default"

  return {
    broadRequest: formValue(formData, "broadRequest") === "true",
    contextMode,
    requestKind: formValue(formData, "requestKind") as RequestDraft["requestKind"],
    itemSlug: formValue(formData, "itemSlug"),
    quantity: formValue(formData, "quantity"),
    sizeFormat: formValue(formData, "sizeFormat"),
    framing: formValue(formData, "framing"),
    designReadiness: formValue(formData, "designReadiness"),
    colour: formValue(formData, "colour"),
    material: formValue(formData, "material"),
    finish: formValue(formData, "finish"),
    fulfilmentMethod: formValue(formData, "fulfilmentMethod"),
    location: formValue(formData, "location"),
    preferredDate: formValue(formData, "preferredDate"),
    customerName: formValue(formData, "customerName"),
    phoneWhatsApp: formValue(formData, "phoneWhatsApp"),
    email: formValue(formData, "email"),
    customerNote: formValue(formData, "customerNote"),
  }
}

async function requestOrigin() {
  const requestHeaders = await headers()
  const origin = requestHeaders.get("origin")
  if (origin) return origin

  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host")
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https"
  return host ? `${protocol.split(",")[0]}://${host}` : null
}

async function submitEnquiryAction(
  _previousState: EnquiryActionState,
  formData: FormData
): Promise<EnquiryActionState> {
  const draft = requestDraftFromFormData(formData)

  try {
    const result = await persistEnquiry(draft, await requestOrigin())
    return {
      status: "success",
      reference: result.reference,
      whatsappUrl: result.whatsappUrl,
      duplicate: result.duplicate,
    }
  } catch (error) {
    if (error instanceof RequestValidationError) {
      return {
        status: "validation",
        message: error.message,
        fieldErrors: error.fieldErrors,
      }
    }

    if (error instanceof RequestContextUnavailableError) {
      return { status: "context-error", message: error.message }
    }

    return {
      status: "error",
      message:
        "We couldn’t save your request. Your answers are still here, so you can try again.",
    }
  }
}

export {
  submitEnquiryAction,
}
