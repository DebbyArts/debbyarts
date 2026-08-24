import type {
  RequestItem,
  RequestKindValue,
} from "@/features/enquiries/request-types"

type SearchParamValue = string | string[] | undefined

type RequestSearchParams = {
  artwork?: SearchParamValue
  service?: SearchParamValue
  type?: SearchParamValue
}

type ParsedRequestContext =
  | { mode: "default"; status: "valid" }
  | { mode: "art-commission"; status: "valid" }
  | { mode: "artwork"; slug: string; status: "valid" }
  | { mode: "service"; slug: string; status: "valid" }
  | { message: string; status: "invalid" }

const DEFAULT_STEPS = [
  "interest",
  "item",
  "details",
  "delivery",
  "contact",
] as const

const CONTEXTUAL_STEPS = ["details", "delivery", "contact"] as const

type RequestStep = (typeof DEFAULT_STEPS)[number]

function singleValue(value: SearchParamValue) {
  if (Array.isArray(value)) return { invalid: true as const }
  if (value === undefined) return { value: undefined }

  const trimmed = value.trim()
  return trimmed ? { value: trimmed } : { invalid: true as const }
}

function parseRequestContext(
  searchParams: RequestSearchParams
): ParsedRequestContext {
  const artwork = singleValue(searchParams.artwork)
  const service = singleValue(searchParams.service)
  const type = singleValue(searchParams.type)

  if (artwork.invalid || service.invalid || type.invalid) {
    return {
      status: "invalid",
      message: "This request link contains duplicate or incomplete context.",
    }
  }

  const supplied = [artwork.value, service.value, type.value].filter(Boolean)

  if (supplied.length > 1) {
    return {
      status: "invalid",
      message: "This request link combines conflicting artwork or service context.",
    }
  }

  if (artwork.value) {
    return { status: "valid", mode: "artwork", slug: artwork.value }
  }

  if (service.value) {
    return { status: "valid", mode: "service", slug: service.value }
  }

  if (type.value) {
    return type.value === "art-commission"
      ? { status: "valid", mode: "art-commission" }
      : {
          status: "invalid",
          message: "This request type is not supported.",
        }
  }

  return { status: "valid", mode: "default" }
}

function getRequestSteps(hasKnownContext: boolean): readonly RequestStep[] {
  return hasKnownContext ? CONTEXTUAL_STEPS : DEFAULT_STEPS
}

function getEnabledDetailFields(item: RequestItem | null) {
  if (!item) return []

  if (item.kind === "ARTWORK") {
    const fields: string[] = []

    if (item.record.availableSizes.length > 0) fields.push("sizeFormat")
    if (item.record.framingEnabled && item.record.framingOptions.length > 0) {
      fields.push("framing")
    }
    if (item.record.askQuantity) fields.push("quantity")

    return fields
  }

  const fields: string[] = []
  if (item.record.askQuantity) fields.push("quantity")
  if (item.record.askSizeFormat) fields.push("sizeFormat")
  if (item.record.askDesignReadiness) fields.push("designReadiness")
  if (item.record.askColour) fields.push("colour")
  if (item.record.askMaterial) fields.push("material")
  if (item.record.askFinish) fields.push("finish")
  return fields
}

function broadSnapshot(kind: RequestKindValue, artCommission: boolean) {
  if (kind === "SERVICE") {
    return { name: "Custom service request", slug: "custom-service-request" }
  }

  return artCommission
    ? { name: "Custom art commission", slug: "art-commission" }
    : { name: "Custom artwork request", slug: "custom-artwork-request" }
}

export {
  broadSnapshot,
  getEnabledDetailFields,
  getRequestSteps,
  parseRequestContext,
  type ParsedRequestContext,
  type RequestSearchParams,
  type RequestStep,
}
