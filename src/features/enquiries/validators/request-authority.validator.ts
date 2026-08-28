import { DESIGN_READINESS_VALUES } from "@/features/enquiries/constants"
import { EnquiryFieldError } from "@/features/enquiries/errors/enquiry-field.error"
import type {
  NormalizedEnquiryInput,
  ParsedEnquiryInput,
  RequestAuthority,
  RequestFieldErrors,
} from "@/features/enquiries/types"

function fieldError(fieldErrors: RequestFieldErrors) {
  return new EnquiryFieldError(fieldErrors)
}

function boundedText(value: string, maximumLength: number) {
  return value.length <= maximumLength ? value || null : null
}

function validateRequestAuthority(
  enquiry: ParsedEnquiryInput,
  authority: RequestAuthority
): NormalizedEnquiryInput {
  const errors: RequestFieldErrors = {}
  let sizeFormat: string | null = null
  let framing: string | null = null
  let designReadiness: NormalizedEnquiryInput["designReadiness"] = null
  let colour: string | null = null
  let material: string | null = null
  let finish: string | null = null

  if (authority.kind !== enquiry.requestKind) {
    errors.requestKind = "Choose the request type again."
  }

  if (authority.kind === "ARTWORK" && authority.record) {
    const size = boundedText(enquiry.sizeFormat, 200)
    const frame = boundedText(enquiry.framing, 200)

    if (authority.record.availableSizes.length > 0) {
      if (!size || !authority.record.availableSizes.includes(size)) {
        errors.sizeFormat = "Choose one of the available artwork sizes."
      } else {
        sizeFormat = size
      }
    } else if (enquiry.sizeFormat) {
      errors.sizeFormat = "Size is not available for this artwork."
    }

    const framingOptions = authority.record.framingEnabled
      ? authority.record.framingOptions
      : []
    if (framingOptions.length > 0) {
      if (!frame || !framingOptions.includes(frame)) {
        errors.framing = "Choose one of the available framing options."
      } else {
        framing = frame
      }
    } else if (enquiry.framing) {
      errors.framing = "Framing is not available for this artwork."
    }

    if (authority.record.askQuantity) {
      if (enquiry.quantity === null) {
        errors.quantity = "Enter the required quantity."
      }
    } else if (enquiry.quantity !== null) {
      errors.quantity = "Quantity does not apply to this artwork."
    }

    if (
      enquiry.designReadiness ||
      enquiry.colour ||
      enquiry.material ||
      enquiry.finish
    ) {
      errors.designReadiness =
        "Service-only answers cannot be submitted for artwork."
    }
  } else if (authority.kind === "SERVICE" && authority.record) {
    const service = authority.record
    const size = boundedText(enquiry.sizeFormat, 200)

    if (service.askQuantity) {
      if (enquiry.quantity === null) {
        errors.quantity = "Enter the required quantity."
      }
    } else if (enquiry.quantity !== null) {
      errors.quantity = "Quantity does not apply to this service."
    }

    if (service.askSizeFormat) {
      if (
        service.sizeFormatOptions.length === 0 ||
        !size ||
        !service.sizeFormatOptions.includes(size)
      ) {
        errors.sizeFormat =
          "Choose one of the available size or format options."
      } else {
        sizeFormat = size
      }
    } else if (enquiry.sizeFormat) {
      errors.sizeFormat = "Size or format does not apply to this service."
    }

    if (service.askDesignReadiness) {
      const readiness = enquiry.designReadiness as NonNullable<
        NormalizedEnquiryInput["designReadiness"]
      >
      if (!DESIGN_READINESS_VALUES.includes(readiness)) {
        errors.designReadiness = "Choose your design readiness."
      } else {
        designReadiness = readiness
      }
    } else if (enquiry.designReadiness) {
      errors.designReadiness =
        "Design readiness does not apply to this service."
    }

    const materialValue = boundedText(enquiry.material, 200)
    if (service.askMaterial) {
      if (
        service.materialOptions.length === 0 ||
        !materialValue ||
        !service.materialOptions.includes(materialValue)
      ) {
        errors.material = "Choose one of the available material options."
      } else {
        material = materialValue
      }
    } else if (enquiry.material) {
      errors.material = "Material does not apply to this service."
    }

    const optionalServiceFields = [
      ["colour", service.askColour],
      ["finish", service.askFinish],
    ] as const

    for (const [field, enabled] of optionalServiceFields) {
      const value = boundedText(enquiry[field], 200)
      if (!enabled && enquiry[field]) {
        errors[field] = `${field[0].toUpperCase()}${field.slice(1)} does not apply to this service.`
      } else if (value === null && enquiry[field]) {
        errors[field] = `Keep ${field} under 200 characters.`
      } else if (enabled) {
        if (field === "colour") colour = value
        if (field === "finish") finish = value
      }
    }

    if (enquiry.framing) {
      errors.framing = "Artwork framing cannot be submitted for a service."
    }
  } else {
    const structuredFields = [
      "quantity",
      "sizeFormat",
      "framing",
      "designReadiness",
      "colour",
      "material",
      "finish",
    ] as const

    for (const field of structuredFields) {
      if (enquiry[field] !== null && enquiry[field] !== "") {
        errors[field] = "This field is not available for a broad request."
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    throw fieldError(errors)
  }

  return {
    artworkId: authority.kind === "ARTWORK" ? authority.id : null,
    colour,
    customerName: enquiry.customerName,
    customerNote: enquiry.customerNote,
    designReadiness,
    email: enquiry.email,
    finish,
    framing,
    fulfilmentMethod: enquiry.fulfilmentMethod,
    itemNameSnapshot: authority.name,
    itemSlugSnapshot: authority.slug,
    location: enquiry.location,
    material,
    phoneWhatsApp: enquiry.phoneWhatsApp,
    preferredDate: enquiry.preferredDate,
    quantity:
      authority.record?.askQuantity && enquiry.quantity !== null
        ? enquiry.quantity
        : null,
    requestKind: authority.kind,
    serviceId: authority.kind === "SERVICE" ? authority.id : null,
    sizeFormat,
  }
}

export { validateRequestAuthority }
