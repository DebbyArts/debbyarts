import type {
  RequestField,
  RequestFieldErrors,
} from "@/features/enquiries/types"
import type { ZodError } from "zod"

class EnquiryFieldError extends Error {
  fieldErrors: RequestFieldErrors

  constructor(fieldErrors: RequestFieldErrors) {
    super("Please correct the highlighted request details.")
    this.name = "EnquiryFieldError"
    this.fieldErrors = fieldErrors
  }
}

function enquiryFieldErrorsFromZod(error: ZodError): RequestFieldErrors {
  const fieldErrors: RequestFieldErrors = {}

  for (const issue of error.issues) {
    const field = issue.path[0]
    if (typeof field !== "string" || field in fieldErrors) continue

    fieldErrors[field as RequestField] = issue.message
  }

  return fieldErrors
}

export { EnquiryFieldError, enquiryFieldErrorsFromZod }
