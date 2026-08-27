import type {
  RequestDraft,
  RequestFieldErrors,
  NormalizedEnquiryInput,
  RequestAuthority,
} from "@/features/enquiries/types"
import {
  DesignReadiness,
  FulfilmentMethod,
} from "@/db/generated/prisma/enums"
import { DESIGN_READINESS_VALUES } from "@/features/enquiries/constants"

class RequestValidationError extends Error {
  fieldErrors: RequestFieldErrors

  constructor(fieldErrors: RequestFieldErrors) {
    super("Please correct the highlighted request details.")
    this.name = "RequestValidationError"
    this.fieldErrors = fieldErrors
  }
}

function cleanText(value: string, maximumLength: number) {
  const cleaned = value.trim().replace(/\s+/g, " ")
  return cleaned.length <= maximumLength ? cleaned : null
}

function normalizePhone(value: string) {
  const trimmed = value.trim()

  if (!trimmed || /[A-Za-z]/.test(trimmed)) return null

  let digits = trimmed.replace(/\D/g, "")

  if (digits.startsWith("00")) digits = digits.slice(2)
  if (digits.length === 11 && digits.startsWith("0")) {
    digits = `234${digits.slice(1)}`
  }

  if (digits.length < 8 || digits.length > 15 || digits.startsWith("0")) {
    return null
  }

  return `+${digits}`
}

function normalizeEmail(value: string) {
  const email = value.trim().toLowerCase()
  if (!email) return null
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return undefined
  }
  return email
}

function normalizePreferredDate(value: string, now: Date) {
  const trimmed = value.trim()
  if (!trimmed) return null
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return undefined

  const date = new Date(`${trimmed}T00:00:00.000Z`)
  const today = now.toISOString().slice(0, 10)

  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== trimmed) {
    return undefined
  }

  return trimmed < today ? undefined : date
}

function normalizeQuantity(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return null
  if (!/^\d+$/.test(trimmed)) return undefined

  const quantity = Number(trimmed)
  return Number.isSafeInteger(quantity) && quantity > 0 && quantity <= 1_000_000
    ? quantity
    : undefined
}

function validateEnquiryInput(
  draft: RequestDraft,
  authority: RequestAuthority,
  now = new Date()
): NormalizedEnquiryInput {
  const errors: RequestFieldErrors = {}
  const customerName = cleanText(draft.customerName, 120)
  const phoneWhatsApp = normalizePhone(draft.phoneWhatsApp)
  const email = normalizeEmail(draft.email)
  const customerNote = cleanText(draft.customerNote, 2_000)
  const location = cleanText(draft.location, 250)
  const preferredDate = normalizePreferredDate(draft.preferredDate, now)
  const quantity = normalizeQuantity(draft.quantity)

  if (!customerName) errors.customerName = "Enter your name."
  if (!phoneWhatsApp) {
    errors.phoneWhatsApp = "Enter a valid phone or WhatsApp number."
  }
  if (email === undefined) errors.email = "Enter a valid email address."
  if (customerNote === null && draft.customerNote.trim()) {
    errors.customerNote = "Keep the note under 2,000 characters."
  }
  if (location === null && draft.location.trim()) {
    errors.location = "Keep the location under 250 characters."
  }
  if (preferredDate === undefined) {
    errors.preferredDate = "Choose today or a future date."
  }
  if (quantity === undefined) {
    errors.quantity = "Enter a positive whole-number quantity."
  }

  const fulfilmentMethod = draft.fulfilmentMethod as FulfilmentMethod
  if (!Object.values(FulfilmentMethod).includes(fulfilmentMethod)) {
    errors.fulfilmentMethod = "Choose delivery or pickup."
  }
  if (fulfilmentMethod === "DELIVERY" && !location) {
    errors.location = "Enter the delivery area, city, or state."
  }

  let sizeFormat: string | null = null
  let framing: string | null = null
  let designReadiness: DesignReadiness | null = null
  let colour: string | null = null
  let material: string | null = null
  let finish: string | null = null

  if (authority.kind !== draft.requestKind) {
    errors.requestKind = "Choose the request type again."
  }

  if (authority.kind === "ARTWORK" && authority.record) {
    const size = cleanText(draft.sizeFormat, 200)
    const frame = cleanText(draft.framing, 200)

    if (authority.record.availableSizes.length > 0) {
      if (!size || !authority.record.availableSizes.includes(size)) {
        errors.sizeFormat = "Choose one of the available artwork sizes."
      } else {
        sizeFormat = size
      }
    } else if (draft.sizeFormat.trim()) {
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
    } else if (draft.framing.trim()) {
      errors.framing = "Framing is not available for this artwork."
    }

    if (authority.record.askQuantity) {
      if (quantity === null) errors.quantity = "Enter the required quantity."
    } else if (draft.quantity.trim()) {
      errors.quantity = "Quantity does not apply to this artwork."
    }

    if (
      draft.designReadiness.trim() ||
      draft.colour.trim() ||
      draft.material.trim() ||
      draft.finish.trim()
    ) {
      errors.designReadiness = "Service-only answers cannot be submitted for artwork."
    }
  } else if (authority.kind === "SERVICE" && authority.record) {
    const service = authority.record
    const size = cleanText(draft.sizeFormat, 200)

    if (service.askQuantity) {
      if (quantity === null) errors.quantity = "Enter the required quantity."
    } else if (draft.quantity.trim()) {
      errors.quantity = "Quantity does not apply to this service."
    }

    if (service.askSizeFormat) {
      if (
        service.sizeFormatOptions.length === 0 ||
        !size ||
        !service.sizeFormatOptions.includes(size)
      ) {
        errors.sizeFormat = "Choose one of the available size or format options."
      } else {
        sizeFormat = size
      }
    } else if (draft.sizeFormat.trim()) {
      errors.sizeFormat = "Size or format does not apply to this service."
    }

    if (service.askDesignReadiness) {
      if (
        !DESIGN_READINESS_VALUES.includes(draft.designReadiness as DesignReadiness)
      ) {
        errors.designReadiness = "Choose your design readiness."
      } else {
        designReadiness = draft.designReadiness as DesignReadiness
      }
    } else if (draft.designReadiness.trim()) {
      errors.designReadiness = "Design readiness does not apply to this service."
    }

    const materialValue = cleanText(draft.material, 200)
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
    } else if (draft.material.trim()) {
      errors.material = "Material does not apply to this service."
    }

    const optionalServiceFields = [
      ["colour", service.askColour],
      ["finish", service.askFinish],
    ] as const

    for (const [field, enabled] of optionalServiceFields) {
      const value = cleanText(draft[field], 200)
      if (!enabled && draft[field].trim()) {
        errors[field] = `${field[0].toUpperCase()}${field.slice(1)} does not apply to this service.`
      } else if (value === null && draft[field].trim()) {
        errors[field] = `Keep ${field} under 200 characters.`
      } else if (enabled) {
        if (field === "colour") colour = value || null
        if (field === "finish") finish = value || null
      }
    }

    if (draft.framing.trim()) {
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
      if (draft[field].trim()) {
        errors[field] = "This field is not available for a broad request."
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    throw new RequestValidationError(errors)
  }

  return {
    requestKind: authority.kind,
    artworkId: authority.kind === "ARTWORK" ? authority.id : null,
    serviceId: authority.kind === "SERVICE" ? authority.id : null,
    itemNameSnapshot: authority.name,
    itemSlugSnapshot: authority.slug,
    quantity:
      authority.record && authority.record.askQuantity
        ? (quantity as number)
        : null,
    sizeFormat,
    framing,
    designReadiness,
    colour,
    material,
    finish,
    fulfilmentMethod,
    location: location || null,
    preferredDate: preferredDate || null,
    customerName: customerName as string,
    phoneWhatsApp: phoneWhatsApp as string,
    email: email || null,
    customerNote: customerNote || null,
  }
}

export {
  DESIGN_READINESS_VALUES,
  RequestValidationError,
  normalizeEmail,
  normalizePhone,
  normalizePreferredDate,
  validateEnquiryInput,
}
