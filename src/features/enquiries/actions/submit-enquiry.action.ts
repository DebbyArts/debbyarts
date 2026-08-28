"use server"

import { headers } from "next/headers"
import { ZodError } from "zod"

import {
  EnquiryFieldError,
  enquiryFieldErrorsFromZod,
} from "@/features/enquiries/errors/enquiry-field.error"
import { RequestContextUnavailableError } from "@/features/enquiries/errors/request-context-unavailable.error"
import { parseEnquiryForm } from "@/features/enquiries/parsers/enquiry-form.parser"
import { submitEnquiry } from "@/features/enquiries/services/enquiry.mutation.service"
import type { EnquiryActionState } from "@/features/enquiries/types"

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
  try {
    const input = parseEnquiryForm(formData)
    const result = await submitEnquiry(input, await requestOrigin())
    return {
      status: "success",
      reference: result.reference,
      whatsappUrl: result.whatsappUrl,
      duplicate: result.duplicate,
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        status: "validation",
        message: "Please correct the highlighted request details.",
        fieldErrors: enquiryFieldErrorsFromZod(error),
      }
    }

    if (error instanceof EnquiryFieldError) {
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
